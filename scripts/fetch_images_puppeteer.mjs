import puppeteer from 'puppeteer';
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

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set User Agent to avoid bot detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

  for (const prod of products) {
    console.log(`Searching image for: ${prod.name}`);
    const query = encodeURIComponent(`bf suma ${prod.name}`);
    
    // Using DuckDuckGo Images
    const searchUrl = `https://duckduckgo.com/?q=${query}&t=h_&iar=images&iax=images&ia=images`;
    
    try {
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait for images to load
      await page.waitForSelector('.tile--img__img', { timeout: 10000 });
      
      // Get the first image src
      const imgUrl = await page.evaluate(() => {
        const img = document.querySelector('.tile--img__img');
        return img ? img.src : null;
      });
      
      if (!imgUrl) {
        console.warn(`No URL found for ${prod.slug}`);
        continue;
      }
      
      let finalUrl = imgUrl;
      // Handle duckduckgo proxy URLs
      if (imgUrl.startsWith('//')) {
        finalUrl = 'https:' + imgUrl;
      }
      
      console.log(`Downloading image for ${prod.slug}...`);
      const dest = path.join(imagesDir, `${prod.slug}.jpg`);
      
      const success = await downloadImage(finalUrl, dest);
      
      if (success) {
        const { data: product } = await supabase.from('products').select('id').eq('slug', prod.slug).single();
        
        if (product) {
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
    } catch (e) {
      console.error(`Failed to process ${prod.name}:`, e.message);
    }
  }

  await browser.close();
  console.log('Done!');
}

run();
