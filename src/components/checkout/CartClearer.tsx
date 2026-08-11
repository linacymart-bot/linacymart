'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export function CartClearer({ shouldClear }: { shouldClear: boolean }) {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (shouldClear) {
      clearCart();
    }
  }, [shouldClear, clearCart]);

  return null;
}
