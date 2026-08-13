import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export const metadata = {
  title: 'Reset Password - Linacy',
  description: 'Reset your Linacy account password.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to login
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-slate-900">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Enter your email and we will send you a reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
          <ForgotPasswordForm />
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span>Secure, encrypted process</span>
        </div>
      </div>
    </div>
  );
}
