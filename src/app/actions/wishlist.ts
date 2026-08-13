'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleWishlist(productId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to save products to your wishlist.' };
  }

  // Check if it exists
  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle();

  if (existing) {
    // Remove
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('id', existing.id);
      
    if (error) return { error: error.message };
  } else {
    // Add
    const { error } = await supabase
      .from('wishlists')
      .insert({
        user_id: user.id,
        product_id: productId
      });
      
    if (error) return { error: error.message };
  }

  revalidatePath('/products');
  revalidatePath('/products/[slug]');
  revalidatePath('/account/wishlist');
  
  return { success: true };
}
