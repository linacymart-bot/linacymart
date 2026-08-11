'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddToCartButton } from './AddToCartButton';

interface StickyAddToCartProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
  };
}

export function StickyAddToCart({ product }: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40 p-4"
        >
          <div className="container-custom flex items-center justify-between gap-4">
            <div className="hidden md:flex items-center gap-4">
              <img src={product.image} alt={product.name} className="w-12 h-12 object-contain bg-slate-50 rounded-lg p-1 border border-slate-100" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{product.name}</h4>
                <p className="text-primary-700 font-bold text-sm">KSh {product.price.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex-grow max-w-sm ml-auto">
              <AddToCartButton product={product} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
