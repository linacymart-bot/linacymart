import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const imageDir = path.join(process.cwd(), 'public', 'images', 'products');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    if (url.startsWith('/')) return resolve(false);
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        fs.unlink(destPath, () => {});
        return resolve(false);
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      resolve(false);
    });
  });
}

// AI descriptions map (since I am simulating the AI here)
const aiDescriptions = {
  'pure-broken-ganoderma-spores': "A powerful immune booster formulated from 100% natural cracked Ganoderma lucidum spores. Enhances cellular immunity, supports liver function, and combats fatigue. Perfect for overall wellness and vitality.",
  'x-power-coffee': "A premium men's health coffee blend infused with Maca and Tongkat Ali. Designed to naturally boost stamina, increase energy levels, and enhance male performance and vitality without jitters.",
  'femicalcium-d3': "Specifically formulated for women, this calcium supplement is enriched with Vitamin D3 to ensure maximum absorption. Promotes strong bones, teeth, and helps prevent osteoporosis during critical life stages.",
  'detoxilive-pro-oil-capsules': "A potent detoxifying formula that supports liver health and cellular regeneration. Helps flush out toxins, improve metabolism, and restore your body's natural balance.",
  'nmn-duo-release': "The ultimate anti-aging supplement. NMN (Nicotinamide Mononucleotide) boosts NAD+ levels in cells, reversing signs of aging, repairing DNA, and restoring youthful energy and cognitive function.",
  'ez-xlim': "A healthy, natural weight management solution. Ez-xlim helps block fat absorption, accelerates metabolism, and suppresses appetite safely to help you achieve your body goals.",
  'nmn-coffee-new': "Combine your morning ritual with anti-aging science. This premium coffee is infused with NMN to kickstart your metabolism, clear brain fog, and boost your cellular energy for the entire day.",
  'pure-broken-ganoderma-spores-60s': "A powerful immune booster formulated from 100% natural cracked Ganoderma lucidum spores. Enhances cellular immunity, supports liver function, and combats fatigue. Perfect for overall wellness and vitality.",
  'veggie-veggie': "A comprehensive blend of essential vegetables and fibers designed to support digestive health, improve bowel movements, and provide crucial phytonutrients missing from a standard diet.",
  'nmn-sharp-mind': "A specialized nootropic blend featuring NMN to enhance focus, memory recall, and overall brain health. Perfect for professionals and students demanding peak cognitive performance.",
  'ntdiarr-pills': "Fast-acting, natural relief for digestive upsets and diarrhea. Formulated with traditional herbs to soothe the gastrointestinal tract and restore normal bowel function quickly.",
  'femicare-feminine-cleanser': "A gentle, pH-balanced intimate wash designed specifically for women's hygiene. Prevents infections, eliminates odors, and provides all-day freshness and confidence.",
  'elements': "A complete daily multivitamin and mineral complex. Fills nutritional gaps, boosts the immune system, and provides the essential building blocks for optimal health and vitality.",
  'femibiotics': "Targeted probiotics for women's health. Restores healthy vaginal flora, supports urinary tract health, and bolsters the immune system with clinically proven strains.",
  'probio3-straweberry-flavor-30s': "Delicious strawberry-flavored probiotics perfect for the whole family. Promotes a healthy gut microbiome, aids digestion, and strengthens the immune response."
};

async function run() {
  console.log("Fetching categories...");
  const { data: categories } = await supabase.from('categories').select('id, slug');
  const catMap = categories.reduce((acc, c) => ({...acc, [c.slug]: c.id}), {});

  // Parse HTML again to get all products and images
  const filePath = "C:\\Users\\Admin\\.gemini\\antigravity\\brain\\0f9d10cf-31bb-4899-8403-2634009f59e4\\.system_generated\\steps\\228\\content.md";
  const content = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(content);
  
  const parsedProducts = [];
  $('dl.pro_item').each((i, el) => {
    const $el = $(el);
    const name = $el.find('.themes_products_title').text().trim();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let imgUrl = $el.find('img').attr('src');
    if (imgUrl && imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
    
    if (name && imgUrl) {
      parsedProducts.push({ name, slug, imgUrl });
    }
  });

  console.log(`Parsed ${parsedProducts.length} products from HTML.`);

  const { data: existingProducts } = await supabase.from('products').select('id, slug, name');
  
  let featuredCount = 0;
  
  for (const product of existingProducts) {
    const match = parsedProducts.find(p => p.slug === product.slug);
    
    // Categorize
    let categorySlug = 'others';
    if (product.slug.includes('coffee') || product.slug.includes('x-power')) categorySlug = 'mens-power';
    else if (product.slug.includes('ganoderma') || product.slug.includes('nmn')) categorySlug = 'immune-booster';
    else if (product.slug.includes('femi')) categorySlug = 'womens-beauty';
    else if (product.slug.includes('xlim')) categorySlug = 'suma-fit';
    
    const catId = catMap[categorySlug] || catMap['others'];
    
    // AI Description
    const defaultDesc = "A premium BF Suma health product crafted with the highest quality natural ingredients to support your well-being and vitality.";
    const richDesc = aiDescriptions[product.slug] || defaultDesc;
    
    // Set Featured (Make the first 6 featured)
    const isFeatured = featuredCount < 6;
    if (isFeatured) featuredCount++;
    
    // Update Product in DB
    await supabase.from('products').update({
      category_id: catId,
      full_description: richDesc,
      short_description: richDesc.substring(0, 100) + '...',
      featured: isFeatured
    }).eq('id', product.id);

    // Process Image
    if (match && match.imgUrl) {
      const extension = match.imgUrl.includes('.png') ? '.png' : '.jpg';
      const filename = `product-${product.id}${extension}`;
      const destPath = path.join(imageDir, filename);
      const localUrl = `/images/products/${filename}`;
      
      const downloaded = await downloadImage(match.imgUrl, destPath);
      
      if (downloaded) {
        // Upsert Image in DB
        const { error: imgError } = await supabase.from('product_images').upsert({
          product_id: product.id,
          url: localUrl,
          is_primary: true
        }, { onConflict: 'product_id,url' });
        
        // Let's actually delete all old images for this product to prevent duplicates, then insert
        await supabase.from('product_images').delete().eq('product_id', product.id);
        await supabase.from('product_images').insert({
          product_id: product.id,
          url: localUrl,
          is_primary: true
        });
      }
    }
  }

  console.log("Data enhancement complete.");
}

run();
