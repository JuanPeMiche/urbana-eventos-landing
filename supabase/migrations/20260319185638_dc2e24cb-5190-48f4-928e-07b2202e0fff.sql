
-- Drop the overly broad public policies on leads
DROP POLICY IF EXISTS "Admins can manage leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can view leads" ON public.leads;

-- Recreate admin policies restricted to authenticated users only
CREATE POLICY "Admins can manage leads"
  ON public.leads
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
