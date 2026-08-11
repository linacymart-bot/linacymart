import Link from 'next/link';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { CartClearer } from '@/components/checkout/CartClearer';

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const orderNumber = params.orderNumber as string;
  const total = params.total as string;
  const phone = params.phone as string;
  const name = params.name as string;
  const shouldClear = params.clear === 'true';

  // WhatsApp integration for M-Pesa push / manual payment confirmation
  const whatsappNumber = '254111802597'; // Actual business WhatsApp number
  const message = encodeURIComponent(
    `Hello BF Suma,\n\nI have just placed an order on the website.\n\n*Order Number:* ${orderNumber}\n*Total:* KSh ${Number(total).toLocaleString()}\n*Name:* ${name}\n*Phone:* ${phone}\n\nPlease initiate the M-Pesa STK push for my payment.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  if (!orderNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Request</h1>
          <p className="text-slate-500 mb-6">No order details found in the URL.</p>
          <Link href="/" className="btn-primary">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4">
      <CartClearer shouldClear={shouldClear} />
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 text-center max-w-xl w-full">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
        <p className="text-slate-500 text-lg mb-8">
          Thank you for your purchase, {name || 'valued customer'}. Your order has been received and is being processed.
        </p>

        <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left border border-slate-200">
          <div className="flex justify-between mb-3 border-b border-slate-200 pb-3">
            <span className="text-slate-500">Order Number</span>
            <span className="font-bold text-slate-900">{orderNumber}</span>
          </div>
          <div className="flex justify-between mb-3 border-b border-slate-200 pb-3">
            <span className="text-slate-500">Total Amount</span>
            <span className="font-bold text-primary-600 text-lg">KSh {Number(total).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Payment Status</span>
            <span className="font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-sm">Pending</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900">Next Step: Complete Payment</h3>
          <p className="text-sm text-slate-600 mb-4">
            To complete your order, please click the button below to send us your order details via WhatsApp. We will trigger an M-Pesa STK push to your phone number ({phone}) immediately.
          </p>
          
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl transition-colors w-full text-lg shadow-sm"
          >
            <MessageCircle className="w-6 h-6" />
            Pay via WhatsApp
          </a>

          <Link href="/products" className="block text-slate-500 hover:text-primary-600 font-medium text-sm mt-6">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
