-- Phase 3: Customer Accounts & Wishlists

-- 1. Create Wishlists Table
CREATE TABLE public.wishlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id) -- A user can only wishlist a product once
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Users can read their own wishlists
CREATE POLICY "Users can view own wishlists"
ON public.wishlists FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert into their own wishlists
CREATE POLICY "Users can insert own wishlists"
ON public.wishlists FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete from their own wishlists
CREATE POLICY "Users can delete own wishlists"
ON public.wishlists FOR DELETE
USING (auth.uid() = user_id);


-- 2. Link Orders to Auth Users (Optional, helps track order history)
ALTER TABLE public.orders 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3. Link Customers to Auth Users (Optional, to keep unified data)
ALTER TABLE public.customers
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL UNIQUE;
