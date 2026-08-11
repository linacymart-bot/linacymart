import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function downloadImage(url, destPath) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
    return false;
  }
}

async function run() {
  const csvPath = path.join(__dirname, '..', 'product_images_to_upload.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found!');
    return;
  }

  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split('\n').filter(line => line.trim().length > 0);
  
  // Skip header
  const rows = lines.slice(1).map(line => {
    // Basic CSV parsing since there are no quoted commas in this specific file
    const [name, slug, link] = line.split(',');
    return { name: name?.trim(), slug: slug?.trim(), link: link?.trim() };
  });

  const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  console.log(`Found ${rows.length} rows to process.`);

  for (const row of rows) {
    if (!row.slug || !row.link || !row.link.startsWith('http')) {
      console.log(`Skipping invalid row: ${row.name}`);
      continue;
    }

    console.log(`Processing: ${row.name}`);
    try {
      const res = await fetch(row.link, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!res.ok) {
        console.error(`Failed to fetch page for ${row.name}: ${res.statusText}`);
        continue;
      }
      
      const html = await res.text();
      const $ = cheerio.load(html);
      
      // BF Suma typically has og:image or a main product image.
      // Let's try to get og:image first.
      let imgUrl = $('meta[property="og:image"]').attr('content');
      
      // Fallback 1: The big preview image on BF Suma product pages
      if (!imgUrl) {
        imgUrl = $('.goods_img .big_pic img').attr('src');
      }
      
      // Fallback 2: Any image inside .pro_item if it's a listing page somehow
      if (!imgUrl) {
         imgUrl = $('.pro_item img').first().attr('src');
      }
      
      // Fallback 3: The first image that looks like a product
      if (!imgUrl) {
          $('img').each((i, el) => {
              const src = $(el).attr('src');
              if (src && src.includes('products') && !imgUrl) {
                  imgUrl = src;
              }
          });
      }

      if (!imgUrl) {
        console.error(`Could not find an image URL for ${row.name} on ${row.link}`);
        continue;
      }

      if (imgUrl.startsWith('//')) {
        imgUrl = 'https:' + imgUrl;
      }

      console.log(`Found image URL: ${imgUrl}`);
      
      const destFile = `${row.slug}.jpg`; // Will save as jpg regardless, works for browsers
      const destPath = path.join(imagesDir, destFile);
      
      const downloaded = await downloadImage(imgUrl, destPath);
      
      if (downloaded) {
        // Update database
        const { data: product } = await supabase.from('products').select('id').eq('slug', row.slug).single();
        if (product) {
            // First check if an image already exists for this product
            const { data: existingImages } = await supabase
              .from('product_images')
              .select('id, url')
              .eq('product_id', product.id)
              .eq('is_primary', true);
              
            const newUrl = `/images/products/${destFile}`;
            
            if (existingImages && existingImages.length > 0) {
               // Update existing primary image
               const { error } = await supabase
                 .from('product_images')
                 .update({ url: newUrl })
                 .eq('id', existingImages[0].id);
                 
               if (error) console.error(`Error updating DB for ${row.name}:`, error.message);
               else console.log(`Successfully updated database for ${row.name}`);
            } else {
               // Insert new primary image
               const { error } = await supabase
                 .from('product_images')
                 .insert({
                    product_id: product.id,
                    url: newUrl,
                    is_primary: true
                 });
                 
               if (error) console.error(`Error inserting DB for ${row.name}:`, error.message);
               else console.log(`Successfully inserted to database for ${row.name}`);
            }
            
            // Delete placeholder.svg entry if it exists to avoid multiple primary images or clutter
            await supabase.from('product_images').delete().eq('product_id', product.id).eq('url', '/placeholder.svg');
            
        } else {
            console.error(`Product ${row.slug} not found in database!`);
        }
      }
      
    } catch (error) {
      console.error(`Error processing ${row.name}:`, error.message);
    }
  }
  
  console.log("Finished processing all links.");
}

run();
