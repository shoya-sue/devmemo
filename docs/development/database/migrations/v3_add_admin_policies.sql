-- Migration: v3_add_admin_policies
-- Created at: 2024-03-21
-- Description: Add admin policies for categories and tags management

-- Add function to verify admin status
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM admin_users
    WHERE admin_users.user_id = $1
  );
END;
$$ language plpgsql security definer;

-- Add admin policies for categories
create policy "Only admins can modify categories"
on public.categories for all
using (auth.uid() in (select user_id from admin_users));

-- Add admin policies for tags
create policy "Only admins can modify tags"
on public.tags for all
using (auth.uid() in (select user_id from admin_users));

-- Add admin users management policies
create policy "Only super admins can modify admin users"
on public.admin_users for all
using (auth.uid() in (select user_id from admin_users));

-- Add admin verification function
CREATE OR REPLACE FUNCTION require_admin()
RETURNS trigger AS $$
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only administrators can perform this action';
  END IF;
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Add admin check triggers
CREATE TRIGGER ensure_admin_for_category_changes
  BEFORE INSERT OR UPDATE OR DELETE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION require_admin();

CREATE TRIGGER ensure_admin_for_tag_changes
  BEFORE INSERT OR UPDATE OR DELETE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION require_admin(); 