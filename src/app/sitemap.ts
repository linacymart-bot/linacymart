import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.linacymart.co.ke';

  // Base static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/become-a-member`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Fetch all active products
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('active', true)
    .eq('status', 'published');

  if (products) {
    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: 'daily',
      priority: 0.7,
    }));
    
    return [...routes, ...productRoutes];
  }

  return routes;
}
