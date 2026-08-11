import { createClient } from '@/utils/supabase/server';
import DeliveryForm from '../DeliveryForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditDeliveryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data } = await supabase
    .from('delivery_zones')
    .select('*')
    .eq('id', id)
    .single();

  if (!data) {
    notFound();
  }

  return (
    <div className="pb-10">
      <DeliveryForm initialData={data} />
    </div>
  );
}
