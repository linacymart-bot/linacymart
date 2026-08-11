'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  const { getCartCount, setCartDrawerOpen } = useCartStore();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'All Products', href: '/products' },
    { name: 'Become a Member', href: '/become-a-member' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-slate-200/60 shadow-sm supports-[backdrop-filter]:bg-white/60 transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 text-white px-4 py-2 text-center text-sm font-medium tracking-wide">
        <Link href="/become-a-member" className="hover:text-primary-50 transition-colors inline-block hover:scale-105 duration-200">
          BECOME A BF SUMA MEMBER - LEARN MORE
        </Link>
      </div>

      <nav className="container-custom mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-700 tracking-tight">BF Suma</span>
              <span className="text-sm font-medium text-slate-500 hidden sm:block border-l pl-2 border-slate-300">Independent Distributor</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                  pathname === item.href ? 'text-primary-600' : 'text-slate-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const query = formData.get('q');
                if (query) window.location.href = `/products?q=${encodeURIComponent(query.toString())}`;
              }}
              className="hidden lg:flex items-center relative mr-2"
            >
              <input 
                type="text" 
                name="q"
                placeholder="Search products..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all w-64"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
            <button 
              onClick={() => setCartDrawerOpen(true)}
              className="text-slate-700 hover:text-primary-600 p-2 relative flex items-center gap-2 group"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {mounted && getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {getCartCount()}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold hidden sm:block group-hover:text-primary-600">Cart</span>
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center ml-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-700 hover:text-primary-600 p-2 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white shadow-lg absolute w-full left-0">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const query = formData.get('q');
                  if (query) window.location.href = `/products?q=${encodeURIComponent(query.toString())}`;
                }}
                className="relative w-full"
              >
                <input 
                  type="text" 
                  name="q"
                  placeholder="Search products..." 
                  className="pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 w-full transition-all"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </form>

              <div className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-3 rounded-xl text-base font-medium ${
                      pathname === item.href
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
