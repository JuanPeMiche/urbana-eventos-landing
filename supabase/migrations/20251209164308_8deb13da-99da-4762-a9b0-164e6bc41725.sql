-- Tabla para almacenar contenido editable del sitio
CREATE TABLE public.site_content (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Política: cualquiera puede leer el contenido
CREATE POLICY "Anyone can view site content"
ON public.site_content
FOR SELECT
USING (true);

-- Política: solo admins pueden modificar contenido
CREATE POLICY "Admins can manage site content"
ON public.site_content
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insertar contenido inicial
INSERT INTO public.site_content (id, content) VALUES
  ('hero_title', 'Organizamos tu evento ideal, vos solo disfrutá'),
  ('hero_subtitle', 'Contanos qué evento querés hacer y nosotros te asignamos el salón perfecto: cumpleaños, casamientos, eventos empresariales y más.'),
  ('hero_benefit_1', 'Más de 10 salones aliados'),
  ('hero_benefit_2', 'Eventos para cualquier capacidad'),
  ('hero_benefit_3', 'Respuesta rápida por WhatsApp'),
  ('about_title', '¿Quiénes Somos?'),
  ('about_text_1', 'Somos una central especializada en conectar personas con salones de eventos de forma fácil, rápida y segura. Te escuchamos, analizamos tu evento y te guiamos hacia la mejor opción disponible.'),
  ('about_text_2', 'Trabajamos con salones exclusivos en Montevideo con los que tenemos acuerdos directos. Cada evento es único, por eso evaluamos cantidad de personas, preferencia (parrillero, formal, empresarial) y presupuesto para proponerte el salón ideal.'),
  ('contact_title', 'Pedí tu propuesta para el salón ideal'),
  ('contact_subtitle', 'Completá el formulario con los detalles de tu evento y nuestro equipo te contactará con la mejor propuesta de salón y costos.'),
  ('event_casamiento', 'Salones preparados para tu boda, con toda la elegancia que merecés.'),
  ('event_fiesta_empresarial', 'Celebrá logros y fortalecé a tu equipo en el espacio perfecto.'),
  ('event_despedida', 'Cerrá el año con estilo y alegría junto a tus seres queridos.'),
  ('event_presentacion', 'Espacios profesionales para lanzar tu producto con impacto.'),
  ('event_capacitacion', 'Potenciá tu equipo en un lugar organizado y preparado.'),
  ('event_cumpleanos', 'Festejá a lo grande con tus invitados en un ambiente exclusivo.'),
  ('event_aniversario', 'Brindá por más años juntos y más logros alcanzados.'),
  ('event_otro', 'Contanos tu idea y encontramos el espacio ideal.');