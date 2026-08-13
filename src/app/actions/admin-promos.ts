'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const promoSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.number().min(0.01),
  max_uses: z.number().nullable().optional(),
});

export async function createPromoCode(formData: FormData) {
  try {
    const rawData = {
      code: formData.get('code')?.toString().toUpperCase(),
      discount_type: formData.get('discount_type'),
      discount_value: Number(formData.get('discount_value')),
      max_uses: formData.get('max_uses') ? Number(formData.get('max_uses')) : null,
    };

    const validatedData = promoSchema.parse(rawData);

    const { error } = await supabase
      .from('promo_codes')
      .insert({
        ...validatedData,
        active: true,
        uses: 0
      });

    if (error) {
      if (error.code === '23505') throw new Error('A promo code with this name already exists.');
      throw error;
    }

    revalidatePath('/admin/promo-codes');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to create promo code:', error);
    return { success: false, error: error.message };
  }
}

export async function togglePromoCodeStatus(id: string, currentStatus: boolean) {
  try {
    const { error } = await supabase
      .from('promo_codes')
      .update({ active: !currentStatus })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/promo-codes');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to toggle promo code:', error);
    return { success: false, error: error.message };
  }
}

export async function deletePromoCode(id: string) {
  try {
    const { error } = await supabase
      .from('promo_codes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/promo-codes');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete promo code:', error);
    return { success: false, error: error.message };
  }
}
