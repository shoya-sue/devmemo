# 開発ドキュメント

DevMemoプロジェクトの開発に関する技術ドキュメントです。

## 📚 開発ドキュメント一覧

### API開発
- **[エンドポイント一覧](./api/endpoints.md)** - 利用可能なAPIエンドポイントの詳細
- **[Supabase API](./api/supabase-api.md)** - Supabase APIの使用方法
- **[実装ガイド](./api/supabase-implementation.md)** - API実装の詳細ガイド

### データベース
- **[スキーマ定義](./database/schema.md)** - データベースのテーブル構造
- **[マイグレーション](./database/migrations/)** - データベースマイグレーションファイル

### 開発ガイドライン
- **[ベストプラクティス](./best-practices.md)** - 開発における推奨事項

## 🔧 開発環境

### 必要なツール
- Node.js 18以上
- npm または yarn
- Git

### 開発コマンド

```bash
# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 型チェック
npm run type-check

# リント
npm run lint

# テスト
npm run test
```

## 🏗️ プロジェクト構造

```
devmemo/
├── app/                 # Next.js App Router
│   ├── api/            # APIルート
│   ├── components/     # 共通コンポーネント
│   └── [pages]/        # 各ページ
├── lib/                # ユーティリティ関数
├── types/              # TypeScript型定義
└── public/             # 静的ファイル
```

## 🔍 コード規約

### TypeScript
- strict modeを有効化
- 明示的な型定義を推奨
- anyの使用は避ける

### React/Next.js
- Server Componentsを優先的に使用
- Client Componentsは必要最小限に
- データフェッチはServer Sideで実行

### スタイリング
- Tailwind CSSを使用
- カスタムCSSは最小限に
- レスポンシブデザインを考慮

## 📝 コミット規約

```
<type>: <subject>

<body>
```

### Type
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: スタイル変更
- `refactor`: リファクタリング
- `test`: テスト
- `chore`: その他

## 🚀 デプロイメント

本番環境へのデプロイについては[デプロイメントガイド](../deployment/)を参照してください。