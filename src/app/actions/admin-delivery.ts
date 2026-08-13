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

export async function createDeliveryFee(formData: FormData) {
  try {
    const rawData = {
      county: formData.get('county')?.toString().trim(),
      fee: Number(formData.get('fee')),
    };

    if (!rawData.county) {
      throw new Error('Location/County is required');
    }

    const { error } = await supabase
      .from('delivery_zones')
      .insert({ county: rawData.county, fee: rawData.fee });

    if (error) throw error;

    revalidatePath('/admin/delivery');
    revalidatePath('/checkout');
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to create delivery location:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteDeliveryFee(id: string) {
  try {
    const { error } = await supabase
      .from('delivery_zones')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/delivery');
    revalidatePath('/checkout');
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete delivery location:', error);
    return { success: false, error: error.message };
  }
}
