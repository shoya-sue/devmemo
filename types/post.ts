export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  created_at: Date;
  updated_at: Date;
  category_id?: number;
  category?: Category;
  tags?: Tag[];
}

export interface Category {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  posts?: Post[];
}

export interface Tag {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  posts?: Post[];
}

export interface PostWithRelations extends Post {
  category: Category;
  tags: Tag[];
}

export interface PostTag {
  post_id: number;
  tag_id: number;
  created_at: string;
  updated_at: string;
} 