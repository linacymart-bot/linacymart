import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'products');
  const files = fs.readdirSync(imagesDir);

  for (const file of files) {
    if (file.startsWith('product-') || !file.endsWith('.jpg')) continue; // Skip existing products or non-jpegs
    
    const slug = file.replace('.jpg', '');
    const url = `/images/products/${file}`;

    console.log(`Processing image for slug: ${slug}`);

    // Get product ID
    const { data: product, error: pErr } = await supabase.from('products').select('id').eq('slug', slug).single();
    
    if (pErr || !product) {
      console.warn(`Could not find product for slug ${slug}`);
      continue;
    }

    // Check if image exists
    const { data: existing } = await supabase.from('product_images').select('id').eq('product_id', product.id);
    
    if (existing && existing.length > 0) {
      // Update
      await supabase.from('product_images').update({ url, is_primary: true }).eq('product_id', product.id);
      console.log(`Updated existing image record for ${slug}`);
    } else {
      // Insert
      const { error: iErr } = await supabase.from('product_images').insert([{ product_id: product.id, url, is_primary: true }]);
      if (iErr) {
        console.error(`Failed to insert for ${slug}:`, iErr);
      } else {
        console.log(`Inserted image record for ${slug}`);
      }
    }
  }
  
  // Set placeholders for those missing images
  const products = [
    'micro2-cycle-tablets',
    'dr-cow-smart-kids-calcium',
    '4-in-1-reishi-coffee',
    '4-in-1-ginseng-coffee',
    'youthessence-cleanser',
    'youthessence-lotion'
  ];
  
  for (const slug of products) {
    const { data: product } = await supabase.from('products').select('id').eq('slug', slug).single();
    if (product) {
      const { data: existing } = await supabase.from('product_images').select('id').eq('product_id', product.id);
      if (!existing || existing.length === 0) {
         await supabase.from('product_images').insert([{ product_id: product.id, url: '/placeholder.svg', is_primary: true }]);
         console.log(`Inserted placeholder for ${slug}`);
      }
    }
  }

  console.log('Done mapping all images in database!');
}

run();
