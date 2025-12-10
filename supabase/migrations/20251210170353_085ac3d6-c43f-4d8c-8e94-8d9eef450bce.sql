-- First drop existing storage policies
DROP POLICY IF EXISTS "Gallery images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update gallery files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete from gallery" ON storage.objects;

-- Public read access for gallery bucket
CREATE POLICY "Gallery images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

-- Allow authenticated admins to upload to gallery bucket
CREATE POLICY "Admins can upload to gallery"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'gallery' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated admins to update gallery files
CREATE POLICY "Admins can update gallery files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'gallery' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated admins to delete from gallery bucket
CREATE POLICY "Admins can delete from gallery"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'gallery' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Fix gallery_images table policies
DROP POLICY IF EXISTS "Admins can manage gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Anyone can manage gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Gallery images are publicly visible" ON public.gallery_images;

-- Public read access for active images
CREATE POLICY "Gallery images are publicly visible"
ON public.gallery_images FOR SELECT
USING (is_active = true);

-- Admin full access
CREATE POLICY "Admins can manage gallery images"
ON public.gallery_images FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));