'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  cover_image: z.string().optional(),
  published: z.boolean().default(false),
});

export async function createBlogPost(formData: FormData) {
  try {
    const rawData = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      content: formData.get('content'),
      cover_image: formData.get('cover_image') || null,
      published: formData.get('published') === 'on',
    };

    const validatedData = blogSchema.parse(rawData);

    const { error } = await supabase
      .from('blog_posts')
      .insert({
        ...validatedData,
      });

    if (error) throw error;

    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to create blog post:', error);
    return { success: false, error: error.message };
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  try {
    const rawData = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      content: formData.get('content'),
      cover_image: formData.get('cover_image') || null,
      published: formData.get('published') === 'on',
    };

    const validatedData = blogSchema.parse(rawData);

    const { error } = await supabase
      .from('blog_posts')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    revalidatePath(`/blog/${validatedData.slug}`);
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update blog post:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
