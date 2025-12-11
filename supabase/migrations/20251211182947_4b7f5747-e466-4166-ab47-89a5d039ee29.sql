-- Drop existing restrictive storage policies
DROP POLICY IF EXISTS "Admin full access to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update gallery objects" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete from gallery" ON storage.objects;

-- Create proper storage policies for gallery bucket
-- Public read access for all files in gallery bucket
CREATE POLICY "Public read access to gallery"
ON storage.objects
FOR SELECT
USING (bucket_id = 'gallery');

-- Authenticated users with admin role can insert
CREATE POLICY "Admins can upload to gallery"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'gallery' 
  AND auth.role() = 'authenticated'
  AND public.has_role(auth.uid(), 'admin')
);

-- Authenticated users with admin role can update
CREATE POLICY "Admins can update gallery objects"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'gallery' 
  AND auth.role() = 'authenticated'
  AND public.has_role(auth.uid(), 'admin')
);

-- Authenticated users with admin role can delete
CREATE POLICY "Admins can delete from gallery"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'gallery' 
  AND auth.role() = 'authenticated'
  AND public.has_role(auth.uid(), 'admin')
);