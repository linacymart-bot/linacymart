import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { MarkdownRenderer } from './MarkdownRenderer';

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, content, cover_image')
    .eq('slug', slug)
    .single();

  if (!post) return { title: 'Not Found' };

  return {
    title: `${post.title} - Linacy Blog`,
    description: post.content.substring(0, 150),
    openGraph: {
      images: post.cover_image ? [{ url: post.cover_image }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!post) {
    notFound();
  }

  // Pre-fetch any products referenced by shortcodes in the markdown [PRODUCT:slug]
  const productSlugs = new Set<string>();
  const regex = /\[PRODUCT:([a-zA-Z0-9-]+)\]/g;
  let match;
  while ((match = regex.exec(post.content)) !== null) {
    productSlugs.add(match[1]);
  }

  let productsMap = new Map();
  if (productSlugs.size > 0) {
    const { data: products } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        sale_price,
        product_images(url, is_primary)
      `)
      .in('slug', Array.from(productSlugs))
      .eq('active', true);

    if (products) {
      products.forEach(p => productsMap.set(p.slug, p));
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to all articles
        </Link>

        <article className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {post.cover_image && (post.cover_image.startsWith('http') || post.cover_image.startsWith('/')) && (
            <div className="w-full aspect-[2/1] relative">
              <img 
                src={post.cover_image} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8 sm:p-12">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-6">
              <Calendar className="w-4 h-4" />
              {new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-10">
              {post.title}
            </h1>
            
            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-primary-600">
              <MarkdownRenderer content={post.content} products={Object.fromEntries(productsMap)} />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
