import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Filter, ArrowDownUp } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const categoryParam = params.category as string | undefined;
  const sortParam = params.sort as string | undefined;

  const supabase = await createClient();

  // Fetch all active categories for the sidebar
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('name');

  // Build the product query
  let query = supabase
    .from('products')
    .select(`
      *,
      categories!inner(slug, name),
      product_images (url, is_primary)
    `)
    .eq('active', true)
    .eq('status', 'published');

  const qParam = params.q as string | undefined;

  // Filter by category if specified
  if (categoryParam && categoryParam !== 'all') {
    query = query.eq('categories.slug', categoryParam);
  }

  // Filter by search query if specified
  if (qParam) {
    query = query.ilike('name', `%${qParam}%`);
  }

  // Apply sorting
  switch (sortParam) {
    case 'price-asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('price', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    default:
      // 'popular' or default
      query = query.order('created_at', { ascending: true });
  }

  const { data: products } = await query;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            {qParam 
              ? `Search results for "${qParam}"`
              : categoryParam && categoryParam !== 'all' && categories
                ? categories.find(c => c.slug === categoryParam)?.name || 'All Products'
                : 'All Products'}
          </h1>
          <div className="text-sm text-slate-500">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900">Products</span>
            {qParam && (
              <>
                <span className="mx-2">/</span>
                <span className="text-slate-900">Search</span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-24">
              <div className="flex items-center gap-2 font-bold text-lg mb-6 border-b border-slate-100 pb-4 text-slate-900">
                <Filter className="w-5 h-5" />
                Categories
              </div>
              
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/products?category=all"
                    className={`block text-sm font-medium transition-colors ${!categoryParam || categoryParam === 'all' ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}
                  >
                    All Products
                  </Link>
                </li>
                {categories?.map((cat) => (
                  <li key={cat.id}>
                    <Link 
                      href={`/products?category=${cat.slug}${sortParam ? `&sort=${sortParam}` : ''}`}
                      className={`block text-sm font-medium transition-colors ${categoryParam === cat.slug ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-grow">
            {/* Sort Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-slate-600 font-medium">
                Showing <span className="text-slate-900 font-bold">{products?.length || 0}</span> products
              </div>
              
              <div className="flex items-center gap-2">
                <ArrowDownUp className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-700 font-medium mr-2">Sort by:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Popular', value: 'popular' },
                    { label: 'Newest', value: 'newest' },
                    { label: 'Price: Low to High', value: 'price-asc' },
                    { label: 'Price: High to Low', value: 'price-desc' },
                  ].map((option) => {
                    const isActive = sortParam === option.value || (!sortParam && option.value === 'popular');
                    return (
                      <Link
                        key={option.value}
                        href={`/products?${categoryParam ? `category=${categoryParam}&` : ''}sort=${option.value}`}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors border ${
                          isActive 
                            ? 'bg-primary-50 text-primary-700 border-primary-200' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'
                        }`}
                      >
                        {option.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Grid */}
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => {
                  const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.url 
                    || product.product_images?.[0]?.url 
                    || '/placeholder.svg';
                    
                  return (
                    <div key={product.id} className="card group hover:shadow-md transition-shadow">
                      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-slate-50">
                        <img 
                          src={primaryImage} 
                          alt={product.name} 
                          className="object-cover w-full h-full mix-blend-multiply p-4 transition-transform group-hover:scale-105"
                        />
                        {product.sale_price && (
                          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            SALE
                          </span>
                        )}
                      </Link>
                      <div className="p-5">
                        <div className="text-xs text-primary-600 font-medium mb-1">
                          {(product.categories as any)?.name}
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">
                          <Link href={`/products/${product.slug}`} className="hover:text-primary-600">
                            {product.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                          {product.short_description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            {product.sale_price ? (
                              <div className="flex flex-col">
                                <span className="text-sm text-slate-400 line-through">KSh {Number(product.price).toLocaleString()}</span>
                                <span className="text-lg font-bold text-slate-900">KSh {Number(product.sale_price).toLocaleString()}</span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-slate-900">KSh {Number(product.price).toLocaleString()}</span>
                            )}
                          </div>
                          <Link href={`/products/${product.slug}`} className="bg-primary-50 text-primary-700 hover:bg-primary-100 p-2 rounded-lg transition-colors font-medium text-sm">
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-xl border border-slate-100 text-center shadow-sm">
                <div className="text-slate-400 mb-4">
                  <Filter className="w-12 h-12 mx-auto opacity-50" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  We couldn't find any active products in this category matching your criteria.
                </p>
                <Link href="/products" className="btn-primary inline-block mt-6">
                  Clear Filters
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
