import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-16">
      <div className="container-custom max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
          <h2 className="text-xl font-medium text-slate-700 animate-pulse">Loading product details...</h2>
        </div>
      </div>
    </div>
  );
}
