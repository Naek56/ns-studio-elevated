
-- Tighten bookings RLS: replace permissive WITH CHECK (true) with input validation,
-- and explicitly prevent public reads of PII.

DROP POLICY IF EXISTS "Anyone can create a booking" ON public.bookings;

-- Allow public booking submissions but validate input shape/length to avoid abuse
CREATE POLICY "Public can submit valid bookings"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(name)) BETWEEN 1 AND 120
  AND length(email) BETWEEN 3 AND 254
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(phone) BETWEEN 5 AND 40
  AND length(coalesce(message, '')) <= 2000
  AND appointment_date >= CURRENT_DATE
  AND length(appointment_time) BETWEEN 1 AND 20
);

-- No SELECT/UPDATE/DELETE policies => denied for anon & authenticated.
-- Admin/back-office reads must go through the service_role key in an edge function.

REVOKE SELECT, UPDATE, DELETE ON public.bookings FROM anon, authenticated;
GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;
