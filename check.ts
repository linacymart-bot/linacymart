import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function check() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      total,
      status,
      created_at,
      customer:customers(full_name, phone)
    `)
    .order('created_at', { ascending: false });

  console.log('Orders error:', error);
  console.log('Orders data:', JSON.stringify(data, null, 2));
}

check();
