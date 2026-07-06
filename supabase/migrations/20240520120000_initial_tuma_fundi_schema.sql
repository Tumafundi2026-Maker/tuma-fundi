-- 1. USERS TABLE (AUTH LINKED)
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    phone text UNIQUE,
    email text UNIQUE,
    role text CHECK (role IN ('customer', 'fundi', 'admin')) DEFAULT 'customer',
    created_at timestamp with time zone DEFAULT now()
);

-- Trigger to automatically create a user record in public.users when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, full_name, email, role)
    VALUES (
        new.id, 
        COALESCE(new.raw_user_meta_data->>'full_name', ''), 
        new.email, 
        COALESCE(new.raw_user_meta_data->>'role', 'customer')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. FUNDI PROFILES
CREATE TABLE IF NOT EXISTS public.fundi_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    profile_photo text,
    county text,
    town text,
    bio text,
    experience_years int,
    rating decimal DEFAULT 0.0,
    is_verified boolean DEFAULT false,
    is_active boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE,
    description text,
    icon text,
    created_at timestamp with time zone DEFAULT now()
);

-- Seed categories
INSERT INTO public.categories (name, description, icon) 
SELECT 'plumber', 'Professional plumbing services', 'wrench'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'plumber');

INSERT INTO public.categories (name, description, icon) 
SELECT 'electrician', 'Certified electrical work', 'zap'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'electrician');

INSERT INTO public.categories (name, description, icon) 
SELECT 'carpenter', 'Woodwork and furniture repair', 'hammer'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'carpenter');

-- 4. FUNDI SERVICES
CREATE TABLE IF NOT EXISTS public.fundi_services (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    fundi_id uuid REFERENCES public.fundi_profiles(id) ON DELETE CASCADE,
    category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    service_name text,
    price_from numeric,
    description text,
    created_at timestamp with time zone DEFAULT now()
);

-- 5. BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    fundi_id uuid REFERENCES public.fundi_profiles(id) ON DELETE CASCADE,
    service_description text,
    location text,
    status text CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
    price numeric,
    created_at timestamp with time zone DEFAULT now()
);

-- Align existing tables with requested schema
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_type text CHECK (payment_type IN ('registration', 'subscription'));
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS reference text UNIQUE;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS plan text CHECK (plan IN ('basic', 'standard', 'premium'));

ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS fundi_id uuid REFERENCES public.fundi_profiles(id) ON DELETE CASCADE;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS plan text CHECK (plan IN ('300', '500', '1000'));
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('active', 'expired', 'suspended')) DEFAULT 'active';
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS auto_renew boolean DEFAULT false;

-- 6. PAYMENTS (PAYSTACK)
CREATE TABLE IF NOT EXISTS public.payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    amount numeric,
    payment_type text CHECK (payment_type IN ('registration', 'subscription')),
    reference text UNIQUE,
    status text CHECK (status IN ('pending', 'success', 'failed')) DEFAULT 'pending',
    plan text CHECK (plan IN ('basic', 'standard', 'premium')),
    created_at timestamp with time zone DEFAULT now()
);

-- 7. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    fundi_id uuid REFERENCES public.fundi_profiles(id) ON DELETE CASCADE,
    plan text CHECK (plan IN ('300', '500', '1000')),
    status text CHECK (status IN ('active', 'expired', 'suspended')) DEFAULT 'active',
    start_date timestamp with time zone,
    expiry_date timestamp with time zone,
    auto_renew boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- 8. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    fundi_id uuid REFERENCES public.fundi_profiles(id) ON DELETE CASCADE,
    rating int CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamp with time zone DEFAULT now()
);

-- 9. SMS LOGS (CELCOM AFRICA)
CREATE TABLE IF NOT EXISTS public.sms_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    phone text,
    message text,
    status text CHECK (status IN ('sent', 'failed', 'delivered')),
    gateway text DEFAULT 'celcom_africa',
    created_at timestamp with time zone DEFAULT now()
);

-- 10. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    title text,
    message text,
    type text CHECK (type IN ('booking', 'payment', 'system')),
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- 11. REGISTRATION PAYMENTS TRACKING
CREATE TABLE IF NOT EXISTS public.registration_payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    amount numeric DEFAULT 300,
    status text CHECK (status IN ('pending', 'paid')) DEFAULT 'pending',
    reference text UNIQUE,
    created_at timestamp with time zone DEFAULT now()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_fundi_profiles_user_id ON public.fundi_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_fundi_services_fundi_id ON public.fundi_services(fundi_id);
