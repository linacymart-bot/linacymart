'use client';

import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';

export function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const isCartDrawerOpen = useCartStore((state) => state.isCartDrawerOpen);
  const setCartDrawerOpen = useCartStore((state) => state.setCartDrawerOpen);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getCartTotal = useCartStore((state) => state.getCartTotal);

  if (!isCartDrawerOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/50 z-50 transition-opacity"
        onClick={() => setCartDrawerOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart
          </h2>
          <button
            onClick={() => setCartDrawerOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingBag className="w-16 h-16 text-slate-200" />
              <div>
                <p className="text-lg font-medium text-slate-900">Your cart is empty</p>
                <p className="text-slate-500 text-sm mt-1">Looks like you haven't added anything yet.</p>
              </div>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="btn-primary mt-4"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-slate-50 pb-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-md overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
                        {item.name}
                      </h3>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg">
                        <button 
                          className="px-2 py-1 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm font-medium text-slate-900 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button 
                          className="px-2 py-1 text-slate-600 hover:bg-slate-50"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-sm font-bold text-slate-900">
                        KSh {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-100 p-4 bg-slate-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-600 font-medium">Subtotal</span>
              <span className="text-lg font-bold text-slate-900">
                KSh {getCartTotal().toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4 text-center">
              Delivery fees calculated at checkout.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/products"
                onClick={() => setCartDrawerOpen(false)}
                className="btn-secondary text-center w-full"
              >
                Keep Shopping
              </Link>
              <Link 
                href="/checkout"
                onClick={() => setCartDrawerOpen(false)}
                className="btn-primary text-center w-full"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
