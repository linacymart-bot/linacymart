import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
      <h2 className="text-xl font-medium text-slate-700 animate-pulse">Loading articles...</h2>
    </div>
  );
}
