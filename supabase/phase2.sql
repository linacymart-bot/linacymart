-- Phase 2 Updates

-- Promo Codes
CREATE TABLE public.promo_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    active BOOLEAN DEFAULT true,
    uses INTEGER DEFAULT 0,
    max_uses INTEGER,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
-- Only admin (service role) can manage promo codes, public can read active ones for validation
CREATE POLICY "Allow public read active promo codes" ON public.promo_codes FOR SELECT USING (active = true);

-- Add promo code tracking to Orders
ALTER TABLE public.orders 
ADD COLUMN promo_code_id UUID REFERENCES public.promo_codes(id) ON DELETE SET NULL,
ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0.00;

-- Create RPC for incrementing promo uses atomically
CREATE OR REPLACE FUNCTION increment_promo_uses(p_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.promo_codes
  SET uses = uses + 1
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
