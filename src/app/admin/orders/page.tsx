import { createAdminClient } from '@/utils/supabase/server';
import { Search, Eye } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const supabase = await createAdminClient();

  const { data: rawOrders, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      total,
      status,
      created_at,
      customer:customers(full_name, phone)
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Orders</h1>
          <p className="text-slate-500 mt-1">Manage and track customer orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="pl-9 pr-4 py-2 w-full sm:w-80 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
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
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders?.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      #{order.order_number}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{order.customer_name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{order.customer_phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleString()}
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
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/orders/${order.id}`} className="text-primary-600 hover:text-primary-800 font-medium bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
