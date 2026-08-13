'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function toggleReviewStatus(id: string, currentStatus: boolean) {
  try {
    const { error } = await supabase
      .from('reviews')
      .update({ is_verified: !currentStatus })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/reviews');
    revalidatePath('/products/[slug]', 'page');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to toggle review status:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteReview(id: string) {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/reviews');
    revalidatePath('/products/[slug]', 'page');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete review:', error);
    return { success: false, error: error.message };
  }
}
