'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4 tracking-tight">BF Suma</h3>
            <p className="text-sm text-slate-400 mb-4">
              Independent BF Suma Distributor in Kenya. Providing premium health, wellness, and beauty products.
            </p>
            <p className="text-xs text-slate-500 font-medium border-l-2 border-primary-500 pl-3">
              Disclaimer: This is not the official BF Suma corporate website.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-col md:items-center">
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-slate-400 hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-slate-400 hover:text-primary-400 transition-colors">All Products</Link></li>
              <li><Link href="/blog" className="text-slate-400 hover:text-primary-400 transition-colors">Health Blog</Link></li>
              <li><Link href="/become-a-member" className="text-slate-400 hover:text-primary-400 transition-colors">Join as Distributor</Link></li>
              <li><Link href="/checkout" className="text-slate-400 hover:text-primary-400 transition-colors">Checkout</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col md:items-end">
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm text-left md:text-right">Categories</h4>
            <ul className="space-y-4 text-left md:text-right">
              <li><Link href="/products?category=immune-booster" className="text-slate-400 hover:text-primary-400 transition-colors">Immune Boosters</Link></li>
              <li><Link href="/products?category=mens-power" className="text-slate-400 hover:text-primary-400 transition-colors">Men's Health</Link></li>
              <li><Link href="/products?category=womens-beauty" className="text-slate-400 hover:text-primary-400 transition-colors">Women's Health</Link></li>
              <li><Link href="/products?category=smart-kids" className="text-slate-400 hover:text-primary-400 transition-colors">Children's Health</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Meru, Kenya</li>
              <li>Delivery Nationwide via G4S</li>
              <li className="pt-2 flex flex-col gap-2">
                <a href="https://wa.me/254733949512?text=Hello!%20I'm%20interested%20in%20BF%20Suma%20products." target="_blank" rel="noopener noreferrer" className="inline-block bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-500 transition-colors font-medium text-center">
                  Chat with Agent 1
                </a>
                <a href="https://wa.me/254714972502?text=Hello!%20I'm%20interested%20in%20BF%20Suma%20products." target="_blank" rel="noopener noreferrer" className="inline-block bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-500 transition-colors font-medium text-center">
                  Chat with Agent 2
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {currentYear} BF Suma Independent Distributor. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="text-slate-600 cursor-not-allowed">Privacy Policy (Coming Soon)</span>
            <span className="text-slate-600 cursor-not-allowed">Terms of Service (Coming Soon)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
