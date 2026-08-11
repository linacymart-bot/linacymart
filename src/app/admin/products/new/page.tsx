import { createClient } from '@/utils/supabase/server';
import ProductForm from '../ProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const supabase = await createClient();
  
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');

  return (
    <div className="pb-10">
      <ProductForm categories={categories || []} />
    </div>
  );
}
