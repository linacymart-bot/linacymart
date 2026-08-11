import fs from 'fs';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const filePath = "C:\\Users\\Admin\\.gemini\\antigravity\\brain\\0f9d10cf-31bb-4899-8403-2634009f59e4\\.system_generated\\steps\\228\\content.md";
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const $ = cheerio.load(content);
  
  const products = [];
  
  // Scrape products from the list
  $('dl.pro_item').each((i, el) => {
    const $el = $(el);
    const name = $el.find('.themes_products_title').text().trim();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const priceText = $el.find('.price_data').text().trim();
    const price = parseFloat(priceText.replace(/,/g, ''));
    
    let imgUrl = $el.find('img').attr('src');
    if (imgUrl && imgUrl.startsWith('//')) {
      imgUrl = 'https:' + imgUrl;
    }

    if (name && !isNaN(price)) {
      products.push({
        name,
        slug,
        sku: 'BFS-' + Math.floor(1000 + Math.random() * 9000), // Random SKU
        price,
        short_description: name,
        full_description: 'Premium BF Suma health product: ' + name,
        active: true,
        status: 'published',
        image: imgUrl
      });
    }
  });
  
  console.log(`Found ${products.length} products to insert.`);
  
  // We need a default category to assign these to if we can't map them perfectly, 
  // since category mapping from this single page isn't trivial without fetching each category page.
  // We will assign them to the "Others" category.
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'others')
    .single();
    
  if (!category) {
    console.error("Could not find 'others' category");
    process.exit(1);
  }

  let insertedCount = 0;
  for (const p of products) {
    // Insert Product
    const { data: insertedProduct, error } = await supabase
      .from('products')
      .upsert({
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        category_id: category.id, // Assign to 'others'
        price: p.price,
        short_description: p.short_description,
        full_description: p.full_description,
        active: p.active,
        status: p.status,
      }, { onConflict: 'slug' })
      .select('id')
      .single();

    if (error) {
      console.error(`Error inserting product ${p.name}:`, error.message);
      continue;
    }

    // Insert Image
    if (p.image && insertedProduct) {
      await supabase
        .from('product_images')
        .upsert({
          product_id: insertedProduct.id,
          url: p.image,
          is_primary: true
        }, { onConflict: 'product_id,url' });
    }
    
    insertedCount++;
  }
  
  console.log(`Successfully inserted/updated ${insertedCount} products.`);
}

run();
