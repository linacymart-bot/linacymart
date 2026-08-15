import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
  // Test the exact same query as admin dashboard
  const { data: rawOrders, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      total,
      status,
      created_at,
      customer:customers(full_name, phone),
      items:order_items(
        quantity,
        product:products(name, product_images(url, is_primary))
      )
    `)
    .order('created_at', { ascending: false });

  console.log('Dashboard query error:', JSON.stringify(error, null, 2));
  console.log('Dashboard query count:', rawOrders?.length);
  console.log('First result:', JSON.stringify(rawOrders?.[0], null, 2));
}

check().catch(console.error);
