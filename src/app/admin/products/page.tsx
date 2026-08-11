import { createClient } from '@/utils/supabase/server';
import { Search, Plus, Pencil } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      sale_price,
      active,
      featured,
      categories(name),
      product_images(url, is_primary)
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Products</h1>
          <p className="text-slate-500 mt-1">Manage your catalog, prices, and offers.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="pl-9 pr-4 py-2 w-full sm:w-80 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                products?.map((product: any) => {
                  const category = Array.isArray(product.categories) ? product.categories[0] : product.categories;
                  const primaryImg = product.product_images?.find((img: any) => img.is_primary)?.url || product.product_images?.[0]?.url;
                  
                  return (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                            {primaryImg ? (
                              <img src={primaryImg} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-slate-400 text-xs">No img</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{product.name}</div>
                            {product.featured && <span className="text-xs text-primary-600 font-medium">Featured</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {category?.name || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {product.sale_price ? (
                          <div>
                            <div className="font-bold text-red-600">KSh {Number(product.sale_price).toLocaleString()}</div>
                            <div className="text-xs line-through text-slate-400">KSh {Number(product.price).toLocaleString()}</div>
                          </div>
                        ) : (
                          <div className="font-medium text-slate-900">KSh {Number(product.price).toLocaleString()}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${product.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                          {product.active ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/products/${product.id}`} className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
