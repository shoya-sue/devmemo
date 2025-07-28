# 開発環境構築ガイド

最終更新: 2025-07-28

## 前提条件

開発を始める前に、以下のツールがインストールされていることを確認してください：

- **Node.js** 18.17.0 以上
- **npm** または **yarn**
- **Git**
- **エディタ** (VS Code推奨)
- **Supabaseアカウント**

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone [repository-url]
cd devmemo
```

### 2. 依存関係のインストール

```bash
npm install
# または
yarn install
```

### 3. Supabaseプロジェクトの準備

#### 3.1 Supabaseでプロジェクト作成

1. [Supabase](https://supabase.com)にアクセス
2. 新しいプロジェクトを作成
3. プロジェクトのURLとAPIキーを取得

#### 3.2 データベースセットアップ

Supabaseダッシュボードの SQL エディタで以下のマイグレーションを順番に実行：

```bash
# SQL エディタで実行
1. docs/database/migrations/v1_initial_setup.sql
2. docs/database/migrations/v2_add_category_relation.sql
3. docs/database/migrations/v3_add_admin_policies.sql
4. docs/database/migrations/v4_add_storage_support.sql
5. docs/database/migrations/v5_add_full_text_search.sql
```

### 4. 環境変数の設定

`.env.local`ファイルを作成：

```bash
cp .env.example .env.local
```

`.env.local`を編集して実際の値を設定：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# オプション
NODE_ENV=development
```

### 5. 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
```

ブラウザで http://localhost:3000 にアクセス

## 開発ワークフロー

### ブランチ戦略

```bash
# 新機能開発
git checkout -b feature/機能名

# バグ修正
git checkout -b fix/バグ名

# ドキュメント更新
git checkout -b docs/更新内容
```

### コミットメッセージ規約

```bash
# 機能追加
git commit -m "feat: ユーザープロフィール機能を追加"

# バグ修正
git commit -m "fix: ログイン時のエラーを修正"

# ドキュメント
git commit -m "docs: READMEを更新"

# リファクタリング
git commit -m "refactor: 認証ロジックを整理"

# テスト
git commit -m "test: ユーザー認証のテストを追加"
```

### コード品質チェック

```bash
# Lintの実行
npm run lint

# 型チェック
npx tsc --noEmit

# フォーマット
npx prettier --write .
```

## 開発ツールの設定

### VS Code拡張機能（推奨）

- **ESLint** - コード品質チェック
- **Prettier** - コードフォーマッター
- **Tailwind CSS IntelliSense** - Tailwindクラス補完
- **Prisma** - Prismaサポート（使用する場合）
- **GitLens** - Git履歴表示

### VS Code設定（.vscode/settings.json）

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

## デバッグ方法

### Next.jsデバッグ設定（.vscode/launch.json）

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Supabaseログの確認

1. Supabaseダッシュボードにアクセス
2. Logs セクションで API ログを確認
3. Database セクションで SQL ログを確認

## トラブルシューティング

### よくある問題と解決方法

#### 1. 環境変数が読み込まれない
```bash
# .env.localファイルの確認
cat .env.local

# Next.jsサーバーの再起動
npm run dev
```

#### 2. Supabase接続エラー
- APIキーが正しいか確認
- プロジェクトURLが正しいか確認
- ネットワーク接続を確認

#### 3. TypeScriptエラー
```bash
# 型定義の再生成
npx supabase gen types typescript --project-id your-project-id > types/supabase.ts

# node_modulesの再インストール
rm -rf node_modules package-lock.json
npm install
```

#### 4. ビルドエラー
```bash
# キャッシュクリア
rm -rf .next
npm run build
```

## 開発のヒント

### 1. ホットリロード
- ファイル保存時に自動的にブラウザが更新される
- `_app.tsx`や設定ファイルの変更時は手動リロードが必要

### 2. 開発用データ
- Supabaseダッシュボードでテストデータを直接作成
- SQLエディタでシードデータを投入

### 3. パフォーマンス監視
- Chrome DevToolsの Network タブで API 呼び出しを確認
- React Developer Tools で再レンダリングを監視

### 4. エラーハンドリング
- `console.error`でエラーログを出力
- エラーバウンダリコンポーネントを活用

## 次のステップ

- [API仕様](../api/supabase-api.md)を確認
- [ベストプラクティス](./best-practices.md)を学ぶ
- [デプロイガイド](./deployment.md)を読む