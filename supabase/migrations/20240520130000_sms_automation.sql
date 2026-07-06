-- Update sms_logs status check to include 'queued'
ALTER TABLE public.sms_logs DROP CONSTRAINT IF EXISTS sms_logs_status_check;
ALTER TABLE public.sms_logs ADD CONSTRAINT sms_logs_status_check CHECK (status IN ('queued', 'sent', 'failed', 'delivered'));

-- Enable HTTP extension for potential async DB-to-Edge-Function calls (optional)
CREATE EXTENSION IF NOT EXISTS http;

-- Helper function to send SMS via Edge Function (can be called from frontend or DB triggers)
CREATE OR REPLACE FUNCTION public.send_sms_notification(
  p_phone text,
  p_message text,
  p_user_id uuid DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_response http_response;
  v_edge_url text;
  v_service_key text;
BEGIN
  -- Get Supabase URL and Service Role Key from settings
  -- Note: These must be set in the database: 
  -- ALTER DATABASE postgres SET app.settings.supabase_url TO 'your_url';
  -- ALTER DATABASE postgres SET app.settings.service_role_key TO 'your_key';
  v_edge_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-sms';
  v_service_key := current_setting('app.settings.service_role_key', true);

  IF v_edge_url IS NOT NULL AND v_service_key IS NOT NULL AND v_edge_url != '/functions/v1/send-sms' THEN
    SELECT * INTO v_response FROM http((
      'POST',
      v_edge_url,
      ARRAY[
        http_header('Authorization', 'Bearer ' || v_service_key),
        http_header('Content-Type', 'application/json')
      ],
      'application/json',
      json_build_object(
        'phone', p_phone,
        'message', p_message,
        'user_id', p_user_id
      )::text
    )::http_request);
    
    RETURN v_response.content::json;
  ELSE
    -- Fallback: Just log it as queued if HTTP extension/settings are not configured
    INSERT INTO public.sms_logs (user_id, phone, message, status, gateway)
    VALUES (p_user_id, p_phone, p_message, 'queued', 'celcom_africa');
    
    RETURN json_build_object('status', 'queued', 'message', 'HTTP settings not configured, logged for later processing');
  END IF;
END;
$$;

-- RLS Policy Update for sms_logs
-- Ensure users can only see their own logs, admins can see all
DROP POLICY IF EXISTS "Users can view own sms logs" ON public.sms_logs;
CREATE POLICY "Users can view own sms logs" ON public.sms_logs
    FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admin can view all sms logs" ON public.sms_logs;
CREATE POLICY "Admin can view all sms logs" ON public.sms_logs
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "System can insert sms logs" ON public.sms_logs;
CREATE POLICY "System can insert sms logs" ON public.sms_logs
    FOR INSERT WITH CHECK (true); -- Allow edge function / triggers to insert

-- Index for faster log retrieval
CREATE INDEX IF NOT EXISTS idx_sms_logs_status ON public.sms_logs(status);
CREATE INDEX IF NOT EXISTS idx_sms_logs_created_at ON public.sms_logs(created_at DESC);
