import Link from 'next/link';
import { PackageSearch } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-slate-50">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-primary-100 p-4 rounded-full text-primary-600">
            <PackageSearch className="w-16 h-16" />
          </div>
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          404 - Page Not Found
        </h1>
        
        <p className="text-lg text-slate-600 mb-8">
          Oops! The page or product you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/products" 
            className="btn-primary w-full sm:w-auto"
          >
            Browse Products
          </Link>
          
          <Link 
            href="/" 
            className="px-6 py-3 rounded-xl font-medium border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors w-full sm:w-auto"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
