-- Fix function search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Lock down has_role: only callable internally (RLS uses it via SECURITY DEFINER)
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;

-- Replace permissive insert policy with validated one
DROP POLICY IF EXISTS "Anyone can submit a registration" ON public.registrations;

CREATE POLICY "Anyone can submit a valid registration"
  ON public.registrations FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(student_name)) BETWEEN 2 AND 100
    AND length(trim(parent_name)) BETWEEN 2 AND 100
    AND length(trim(email)) BETWEEN 5 AND 255
    AND email LIKE '%@%.%'
    AND length(trim(mobile)) BETWEEN 7 AND 15
    AND length(trim(whatsapp)) BETWEEN 7 AND 15
    AND length(trim(city)) BETWEEN 2 AND 100
    AND payment_status = 'unpaid'
    AND payment_id IS NULL
    AND exam_id IS NULL
  );