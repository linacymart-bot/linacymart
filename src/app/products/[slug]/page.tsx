import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { StickyAddToCart } from '@/components/product/StickyAddToCart';
import { ReviewForm } from '@/components/product/ReviewForm';
import { ShieldCheck, Truck, RotateCcw, Star, CheckCircle2, ChevronDown, ListChecks, Info, AlertTriangle } from 'lucide-react';

import { Metadata } from 'next';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: product } = await supabase
    .from('products')
    .select('name, short_description, product_images(url, is_primary)')
    .eq('slug', slug)
    .single();

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.url 
    || product.product_images?.[0]?.url 
    || '/placeholder.svg';

  return {
    title: `${product.name} | BF Suma Kenya`,
    description: product.short_description || `Buy ${product.name} online in Kenya.`,
    openGraph: {
      title: product.name,
      description: product.short_description || `Buy ${product.name} online in Kenya.`,
      images: [primaryImage],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.short_description || `Buy ${product.name} online in Kenya.`,
      images: [primaryImage],
    }
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch product data
  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name, slug),
      product_images(url, is_primary),
      reviews(*)
    `)
    .eq('slug', slug)
    .single();

  if (!product) {
    notFound();
  }

  const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.url 
    || product.product_images?.[0]?.url 
    || '/placeholder.svg';

  const category = Array.isArray(product.category) ? product.category[0] : product.category;
  // Only show approved (verified) reviews
  const reviews = (product.reviews || []).filter((r: any) => r.is_verified);
  
  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: primaryImage,
    description: product.short_description || product.full_description,
    offers: {
      '@type': 'Offer',
      price: product.sale_price ? product.sale_price : product.price,
      priceCurrency: 'KES',
      availability: 'https://schema.org/InStock',
    },
    ...(reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating,
        reviewCount: reviews.length,
      }
    })
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-4">
        <div className="container-custom">
          <nav className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary-600 transition-colors">All Products</Link>
            <span>/</span>
            {category && (
              <>
                <Link href={`/products?category=${category.slug}`} className="hover:text-primary-600 transition-colors">
                  {category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-slate-900 truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom mt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-12">
          <div className="flex flex-col lg:flex-row">
            
            {/* Image Gallery Column */}
            <div className="w-full lg:w-1/2 bg-slate-50/50 p-4 sm:p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200 relative">
              {product.sale_price && (
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-red-500 text-white font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-sm z-10 text-xs sm:text-sm tracking-wider">
                  SALE
                </div>
              )}
              <div className="relative aspect-square w-full max-w-md mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8 group">
                <img 
                  src={primaryImage} 
                  alt={product.name} 
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Product Summary Column */}
            <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
              {category && (
                <Link 
                  href={`/products?category=${category.slug}`}
                  className="inline-block text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full mb-4 hover:bg-primary-100 transition-colors self-start"
                >
                  {category.name}
                </Link>
              )}
              
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 sm:mb-6 leading-tight tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-slate-100">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 sm:w-6 sm:h-6 ${i < Math.round(Number(averageRating)) ? 'fill-current' : 'text-slate-200'}`} />
                  ))}
                </div>
                <a href="#reviews" className="text-sm sm:text-base font-medium text-slate-500 hover:text-primary-600 transition-colors">
                  {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                </a>
              </div>

              <div className="mb-8 sm:mb-10">
                {product.sale_price ? (
                  <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3">
                    <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">KSh {Number(product.sale_price).toLocaleString()}</span>
                    <div className="flex items-center gap-3 pb-1">
                      <span className="text-xl sm:text-2xl text-slate-400 line-through">KSh {Number(product.price).toLocaleString()}</span>
                      <span className="text-xs sm:text-sm font-bold text-red-600 bg-red-50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-red-100">
                        Save KSh {(Number(product.price) - Number(product.sale_price)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">KSh {Number(product.price).toLocaleString()}</span>
                )}
                <p className="text-xs sm:text-sm text-slate-500 mt-4 font-medium flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Delivery fees calculated at checkout. Ships via G4S.
                </p>
              </div>

              <div className="bg-slate-50/80 p-6 sm:p-8 rounded-3xl border border-slate-200/60 mb-8 backdrop-blur-sm shadow-sm">
                <AddToCartButton product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.sale_price ? Number(product.sale_price) : Number(product.price),
                  image: primaryImage
                }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                <div className="flex flex-col sm:items-center sm:text-center gap-2">
                  <div className="bg-green-100 p-3 rounded-full sm:mx-auto w-fit">
                    <ShieldCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">100% Authentic<br className="hidden sm:block"/> BF Suma</span>
                </div>
                <div className="flex flex-col sm:items-center sm:text-center gap-2">
                  <div className="bg-blue-100 p-3 rounded-full sm:mx-auto w-fit">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Nationwide Delivery<br className="hidden sm:block"/> via G4S</span>
                </div>
                <div className="flex flex-col sm:items-center sm:text-center gap-2">
                  <div className="bg-amber-100 p-3 rounded-full sm:mx-auto w-fit">
                    <RotateCcw className="w-6 h-6 text-amber-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Dedicated Support<br className="hidden sm:block"/> 24/7</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Detailed Info Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content (Left 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 lg:p-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Info className="text-primary-500 w-6 h-6" /> Product Details
              </h2>
              <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                <p>{product.full_description}</p>
              </div>
            </div>

            {product.short_description && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 lg:p-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Star className="text-primary-500 w-6 h-6" /> Key Benefits
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-line">
                  <p>{product.short_description}</p>
                </div>
              </div>
            )}

            {product.ingredients && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 lg:p-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <ListChecks className="text-primary-500 w-6 h-6" /> Active Ingredients
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-line">
                  <p>{product.ingredients}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info (Right 1/3) */}
          <div className="space-y-6">
            {product.directions && (
              <div className="bg-primary-900 text-white rounded-3xl shadow-sm p-8">
                <h3 className="text-xl font-bold mb-4 border-b border-primary-700 pb-4">Suggested Use</h3>
                <p className="text-primary-100 leading-relaxed whitespace-pre-line">{product.directions}</p>
              </div>
            )}

            {product.warnings && (
              <div className="bg-orange-50 text-orange-900 rounded-3xl border border-orange-200 shadow-sm p-8">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-orange-200 pb-4">
                  <AlertTriangle className="w-5 h-5 text-orange-500" /> Important Warnings
                </h3>
                <p className="text-orange-800/80 text-sm leading-relaxed">{product.warnings}</p>
              </div>
            )}

            {product.storage_information && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Storage</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{product.storage_information}</p>
              </div>
            )}
            
            {product.pack_size && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Pack Size</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{product.pack_size}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="mt-12 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 lg:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 mb-8 sm:mb-10 border-b border-slate-100 pb-6 sm:pb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-4">
                Customer Reviews
                <span className="bg-primary-100 text-primary-700 text-lg font-bold py-1 px-4 rounded-full">{averageRating} / 5.0</span>
              </h2>
              <p className="text-slate-500 mt-2">Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.length === 0 ? (
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center">
                  <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-700 mb-1">No reviews yet</p>
                  <p className="text-slate-500">Be the first to review {product.name}!</p>
                </div>
              ) : (
                reviews.map((review: any) => (
                  <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-700 mb-6 leading-relaxed italic">"{review.comment}"</p>
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium mt-auto bg-slate-50 w-fit px-4 py-2 rounded-full border border-slate-100">
                      <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs">
                        {review.reviewer_name.charAt(0).toUpperCase()}
                      </div>
                      {review.reviewer_name} 
                      {review.is_verified && (
                        <span className="text-green-600 flex items-center text-xs font-bold border-l border-slate-300 pl-3 ml-1">
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Write Review Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ReviewForm productId={product.id} />
              </div>
            </div>

          </div>
        </div>

      </div>
      
      {/* Sticky Add To Cart (appears on scroll) */}
      <StickyAddToCart product={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.sale_price ? Number(product.sale_price) : Number(product.price),
        image: primaryImage
      }} />
    </div>
  );
}
