import { createClient } from '@/utils/supabase/server';
import { AdminUser } from '@/types/user';

export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .single();
  
  return !error && !!data;
}

export async function requireAdmin(userId: string | undefined): Promise<void> {
  if (!userId) {
    throw new Error('Unauthorized: User not authenticated');
  }
  
  const admin = await isAdmin(userId);
  if (!admin) {
    throw new Error('Forbidden: Admin access required');
  }
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user;
}