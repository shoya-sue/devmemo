import { supabase } from '../supabase';
import { Post } from '@/types/post';

export const getPosts = async (userId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(id, name),
      tags:post_tags(tag:tags(id, name))
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // タグの形式を整形
  const formattedData = data.map(post => ({
    ...post,
    category: post.category,
    tags: post.tags.map((t: any) => t.tag)
  }));

  return formattedData as Post[];
};

export const getPost = async (id: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(id, name),
      tags:post_tags(tag:tags(id, name))
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  // タグの形式を整形
  const formattedData = {
    ...data,
    category: data.category,
    tags: data.tags.map((t: any) => t.tag)
  };

  return formattedData as Post;
};

export const createPost = async (post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([post])
    .select()
    .single();

  if (error) throw error;
  return data as Post;
};

export const updatePost = async (id: string, post: Partial<Post>) => {
  const { data, error } = await supabase
    .from('posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Post;
};

export const deletePost = async (id: string) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}; 