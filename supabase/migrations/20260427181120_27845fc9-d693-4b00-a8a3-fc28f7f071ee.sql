
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS auth_user_id uuid;

CREATE INDEX IF NOT EXISTS registrations_auth_user_id_idx ON public.registrations(auth_user_id);
CREATE INDEX IF NOT EXISTS registrations_email_idx ON public.registrations(lower(email));

-- Allow a logged-in student to view their own registration row
CREATE POLICY "Students can view their own registration"
ON public.registrations
FOR SELECT
TO authenticated
USING (
  auth_user_id = auth.uid()
  OR lower(email) = lower(coalesce((auth.jwt() ->> 'email'), ''))
);

-- Allow a logged-in student to attach their auth user id (one-time link)
CREATE POLICY "Students can link their own registration"
ON public.registrations
FOR UPDATE
TO authenticated
USING (
  auth_user_id IS NULL
  AND lower(email) = lower(coalesce((auth.jwt() ->> 'email'), ''))
)
WITH CHECK (
  auth_user_id = auth.uid()
  AND lower(email) = lower(coalesce((auth.jwt() ->> 'email'), ''))
);
