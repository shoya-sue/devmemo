-- Migration: v1_initial_setup
-- Created at: 2024-03-21
-- Description: Initial database setup with basic tables and policies

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create admin users table
create table public.admin_users (
  user_id uuid primary key references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create basic tables
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  title text not null,
  content text,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- Enable Row Level Security
alter table public.posts enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.post_tags enable row level security;
alter table public.admin_users enable row level security;

-- Create basic policies
-- Posts policies
create policy "Public posts are viewable by everyone"
on public.posts for select
using (is_published = true);

create policy "Users can create their own posts"
on public.posts for insert
with check (auth.uid() = user_id);

create policy "Users can update their own posts"
on public.posts for update
using (auth.uid() = user_id);

create policy "Users can delete their own posts"
on public.posts for delete
using (auth.uid() = user_id);

-- Categories policies
create policy "Categories are viewable by everyone"
on public.categories for select
using (true);

-- Tags policies
create policy "Tags are viewable by everyone"
on public.tags for select
using (true);

-- Post tags policies
create policy "Post tags are viewable by everyone"
on public.post_tags for select
using (true);

create policy "Users can manage their post tags"
on public.post_tags for all
using (
  auth.uid() in (
    select user_id from public.posts where id = post_id
  )
);

-- Admin users basic policies
create policy "Admin users are viewable by everyone"
on public.admin_users for select
using (true); 