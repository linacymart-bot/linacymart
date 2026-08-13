import Link from 'next/link';
import { WishlistButton } from './WishlistButton';

export function ProductCard({ 
  product, 
  isWishlisted = true 
}: { 
  product: any, 
  isWishlisted?: boolean 
}) {
  const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.url 
    || product.product_images?.[0]?.url 
    || product.image_url
    || '/placeholder.svg';
    
  return (
    <div className="card group hover:shadow-md transition-shadow bg-white overflow-hidden relative">
      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-slate-50 border-b border-slate-50">
        <img 
          src={primaryImage} 
          alt={product.name} 
          className="object-contain w-full h-full mix-blend-multiply p-3 sm:p-5 transition-transform group-hover:scale-105"
        />
        {product.sale_price && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
            SALE
          </span>
        )}
      </Link>
      <WishlistButton 
        productId={product.id} 
        initialIsWishlisted={isWishlisted} 
      />
      <div className="p-3 sm:p-5">
        <div className="h-4 sm:h-5 mb-1 overflow-hidden">
          <div className="text-[10px] sm:text-xs text-primary-600 font-medium line-clamp-1">
            {(product.categories as any)?.name || product.category}
          </div>
        </div>
        
        <div className="h-10 sm:h-12 mb-2 sm:mb-4 overflow-hidden">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight line-clamp-2">
            <Link href={`/products/${product.slug}`} className="hover:text-primary-600">
              {product.name}
            </Link>
          </h3>
        </div>

        <div className="h-8 sm:h-10 mb-3 sm:mb-4 hidden sm:block overflow-hidden">
          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
            {product.short_description || 'View product for details'}
          </p>
        </div>

        <div className="flex items-center justify-between h-10 sm:h-12 border-t border-slate-50 pt-3">
          <div className="flex flex-col justify-center">
            {product.sale_price ? (
              <>
                <span className="text-[10px] sm:text-xs text-slate-400 line-through leading-none mb-0.5">KSh {Number(product.price).toLocaleString()}</span>
                <span className="text-sm sm:text-lg font-bold text-slate-900 leading-none">KSh {Number(product.sale_price).toLocaleString()}</span>
              </>
            ) : (
              <span className="text-sm sm:text-lg font-bold text-slate-900 leading-none">KSh {Number(product.price).toLocaleString()}</span>
            )}
          </div>
          <Link href={`/products/${product.slug}`} className="bg-primary-50 text-primary-700 hover:bg-primary-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors font-medium text-xs sm:text-sm flex-shrink-0 ml-1">
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
