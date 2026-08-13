import Link from 'next/link';
import { Suspense } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { LoginForm } from './LoginForm';

export const metadata = {
  title: 'Login - Linacy',
  description: 'Login to your Linacy account to track orders and save wishlists.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-primary-600 hover:text-primary-500">
            Sign up for free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
          <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span>Secure, encrypted login</span>
        </div>
      </div>
    </div>
  );
}
