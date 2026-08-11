'use client';

import { useState, useTransition } from 'react';
import { submitReview } from '@/app/actions/review';
import { Star, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    formData.append('productId', productId);
    formData.append('rating', rating.toString());
    
    setStatus('idle');
    setErrorMessage('');

    startTransition(async () => {
      const result = await submitReview(formData);
      if (result.success) {
        setStatus('success');
        // Refresh the page data to show the new review
        router.refresh();
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Failed to submit review');
      }
    });
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 p-6 rounded-2xl text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h4 className="font-bold text-green-900 mb-2">Review Submitted!</h4>
        <p className="text-sm text-green-700">Thank you for sharing your experience.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm font-medium text-green-700 hover:text-green-800 underline"
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
      <h3 className="font-bold text-slate-900 mb-4">Write a Review</h3>
      
      {status === 'error' && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star 
                className={`w-8 h-8 ${
                  star <= (hoveredRating || rating) 
                    ? 'fill-amber-400 text-amber-400' 
                    : 'fill-slate-200 text-slate-200'
                }`} 
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">Your Name *</label>
        <input 
          type="text" 
          name="reviewerName" 
          required 
          placeholder="John D."
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">Your Review *</label>
        <textarea 
          name="comment" 
          required 
          rows={4}
          placeholder="Tell us what you liked about this product..."
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="btn-primary w-full flex justify-center items-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
          </>
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  );
}
