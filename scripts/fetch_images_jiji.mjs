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

const products = [
  {"name": 'Refined Yunzhi Essence', "slug": 'refined-yunzhi-essence'},
  {"name": 'Vitamin C Chewable Tablets', "slug": 'vitamin-c-chewable-tablets'},
  {"name": 'ZaminoCal Plus', "slug": 'zaminocal-plus'},
  {"name": 'Micro2 Cycle Tablets', "slug": 'micro2-cycle-tablets'},
  {"name": 'ConstiRelax', "slug": 'constirelax'},
  {"name": 'ProstatRelax', "slug": 'prostatrelax'},
  {"name": 'Feminergy Capsules', "slug": 'feminergy-capsules'},
  {"name": 'Anatic Herbal Essence Soap', "slug": 'anatic-herbal-essence-soap'},
  {"name": 'Dr. Cow Smart Kids Calcium', "slug": 'dr-cow-smart-kids-calcium'},
  {"name": '4 in 1 Reishi Coffee', "slug": '4-in-1-reishi-coffee'},
  {"name": '4 in 1 Ginseng Coffee', "slug": '4-in-1-ginseng-coffee'},
  {"name": 'Relivin Tea', "slug": 'relivin-tea'},
  {"name": 'GymEffect', "slug": 'gymeffect'},
  {"name": 'YouthEssence Cleanser', "slug": 'youthessence-cleanser'},
  {"name": 'YouthEssence Lotion', "slug": 'youthessence-lotion'}
];

async function downloadImage(url, dest) {
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!response.ok) throw new Error(`Failed to fetch ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(dest, buffer);
    return true;
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
    return false;
  }
}

async function run() {
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'products');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  for (const prod of products) {
    console.log(`Searching Jiji for: ${prod.name}`);
    const queryUrl = `https://jiji.co.ke/api_web/v1/listing?query=bf%20suma%20${encodeURIComponent(prod.name)}`;
    
    let url = null;
    try {
      const res = await fetch(queryUrl);
      const data = await res.json();
      const item = data.adverts_list?.adverts?.[0];
      if (item && item.image_obj && item.image_obj.url) {
        url = item.image_obj.url;
      }
    } catch (e) {
      console.error(`Error fetching from Jiji API for ${prod.name}:`, e.message);
    }
    
    if (!url) {
      console.warn(`No URL found for ${prod.slug}`);
      continue;
    }
    
    console.log(`Downloading image for ${prod.slug} from ${url.substring(0, 50)}...`);
    const dest = path.join(imagesDir, `${prod.slug}.jpg`);
    
    const success = await downloadImage(url, dest);
    
    if (success) {
      const { data: product } = await supabase.from('products').select('id').eq('slug', prod.slug).single();
      
      if (product) {
        // Update product_images to point to the new image
        let { error } = await supabase
          .from('product_images')
          .update({ url: `/images/products/${prod.slug}.jpg` })
          .eq('product_id', product.id)
          .eq('url', '/placeholder.svg');
          
        if (error) {
           console.error(`Failed to update database for ${prod.slug}:`, error.message);
        } else {
           console.log(`Successfully updated ${prod.slug}`);
        }
      }
    }
  }
  console.log('Done!');
}

run();
