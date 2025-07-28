export interface AdminUser {
  user_id: string;
  created_at: string;
}

export interface UserWithRole {
  id: string;
  email: string;
  created_at: string;
  is_admin: boolean;
}