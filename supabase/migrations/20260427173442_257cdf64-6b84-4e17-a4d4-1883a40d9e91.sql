-- 1. Roles enum + user_roles table (security best practice: roles in separate table)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to avoid recursive RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. Registrations table
CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  twelfth_status TEXT NOT NULL,
  stream TEXT NOT NULL,
  career_interest TEXT NOT NULL,
  matters_most TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  payment_amount INTEGER NOT NULL DEFAULT 500,
  payment_id TEXT,
  exam_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a registration (public landing page)
CREATE POLICY "Anyone can submit a registration"
  ON public.registrations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read/update/delete
CREATE POLICY "Admins can view all registrations"
  ON public.registrations FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update registrations"
  ON public.registrations FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete registrations"
  ON public.registrations FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER registrations_updated_at
  BEFORE UPDATE ON public.registrations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Helpful indexes
CREATE INDEX idx_registrations_payment_status ON public.registrations(payment_status);
CREATE INDEX idx_registrations_created_at ON public.registrations(created_at DESC);