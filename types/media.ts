export interface Media {
  id: string;
  user_id: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  size: number;
  storage_bucket: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface PostMedia {
  post_id: string;
  media_id: string;
  display_order: number;
  created_at: string;
}