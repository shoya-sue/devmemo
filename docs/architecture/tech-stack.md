# 技術スタック詳細

最終更新: 2025-07-28

## フロントエンド技術

### Core Framework
| 技術 | バージョン | 用途 |
|------|------------|------|
| Next.js | 14.1.3 | メインフレームワーク（App Router） |
| React | 18.2.0 | UIライブラリ |
| TypeScript | 5.4.3 | 型安全性の確保 |

### スタイリング
| 技術 | バージョン | 用途 |
|------|------------|------|
| Tailwind CSS | 3.4.1 | ユーティリティファーストCSS |
| @tailwindcss/typography | 0.5.16 | マークダウンコンテンツのスタイリング |
| @tailwindcss/forms | 0.5.10 | フォーム要素のスタイリング |

### エディタ・コンテンツ
| 技術 | バージョン | 用途 |
|------|------------|------|
| @uiw/react-md-editor | 4.0.7 | Markdownエディタ |
| @uiw/react-markdown-preview | 5.1.4 | Markdownプレビュー |
| react-markdown | 10.1.0 | Markdownレンダリング |
| remark-gfm | 4.0.1 | GitHub Flavored Markdown |

## バックエンド技術

### Supabase統合
| 技術 | バージョン | 用途 |
|------|------------|------|
| @supabase/supabase-js | 2.49.4 | Supabaseクライアント |
| @supabase/ssr | 0.6.1 | SSR対応 |
| @supabase/auth-helpers-nextjs | 0.10.0 | Next.js認証ヘルパー |

### データベース
- **PostgreSQL** (Supabase managed)
- **Row Level Security (RLS)** - データアクセス制御
- **pg_trgm** - 全文検索拡張
- **uuid-ossp** - UUID生成

## 開発ツール

### ビルドツール
| 技術 | バージョン | 用途 |
|------|------------|------|
| PostCSS | 8.4.38 | CSSトランスパイル |
| Autoprefixer | 10.4.19 | ベンダープレフィックス自動付与 |

### 品質管理
| 技術 | バージョン | 用途 |
|------|------------|------|
| ESLint | 9.25.1 | コード品質チェック |
| Prettier | 3.5.3 | コードフォーマッター |
| TypeScript ESLint | 8.31.0 | TypeScript用リンター |

## 技術選定の理由

### Next.js 14 (App Router)
- **選定理由**
  - サーバーコンポーネントによるパフォーマンス向上
  - ビルトインのルーティングシステム
  - 優れたDXとTypeScriptサポート
  - Vercelとの完璧な統合

### Supabase
- **選定理由**
  - オープンソースで透明性が高い
  - PostgreSQLベースで信頼性が高い
  - リアルタイム機能の標準搭載
  - 優れた開発者体験

### Tailwind CSS
- **選定理由**
  - 高速な開発サイクル
  - 一貫性のあるデザインシステム
  - パフォーマンスの最適化
  - レスポンシブデザインの簡潔な実装

## 技術的制約事項

### 現在の制限
1. **画像アップロード**
   - ファイルサイズ制限: 5MB/ファイル
   - ストレージ容量: 100MB/ユーザー

2. **データベース**
   - 同時接続数の制限（Supabaseプランに依存）
   - クエリタイムアウト: 60秒

### 非推奨の依存関係
- `@prisma/client` - Supabase使用のため不要（削除予定）

## アップグレード計画

### 短期計画（3ヶ月）
- Next.js 15へのアップグレード検討
- 依存関係の定期的な更新
- パフォーマンス最適化

### 中期計画（6ヶ月）
- Edge Functionsの活用
- WebAssemblyの導入検討
- Progressive Web App (PWA)化

### 長期計画（1年）
- マイクロフロントエンドの検討
- GraphQL APIの追加
- AI/ML機能の統合