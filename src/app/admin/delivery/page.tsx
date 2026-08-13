import { createClient } from '@/utils/supabase/server';
import { Pencil, Plus } from 'lucide-react';
import Link from 'next/link';
import { DeleteDeliveryButton } from './DeleteDeliveryButton';

export const dynamic = 'force-dynamic';

export default async function AdminDeliveryPage() {
  const supabase = await createClient();

  const { data: zones } = await supabase
    .from('delivery_zones')
    .select('*')
    .order('county');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Delivery Zones</h1>
          <p className="text-slate-500 mt-1">Manage shipping fees across different counties.</p>
        </div>
        <Link href="/admin/delivery/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Location
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">County</th>
                <th className="px-6 py-4 text-right">Delivery Fee</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {zones?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    No delivery zones found.
                  </td>
                </tr>
              ) : (
                zones?.map((zone: any) => (
                  <tr key={zone.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {zone.county}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      KSh {Number(zone.fee).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link href={`/admin/delivery/${zone.id}`} className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit location">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteDeliveryButton id={zone.id} />
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
