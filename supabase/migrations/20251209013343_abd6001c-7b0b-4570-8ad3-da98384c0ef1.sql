-- Create leads table for storing contact form submissions
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  tipo_evento TEXT NOT NULL,
  invitados TEXT,
  fecha_evento DATE,
  mensaje TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'nuevo'
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert leads (public form)
CREATE POLICY "Anyone can submit a lead" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- Create a gallery_images table for venue photos
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'salon',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access for gallery
CREATE POLICY "Gallery images are publicly visible" 
ON public.gallery_images 
FOR SELECT 
USING (is_active = true);

-- Allow anyone to insert images (for admin functionality - will enhance later with auth)
CREATE POLICY "Anyone can manage gallery images" 
ON public.gallery_images 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Insert some initial gallery images
INSERT INTO public.gallery_images (title, description, image_url, category, display_order) VALUES
  ('Salón Elegante', 'Espacio ideal para casamientos y eventos formales', '/placeholder.svg', 'casamiento', 1),
  ('Salón Corporativo', 'Perfecto para reuniones y eventos empresariales', '/placeholder.svg', 'empresarial', 2),
  ('Salón Jardín', 'Ambiente al aire libre para celebraciones íntimas', '/placeholder.svg', 'cumpleaños', 3),
  ('Gran Salón', 'Capacidad para más de 200 personas', '/placeholder.svg', 'salon', 4);