CREATE INDEX IF NOT EXISTS idx_fundi_services_category_id ON public.fundi_services(category_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_fundi_id ON public.bookings(fundi_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON public.payments(reference);
CREATE INDEX IF NOT EXISTS idx_subscriptions_fundi_id ON public.subscriptions(fundi_id);
CREATE INDEX IF NOT EXISTS idx_reviews_fundi_id ON public.reviews(fundi_id);
CREATE INDEX IF NOT EXISTS idx_sms_logs_user_id ON public.sms_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_registration_payments_user_id ON public.registration_payments(user_id);

-- RLS ENABLEMENT
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fundi_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fundi_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_payments ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. USERS
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Admin can view all users" ON public.users
    FOR SELECT USING (public.is_admin());

-- 2. FUNDI PROFILES
CREATE POLICY "Public can view fundi profiles" ON public.fundi_profiles
    FOR SELECT USING (true);
CREATE POLICY "Fundi can update own profile" ON public.fundi_profiles
    FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Admin can view all fundi profiles" ON public.fundi_profiles
    FOR SELECT USING (public.is_admin());

-- 3. CATEGORIES
CREATE POLICY "Public can view categories" ON public.categories
    FOR SELECT USING (true);
CREATE POLICY "Admin can manage categories" ON public.categories
    FOR ALL USING (public.is_admin());

-- 4. FUNDI SERVICES
CREATE POLICY "Public can view fundi services" ON public.fundi_services
    FOR SELECT USING (true);
CREATE POLICY "Fundi can manage own services" ON public.fundi_services
    FOR ALL USING (fundi_id IN (SELECT id FROM public.fundi_profiles WHERE user_id = auth.uid()) OR public.is_admin());

-- 5. BOOKINGS
CREATE POLICY "Users can view own bookings" ON public.bookings
    FOR SELECT USING (customer_id = auth.uid() OR fundi_id IN (SELECT id FROM public.fundi_profiles WHERE user_id = auth.uid()) OR public.is_admin());
CREATE POLICY "Users can update own bookings" ON public.bookings
    FOR UPDATE USING (customer_id = auth.uid() OR fundi_id IN (SELECT id FROM public.fundi_profiles WHERE user_id = auth.uid()) OR public.is_admin());
CREATE POLICY "Users can insert bookings" ON public.bookings
    FOR INSERT WITH CHECK (customer_id = auth.uid());

-- 6. PAYMENTS
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can insert own payments" ON public.payments
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- 7. SUBSCRIPTIONS
CREATE POLICY "Fundi can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (fundi_id IN (SELECT id FROM public.fundi_profiles WHERE user_id = auth.uid()) OR public.is_admin());
CREATE POLICY "Admin can manage subscriptions" ON public.subscriptions
    FOR ALL USING (public.is_admin());

-- 8. REVIEWS
CREATE POLICY "Public can view reviews" ON public.reviews
    FOR SELECT USING (true);
CREATE POLICY "Customers can insert reviews" ON public.reviews
    FOR INSERT WITH CHECK (customer_id = auth.uid());

-- 9. SMS LOGS
CREATE POLICY "Users can view own sms logs" ON public.sms_logs
    FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

-- 10. NOTIFICATIONS
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- 11. REGISTRATION PAYMENTS
CREATE POLICY "Users can view own registration payments" ON public.registration_payments
    FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can insert own registration payments" ON public.registration_payments
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- BUSINESS LOGIC TRIGGER: Activate fundi profile after registration payment
CREATE OR REPLACE FUNCTION public.activate_fundi_on_payment()
RETURNS trigger AS $$
BEGIN
    IF NEW.status = 'paid' THEN
        UPDATE public.fundi_profiles
        SET is_active = true
        WHERE user_id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_activate_fundi_on_payment
    AFTER UPDATE OF status ON public.registration_payments
    FOR EACH ROW
    WHEN (NEW.status = 'paid' AND OLD.status != 'paid')
    EXECUTE FUNCTION public.activate_fundi_on_payment();
