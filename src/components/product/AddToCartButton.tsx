'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      ...product,
      quantity,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      {/* Quantity Selector */}
      <div className="flex items-center border-2 border-slate-200 rounded-xl bg-white h-14">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-4 h-full text-slate-500 hover:text-slate-900 transition-colors"
          disabled={quantity <= 1}
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="w-12 text-center font-bold text-slate-900 text-lg">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="px-4 h-full text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="btn-primary flex-grow h-14 flex items-center justify-center gap-2 text-lg"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart
      </button>
    </div>
  );
}
