import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/MotionWrapper';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const supabase = await createClient();

  // Fetch active categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('name');

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select(`
      *,
      product_images (url, is_primary)
    `)
    .eq('active', true)
    .eq('status', 'published')
    .eq('featured', true)
    .limit(4);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary-900 py-24 md:py-32 relative overflow-hidden flex flex-col justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-900/60 to-transparent"></div>
        <div className="container-custom relative z-10">
          <StaggerContainer className="max-w-3xl">
            <StaggerItem>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
                Premium Health & Wellness Solutions
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="text-lg md:text-xl text-primary-50 mb-10 max-w-2xl leading-relaxed">
                Discover authentic BF Suma products designed to boost your immunity, enhance vitality, and support your overall well-being.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="btn-primary flex justify-center items-center gap-2">
                  Shop Products <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/become-a-member" className="btn-secondary flex justify-center items-center">
                  Become a Member
                </Link>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-slate-100 bg-white py-12">
        <div className="container-custom">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <StaggerItem className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4 text-primary-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Authentic Products</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-xs">Guaranteed genuine BF Suma supplements.</p>
            </StaggerItem>
            <StaggerItem className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4 text-primary-600">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Nationwide Delivery</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-xs">Fast and secure shipping via G4S to all 47 counties.</p>
            </StaggerItem>
            <StaggerItem className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4 text-primary-600">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Expert Support</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-xs">Chat directly with us on WhatsApp for assistance.</p>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <FadeIn className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Featured Products</h2>
              <p className="text-slate-500 mt-3 text-lg">Our most popular health solutions.</p>
            </div>
            <Link href="/products" className="hidden sm:flex text-primary-700 font-semibold hover:text-primary-900 items-center gap-1 transition-colors">
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </FadeIn>
          
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {featuredProducts?.map((product) => {
              const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.url 
                || product.product_images?.[0]?.url 
                || '/placeholder.svg';
                
              return (
                <StaggerItem key={product.id} className="card group relative bg-white overflow-hidden">
                  <Link href={`/products/${product.slug}`} className="block relative aspect-[4/5] bg-white border-b border-slate-50">
                    <div className="absolute inset-0 bg-primary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                    <img 
                      src={primaryImage} 
                      alt={product.name} 
                      className="object-contain w-full h-full relative z-10 transition-transform duration-700 group-hover:scale-110 drop-shadow-sm p-4 sm:p-6"
                    />
                    {product.sale_price && (
                      <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-secondary-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full z-20 shadow-sm">
                        SALE
                      </span>
                    )}
                  </Link>
                  <div className="p-3 sm:p-5">
                    <div className="h-10 sm:h-14 mb-2 sm:mb-4 overflow-hidden">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-lg leading-tight line-clamp-2">
                        <Link href={`/products/${product.slug}`} className="hover:text-primary-700 transition-colors">
                          {product.name}
                        </Link>
                      </h3>
                    </div>
                    
                    <div className="h-8 sm:h-10 mb-3 sm:mb-6 hidden sm:block overflow-hidden">
                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        {product.short_description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between h-12 sm:h-14 border-t border-slate-50 pt-3">
                      <div className="flex flex-col justify-center">
                        {product.sale_price ? (
                          <>
                            <span className="text-[10px] sm:text-xs text-slate-400 line-through leading-none mb-0.5">KSh {Number(product.price).toLocaleString()}</span>
                            <span className="text-sm sm:text-xl font-bold text-slate-900 leading-none">KSh {Number(product.sale_price).toLocaleString()}</span>
                          </>
                        ) : (
                          <span className="text-sm sm:text-xl font-bold text-slate-900 leading-none">KSh {Number(product.price).toLocaleString()}</span>
                        )}
                      </div>
                      <Link href={`/products/${product.slug}`} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center hover:bg-primary-900 hover:text-white transition-all duration-300 flex-shrink-0 ml-1">
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute -left-40 top-20 w-80 h-80 bg-primary-50 rounded-full blur-3xl opacity-50"></div>
        <div className="container-custom relative z-10">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Shop by Category</h2>
            <p className="text-slate-500 mt-4 text-lg">Find exactly what you need for your health journey.</p>
          </FadeIn>
          
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <StaggerItem key={category.id}>
                <Link 
                  href={`/products?category=${category.slug}`}
                  className="block bg-background p-8 rounded-2xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50 transition-all duration-300 text-center group h-full"
                >
                  <h3 className="font-bold text-slate-900 group-hover:text-primary-800 transition-colors text-lg">
                    {category.name}
                  </h3>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
