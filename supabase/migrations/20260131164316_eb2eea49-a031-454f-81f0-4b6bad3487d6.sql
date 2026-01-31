-- Create function to update timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create tracking_config table for managing Google Ads tracking per section
CREATE TABLE public.tracking_config (
  id TEXT PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT false,
  ads_id TEXT NOT NULL DEFAULT 'AW-16577812369',
  event_label TEXT NOT NULL DEFAULT 'form_submit',
  conversion_label TEXT,
  track_form_submit BOOLEAN NOT NULL DEFAULT true,
  track_whatsapp_click BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tracking_config ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read tracking config (needed for frontend)
CREATE POLICY "Tracking config is publicly readable"
ON public.tracking_config
FOR SELECT
USING (true);

-- Policy: Only admins can modify tracking config
CREATE POLICY "Only admins can modify tracking config"
ON public.tracking_config
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Insert default config for Infantiles (enabled by default with the provided ID)
INSERT INTO public.tracking_config (id, enabled, ads_id, event_label, track_form_submit, track_whatsapp_click)
VALUES ('cumpleanos-infantiles', true, 'AW-16577812369', 'infantiles_form_submit', true, true);

-- Create trigger for updated_at
CREATE TRIGGER update_tracking_config_updated_at
BEFORE UPDATE ON public.tracking_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();