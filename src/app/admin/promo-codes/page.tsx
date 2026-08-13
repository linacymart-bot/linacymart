import { createClient } from '@/utils/supabase/server';
import { Plus, Tag, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { PromoActions } from './PromoActions';

export const dynamic = 'force-dynamic';

export default async function AdminPromoCodesPage() {
  const supabase = await createClient();

  const { data: promos } = await supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Promo Codes</h1>
          <p className="text-slate-500 mt-1">Manage discounts and promotional codes.</p>
        </div>
        <Link 
          href="/admin/promo-codes/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Promo Code
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Uses</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {promos?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No promo codes found. Create one to get started.
                  </td>
                </tr>
              ) : (
                promos?.map((promo: any) => (
                  <tr key={promo.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary-500" />
                        {promo.code}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Created {new Date(promo.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {promo.discount_type === 'percentage' 
                        ? `${promo.discount_value}% OFF`
                        : `KSh ${Number(promo.discount_value).toLocaleString()} OFF`
                      }
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="font-medium text-slate-900">{promo.uses}</span>
                      {promo.max_uses ? ` / ${promo.max_uses}` : ' / ∞'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {promo.active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <PromoActions id={promo.id} currentStatus={promo.active} />
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
