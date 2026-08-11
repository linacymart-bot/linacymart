import { createClient } from '@/utils/supabase/server';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 3600; // Cache delivery zones for an hour

export default async function CheckoutPage() {
  const supabase = await createClient();

  // Fetch delivery zones
  const { data: counties } = await supabase
    .from('delivery_zones')
    .select('id, county, fee')
    .order('county');

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container-custom max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Secure Checkout</h1>
            <div className="text-sm text-slate-500">
              <Link href="/products" className="hover:text-primary-600">Back to Shopping</Link>
            </div>
          </div>
          <div className="hidden sm:flex items-center text-green-600 text-sm font-medium bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
            <ShieldCheck className="w-4 h-4 mr-1" />
            256-bit Secure Connection
          </div>
        </div>

        <CheckoutForm counties={counties || []} />
      </div>
    </div>
  );
}
