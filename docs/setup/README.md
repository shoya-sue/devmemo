# セットアップガイド

DevMemoプロジェクトのセットアップ手順をご案内します。

## 📚 セットアップドキュメント

1. **[はじめに](./getting-started.md)**
   - 開発環境の構築
   - 必要なツールのインストール
   - プロジェクトの初期設定

2. **[Supabaseセットアップ](./supabase-setup.md)**
   - Supabaseプロジェクトの作成
   - データベースのセットアップ
   - 環境変数の設定

3. **[環境変数の設定](./environment-variables.md)**
   - 必要な環境変数の一覧
   - .env.localファイルの作成
   - セキュリティのベストプラクティス

## クイックスタート

```bash
# 1. リポジトリのクローン
git clone [repository-url]
cd devmemo

# 2. 依存関係のインストール
npm install

# 3. 環境変数の設定
cp .env.example .env.local
# .env.localを編集してSupabaseの認証情報を設定

# 4. 開発サーバーの起動
npm run dev
```

詳細な手順は各ドキュメントをご参照ください。