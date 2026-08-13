'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  full_description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  sale_price: z.number().nullable().optional(),
  category_id: z.string().uuid('Category is required'),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  status: z.string().default('published'),
  short_description: z.string().optional(),
  ingredients: z.string().optional(),
  directions: z.string().optional(),
});

export async function createProduct(formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      full_description: formData.get('description'),
      price: Number(formData.get('price')),
      sale_price: formData.get('sale_price') ? Number(formData.get('sale_price')) : null,
      category_id: formData.get('category_id'),
      active: formData.get('active') === 'on',
      featured: formData.get('featured') === 'on',
      status: formData.get('status') || 'published',
      short_description: formData.get('benefits'),
      ingredients: formData.get('ingredients'),
      directions: formData.get('directions'),
    };

    const validatedData = productSchema.parse(rawData);

    const { data, error } = await supabase
      .from('products')
      .insert(validatedData)
      .select('id')
      .single();

    if (error) throw error;

    const imageUrl = formData.get('image_url') as string;
    if (imageUrl) {
      await supabase.from('product_images').insert({
        product_id: data.id,
        url: imageUrl,
        is_primary: true
      });
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/', 'layout');
    
    return { success: true, productId: data.id };
  } catch (error: any) {
    console.error('Failed to create product:', error);
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      full_description: formData.get('description'),
      price: Number(formData.get('price')),
      sale_price: formData.get('sale_price') ? Number(formData.get('sale_price')) : null,
      category_id: formData.get('category_id'),
      active: formData.get('active') === 'on',
      featured: formData.get('featured') === 'on',
      status: formData.get('status') || 'published',
      short_description: formData.get('benefits'),
      ingredients: formData.get('ingredients'),
      directions: formData.get('directions'),
    };

    const validatedData = productSchema.parse(rawData);

    const { error } = await supabase
      .from('products')
      .update(validatedData)
      .eq('id', id);

    if (error) throw error;

    const imageUrl = formData.get('image_url') as string;
    if (imageUrl) {
      // First, delete existing images for simplicity, then insert new one
      await supabase.from('product_images').delete().eq('product_id', id);
      await supabase.from('product_images').insert({
        product_id: id,
        url: imageUrl,
        is_primary: true
      });
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath(`/products/${validatedData.slug}`);
    revalidatePath('/', 'layout'); // Clears the entire Next.js router cache for public pages
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update product:', error);
    return { success: false, error: error.message };
  }
}
