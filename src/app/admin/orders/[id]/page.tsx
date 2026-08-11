import { createAdminClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, MapPin, Package, Clock, CreditCard } from 'lucide-react';
import OrderStatusSelect from './OrderStatusSelect';

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createAdminClient();

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      customer:customers(full_name, phone, email, county, town, delivery_location),
      items:order_items(
        id,
        quantity,
        price,
        product:products(name, slug, product_images(url, is_primary))
      )
    `)
    .eq('id', id)
    .single();

  if (!order) {
    notFound();
  }

  const customer = Array.isArray(order.customer) ? order.customer[0] : order.customer;
  const items = order.items || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/orders" className="p-2 hover:bg-slate-200 bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            Order #{order.order_number}
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
              order.status === 'completed' ? 'bg-green-100 text-green-800' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-slate-200 text-slate-800'
            }`}>
              {order.status.toUpperCase()}
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            <Clock className="w-4 h-4" /> {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        
        <div className="ml-auto flex items-center gap-3">
          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Items & Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-bold text-slate-900">Order Items</h2>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Product</th>
                    <th className="px-6 py-3 font-medium text-center">Qty</th>
                    <th className="px-6 py-3 font-medium text-right">Price</th>
                    <th className="px-6 py-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item: any) => {
                    const product = Array.isArray(item.product) ? item.product[0] : item.product;
                    const primaryImage = product?.product_images?.find((img: any) => img.is_primary)?.url 
                      || product?.product_images?.[0]?.url 
                      || '/placeholder.svg';

                    return (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={primaryImage} alt={product?.name} className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-slate-100" />
                            <span className="font-medium text-slate-900">{product?.name || 'Unknown Product'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-medium">{item.quantity}</td>
                        <td className="px-6 py-4 text-right text-slate-600">KSh {Number(item.price).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-medium text-slate-900">KSh {(Number(item.price) * item.quantity).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-bold text-slate-900">Payment Summary</h2>
            </div>
            <div className="p-6 bg-slate-50/50">
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-900">KSh {Number(order.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-4 text-sm">
                <span className="text-slate-500">Delivery Fee</span>
                <span className="font-medium text-slate-900">KSh {Number(order.delivery_fee).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <span className="font-bold text-slate-900 text-lg">Total</span>
                <span className="font-black text-primary-700 text-xl">KSh {Number(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Customer Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
              <User className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-bold text-slate-900">Customer Details</h2>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-slate-900 mb-1">{customer?.full_name || 'Unknown'}</h3>
              <p className="text-slate-600 text-sm mb-4">
                <a href={`tel:${customer?.phone}`} className="text-primary-600 hover:underline">{customer?.phone || 'No phone'}</a>
                <br />
                {customer?.email ? <a href={`mailto:${customer.email}`} className="text-primary-600 hover:underline">{customer.email}</a> : 'No email provided'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-bold text-slate-900">Delivery Address</h2>
            </div>
            <div className="p-6">
              <p className="text-slate-700 text-sm leading-relaxed">
                <span className="font-bold block mb-1">{customer?.county}</span>
                {customer?.delivery_location}
              </p>
            </div>
          </div>

          {order.notes && (
            <div className="bg-amber-50 rounded-2xl border border-amber-100 overflow-hidden">
              <div className="p-6 border-b border-amber-100">
                <h2 className="text-sm font-bold text-amber-900 uppercase tracking-wider">Customer Notes</h2>
              </div>
              <div className="p-6 pt-4 text-sm text-amber-800 leading-relaxed italic">
                "{order.notes}"
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
