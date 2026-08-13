import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Filter, ArrowDownUp } from 'lucide-react';
import { ProductFilters } from './ProductFilters';
import { ProductCard } from '@/components/products/ProductCard';

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
  const minPriceParam = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPriceParam = params.maxPrice ? Number(params.maxPrice) : undefined;

  // Filter by category if specified
  if (categoryParam && categoryParam !== 'all') {
    query = query.eq('categories.slug', categoryParam);
  }

  // Filter by search query if specified
  if (qParam) {
    query = query.ilike('name', `%${qParam}%`);
  }

  // Filter by price range
  if (minPriceParam && !isNaN(minPriceParam)) {
    query = query.gte('price', minPriceParam);
  }
  if (maxPriceParam && !isNaN(maxPriceParam)) {
    query = query.lte('price', maxPriceParam);
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
  
  // Fetch user's wishlisted product IDs if logged in
  let userWishlistIds = new Set<string>();
  const { data: { user } } = await supabase.auth.getUser();
  if (user && products) {
    const { data: wishlists } = await supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', user.id);
      
    if (wishlists) {
      userWishlistIds = new Set(wishlists.map(w => w.product_id));
    }
  }

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
          {/* Categories Sidebar/Top Bar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 lg:p-6 sticky top-24">
              <div className="hidden lg:flex items-center gap-2 font-bold text-lg mb-6 border-b border-slate-100 pb-4 text-slate-900">
                <Filter className="w-5 h-5" />
                Categories
              </div>
              
              <ul className="flex flex-row lg:flex-col gap-3 lg:gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
                <li className="flex-shrink-0 lg:flex-shrink">
                  <Link 
                    href="/products?category=all"
                    className={`block text-sm font-medium transition-colors whitespace-nowrap lg:whitespace-normal px-4 py-2 lg:px-0 lg:py-0 rounded-full lg:rounded-none ${!categoryParam || categoryParam === 'all' ? 'bg-primary-50 lg:bg-transparent text-primary-700 lg:text-primary-600' : 'bg-slate-50 lg:bg-transparent text-slate-600 hover:text-primary-600'}`}
                  >
                    All Products
                  </Link>
                </li>
                {categories?.map((cat) => (
                  <li key={cat.id} className="flex-shrink-0 lg:flex-shrink">
                    <Link 
                      href={`/products?category=${cat.slug}${sortParam ? `&sort=${sortParam}` : ''}`}
                      className={`block text-sm font-medium transition-colors whitespace-nowrap lg:whitespace-normal px-4 py-2 lg:px-0 lg:py-0 rounded-full lg:rounded-none ${categoryParam === cat.slug ? 'bg-primary-50 lg:bg-transparent text-primary-700 lg:text-primary-600' : 'bg-slate-50 lg:bg-transparent text-slate-600 hover:text-primary-600'}`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <ProductFilters />
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-grow">
            {/* Sort Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-slate-600 font-medium w-full sm:w-auto text-left">
                Showing <span className="text-slate-900 font-bold">{products?.length || 0}</span> products
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-hidden">
                <ArrowDownUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span className="text-sm text-slate-700 font-medium flex-shrink-0 mr-1 sm:mr-2">Sort by:</span>
                <div className="flex overflow-x-auto gap-2 pb-2 sm:pb-0 scrollbar-hide flex-grow -mx-2 px-2 sm:mx-0 sm:px-0">
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
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors border whitespace-nowrap flex-shrink-0 ${
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
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isWishlisted={userWishlistIds.has(product.id)} 
                  />
                ))}
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
