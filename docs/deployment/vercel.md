# デプロイメントガイド

最終更新: 2025-07-28

## デプロイ先の選択

DevMemoは以下のプラットフォームにデプロイ可能です：

- **Vercel** (推奨)
- **Netlify**
- **AWS Amplify**
- **その他のNode.js対応ホスティング**

このガイドでは、推奨のVercelを使用したデプロイ方法を説明します。

## 事前準備

### 1. 本番用Supabaseプロジェクト

開発用とは別に本番用のSupabaseプロジェクトを作成することを推奨します。

1. Supabaseで新しいプロジェクトを作成
2. マイグレーションSQLを実行
3. 本番用のURLとAPIキーを取得

### 2. 環境変数の準備

本番環境で必要な環境変数：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
```

## Vercelへのデプロイ

### 方法1: Vercel CLIを使用

#### 1. Vercel CLIのインストール
```bash
npm i -g vercel
```

#### 2. プロジェクトのデプロイ
```bash
vercel
```

初回実行時の設定：
- プロジェクト名を入力
- フレームワークはNext.jsを選択
- ビルド設定はデフォルトを使用

#### 3. 環境変数の設定
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 方法2: GitHub連携

#### 1. GitHubリポジトリの準備
```bash
git remote add origin https://github.com/username/devmemo.git
git push -u origin main
```

#### 2. Vercelダッシュボードでの設定

1. [Vercel](https://vercel.com)にログイン
2. "New Project"をクリック
3. GitHubリポジトリをインポート
4. 環境変数を設定
5. "Deploy"をクリック

### 環境変数の管理

Vercelダッシュボードで環境変数を設定：

1. プロジェクト設定に移動
2. "Environment Variables"セクション
3. 以下の変数を追加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ビルド設定

### vercel.json（オプション）

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["hnd1"],
  "functions": {
    "app/api/**.ts": {
      "maxDuration": 60
    }
  }
}
```

### ビルド最適化

```json
// next.config.js
module.exports = {
  images: {
    domains: ['your-supabase-url.supabase.co'],
  },
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
}
```

## デプロイ前チェックリスト

### 1. コードチェック
- [ ] `npm run build` が成功する
- [ ] `npm run lint` でエラーがない
- [ ] TypeScriptエラーがない
- [ ] 未使用の依存関係を削除

### 2. セキュリティチェック
- [ ] 環境変数が適切に設定されている
- [ ] APIキーがコードに直接記載されていない
- [ ] デバッグログが削除されている
- [ ] エラーメッセージが適切

### 3. パフォーマンスチェック
- [ ] 画像が最適化されている
- [ ] 不要なコードが削除されている
- [ ] バンドルサイズが適切

### 4. データベースチェック
- [ ] 本番用マイグレーションが完了
- [ ] RLSポリシーが適切に設定
- [ ] インデックスが作成されている

## デプロイ後の確認

### 1. 機能テスト
- [ ] ユーザー登録・ログイン
- [ ] 記事の作成・編集・削除
- [ ] 画像アップロード
- [ ] 検索機能

### 2. パフォーマンステスト
- [ ] ページ読み込み速度
- [ ] API レスポンス時間
- [ ] Lighthouse スコア確認

### 3. セキュリティテスト
- [ ] 認証が必要なページの保護
- [ ] HTTPS接続の確認
- [ ] CORSポリシーの確認

## 監視とメンテナンス

### Vercelダッシュボード

1. **Analytics** - トラフィックとパフォーマンス
2. **Functions** - サーバーレス関数のログ
3. **Domains** - カスタムドメイン設定

### Supabaseダッシュボード

1. **Database** - クエリパフォーマンス
2. **Auth** - ユーザー管理
3. **Storage** - ファイル使用量
4. **Logs** - APIログ

### アラート設定

#### Vercel
- ビルド失敗通知
- デプロイ完了通知

#### Supabase
- データベース使用量アラート
- APIレート制限アラート

## トラブルシューティング

### ビルドエラー

#### 1. 依存関係エラー
```bash
# package-lock.jsonを削除して再インストール
rm package-lock.json
npm install
```

#### 2. 環境変数エラー
- Vercelダッシュボードで環境変数を確認
- 変数名のタイポをチェック

### 実行時エラー

#### 1. 500エラー
- Vercel Functions ログを確認
- Supabase接続を確認

#### 2. 認証エラー
- Supabase URLとAPIキーを確認
- CORSポリシーを確認

## CI/CDパイプライン

### GitHub Actions設定例

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
```

## ロールバック手順

Vercelでは簡単に以前のデプロイにロールバック可能：

1. Vercelダッシュボードにアクセス
2. Deploymentsタブを開く
3. 安定していた以前のデプロイを選択
4. "Promote to Production"をクリック

## ベストプラクティス

1. **ステージング環境の活用**
   - プレビューデプロイでテスト
   - 本番デプロイ前に確認

2. **段階的ロールアウト**
   - A/Bテストの実施
   - 機能フラグの活用

3. **バックアップ戦略**
   - データベースの定期バックアップ
   - 設定のバージョン管理

4. **パフォーマンス最適化**
   - CDNの活用
   - 画像の最適化
   - キャッシュ戦略