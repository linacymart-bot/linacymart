import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Search, ArrowRight } from 'lucide-react';
import { redirect } from 'next/navigation';

export const revalidate = 0; // Dynamic page

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';

  const supabase = await createClient();
  
  let products = [];
  
  if (q.trim()) {
    // Basic search on name and description
    const { data } = await supabase
      .from('products')
      .select(`
        *,
        categories (name, slug),
        product_images (url, is_primary)
      `)
      .eq('active', true)
      .eq('status', 'published')
      .or(`name.ilike.%${q}%,short_description.ilike.%${q}%`);
      
    products = data || [];
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container-custom max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-6 text-center">Search Products</h1>
          
          <form action="/search" method="GET" className="relative max-w-2xl mx-auto">
            <input 
              type="text" 
              name="q"
              defaultValue={q}
              placeholder="Search by product name or benefits..." 
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-6 py-4 pl-14 text-lg focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all"
              autoFocus
            />
            <Search className="w-6 h-6 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Search
            </button>
          </form>
        </div>

        {q && (
          <div className="mb-6 text-slate-600 font-medium">
            Found {products.length} {products.length === 1 ? 'result' : 'results'} for "<span className="text-slate-900">{q}</span>"
          </div>
        )}

        {q && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map((product) => {
              const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.url 
                || product.product_images?.[0]?.url 
                || '/placeholder.svg';
                
              return (
                <div key={product.id} className="card group hover:shadow-md transition-shadow flex overflow-hidden h-40">
                  <div className="w-1/3 bg-slate-50 relative p-4 flex-shrink-0 flex items-center justify-center">
                    <img 
                      src={primaryImage} 
                      alt={product.name} 
                      className="object-contain w-full h-full mix-blend-multiply transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="w-2/3 p-4 flex flex-col justify-center">
                    <div className="text-xs text-primary-600 font-medium mb-1">
                      {(product.categories as any)?.name}
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">
                      <Link href={`/products/${product.slug}`} className="hover:text-primary-600 before:absolute before:inset-0">
                        {product.name}
                      </Link>
                    </h3>
                    <div className="mt-auto pt-2">
                      <span className="text-lg font-bold text-slate-900">
                        KSh {Number(product.sale_price || product.price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {q && products.length === 0 && (
          <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">No results found</h2>
            <p className="text-slate-500 mb-6">
              We couldn't find anything matching "{q}". Try checking your spelling or searching for a different term.
            </p>
            <Link href="/products" className="text-primary-600 font-medium hover:text-primary-700 flex items-center justify-center gap-2">
              Browse all products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
