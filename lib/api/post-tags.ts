import { createClient } from '@/utils/supabase/client';

export async function updatePostTags(postId: string, tagIds: string[]) {
  const supabase = createClient();
  
  // 既存のタグを全て削除
  const { error: deleteError } = await supabase
    .from('post_tags')
    .delete()
    .eq('post_id', postId);
  
  if (deleteError) throw deleteError;
  
  // 新しいタグを追加
  if (tagIds.length > 0) {
    const postTags = tagIds.map(tagId => ({
      post_id: postId,
      tag_id: tagId
    }));
    
    const { error: insertError } = await supabase
      .from('post_tags')
      .insert(postTags);
    
    if (insertError) throw insertError;
  }
}

export async function getPostTags(postId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('post_tags')
    .select(`
      tag_id,
      tags (
        id,
        name
      )
    `)
    .eq('post_id', postId);
  
  if (error) throw error;
  
  return data?.map(item => item.tags) || [];
}