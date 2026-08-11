import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const imageDir = path.join(process.cwd(), 'public', 'images', 'products');

// Ensure directory exists
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    // If it's already a local path, skip
    if (url.startsWith('/')) {
      return resolve(false);
    }
    
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        fs.unlink(destPath, () => {}); // Delete the file async
        return reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log("Fetching images from Supabase...");
  const { data: images, error } = await supabase
    .from('product_images')
    .select('id, url, product_id');
    
  if (error) {
    console.error(error);
    process.exit(1);
  }
  
  console.log(`Found ${images.length} images to process.`);
  
  for (const img of images) {
    if (img.url.startsWith('/')) {
      console.log(`Skipping ${img.id}, already local: ${img.url}`);
      continue;
    }
    
    try {
      const extension = img.url.includes('.png') ? '.png' : '.jpg';
      const filename = `product-${img.product_id}${extension}`;
      const destPath = path.join(imageDir, filename);
      const localUrl = `/images/products/${filename}`;
      
      console.log(`Downloading ${img.url} -> ${localUrl}`);
      const downloaded = await downloadImage(img.url, destPath);
      
      if (downloaded) {
        // Update database with new local URL
        const { error: updateError } = await supabase
          .from('product_images')
          .update({ url: localUrl })
          .eq('id', img.id);
          
        if (updateError) {
          console.error(`Failed to update DB for ${img.id}`, updateError);
        } else {
          console.log(`Successfully updated DB for ${img.id}`);
        }
      }
    } catch (e) {
      console.error(`Error processing image ${img.id}:`, e.message);
    }
  }
  
  console.log("Done downloading and updating images.");
}

run();
