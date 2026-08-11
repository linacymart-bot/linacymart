'use client';

import { useState } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitMembershipLead } from '@/app/actions/membership';
import { Loader2, CheckCircle2 } from 'lucide-react';

const membershipSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(9, 'Please enter a valid phone number'),
  countyId: z.string().uuid('Please select your location'),
  message: z.string().optional(),
});

type MembershipFormData = z.infer<typeof membershipSchema>;

interface MembershipFormProps {
  counties: { id: string; county: string }[];
}

export function MembershipForm({ counties }: MembershipFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useHookForm<MembershipFormData>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      countyId: '',
    },
  });

  const onSubmit = async (data: MembershipFormData) => {
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('phone', data.phone);
    formData.append('countyId', data.countyId);
    formData.append('message', data.message || '');

    const result = await submitMembershipLead(formData);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || 'Failed to submit application. Please try again.');
    }
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 p-8 rounded-2xl border border-green-100 text-center animate-in fade-in duration-500">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-900 mb-2">Application Received!</h3>
        <p className="text-green-700">
          Thank you for your interest in joining BF Suma. One of our top leaders will contact you shortly on the phone number provided to guide you on the next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Start Your Journey Today</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="label">Full Name *</label>
        <input 
          type="text" 
          className={`input-field ${errors.name ? 'border-red-500 ring-red-100' : ''}`}
          placeholder="e.g. John Doe"
          {...register('name')}
        />
        {errors.name && <p className="error-text">{errors.name.message}</p>}
      </div>
      
      <div>
        <label className="label">Phone Number *</label>
        <input 
          type="tel" 
          className={`input-field ${errors.phone ? 'border-red-500 ring-red-100' : ''}`}
          placeholder="e.g. 0712345678"
          {...register('phone')}
        />
        {errors.phone && <p className="error-text">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="label">Your Location (County) *</label>
        <select 
          className={`input-field bg-white ${errors.countyId ? 'border-red-500 ring-red-100' : ''}`}
          {...register('countyId')}
        >
          <option value="" disabled>-- Select your county --</option>
          {counties.map(county => (
            <option key={county.id} value={county.id}>
              {county.county}
            </option>
          ))}
        </select>
        {errors.countyId && <p className="error-text">{errors.countyId.message}</p>}
      </div>

      <div>
        <label className="label">Message (Optional)</label>
        <textarea 
          className="input-field resize-none h-24"
          placeholder="Tell us a bit about why you want to join..."
          {...register('message')}
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="btn-primary w-full h-14 text-lg mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting Application...
          </>
        ) : (
          'Apply Now'
        )}
      </button>
    </form>
  );
}
