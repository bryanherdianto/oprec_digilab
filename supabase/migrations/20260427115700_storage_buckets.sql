INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('cv-files', 'cv-files', true, 4194304)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('transkrip', 'transkrip', true, 2097152)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('profile-photos', 'profile-photos', true, 2097152)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can insert CVs"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cv-files');

CREATE POLICY "Authenticated users can view CVs"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'cv-files');

CREATE POLICY "Authenticated users can update CVs"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'cv-files');

CREATE POLICY "Authenticated users can insert transkrip"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'transkrip');

CREATE POLICY "Authenticated users can view transkrip"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'transkrip');

CREATE POLICY "Authenticated users can update transkrip"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'transkrip');

CREATE POLICY "Authenticated users can insert profile-photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profile-photos');

CREATE POLICY "Authenticated users can view profile-photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'profile-photos');

CREATE POLICY "Authenticated users can update profile-photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'profile-photos');