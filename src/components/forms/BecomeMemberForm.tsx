'use client';

import { useState, useTransition } from 'react';
import { submitLeadForm } from '@/app/actions/lead';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function BecomeMemberForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (formData: FormData) => {
    setStatus('idle');
    setErrorMessage('');
    
    startTransition(async () => {
      const result = await submitLeadForm(formData);
      
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Something went wrong.');
      }
    });
  };

  if (status === 'success') {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Received!</h3>
        <p className="text-slate-600 mb-6">
          Thank you for your interest in joining BF Suma. Our team will review your application and contact you shortly.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="btn-secondary"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Start Your Journey Today</h3>
      
      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <form action={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
          <input 
            type="text" 
            name="name"
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            placeholder="e.g. John Doe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
          <input 
            type="tel" 
            name="phone"
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            placeholder="e.g. 0712345678"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input 
            type="email" 
            name="email"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            placeholder="john@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Your Location (County) *</label>
          <input 
            type="text" 
            name="location"
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            placeholder="e.g. Nairobi"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Any Questions? (Optional)</label>
          <textarea 
            name="message"
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
            placeholder="What would you like to know?"
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          disabled={isPending}
          className="btn-primary w-full py-4 text-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Interest'
          )}
        </button>
        
        <p className="text-xs text-slate-500 text-center mt-4">
          By submitting, you agree to be contacted by our team regarding this opportunity.
        </p>
      </form>
    </div>
  );
}
