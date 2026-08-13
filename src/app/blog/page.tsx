import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { ArrowRight, Calendar, User } from 'lucide-react';

export const revalidate = 3600; // Revalidate every hour

export const metadata = {
  title: 'Health Blog - Linacy',
  description: 'Read the latest articles on health, wellness, and supplements from Linacy.',
};

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('title, slug, cover_image, created_at, content')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Health & Wellness Blog
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Expert advice, supplement guides, and wellness tips to help you live a healthier life.
          </p>
        </div>

        {(!posts || posts.length === 0) ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No articles yet</h3>
            <p className="text-slate-500">Check back soon for our latest health insights!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link 
                key={post.slug} 
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden relative">
                  {post.cover_image ? (
                    <img 
                      src={post.cover_image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                      Linacy
                    </div>
                  )}
                </div>
                <div className="flex-1 p-6 sm:p-8 flex flex-col">
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-1">
                    {/* Extract a short snippet by stripping markdown */}
                    {post.content.replace(/#|\*|\[|\]|\(|\)|_|`|>|-/g, '').substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center text-sm font-bold text-primary-600 group-hover:gap-2 transition-all">
                    Read Article <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
