import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateCSV() {
  const { data: products } = await supabase.from('products').select('name, slug');
  
  // Create CSV with all products
  let csv = 'Product Name,Slug,Image Link (Paste URL here)\n';
  for (const p of products) {
    csv += `"${p.name}",${p.slug},\n`;
  }
  
  fs.writeFileSync('product_images_to_upload.csv', csv);
  console.log('CSV created at product_images_to_upload.csv');
  
  // Also, reset all image urls to placeholder.svg that we just modified
  console.log('Resetting product images to placeholder.svg...');
  await supabase.from('product_images').update({ url: '/placeholder.svg' }).neq('url', '/placeholder.svg');
  console.log('Reset complete!');
}

generateCSV();
