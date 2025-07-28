# Supabaseセットアップガイド

最終更新: 2025-07-28

## 1. Supabaseアカウントの作成

1. [Supabase](https://supabase.com)にアクセス
2. GitHubまたはメールでアカウントを作成
3. ダッシュボードにログイン

## 2. プロジェクトの作成

### 新規プロジェクト作成
1. ダッシュボードで「New project」をクリック
2. 以下の情報を入力：
   - **Project name**: devmemo（任意の名前）
   - **Database Password**: 強力なパスワードを設定
   - **Region**: 最寄りのリージョンを選択（東京: Northeast Asia）
3. 「Create new project」をクリック

### プロジェクト情報の取得
プロジェクトが作成されたら、以下の情報を取得します：

1. **Project URL**
   - Settings → Project settings → Project URL
   - 例: `https://xxxxx.supabase.co`

2. **Anon Key**
   - Settings → Project settings → API → Project API keys → anon public
   - 例: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. データベースのセットアップ

### SQLエディタでマイグレーションを実行

Supabaseダッシュボードの「SQL Editor」で以下のファイルを順番に実行：

```sql
-- 1. 初期セットアップ
docs/database/migrations/v1_initial_setup.sql

-- 2. カテゴリ関連の追加
docs/database/migrations/v2_add_category_relation.sql

-- 3. 管理者ポリシーの追加
docs/database/migrations/v3_add_admin_policies.sql

-- 4. ストレージサポートの追加
docs/database/migrations/v4_add_storage_support.sql

-- 5. 全文検索の追加
docs/database/migrations/v5_add_full_text_search.sql
```

### ストレージの設定

1. Storage → New bucket
2. バケット名: `media`
3. Public bucketをONに設定
4. 「Create bucket」をクリック

## 4. 認証の設定

### メール認証の設定
1. Authentication → Providers
2. Email を有効化
3. 必要に応じて以下を設定：
   - Confirm email: ON（推奨）
   - Double confirm email: OFF
   - Secure password: ON

### （オプション）ソーシャルログインの設定
必要に応じて以下のプロバイダーを設定：
- GitHub
- Google
- その他

## 5. 環境変数の設定

プロジェクトルートに`.env.local`ファイルを作成：

```bash
NEXT_PUBLIC_SUPABASE_URL=取得したProject URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=取得したAnon Key
```

## 6. 接続テスト

```bash
# 開発サーバーを起動
npm run dev

# http://localhost:3000 にアクセス
```

## トラブルシューティング

### データベース接続エラー
- プロジェクトURLが正しいか確認
- APIキーが正しいか確認
- プロジェクトがアクティブか確認

### 認証エラー
- RLSポリシーが適切に設定されているか確認
- anon keyではなくservice role keyを使用していないか確認

### マイグレーションエラー
- SQLファイルを順番通りに実行しているか確認
- 既存のテーブルとの競合がないか確認

## 次のステップ

- [環境変数の設定](./environment-variables.md)
- [開発ガイド](../development/README.md)
- [デプロイメント](../deployment/README.md)