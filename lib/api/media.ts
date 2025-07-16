import { createClient } from '@/utils/supabase/client';

export interface Media {
  id: string;
  user_id: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  size: number;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export async function uploadMedia(file: File): Promise<Media> {
  const supabase = createClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('認証が必要です');

  // Generate unique file name
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('media')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(fileName);

  // Save to database
  const { data: mediaData, error: dbError } = await supabase
    .from('media')
    .insert({
      user_id: user.id,
      file_path: publicUrl,
      file_name: file.name,
      mime_type: file.type,
      size: file.size,
      storage_bucket: 'media',
      metadata: {
        originalName: file.name,
        uploadPath: fileName
      }
    })
    .select()
    .single();

  if (dbError) {
    // Clean up uploaded file if database insert fails
    await supabase.storage.from('media').remove([fileName]);
    throw dbError;
  }

  return mediaData;
}

export async function deleteMedia(mediaId: string): Promise<void> {
  const supabase = createClient();

  // Get media info first
  const { data: media, error: fetchError } = await supabase
    .from('media')
    .select('*')
    .eq('id', mediaId)
    .single();

  if (fetchError || !media) throw new Error('メディアが見つかりません');

  // Delete from storage
  const uploadPath = media.metadata?.uploadPath;
  if (uploadPath) {
    await supabase.storage.from('media').remove([uploadPath]);
  }

  // Delete from database
  const { error: deleteError } = await supabase
    .from('media')
    .delete()
    .eq('id', mediaId);

  if (deleteError) throw deleteError;
}

export async function getUserMedia(userId?: string): Promise<Media[]> {
  const supabase = createClient();
  
  let query = supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function attachMediaToPost(postId: string, mediaIds: string[]): Promise<void> {
  const supabase = createClient();

  // Remove existing associations
  await supabase
    .from('post_media')
    .delete()
    .eq('post_id', postId);

  // Add new associations
  if (mediaIds.length > 0) {
    const postMediaData = mediaIds.map((mediaId, index) => ({
      post_id: postId,
      media_id: mediaId,
      display_order: index
    }));

    const { error } = await supabase
      .from('post_media')
      .insert(postMediaData);

    if (error) throw error;
  }
}

export async function getPostMedia(postId: string): Promise<Media[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('post_media')
    .select(`
      media (*)
    `)
    .eq('post_id', postId)
    .order('display_order');

  if (error) throw error;
  return (data?.map(item => item.media).filter(Boolean) as unknown as Media[]) || [];
}