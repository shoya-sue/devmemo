export interface Post {
  id: string;
  title: string;
  content: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  category_id?: string;
  category?: Category;
  tags?: Tag[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  posts?: Post[];
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
  posts?: Post[];
}

export interface PostWithRelations extends Post {
  category: Category;
  tags: Tag[];
}

export interface PostTag {
  post_id: string;
  tag_id: string;
  created_at: string;
} 