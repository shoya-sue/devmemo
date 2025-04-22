# 📝 DevMemo - 技術ブログCMS
# DevMemo - Technical Blog CMS

個人または小規模チームで利用できる、認証付きのMarkdownベース技術ブログアプリ。  
A Markdown-based technical blog application with authentication for individuals or small teams.

## 🌟 概要 / Overview

Next.js 14 (App Router) + Supabase + Tailwind CSS を使用したモダンなフルスタックブログプラットフォーム。  
Modern full-stack blog platform using Next.js 14 (App Router) + Supabase + Tailwind CSS.

## ✨ 主な機能 / Key Features

- ✅ ユーザー認証 / User Authentication (Supabase Auth)
- ✅ 記事の作成・編集 / Create and Edit Posts
  - Markdownエディタ搭載 / Markdown Editor
  - ドラフト機能 / Draft System
- ✅ タグとカテゴリ管理 / Tags and Categories
- ✅ レスポンシブデザイン / Responsive Design
- ✅ ダークモード対応 / Dark Mode Support

## 🛠 技術スタック / Tech Stack

### フロントエンド / Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Markdown

### バックエンド / Backend
- Supabase (Database & Auth)
  - PostgreSQL
  - Row Level Security
  - JWT Authentication

## 📦 必要要件 / Prerequisites

- Node.js 18.17.0以上 / Node.js 18.17.0 or higher
- npm または yarn / npm or yarn
- Supabaseアカウント / Supabase account

## 🚀 開発環境のセットアップ / Development Setup

1. **リポジトリのクローン / Clone the repository**
```bash
git clone [repository-url]
cd devmemo
```

2. **依存パッケージのインストール / Install dependencies**
```bash
npm install
```

3. **環境変数の設定 / Environment Variables**
`.env.local`ファイルを作成し、以下を設定 / Create `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. **開発サーバーの起動 / Start development server**
```bash
npm run dev
# or
yarn dev
```

## 📊 データベース構造 / Database Structure

### Posts Table
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

## 🔧 デプロイ / Deployment

### Supabase Setup
1. Supabaseプロジェクトの作成
2. データベーススキーマの適用
3. 認証設定の確認

### アプリケーションのデプロイ / Application Deployment
- Vercel（推奨）
- または任意のNode.js対応ホスティング

## 📝 ライセンス / License

MIT License

## 🤝 コントリビューション / Contributing

Issue、PR歓迎です！ / Issues and PRs are welcome!

## 🔐 セキュリティ設定 / Security Setup

### 環境変数 / Environment Variables
1. **開発環境 / Development**
   - `.env.local` ファイルを作成（Gitで追跡されません）
   - **絶対に `.env.local` をGitにコミットしないでください**

2. **本番環境 / Production**
   - Vercelダッシュボードで直接環境変数を設定
   - 本番用の環境変数は別途安全に管理

### 必要な環境変数 / Required Environment Variables
```bash
# Supabase設定 / Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# その他の機密データ / Other Sensitive Data
# DATABASE_URL=your-database-url # 必要な場合のみ
```

### セキュリティチェックリスト / Security Checklist
- ✅ `.gitignore` に `.env.local` を追加
- ✅ 本番環境の環境変数は別途安全に管理
- ✅ Supabaseのサービスロールキーは公開しない
- ✅ デプロイ前に機密データの漏洩がないかチェック

### 推奨プラクティス / Recommended Practices
1. `.env.example` ファイルを用意（ダミーデータ）
2. 開発チームでの環境変数の共有は安全な方法で行う
3. 定期的なセキュリティ監査の実施

## Markdownの使い方ガイド

### 見出し

```markdown
# 見出し1
## 見出し2
### 見出し3
#### 見出し4
##### 見出し5
###### 見出し6
```

### テキストの装飾

```markdown
**太字**
*斜体*
~~打ち消し線~~
```

### リスト

順序なしリスト:
```markdown
- 項目1
- 項目2
  - サブ項目2.1
  - サブ項目2.2
- 項目3
```

順序付きリスト:
```markdown
1. 最初の項目
2. 2番目の項目
3. 3番目の項目
```

### リンクと画像

```markdown
[リンクのテキスト](https://example.com)
![画像の代替テキスト](画像のURL)
```

### コードブロック

インラインコード:
```markdown
`const example = "コード";`
```

コードブロック:
````markdown
```javascript
function hello() {
  console.log("Hello, World!");
}
```
````

### 表

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A1  | B1  | C1  |
| A2  | B2  | C2  |
```

### 引用

```markdown
> これは引用文です。
> 複数行に渡って引用することができます。
```

### 水平線

```markdown
---
```

### タスクリスト

```markdown
- [x] 完了したタスク
- [ ] 未完了のタスク
```

## 実際の使用例

### プロジェクトの概要

このプロジェクトは技術メモを共有するためのプラットフォームです。

#### 主な機能
- Markdownによる記事作成
- タグとカテゴリによる整理
- プレビュー機能

### コードサンプル

```typescript
function greeting(name: string): string {
  return `Hello, ${name}!`;
}
```

### 表を使った機能比較

| 機能 | 無料プラン | プロプラン |
|------|------------|------------|
| 記事数 | 無制限 | 無制限 |
| 画像アップロード | 5MB/月 | 無制限 |
| API アクセス | ✕ | ○ |

> **Note**: このドキュメントは随時更新されます。
