'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentMin = searchParams.get('minPrice') || '';
  const currentMax = searchParams.get('maxPrice') || '';
  
  const [minPrice, setMinPrice] = useState(currentMin);
  const [maxPrice, setMaxPrice] = useState(currentMax);

  // Sync state if URL changes externally
  useEffect(() => {
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
  }, [searchParams]);

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (minPrice) {
      params.set('minPrice', minPrice);
    } else {
      params.delete('minPrice');
    }
    
    if (maxPrice) {
      params.set('maxPrice', maxPrice);
    } else {
      params.delete('maxPrice');
    }
    
    // Reset to page 1 if pagination existed
    params.delete('page');
    
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('minPrice');
    params.delete('maxPrice');
    router.push(`/products?${params.toString()}`);
  };

  const hasPriceFilters = currentMin || currentMax;

  return (
    <div className="mt-8 border-t border-slate-100 pt-6">
      <h3 className="font-bold text-slate-900 mb-4">Price Range (KSh)</h3>
      <form onSubmit={applyFilters} className="space-y-4">
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Min" 
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <span className="text-slate-400">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2">
          <button 
            type="submit" 
            className="flex-1 bg-slate-900 text-white text-xs font-medium py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Apply
          </button>
          {hasPriceFilters && (
            <button 
              type="button" 
              onClick={clearFilters}
              className="flex-1 bg-slate-100 text-slate-600 text-xs font-medium py-2 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
