'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createPromoCode } from '@/app/actions/admin-promos';
import { ArrowLeft, Loader2, Save, Tag } from 'lucide-react';

export default function NewPromoCodePage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await createPromoCode(formData);
      if (result.success) {
        router.push('/admin/promo-codes');
      } else {
        setError(result.error || 'Failed to create promo code');
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/promo-codes" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Promo Code</h1>
          <p className="text-sm text-slate-500 mt-1">Add a new discount code for your customers.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start gap-3">
              <div className="mt-0.5">⚠️</div>
              <div>{error}</div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Promo Code</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                name="code" 
                required 
                placeholder="e.g. SUMMER25"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium uppercase"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Customers will enter this code at checkout.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Discount Type</label>
              <select 
                name="discount_type" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none font-medium"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (KSh)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Discount Value</label>
              <input 
                type="number" 
                name="discount_value" 
                required 
                min="0.01"
                step="0.01"
                placeholder="e.g. 10"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Maximum Uses (Optional)</label>
            <input 
              type="number" 
              name="max_uses" 
              min="1"
              placeholder="Leave blank for unlimited"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
            />
            <p className="text-xs text-slate-500 mt-2">The total number of times this code can be used across all customers.</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Link 
              href="/admin/promo-codes"
              className="px-6 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={isPending}
              className="btn-primary flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Promo Code
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
