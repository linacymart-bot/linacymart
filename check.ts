import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function setup() {
  // Create the 'images' bucket as public
  const { data: bucket, error: bucketErr } = await supabase.storage.createBucket('images', {
    public: true,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
    fileSizeLimit: 10485760, // 10MB
  });
  console.log('Create bucket error:', bucketErr);
  console.log('Created bucket:', JSON.stringify(bucket, null, 2));

  // Clear the bad cover_image from the blog post
  const { error: clearErr } = await supabase
    .from('blog_posts')
    .update({ cover_image: null })
    .eq('id', '4ee47a88-ee53-40ea-adc4-978c7b72d93e');
  console.log('Clear bad blog image error:', clearErr);
  console.log('Cleared bad blog cover image from test post.');

  // Verify buckets now
  const { data: buckets } = await supabase.storage.listBuckets();
  console.log('All buckets now:', JSON.stringify(buckets, null, 2));
}

setup().catch(console.error);
