'use client';

import { useState, useTransition } from 'react';
import { updateOrderStatus } from '@/app/actions/admin-orders';
import { Loader2 } from 'lucide-react';

export default function OrderStatusSelect({ 
  orderId, 
  currentStatus 
}: { 
  orderId: string, 
  currentStatus: string 
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (!result.success) {
        alert('Failed to update status');
        setStatus(currentStatus); // revert
      }
    });
  };

  return (
    <div className="relative">
      <select 
        value={status}
        onChange={handleChange}
        disabled={isPending}
        className="w-full sm:w-auto appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm disabled:opacity-50 cursor-pointer"
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      
      {isPending ? (
        <Loader2 className="w-4 h-4 text-primary-500 animate-spin absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      ) : (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      )}
    </div>
  );
}
