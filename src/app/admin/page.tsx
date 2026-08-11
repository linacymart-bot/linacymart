import { createAdminClient } from '@/utils/supabase/server';
import { Package, TrendingUp, Users, Clock, Search } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = await createAdminClient();

  // Fetch orders (latest first)
  const { data: rawOrders, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      total,
      status,
      created_at,
      customer:customers(full_name, phone),
      items:order_items(
        quantity,
        product:products(name, product_images(url, is_primary))
      )
    `)
    .order('created_at', { ascending: false });

  if (error) console.error(error);

  const orders = rawOrders?.map(o => {
    const cust = Array.isArray(o.customer) ? o.customer[0] : o.customer;
    return {
      ...o,
      total_amount: o.total,
      customer_name: cust?.full_name || 'Unknown',
      customer_phone: cust?.phone || 'Unknown'
    };
  }) || [];

  const realizedRevenue = orders
    .filter(o => o.status.toLowerCase() === 'completed')
    .reduce((sum, order) => sum + Number(order.total_amount), 0);

  const pendingRevenue = orders
    .filter(o => ['new', 'pending', 'processing'].includes(o.status.toLowerCase()))
    .reduce((sum, order) => sum + Number(order.total_amount), 0);

  const totalSuccessfulOrders = orders.filter(o => o.status.toLowerCase() !== 'cancelled').length;
  const canceledOrders = orders.filter(o => o.status.toLowerCase() === 'cancelled').length;

  // Calculate top selling products (from completed orders only)
  const productSales: Record<string, { name: string; quantity: number; image: string }> = {};
  orders
    .filter(o => o.status.toLowerCase() === 'completed')
    .forEach(order => {
      order.items?.forEach((item: any) => {
        const product = Array.isArray(item.product) ? item.product[0] : item.product;
        if (product && product.name) {
          if (!productSales[product.name]) {
            const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.url 
                      || product.product_images?.[0]?.url 
                      || '/placeholder.svg';
            productSales[product.name] = { name: product.name, quantity: 0, image: primaryImage };
          }
          productSales[product.name].quantity += item.quantity;
        }
      });
    });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Realized Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900">KSh {realizedRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900">KSh {pendingRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Orders</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalSuccessfulOrders}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Canceled Orders</p>
              <h3 className="text-2xl font-bold text-slate-900">{canceledOrders}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="pl-9 pr-4 py-2 w-full sm:w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders?.slice(0, 10).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        #{order.order_number}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{order.customer_name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{order.customer_phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.status.toLowerCase() === 'new' || order.status.toLowerCase() === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          order.status.toLowerCase() === 'processing' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          order.status.toLowerCase() === 'completed' ? 'bg-green-50 text-green-700 border border-green-200' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-900">
                        KSh {Number(order.total_amount).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
            <Link href="/admin/orders" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all orders &rarr;
            </Link>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Top Selling Products</h2>
            <p className="text-sm text-slate-500 mt-1">Based on completed orders</p>
          </div>
          <div className="p-6 flex-1">
            {topProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3 py-8">
                <Package className="w-8 h-8 text-slate-300" />
                <p>No completed sales yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {topProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-100" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{product.name}</p>
                      <p className="text-sm text-slate-500">{product.quantity} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
