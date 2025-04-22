import { Tag } from '@/types/post';
import { prisma } from '@/lib/prisma';

export async function getTags(): Promise<Tag[]> {
  return await prisma.tag.findMany({
    orderBy: {
      name: 'asc'
    }
  });
}

export async function createTag(name: string): Promise<Tag> {
  return await prisma.tag.create({
    data: {
      name
    }
  });
}

export async function updateTag(id: number, name: string): Promise<Tag> {
  const tag = await prisma.tag.update({
    where: { id },
    data: { name },
  });
  return tag;
}

export async function deleteTag(id: number): Promise<Tag> {
  return await prisma.tag.delete({
    where: {
      id
    }
  });
}

// 記事とタグの関連付け
export const linkPostTags = async (postId: string, tagIds: string[]) => {
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