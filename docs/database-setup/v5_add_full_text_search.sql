-- Migration: v5_add_full_text_search
-- Created at: 2024-03-21
-- Description: Add full text search support for posts

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add search vector column to posts
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update search vector
CREATE OR REPLACE FUNCTION posts_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search vector updates
CREATE TRIGGER posts_search_vector_update
  BEFORE INSERT OR UPDATE
  ON posts
  FOR EACH ROW
  EXECUTE FUNCTION posts_search_vector_update();

-- Create index for full text search
CREATE INDEX IF NOT EXISTS posts_search_idx ON posts USING gin(search_vector);

-- Create function for similarity search
CREATE OR REPLACE FUNCTION search_posts(search_term text)
RETURNS TABLE (
  id uuid,
  title text,
  content text,
  similarity real
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.content,
    ts_rank(p.search_vector, websearch_to_tsquery('english', search_term)) as similarity
  FROM posts p
  WHERE p.search_vector @@ websearch_to_tsquery('english', search_term)
    AND p.is_published = true
  ORDER BY similarity DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing posts
UPDATE posts
SET search_vector = 
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(content, '')), 'B'); 