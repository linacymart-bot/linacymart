-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    reviewer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access for reviews"
    ON public.reviews FOR SELECT
    USING (true);

-- Create policy for public insert access (for now, allow anyone to review)
CREATE POLICY "Public insert access for reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (true);

-- Seed some realistic reviews for the featured products
DO $$
DECLARE
    ganoderma_id UUID;
    coffee_id UUID;
    nmn_id UUID;
BEGIN
    SELECT id INTO ganoderma_id FROM public.products WHERE slug = 'pure-broken-ganoderma-spores' LIMIT 1;
    SELECT id INTO coffee_id FROM public.products WHERE slug = 'x-power-coffee' LIMIT 1;
    SELECT id INTO nmn_id FROM public.products WHERE slug = 'nmn-duo-release' LIMIT 1;

    IF ganoderma_id IS NOT NULL THEN
        INSERT INTO public.reviews (product_id, reviewer_name, rating, comment, is_verified) VALUES
        (ganoderma_id, 'Jane K.', 5, 'I have been using this for a month now and the results are incredible. Delivery was very fast via G4S to Mombasa.', true),
        (ganoderma_id, 'Peter M.', 5, 'Very happy to find a reliable distributor in Kenya. The packaging was secure and product works perfectly.', true);
    END IF;

    IF coffee_id IS NOT NULL THEN
        INSERT INTO public.reviews (product_id, reviewer_name, rating, comment, is_verified) VALUES
        (coffee_id, 'David N.', 5, 'Works exactly as described. Gives me energy throughout the day without any jitters.', true),
        (coffee_id, 'Michael O.', 4, 'Great coffee. Delivery took 2 days to Kisumu but the product is genuine.', true);
    END IF;
    
    IF nmn_id IS NOT NULL THEN
        INSERT INTO public.reviews (product_id, reviewer_name, rating, comment, is_verified) VALUES
        (nmn_id, 'Sarah W.', 5, 'The anti-aging benefits are real. I feel 10 years younger and have so much more energy.', true);
    END IF;
END $$;
