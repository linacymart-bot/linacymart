import { logoutAdmin } from '@/app/actions/auth';
import { LogOut, ShieldCheck, LayoutDashboard, ShoppingBag, Users, Package, Tags, Truck } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col min-h-[auto] md:min-h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <ShieldCheck className="w-8 h-8 text-primary-500" />
          <span className="text-xl font-bold tracking-tight">Admin Portal</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium">Orders</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
            <Package className="w-5 h-5" />
            <span className="font-medium">Products</span>
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
            <Tags className="w-5 h-5" />
            <span className="font-medium">Categories</span>
          </Link>
          <Link href="/admin/delivery" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
            <Truck className="w-5 h-5" />
            <span className="font-medium">Delivery Zones</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800 mt-auto">
          <form action={logoutAdmin}>
            <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 lg:p-10 max-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
