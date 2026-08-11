'use server';

import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const reviewSchema = z.object({
  productId: z.string().uuid(),
  reviewerName: z.string().min(2, 'Name is required'),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, 'Review must be at least 5 characters long'),
});

export async function submitReview(formData: FormData) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const payload = {
      productId: formData.get('productId') as string,
      reviewerName: formData.get('reviewerName') as string,
      rating: Number(formData.get('rating')),
      comment: formData.get('comment') as string,
    };

    const validatedData = reviewSchema.parse(payload);

    // Save the review directly as verified for simplicity (or pending if there was an approval flow)
    const { error } = await supabase
      .from('reviews')
      .insert({
        product_id: validatedData.productId,
        reviewer_name: validatedData.reviewerName,
        rating: validatedData.rating,
        comment: validatedData.comment,
        is_verified: true, // Auto-verifying for immediate display
      });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Review submission error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}
