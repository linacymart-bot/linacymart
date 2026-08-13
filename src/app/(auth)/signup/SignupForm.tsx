'use client';

import { useState } from 'react';
import { signupCustomer } from '@/app/actions/customer-auth';
import { Loader2 } from 'lucide-react';

export function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }
    
    const result = await signupCustomer(formData);
    
    if (result && result.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
    // if successful, signupCustomer redirects to /account
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="label">Full Name</label>
        <div className="mt-1">
          <input
            name="fullName"
            type="text"
            required
            className="input-field"
            placeholder="Jane Doe"
          />
        </div>
      </div>

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

      <div>
        <label className="label">Confirm Password</label>
        <div className="mt-1">
          <input
            name="confirmPassword"
            type="password"
            required
            className="input-field"
            placeholder="••••••••"
          />
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
              Creating account...
            </>
          ) : (
            'Sign up'
          )}
        </button>
      </div>
    </form>
  );
}
