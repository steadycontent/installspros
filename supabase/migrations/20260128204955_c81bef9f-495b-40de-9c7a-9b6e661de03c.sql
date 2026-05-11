-- Create storage bucket for property photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-photos', 'property-photos', true);

-- Allow anyone to upload photos (no auth required for lead photos)
CREATE POLICY "Anyone can upload property photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'property-photos');

-- Allow public read access to property photos
CREATE POLICY "Property photos are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-photos');