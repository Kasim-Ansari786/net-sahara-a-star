
CREATE TABLE public.counsellors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.counsellors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view counsellors" ON public.counsellors
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert counsellors" ON public.counsellors
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update counsellors" ON public.counsellors
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete counsellors" ON public.counsellors
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER counsellors_set_updated_at
  BEFORE UPDATE ON public.counsellors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.registrations
  ADD COLUMN assigned_counsellor_id UUID REFERENCES public.counsellors(id) ON DELETE SET NULL;

CREATE INDEX idx_registrations_assigned_counsellor ON public.registrations(assigned_counsellor_id);

-- Update insert RLS so public submissions cannot set assignment
DROP POLICY IF EXISTS "Anyone can submit a valid registration" ON public.registrations;
CREATE POLICY "Anyone can submit a valid registration" ON public.registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(student_name)) >= 2 AND length(trim(student_name)) <= 100
    AND length(trim(parent_name)) >= 2 AND length(trim(parent_name)) <= 100
    AND length(trim(email)) >= 5 AND length(trim(email)) <= 255 AND email LIKE '%@%.%'
    AND length(trim(mobile)) >= 7 AND length(trim(mobile)) <= 15
    AND length(trim(whatsapp)) >= 7 AND length(trim(whatsapp)) <= 15
    AND length(trim(city)) >= 2 AND length(trim(city)) <= 100
    AND payment_status = 'unpaid' AND payment_id IS NULL AND exam_id IS NULL
    AND assigned_counsellor_id IS NULL
  );
