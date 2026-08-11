import fs from 'fs';
import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function extractImageFromPage(page, url) {
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Look for common image selectors on e-commerce sites
    // The official store might use specific classes, we'll try a few broad ones
    const imageUrl = await page.evaluate(() => {
      // Look for main product image, usually in a container like .product-image, .main-image, or just a large img
      // Often the first large image is the product image.
      const images = Array.from(document.querySelectorAll('img'));
      
      // Filter out tiny icons, logos, etc.
      const productImages = images.filter(img => {
        const rect = img.getBoundingClientRect();
        return rect.width > 200 && rect.height > 200 && !img.src.includes('logo') && !img.src.includes('banner');
      });
      
      if (productImages.length > 0) {
        return productImages[0].src;
      }
      
      // Fallback: look for meta property="og:image"
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        return ogImage.content;
      }
      
      return null;
    });
    
    return imageUrl;
  } catch (err) {
    console.error(`Error scraping ${url}:`, err.message);
    return null;
  }
}

async function run() {
  const content = fs.readFileSync('product_images_to_upload.csv', 'utf8');
  const lines = content.split('\n').filter(line => line.trim() !== '');
  
  // Skip header
  const dataLines = lines.slice(1);
  
  console.log(`Found ${dataLines.length} products to process.`);
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  let successCount = 0;
  
  for (const line of dataLines) {
    // CSV format: Product Name,Slug,Image Link
    // Need to handle commas in product names correctly
    // Simple regex for CSV splitting
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    if (parts.length < 3) continue;
    
    const name = parts[0].replace(/^"|"$/g, '');
    const slug = parts[1].replace(/^"|"$/g, '');
    let link = parts[2].replace(/^"|"$/g, '').trim();
    
    if (!link || link === '') continue;
    
    console.log(`\nProcessing: ${name}`);
    console.log(`URL: ${link}`);
    
    // If it's an HTML page, scrape it. If it's already an image URL, use it directly.
    let finalImageUrl = link;
    if (link.includes('.html') || !link.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i)) {
      console.log(`Scraping actual image from HTML page...`);
      const scrapedUrl = await extractImageFromPage(page, link);
      if (scrapedUrl) {
        finalImageUrl = scrapedUrl;
        console.log(`Found image: ${finalImageUrl}`);
      } else {
        console.log(`Failed to find image on page.`);
        continue; // Skip if we couldn't find an image
      }
    }
    
    // Ensure final URL is absolute
    if (finalImageUrl.startsWith('/')) {
       try {
           const urlObj = new URL(link);
           finalImageUrl = `${urlObj.origin}${finalImageUrl}`;
       } catch(e) {}
    }

    // Now update Supabase
    // 1. Get product ID
    const { data: product, error: pError } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single();
      
    if (pError || !product) {
      console.error(`Product not found in DB: ${slug}`);
      continue;
    }
    
    // 2. Delete existing placeholders
    await supabase
      .from('product_images')
      .delete()
      .eq('product_id', product.id);
      
    // 3. Insert new image
    const { error: iError } = await supabase
      .from('product_images')
      .insert({
        product_id: product.id,
        url: finalImageUrl,
        is_primary: true
      });
      
    if (iError) {
      console.error(`Error saving image for ${name}:`, iError.message);
    } else {
      console.log(`Successfully updated image for ${name}`);
      successCount++;
    }
  }
  
  await browser.close();
  console.log(`\nFinished! Successfully updated images for ${successCount} products.`);
}

run();
