CREATE OR REPLACE FUNCTION public.get_registration_by_email(_email text)
RETURNS SETOF public.registrations
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.registrations
  WHERE lower(email) = lower(trim(_email))
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_registration_by_email(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_counsellor_by_id(_id uuid)
RETURNS SETOF public.counsellors
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.counsellors WHERE id = _id LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_counsellor_by_id(uuid) TO anon, authenticated;