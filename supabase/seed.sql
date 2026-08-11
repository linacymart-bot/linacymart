-- Seed Initial Categories
INSERT INTO public.categories (id, name, slug, description, active) VALUES
(gen_random_uuid(), 'Immune Booster', 'immune-booster', 'Products to boost your immune system', true),
(gen_random_uuid(), 'Sport Fit', 'sport-fit', 'Fitness and energy support', true),
(gen_random_uuid(), 'Heart & Blood Fit', 'heart-blood-fit', 'Cardiovascular health', true),
(gen_random_uuid(), 'Suma Fit', 'suma-fit', 'General wellness and fitness', true),
(gen_random_uuid(), 'Men''s Power', 'mens-power', 'Men''s health and vitality', true),
(gen_random_uuid(), 'Smart Kids', 'smart-kids', 'Children''s nutrition and health', true),
(gen_random_uuid(), 'Women''s Beauty', 'womens-beauty', 'Women''s health and beauty', true),
(gen_random_uuid(), 'Suma Living', 'suma-living', 'Healthy lifestyle products', true),
(gen_random_uuid(), 'Others', 'others', 'Miscellaneous products', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products using subqueries instead of DO block to prevent editor truncation issues

-- Product 1: Pure & Broken Ganoderma Spores
WITH new_product AS (
  INSERT INTO public.products (id, name, slug, sku, category_id, price, sale_price, short_description, full_description, active, status, featured)
  VALUES (
      gen_random_uuid(),
      'BF Suma Pure & Broken Ganoderma Spores',
      'pure-broken-ganoderma-spores',
      'BFS-001',
      (SELECT id FROM public.categories WHERE slug = 'immune-booster' LIMIT 1),
      9396.00,
      6900.00,
      'High quality pure ganoderma spores.',
      'Detailed description of Pure & Broken Ganoderma Spores. Supports immune system.',
      true,
      'published',
      true
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id
)
INSERT INTO public.product_images (product_id, url, is_primary) 
SELECT id, 'https://ueeshop.ly200-cdn.com/u_file/UPAM/UPAM677/2006/products/03/0278d3a2d4.jpg.240x240.jpg', true FROM new_product;

-- Product 2: X Power Coffee
WITH new_product AS (
  INSERT INTO public.products (id, name, slug, sku, category_id, price, short_description, full_description, active, status, best_seller)
  VALUES (
      gen_random_uuid(),
      'X Power Coffee',
      'x-power-coffee',
      'BFS-002',
      (SELECT id FROM public.categories WHERE slug = 'mens-power' LIMIT 1),
      2430.00,
      'Premium coffee for men''s vitality.',
      'Detailed description of X Power Coffee. Boosts energy and stamina.',
      true,
      'published',
      true
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id
)
INSERT INTO public.product_images (product_id, url, is_primary) 
SELECT id, 'https://ueeshop.ly200-cdn.com/u_file/UPAM/UPAM677/2005/products/28/228efc833f.jpg.240x240.jpg', true FROM new_product;

-- Product 3: Femicalcium D3
WITH new_product AS (
  INSERT INTO public.products (id, name, slug, sku, category_id, price, sale_price, short_description, full_description, active, status, new_arrival)
  VALUES (
      gen_random_uuid(),
      'Femicalcium D3',
      'femicalcium-d3',
      'BFS-003',
      (SELECT id FROM public.categories WHERE slug = 'womens-beauty' LIMIT 1),
      5184.00,
      3800.00,
      'Calcium and Vitamin D3 supplement for women.',
      'Detailed description of Femicalcium D3. Supports bone health and immunity.',
      true,
      'published',
      true
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id
)
INSERT INTO public.product_images (product_id, url, is_primary) 
SELECT id, 'https://ueeshop.ly200-cdn.com/u_file/UPAM/UPAM677/2506/products/30/f834393d67.png.240x240.png', true FROM new_product;
