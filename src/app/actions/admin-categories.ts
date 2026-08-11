'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  active: z.boolean().default(true),
});

export async function createCategory(formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      active: formData.get('active') === 'on',
    };

    const validatedData = categorySchema.parse(rawData);

    const { data, error } = await supabase
      .from('categories')
      .insert(validatedData)
      .select('id')
      .single();

    if (error) throw error;

    revalidatePath('/admin/categories');
    
    return { success: true, categoryId: data.id };
  } catch (error: any) {
    console.error('Failed to create category:', error);
    return { success: false, error: error.message };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      active: formData.get('active') === 'on',
    };

    const validatedData = categorySchema.parse(rawData);

    const { error } = await supabase
      .from('categories')
      .update(validatedData)
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/categories');
    revalidatePath('/products');
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update category:', error);
    return { success: false, error: error.message };
  }
}
