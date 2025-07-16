import { Tag } from '@/types/post';
import { createClient } from '@/utils/supabase/client';

export async function getTags(): Promise<Tag[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function createTag(name: string): Promise<Tag> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tags')
    .insert({ name })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateTag(id: string, name: string): Promise<Tag> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tags')
    .update({ name })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteTag(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function addTagToPost(postId: string, tagId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('post_tags')
    .insert({
      post_id: postId,
      tag_id: tagId
    });
  
  if (error) throw error;
}

export async function removeTagFromPost(postId: string, tagId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('post_tags')
    .delete()
    .eq('post_id', postId)
    .eq('tag_id', tagId);
  
  if (error) throw error;
}

export async function getTagsForPost(postId: string): Promise<Tag[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('post_tags')
    .select(`
      tags (*)
    `)
    .eq('post_id', postId);
  
  if (error) throw error;
  return (data?.map(item => item.tags).filter(Boolean) as unknown as Tag[]) || [];
}

// 記事とタグの関連付け
export const linkPostTags = async (postId: string, tagIds: string[]) => {
  const supabase = createClient();
  const { error } = await supabase
    .from('post_tags')
    .delete()
    .eq('post_id', postId);

  if (error) throw error;

  if (tagIds.length === 0) return;

  const { error: insertError } = await supabase
    .from('post_tags')
    .insert(tagIds.map(tagId => ({
      post_id: postId,
      tag_id: tagId
    })));

  if (insertError) throw insertError;
};