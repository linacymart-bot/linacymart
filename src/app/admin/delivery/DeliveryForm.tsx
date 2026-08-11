'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateDeliveryFee } from '@/app/actions/admin-delivery';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DeliveryForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await updateDeliveryFee(initialData.id, formData);
        
      if (result.success) {
        router.push('/admin/delivery');
      } else {
        setError(result.error || 'Failed to update fee');
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/delivery" className="p-2 hover:bg-slate-200 bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          Edit Delivery Fee: {initialData.county}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 space-y-6">
        
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">County</label>
          <input 
            value={initialData.county} 
            disabled 
            className="w-full bg-slate-100 border border-slate-200 text-slate-500 px-4 py-2 rounded-xl outline-none" 
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Delivery Fee (KSh)</label>
          <input 
            name="fee"
            type="number" 
            defaultValue={initialData.fee} 
            required 
            className="w-full bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none" 
          />
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button 
            type="submit" 
            disabled={isPending}
            className="flex items-center gap-2 bg-primary-900 hover:bg-primary-800 text-white px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Fee
          </button>
        </div>
      </form>
    </div>
  );
}
