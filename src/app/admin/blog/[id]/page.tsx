import { createClient } from '@supabase/supabase-js';
import { BlogForm } from '../BlogForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (!post) {
    notFound();
  }

  return <BlogForm post={post} />;
}
