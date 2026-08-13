import { createAdminClient } from '@/utils/supabase/server';
import { BlogForm } from '../BlogForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const supabase = await createAdminClient();
  
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!post) {
    notFound();
  }

  return <BlogForm post={post} />;
}
