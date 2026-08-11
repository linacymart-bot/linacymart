'use client';

import { useState } from 'react';
import { loginAdmin } from '@/app/actions/auth';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await loginAdmin(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 p-8 text-center">
        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Portal</h1>
        <p className="text-slate-500 mb-8">Enter your secure password to access the dashboard.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm font-medium py-3 px-4 rounded-xl border border-red-100 text-left">
              {error}
            </div>
          )}
          
          <div className="text-left">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input 
              type="password" 
              name="password"
              required
              placeholder="••••••••"
              className="block w-full rounded-xl border-slate-200 bg-slate-50 border px-4 py-3 text-slate-900 shadow-sm transition-colors focus:border-primary-500 focus:ring-primary-500 focus:bg-white sm:text-sm"
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-8 py-3 text-sm font-medium rounded-xl text-white bg-primary-900 hover:bg-primary-800 transition-colors disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}
