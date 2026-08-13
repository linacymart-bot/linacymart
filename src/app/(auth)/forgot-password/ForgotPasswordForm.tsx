'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import { resetPassword } from '@/app/actions/customer-auth';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? 'Sending link...' : 'Send reset link'}
    </button>
  );
}

export function ForgotPasswordForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function action(formData: FormData) {
    setError(null);
    setSuccess(false);
    
    const result = await resetPassword(formData);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Check your email</h3>
        <p className="text-sm text-slate-500">
          We've sent a password reset link to your email address. 
          Please check your inbox (and spam folder) to continue.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start">
          <span className="mr-2">⚠️</span>
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email address
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-slate-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full pl-10 sm:text-sm border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2.5 border"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
