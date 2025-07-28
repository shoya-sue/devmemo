# Supabase API 使用ガイド

最終更新: 2025-07-28

## 概要

DevMemoプロジェクトでは、Supabaseのクライアントライブラリを使用してAPIを操作します。このドキュメントでは、主要なAPI操作パターンと実装例を説明します。

## クライアントの初期化

### ブラウザクライアント
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

### サーバークライアント
```typescript
// utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
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
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options) {
          cookieStore.set({ name, value: '', ...options })
        }
      }
    }
  )
}
```

## 認証API

### サインアップ
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    emailRedirectTo: `${location.origin}/auth/callback`
  }
})
```

### ログイン
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})
```

### ログアウト
```typescript
const { error } = await supabase.auth.signOut()
```

### 現在のユーザー取得
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

## データベースAPI

### 記事の操作

#### 記事一覧取得
```typescript
const { data: posts, error } = await supabase
  .from('posts')
  .select(`
    *,
    category:categories(id, name),
    tags:post_tags(tag:tags(id, name))
  `)
  .eq('is_published', true)
  .order('created_at', { ascending: false })
  .limit(10)
```

#### 記事作成
```typescript
const { data, error } = await supabase
  .from('posts')
  .insert({
    title: '新しい記事',
    content: '記事の内容',
    user_id: user.id,
    category_id: categoryId,
    is_published: false
  })
  .select()
  .single()
```

#### 記事更新
```typescript
const { data, error } = await supabase
  .from('posts')
  .update({
    title: '更新されたタイトル',
    content: '更新された内容',
    updated_at: new Date().toISOString()
  })
  .eq('id', postId)
  .eq('user_id', user.id) // 所有者確認
  .select()
  .single()
```

#### 記事削除
```typescript
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId)
  .eq('user_id', user.id)
```

### カテゴリとタグの操作

#### カテゴリ一覧取得
```typescript
const { data: categories, error } = await supabase
  .from('categories')
  .select('*')
  .order('name')
```

#### タグ作成（管理者のみ）
```typescript
const { data, error } = await supabase
  .from('tags')
  .insert({ name: '新しいタグ' })
  .select()
  .single()
```

#### 記事にタグを追加
```typescript
const { error } = await supabase
  .from('post_tags')
  .insert([
    { post_id: postId, tag_id: tagId1 },
    { post_id: postId, tag_id: tagId2 }
  ])
```

### 全文検索

#### 記事検索
```typescript
const { data: results, error } = await supabase
  .rpc('search_posts', { search_term: '検索キーワード' })
```

## ストレージAPI

### ファイルアップロード
```typescript
const { data, error } = await supabase.storage
  .from('media')
  .upload(`${user.id}/${file.name}`, file, {
    cacheControl: '3600',
    upsert: false
  })

if (data) {
  // メディアテーブルに記録
  const { error: dbError } = await supabase
    .from('media')
    .insert({
      user_id: user.id,
      file_path: data.path,
      file_name: file.name,
      mime_type: file.type,
      size: file.size
    })
}
```

### ファイルURL取得
```typescript
const { data } = supabase.storage
  .from('media')
  .getPublicUrl(filePath)
```

### ファイル削除
```typescript
const { error } = await supabase.storage
  .from('media')
  .remove([filePath])
```

## リアルタイムAPI

### 記事の更新を監視
```typescript
const channel = supabase
  .channel('posts-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'posts'
    },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

// クリーンアップ
channel.unsubscribe()
```

## エラーハンドリング

### 基本的なエラーハンドリング
```typescript
try {
  const { data, error } = await supabase
    .from('posts')
    .select()
  
  if (error) {
    throw error
  }
  
  return data
} catch (error) {
  console.error('Error:', error)
  
  if (error.code === 'PGRST116') {
    // レコードが見つからない
  } else if (error.code === '23505') {
    // 一意制約違反
  } else if (error.code === '42501') {
    // 権限不足
  }
  
  throw error
}
```

### カスタムエラーハンドラー
```typescript
export async function handleSupabaseError<T>(
  promise: Promise<{ data: T | null; error: any }>
): Promise<T> {
  const { data, error } = await promise
  
  if (error) {
    console.error('Supabase error:', error)
    
    if (error.message.includes('JWT')) {
      // 認証エラー
      window.location.href = '/auth/login'
    }
    
    throw new Error(error.message || 'データベースエラーが発生しました')
  }
  
  if (!data) {
    throw new Error('データが見つかりません')
  }
  
  return data
}
```

## ベストプラクティス

### 1. 型安全性の確保
```typescript
// types/database.ts
export type Post = {
  id: string
  title: string
  content: string
  // ...
}

const { data } = await supabase
  .from('posts')
  .select()
  .returns<Post[]>()
```

### 2. クエリの最適化
```typescript
// 必要なフィールドのみ選択
const { data } = await supabase
  .from('posts')
  .select('id, title, created_at')
  
// リレーションの効率的な取得
const { data } = await supabase
  .from('posts')
  .select(`
    id,
    title,
    category!inner(name)
  `)
  .eq('category.name', 'Tech')
```

### 3. バッチ操作
```typescript
// 複数レコードの一括挿入
const { error } = await supabase
  .from('post_tags')
  .insert(
    tagIds.map(tagId => ({
      post_id: postId,
      tag_id: tagId
    }))
  )
```

### 4. トランザクション処理
```typescript
// Supabaseはトランザクションを直接サポートしないため、
// Edge Functionやストアドプロシージャを使用
const { data, error } = await supabase
  .rpc('create_post_with_tags', {
    post_title: title,
    post_content: content,
    tag_names: ['tag1', 'tag2']
  })
```

## パフォーマンスのヒント

1. **インデックスの活用**
   - 頻繁にクエリするカラムにインデックスを作成

2. **ページネーション**
   ```typescript
   const { data } = await supabase
     .from('posts')
     .select()
     .range(0, 9) // 10件取得
   ```

3. **キャッシュ戦略**
   - React QueryやSWRとの統合を検討

4. **接続プーリング**
   - サーバーサイドでは接続を再利用