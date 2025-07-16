import { Category } from '@/types/post';
import { createClient } from '@/utils/supabase/client';

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function createCategory(data: { name: string }): Promise<Category> {
  const supabase = createClient();
  const { data: category, error } = await supabase
    .from('categories')
    .insert({
      name: data.name
    })
    .select()
    .single();
  
  if (error) throw error;
  return category;
}

export async function updateCategory(id: string, name: string): Promise<Category> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .update({ name })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
} 