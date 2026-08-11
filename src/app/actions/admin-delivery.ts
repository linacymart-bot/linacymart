'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const deliverySchema = z.object({
  fee: z.number().min(0, 'Fee cannot be negative'),
});

export async function updateDeliveryFee(id: string, formData: FormData) {
  try {
    const rawData = {
      fee: Number(formData.get('fee')),
    };

    const validatedData = deliverySchema.parse(rawData);

    const { error } = await supabase
      .from('delivery_zones')
      .update({ fee: validatedData.fee })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/delivery');
    revalidatePath('/checkout');
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update delivery fee:', error);
    return { success: false, error: error.message };
  }
}
