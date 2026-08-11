import { logoutAdmin } from '@/app/actions/auth';
import { LogOut, ShieldCheck, LayoutDashboard, ShoppingBag, Users, Package, Tags, Truck } from 'lucide-react';
import Link from 'next/link';

import AdminSidebar from './AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6 lg:p-10 max-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
