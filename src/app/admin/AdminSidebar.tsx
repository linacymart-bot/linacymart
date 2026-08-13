'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, ShieldCheck, LayoutDashboard, ShoppingBag, Package, Tags, Truck, Menu, X, Star, Tag } from 'lucide-react';
import { logoutAdmin } from '@/app/actions/auth';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/categories', icon: Tags, label: 'Categories' },
    { href: '/admin/delivery', icon: Truck, label: 'Delivery Zones' },
    { href: '/admin/reviews', icon: Star, label: 'Reviews' },
    { href: '/admin/promo-codes', icon: Tag, label: 'Promo Codes' },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary-500" />
          <span className="text-lg font-bold">Admin Portal</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-slate-800 rounded-lg">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isOpen ? 'block' : 'hidden'} md:flex 
        w-full md:w-64 bg-slate-900 text-white flex-col 
        min-h-[auto] md:min-h-screen 
        fixed md:sticky top-[68px] md:top-0 z-40 
        h-[calc(100vh-68px)] md:h-screen
      `}>
        <div className="hidden md:flex p-6 items-center gap-3 border-b border-slate-800">
          <ShieldCheck className="w-8 h-8 text-primary-500" />
          <span className="text-xl font-bold tracking-tight">Admin Portal</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-primary-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800 mt-auto bg-slate-900">
          <form action={logoutAdmin}>
            <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
