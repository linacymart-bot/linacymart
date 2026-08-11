import { createClient } from '@/utils/supabase/server';
import ProductForm from '../ProductForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient();
  
  const [productResponse, categoriesResponse] = await Promise.all([
    supabase.from('products').select('*, product_images(url, is_primary)').eq('id', id).single(),
    supabase.from('categories').select('id, name').order('name')
  ]);

  if (!productResponse.data) {
    notFound();
  }

  return (
    <div className="pb-10">
      <ProductForm 
        initialData={productResponse.data} 
        categories={categoriesResponse.data || []} 
      />
    </div>
  );
}
