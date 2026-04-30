
CREATE POLICY "Students can view their assigned counsellor"
ON public.counsellors
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.registrations r
    WHERE r.assigned_counsellor_id = counsellors.id
      AND (
        r.auth_user_id = auth.uid()
        OR lower(r.email) = lower(coalesce((auth.jwt() ->> 'email'), ''))
      )
  )
);
