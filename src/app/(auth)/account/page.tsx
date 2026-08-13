import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Package, Heart, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'My Account - Linacy',
};

export default async function AccountPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login?redirectTo=/account');
  }

  // Fetch user orders matching their email (since our orders table currently links by customer email/phone)
  // Or fetch by user_id if we have linked them
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      created_at,
      total,
      status,
      customers ( email )
    `)
    .eq('customers.email', user.email)
    .order('created_at', { ascending: false });

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
              <Link href="/account" className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-700 rounded-lg font-medium">
                <Package className="w-5 h-5" /> Orders
              </Link>
              <Link href="/account/wishlist" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
                <Heart className="w-5 h-5" /> Wishlist
              </Link>
              <Link href="/account/settings" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
                <Settings className="w-5 h-5" /> Settings
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
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Order History</h1>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {(!orders || orders.length === 0) ? (
                <div className="p-12 text-center text-slate-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-medium text-slate-900 mb-1">No orders yet</p>
                  <p className="mb-6">When you place an order, it will appear here.</p>
                  <Link href="/products" className="btn-primary inline-flex">Start Shopping</Link>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                      <th className="px-6 py-4 font-medium">Order #</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Total</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {order.order_number}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">
                          KSh {Number(order.total).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  );
}
