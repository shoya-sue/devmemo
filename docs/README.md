# DevMemo ドキュメント

DevMemoプロジェクトの包括的なドキュメントです。

## 📂 ドキュメント構成

### 🚀 [セットアップ](./setup/)
プロジェクトの初期設定とインストール手順
- [はじめに](./setup/getting-started.md)
- [Supabaseセットアップ](./setup/supabase-setup.md)
- [環境変数の設定](./setup/environment-variables.md)
- [Supabase概要](./setup/supabase-overview.md)

### 🛠️ [開発](./development/)
開発に関する技術ドキュメント
- [開発ガイド](./development/README.md)
- [ベストプラクティス](./development/best-practices.md)
- [API開発](./development/api/)
- [データベース](./development/database/)

### 🏗️ [アーキテクチャ](./architecture/)
システム設計とアーキテクチャ
- [システム概要](./architecture/overview.md)
- [技術スタック](./architecture/tech-stack.md)

### 🚢 [デプロイメント](./deployment/)
本番環境へのデプロイ手順
- [Vercelデプロイ](./deployment/vercel.md)

### 🔧 [トラブルシューティング](./troubleshooting/)
よくある問題と解決方法
- [よくある問題](./troubleshooting/common-issues.md)

### 📊 [レポート](./reports/)
プロジェクト分析とレポート
- [アーカイブ](./reports/archive/) - 過去の検証レポート

## 🎯 クイックリンク

- **開発を始める**: [セットアップガイド](./setup/getting-started.md)
- **API仕様**: [エンドポイント一覧](./development/api/endpoints.md)
- **データベース設計**: [スキーマ定義](./development/database/schema.md)
- **デプロイ方法**: [Vercelデプロイ](./deployment/vercel.md)

## 🔄 ドキュメント更新ガイドライン

1. **新機能追加時**
   - 関連するドキュメントを必ず更新
   - 実装例を含める

2. **バグ修正時**
   - トラブルシューティングに追記
   - 根本原因と解決策を記載

3. **仕様変更時**
   - 影響範囲のドキュメントを全て更新
   - 変更履歴を明記

## 📝 ドキュメント作成規約

- Markdown形式で記述
- 日本語と英語の併記（重要部分）
- コード例は言語を明記
- 図表を積極的に活用
- 更新日時を記載

## 🏷️ バージョン管理

- ドキュメントもGitで管理
- 重要な変更はPRでレビュー
- タグ付けで版管理

最終更新: 2025-07-28