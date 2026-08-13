'use client';

import { useTransition } from 'react';
import { Eye, EyeOff, Trash2, Loader2 } from 'lucide-react';
import { toggleReviewStatus, deleteReview } from '@/app/actions/admin-reviews';

export function ReviewActions({ id, currentStatus }: { id: string, currentStatus: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleReviewStatus(id, currentStatus);
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this review permanently?')) {
      startTransition(async () => {
        await deleteReview(id);
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <button 
        onClick={handleToggle}
        disabled={isPending}
        title={currentStatus ? "Hide Review" : "Approve Review"}
        className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors disabled:opacity-50 ${
          currentStatus 
            ? 'text-amber-600 hover:bg-amber-50' 
            : 'text-green-600 hover:bg-green-50'
        }`}
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : currentStatus ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
      
      <button 
        onClick={handleDelete}
        disabled={isPending}
        title="Delete Review"
        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
