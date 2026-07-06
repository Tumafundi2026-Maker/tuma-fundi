-- IntaSend Payment Gateway: payments table for booking transactions
CREATE TABLE IF NOT EXISTS public.intasend_payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id text NOT NULL UNIQUE,
    booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
    amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'KES',
    status text NOT NULL CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETE', 'FAILED')),
    provider text,
    customer_name text,
    customer_email text,
    customer_phone text,
    api_ref text,
    raw_payload jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_intasend_payments_invoice_id ON public.intasend_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_intasend_payments_booking_id ON public.intasend_payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_intasend_payments_status ON public.intasend_payments(status);
CREATE INDEX IF NOT EXISTS idx_intasend_payments_created_at ON public.intasend_payments(created_at DESC);

-- RLS Enablement
ALTER TABLE public.intasend_payments ENABLE ROW LEVEL SECURITY;

-- Users can view payments tied to their bookings
CREATE POLICY "Users can view own intasend payments" ON public.intasend_payments
    FOR SELECT USING (
        booking_id IN (SELECT id FROM public.bookings WHERE customer_id = auth.uid())
        OR public.is_admin()
    );

-- Service role (edge functions) has full access
CREATE POLICY "Service role full access to intasend payments" ON public.intasend_payments
    FOR ALL USING (true) WITH CHECK (true);

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_intasend_payment_timestamp()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_intasend_payments_updated_at ON public.intasend_payments;
CREATE TRIGGER trg_intasend_payments_updated_at
    BEFORE UPDATE ON public.intasend_payments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_intasend_payment_timestamp();
