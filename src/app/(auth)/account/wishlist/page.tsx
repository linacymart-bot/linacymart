import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Package, Heart, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';

export const metadata = {
  title: 'My Wishlist - Linacy',
};

export default async function WishlistPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login?redirectTo=/account/wishlist');
  }

  // Fetch wishlisted products
  const { data: wishlists } = await supabase
    .from('wishlists')
    .select(`
      product_id,
      products (
        id,
        name,
        slug,
        price,
        sale_price,
        short_description,
        categories (name, slug),
        product_images (url, is_primary)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Filter out any null products (in case they were deleted but cascade failed somehow)
  const products = wishlists?.map(w => w.products).filter(Boolean) || [];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container-custom max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-2">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
              <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-bold text-slate-900">{user.user_metadata?.full_name || 'Customer'}</h2>
              <p className="text-sm text-slate-500 truncate">{user.email}</p>
            </div>
            
            <nav className="flex flex-col gap-1">
              <Link href="/account" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
                <Package className="w-5 h-5" /> Orders
              </Link>
              <Link href="/account/wishlist" className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-700 rounded-lg font-medium">
                <Heart className="w-5 h-5" /> Wishlist
              </Link>
              
              <form action="/actions/customer-auth" method="POST" className="mt-4 border-t border-slate-200 pt-4">
                <button formAction={async () => {
                  'use server';
                  const supabase = await createClient();
                  await supabase.auth.signOut();
                  redirect('/login');
                }} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors text-left">
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </form>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">My Wishlist</h1>
            
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium text-slate-900 mb-1">Your wishlist is empty</p>
                <p className="mb-6 text-slate-500">Save items you love so you can easily find them later.</p>
                <Link href="/products" className="btn-primary inline-flex">Explore Products</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
          
        </div>
        
      </div>
    </div>
  );
}
