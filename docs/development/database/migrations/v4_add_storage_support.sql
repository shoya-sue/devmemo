-- Migration: v4_add_storage_support
-- Created at: 2024-03-21
-- Description: Add storage support for images and media files

-- Create media table for tracking uploaded files
CREATE TABLE public.media (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  file_path text not null,
  file_name text not null,
  mime_type text not null,
  size integer not null,
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Add post_media relation table
CREATE TABLE public.post_media (
  post_id uuid references posts(id) on delete cascade,
  media_id uuid references media(id) on delete cascade,
  display_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (post_id, media_id)
);

-- Enable RLS
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_media ENABLE ROW LEVEL SECURITY;

-- Create policies for media
CREATE POLICY "Users can view public media"
  ON public.media FOR SELECT
  USING (true);

CREATE POLICY "Users can upload their own media"
  ON public.media FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own media"
  ON public.media FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own media"
  ON public.media FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for post_media
CREATE POLICY "Anyone can view post media"
  ON public.post_media FOR SELECT
  USING (true);

CREATE POLICY "Post owners can insert post media"
  ON public.post_media FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM posts WHERE id = post_id
    )
  );

CREATE POLICY "Post owners can update post media"
  ON public.post_media FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM posts WHERE id = post_id
    )
  );

CREATE POLICY "Post owners can delete post media"
  ON public.post_media FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM posts WHERE id = post_id
    )
  );

-- Add indexes for better performance
CREATE INDEX idx_media_user_id ON public.media(user_id);
CREATE INDEX idx_media_created_at ON public.media(created_at);
CREATE INDEX idx_post_media_post_id ON public.post_media(post_id);
CREATE INDEX idx_post_media_media_id ON public.post_media(media_id);

-- Add trigger for updating media updated_at
CREATE TRIGGER update_media_updated_at
    BEFORE UPDATE ON media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add storage quota tracking
ALTER TABLE public.media
ADD COLUMN storage_bucket text not null default 'media';

-- Create function to check storage quota
CREATE OR REPLACE FUNCTION check_storage_quota()
RETURNS trigger AS $$
DECLARE
  user_quota integer := 104857600; -- 100MB default
  current_usage integer;
BEGIN
  SELECT COALESCE(SUM(size), 0) INTO current_usage
  FROM media
  WHERE user_id = NEW.user_id;

  IF (current_usage + NEW.size) > user_quota THEN
    RAISE EXCEPTION 'Storage quota exceeded';
  END IF;

  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Add storage quota trigger
CREATE TRIGGER check_storage_quota_trigger
    BEFORE INSERT ON media
    FOR EACH ROW
    EXECUTE FUNCTION check_storage_quota(); 