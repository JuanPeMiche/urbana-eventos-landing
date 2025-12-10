-- Fix RLS so admins can see ALL images (active and inactive)
DROP POLICY IF EXISTS "Gallery images are publicly visible" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can manage gallery images" ON public.gallery_images;

-- Public can only see active images
CREATE POLICY "Public can view active images"
ON public.gallery_images FOR SELECT
USING (is_active = true);

-- Admins can see ALL images (including inactive)
CREATE POLICY "Admins can view all images"
ON public.gallery_images FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert, update, delete
CREATE POLICY "Admins can insert images"
ON public.gallery_images FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update images"
ON public.gallery_images FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete images"
ON public.gallery_images FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));