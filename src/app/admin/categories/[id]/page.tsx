import { createClient } from '@/utils/supabase/server';
import CategoryForm from '../CategoryForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (!data) {
    notFound();
  }

  return (
    <div className="pb-10">
      <CategoryForm initialData={data} />
    </div>
  );
}
