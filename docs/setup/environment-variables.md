# 環境変数設定ガイド

最終更新: 2025-07-28

## 必要な環境変数

DevMemoプロジェクトで必要な環境変数は以下の2つのみです：

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseプロジェクトのURL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabaseの公開APIキー | `eyJhbGc...` |

## 設定方法

### 開発環境

1. プロジェクトルートに`.env.local`ファイルを作成
2. 以下の内容を記入：

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 本番環境（Vercel）

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. Settings → Environment Variables
4. 各環境変数を追加

## セキュリティのベストプラクティス

### ✅ すべきこと

1. **`.env.local`をGitにコミットしない**
   - `.gitignore`に含まれていることを確認
   
2. **環境ごとに異なる値を使用**
   - 開発環境と本番環境で別のSupabaseプロジェクトを使用

3. **定期的なキーのローテーション**
   - セキュリティのため、定期的にAPIキーを更新

### ❌ してはいけないこと

1. **Service Role Keyを公開しない**
   - `NEXT_PUBLIC_`プレフィックスを付けない
   - クライアントサイドで使用しない

2. **ハードコーディング**
   - コード内に直接認証情報を記載しない

3. **公開リポジトリへのコミット**
   - 誤って環境変数をコミットした場合は、即座にキーを再生成

## 環境変数の確認方法

```bash
# 開発環境で環境変数が正しく読み込まれているか確認
npm run dev

# コンソールで確認（開発時のみ）
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

## トラブルシューティング

### 環境変数が読み込まれない

1. **ファイル名を確認**
   - `.env.local`（`.env`ではない）

2. **Next.jsサーバーを再起動**
   ```bash
   # Ctrl+C で停止後
   npm run dev
   ```

3. **NEXT_PUBLIC_プレフィックスを確認**
   - クライアントサイドで使用する変数には必須

### 本番環境で動作しない

1. **Vercelの環境変数を確認**
   - すべての必要な変数が設定されているか
   - 値が正しいか（コピペミスがないか）

2. **再デプロイ**
   - 環境変数を変更後は再デプロイが必要

## 参考情報

- [Next.js環境変数ドキュメント](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel環境変数ドキュメント](https://vercel.com/docs/environment-variables)
- [Supabaseセキュリティベストプラクティス](https://supabase.com/docs/guides/auth/row-level-security)