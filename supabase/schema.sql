-- BF Suma E-commerce Schema

-- Categories
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT UNIQUE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    short_description TEXT,
    full_description TEXT,
    ingredients TEXT,
    directions TEXT,
    warnings TEXT,
    storage_information TEXT,
    pack_size TEXT,
    featured BOOLEAN DEFAULT false,
    best_seller BOOLEAN DEFAULT false,
    new_arrival BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'draft', -- draft, pending, published
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Product Images
CREATE TABLE public.product_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Delivery Zones (Counties)
CREATE TABLE public.delivery_zones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    county TEXT NOT NULL UNIQUE,
    fee DECIMAL(10,2) NOT NULL DEFAULT 500.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Customers (Guest Checkout)
CREATE TABLE public.customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    county TEXT NOT NULL,
    town TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Orders
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE, -- BFS-YYYYMMDD-XXX
    customer_id UUID REFERENCES public.customers(id) ON DELETE RESTRICT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'New', -- New, Contacted, Confirmed, Processing, Dispatched, Delivered, Cancelled
    notes TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Order Items
CREATE TABLE public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Membership Leads
CREATE TABLE public.membership_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    county TEXT NOT NULL,
    town TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'New', -- New, Contacted, Qualified, Joined, Not Interested, Follow Up
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Site Settings
CREATE TABLE public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS setup
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (active = true);
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (active = true AND status = 'published');
CREATE POLICY "Allow public read product_images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Allow public read delivery_zones" ON public.delivery_zones FOR SELECT USING (true);
CREATE POLICY "Allow public read site_settings" ON public.site_settings FOR SELECT USING (true);

-- Allow public insert (guest checkout)
CREATE POLICY "Allow public insert customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert membership_leads" ON public.membership_leads FOR INSERT WITH CHECK (true);


-- SEED DATA: 47 Counties of Kenya with estimated G4S fees from Meru
INSERT INTO public.delivery_zones (county, fee) VALUES 
('Mombasa', 850.00), ('Kwale', 900.00), ('Kilifi', 900.00), ('Tana River', 1000.00), 
('Lamu', 1200.00), ('Taita/Taveta', 950.00), ('Garissa', 1100.00), ('Wajir', 1500.00), 
('Mandera', 1800.00), ('Marsabit', 1500.00), ('Isiolo', 450.00), ('Meru', 200.00), 
('Tharaka-Nithi', 300.00), ('Embu', 350.00), ('Kitui', 650.00), ('Machakos', 600.00), 
('Makueni', 700.00), ('Nyandarua', 550.00), ('Nyeri', 450.00), ('Kirinyaga', 400.00), 
('Murang''a', 450.00), ('Kiambu', 500.00), ('Turkana', 1600.00), ('West Pokot', 1200.00), 
('Samburu', 900.00), ('Trans Nzoia', 1000.00), ('Uasin Gishu', 900.00), ('Elgeyo/Marakwet', 950.00), 
('Nandi', 900.00), ('Baringo', 850.00), ('Laikipia', 450.00), ('Nakuru', 600.00), 
('Narok', 750.00), ('Kajiado', 750.00), ('Kericho', 800.00), ('Bomet', 850.00), 
('Kakamega', 1000.00), ('Vihiga', 1000.00), ('Bungoma', 1050.00), ('Busia', 1100.00), 
('Siaya', 1100.00), ('Kisumu', 950.00), ('Homa Bay', 1050.00), ('Migori', 1100.00), 
('Kisii', 1000.00), ('Nyamira', 1000.00), ('Nairobi City', 500.00)
ON CONFLICT DO NOTHING;

-- Initial Settings
INSERT INTO public.site_settings (key, value) VALUES
('whatsapp_number', '"254700000000"'),
('currency', '"KES"')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
