'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { toggleWishlist } from '@/app/actions/wishlist';
import { AuthModal } from '@/components/auth/AuthModal';

export function WishlistButton({ productId, initialIsWishlisted = false }: { productId: string, initialIsWishlisted?: boolean }) {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    // Optimistic update
    setIsWishlisted(!isWishlisted);

    const result = await toggleWishlist(productId);

    if (result.error) {
      // Revert if error
      setIsWishlisted(isWishlisted);
      if (result.error.includes('logged in')) {
        setShowAuthModal(true);
      } else {
        alert(result.error);
      }
    }
    
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-2 rounded-full shadow-sm transition-all z-10 ${
          isWishlisted 
            ? 'bg-red-50 text-red-500 hover:bg-red-100' 
            : 'bg-white text-slate-400 hover:text-red-500 hover:bg-slate-50'
        }`}
        aria-label="Toggle wishlist"
      >
        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign In to Save"
        message="Create an account or sign in to save products to your wishlist."
      />
    </>
  );
}
