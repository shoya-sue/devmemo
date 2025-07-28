# よくある問題と解決方法

最終更新: 2025-07-28

## 開発環境の問題

### npm install でエラーが発生する

**症状**: 依存関係のインストール中にエラー

**解決方法**:
```bash
# キャッシュクリアと再インストール
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 開発サーバーが起動しない

**症状**: `npm run dev` でエラー

**解決方法**:
1. ポート3000が使用中でないか確認
   ```bash
   lsof -i :3000
   kill -9 [PID]
   ```
2. 環境変数ファイルの確認
   ```bash
   ls -la .env.local
   ```

### TypeScriptエラーが大量に出る

**症状**: 型エラーが多数表示される

**解決方法**:
```bash
# TypeScript設定のリセット
rm tsconfig.tsbuildinfo
npx tsc --build --clean
npm run dev
```

## Supabase関連の問題

### 認証エラー: Invalid API key

**症状**: SupabaseのAPIキーエラー

**解決方法**:
1. `.env.local`のAPIキーを確認
2. Supabaseダッシュボードで正しいキーをコピー
3. キーの前後に余分なスペースがないか確認

### データベース接続エラー

**症状**: データベースクエリが失敗する

**解決方法**:
1. Supabaseプロジェクトが稼働中か確認
2. RLSポリシーが適切に設定されているか確認
   ```sql
   -- RLSが有効か確認
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

### ストレージアップロードエラー

**症状**: 画像アップロードが失敗する

**解決方法**:
1. ストレージバケットが存在するか確認
2. バケットのポリシーを確認
   ```sql
   -- Supabase SQLエディタで実行
   INSERT INTO storage.buckets (id, name, public) 
   VALUES ('media', 'media', true)
   ON CONFLICT DO NOTHING;
   ```

## ビルド・デプロイの問題

### ビルドエラー: Module not found

**症状**: モジュールが見つからないエラー

**解決方法**:
```bash
# 依存関係の確認と再インストール
npm list [module-name]
npm install [module-name]
```

### Vercelデプロイエラー

**症状**: デプロイが失敗する

**解決方法**:
1. ローカルでビルドを確認
   ```bash
   npm run build
   ```
2. 環境変数がVercelに設定されているか確認
3. ビルドログを詳細に確認

### 本番環境で500エラー

**症状**: 本番環境でサーバーエラー

**解決方法**:
1. Vercel Functionsログを確認
2. 環境変数の設定を確認
3. Supabaseの接続を確認

## UI/UXの問題

### ダークモードが機能しない

**症状**: テーマ切り替えが効かない

**解決方法**:
```typescript
// ThemeContext.tsxを確認
localStorage.removeItem('theme')
// ページをリロード
```

### Markdownエディタが表示されない

**症状**: エディタコンポーネントが空白

**解決方法**:
1. SSRの問題を回避
   ```typescript
   const MDEditor = dynamic(
     () => import('@uiw/react-md-editor'),
     { ssr: false }
   )
   ```

### レスポンシブデザインが崩れる

**症状**: モバイル表示で要素が重なる

**解決方法**:
1. Tailwindクラスの確認
2. ブラウザのキャッシュをクリア
3. `postcss.config.js`の設定確認

## パフォーマンスの問題

### ページ読み込みが遅い

**症状**: 初回読み込みに時間がかかる

**解決方法**:
1. 画像の最適化
   ```typescript
   import Image from 'next/image'
   // next/imageを使用
   ```
2. 不要な依存関係を削除
3. コード分割の実装

### APIレスポンスが遅い

**症状**: データ取得に時間がかかる

**解決方法**:
1. クエリの最適化
   ```typescript
   // 必要なフィールドのみ選択
   .select('id, title, created_at')
   ```
2. インデックスの追加
3. ページネーションの実装

## セキュリティの問題

### CORS エラー

**症状**: Cross-Origin エラー

**解決方法**:
1. Supabaseダッシュボードで許可するドメインを設定
2. APIルートでCORSヘッダーを設定
   ```typescript
   res.setHeader('Access-Control-Allow-Origin', '*')
   ```

### 認証が維持されない

**症状**: ログイン状態が保持されない

**解決方法**:
1. Cookieの設定を確認
2. ミドルウェアの設定を確認
3. セッション有効期限を確認

## データベースの問題

### マイグレーションエラー

**症状**: SQLマイグレーションが失敗

**解決方法**:
1. 依存関係の順序を確認
2. 既存のオブジェクトとの競合を確認
   ```sql
   -- 既存のテーブルを確認
   \dt
   ```

### RLSポリシーが機能しない

**症状**: 権限エラーが発生

**解決方法**:
```sql
-- ポリシーの確認
SELECT * FROM pg_policies WHERE tablename = 'posts';

-- ポリシーの再作成
DROP POLICY IF EXISTS "policy_name" ON posts;
CREATE POLICY "policy_name" ON posts ...
```

## デバッグのヒント

### ログの活用

```typescript
// 開発環境でのみログ出力
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}
```

### Supabaseクライアントのデバッグ

```typescript
// レスポンスの詳細を確認
const { data, error, status, statusText } = await supabase
  .from('posts')
  .select()

console.log({ error, status, statusText })
```

### ネットワークタブの活用

1. Chrome DevToolsを開く
2. Networkタブで失敗したリクエストを確認
3. レスポンスの詳細を確認

## 問題が解決しない場合

1. **エラーメッセージを詳細に記録**
   - 完全なエラーメッセージ
   - エラーが発生した操作
   - 環境情報（OS、Node.jsバージョン等）

2. **最小限の再現コードを作成**
   - 問題を再現する最小のコード
   - 関連する設定ファイル

3. **コミュニティに質問**
   - GitHubのIssues
   - Supabaseのディスカッション
   - Next.jsのフォーラム

4. **公式ドキュメントの確認**
   - [Next.js Docs](https://nextjs.org/docs)
   - [Supabase Docs](https://supabase.com/docs)
   - [Tailwind CSS Docs](https://tailwindcss.com/docs)