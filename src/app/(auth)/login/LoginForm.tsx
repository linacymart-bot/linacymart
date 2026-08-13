'use client';

import { useState } from 'react';
import { loginCustomer } from '@/app/actions/customer-auth';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/account';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append('redirectTo', redirectTo);
    
    const result = await loginCustomer(formData);
    
    if (result && result.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
    // if successful, loginCustomer redirects to /account or redirectTo
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="label">Email address</label>
        <div className="mt-1">
          <input
            name="email"
            type="email"
            required
            className="input-field"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label className="label">Password</label>
        <div className="mt-1">
          <input
            name="password"
            type="password"
            required
            className="input-field"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <Link href="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
            Forgot your password?
          </Link>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full h-12 flex justify-center items-center gap-2 text-base disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </div>
    </form>
  );
}
