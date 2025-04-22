# DevMemoでのSupabase実装ガイド

## プロジェクト構成

このプロジェクトでは、Supabaseを以下の目的で使用します：

1. ユーザー認証
2. ブログ記事の管理
3. タグとカテゴリの管理

## データベース設計

### テーブル構造

1. **posts**（記事）
```sql
create table posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  title text not null,
  content text,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
```

2. **categories**（カテゴリ）
```sql
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

3. **tags**（タグ）
```sql
create table tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

4. **post_tags**（記事とタグの中間テーブル）
```sql
create table post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);
```

## セキュリティ設定

### Row Level Security (RLS)ポリシー

1. **posts テーブル**
```sql
-- 読み取りポリシー
create policy "Public posts are viewable by everyone"
on posts for select
using (is_published = true);

-- 作成ポリシー
create policy "Users can create their own posts"
on posts for insert
with check (auth.uid() = user_id);

-- 更新ポリシー
create policy "Users can update their own posts"
on posts for update
using (auth.uid() = user_id);

-- 削除ポリシー
create policy "Users can delete their own posts"
on posts for delete
using (auth.uid() = user_id);
```

2. **categories テーブル**
```sql
-- 読み取りポリシー（全ユーザーが閲覧可能）
create policy "Categories are viewable by everyone"
on categories for select
using (true);

-- 作成・更新・削除ポリシー（管理者のみ）
create policy "Only admins can modify categories"
on categories for all
using (auth.uid() in (select user_id from admin_users));
```

## 認証実装

### 1. クライアントセットアップ
```typescript
// utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 2. サーバーサイドセットアップ
```typescript
// utils/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
          }
        },
      },
    }
  )
}
```

## データ操作

### 1. 記事の取得
```typescript
const { data: posts, error } = await supabase
  .from('posts')
  .select(`
    *,
    category:categories(id, name),
    tags:post_tags(tag:tags(id, name))
  `)
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

### 2. 記事の作成
```typescript
const { data, error } = await supabase
  .from('posts')
  .insert([{
    title,
    content,
    user_id: userId,
    is_published: false
  }])
  .select();
```

### 3. 記事の更新
```typescript
const { data, error } = await supabase
  .from('posts')
  .update({ title, content, updated_at: new Date() })
  .eq('id', postId)
  .select();
```

## エラーハンドリング

```typescript
try {
  const { data, error } = await supabase.from('posts').select();
  if (error) {
    throw new Error(error.message);
  }
  // データの処理
} catch (error) {
  console.error('Error fetching posts:', error);
  // エラー処理
}
```

## 開発フロー

1. **ローカル開発**
   - `.env.local`で環境変数を設定
   - `npm run dev`で開発サーバー起動
   - Supabaseダッシュボードでデータ確認

2. **デプロイ**
   - Vercelで環境変数を設定
   - 本番環境のSupabase設定を確認
   - デプロイ後の動作確認

## 参考資料

- [Supabase Next.js Server Components](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security) 