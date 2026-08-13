'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
}

export function DashboardCharts({ orders }: { orders: Order[] }) {
  const chartData = useMemo(() => {
    // Group completed orders by day for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const revenueByDay = last7Days.map(date => {
      const dayOrders = orders.filter(
        o => o.status.toLowerCase() === 'completed' && o.created_at.startsWith(date)
      );
      const sum = dayOrders.reduce((acc, order) => acc + Number(order.total_amount), 0);
      
      // Format date as Mon, Tue, etc.
      const dateObj = new Date(date);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

      return {
        name: dayName,
        Revenue: sum,
      };
    });

    return revenueByDay;
  }, [orders]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] w-full h-[350px]">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Revenue (Last 7 Days)</h2>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            tickFormatter={(value) => `KSh ${value}`}
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => [`KSh ${Number(value).toLocaleString()}`, 'Revenue']}
          />
          <Bar 
            dataKey="Revenue" 
            fill="#0ea5e9" 
            radius={[4, 4, 0, 0]} 
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
