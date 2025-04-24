# データベースマイグレーション手順 / Database Migration Guide

## マイグレーションファイル / Migration Files

1. `v1_initial_setup.sql`
   - 初期セットアップ
   - 基本テーブルの作成
   - 基本的なRLSポリシーの設定

2. `v2_add_category_relation.sql`
   - カテゴリ機能の拡張
   - カテゴリの説明フィールド追加
   - 記事とカテゴリの関連付け
   - パフォーマンス向上のためのインデックス追加
   - updated_at自動更新機能の追加

3. `v3_add_admin_policies.sql`
   - 管理者ポリシーの追加
   - カテゴリとタグの管理権限設定
   - 管理者確認用関数の追加

## 実行手順 / Execution Steps

### 新規インストール / Fresh Installation

新規インストールの場合は、順番に全てのSQLファイルを実行します：

```bash
# Supabaseのダッシュボードで以下のSQLを順番に実行
1. psql -f v1_initial_setup.sql
2. psql -f v2_add_category_relation.sql
3. psql -f v3_add_admin_policies.sql
```

### 既存のデータベースの更新 / Updating Existing Database

既存のデータベースを更新する場合は、必要なバージョンのみを実行します：

1. 現在のバージョンを確認
2. 未適用のマイグレーションを特定
3. 必要なマイグレーションファイルを順番に実行

## 注意事項 / Precautions

1. **バックアップ**
   - マイグレーション実行前に必ずバックアップを取得してください
   - `pg_dump`コマンドでバックアップを作成できます

2. **実行環境**
   - 開発環境で十分にテストしてから本番環境に適用してください
   - 本番環境での実行は、メンテナンス時間中に行うことを推奨します

3. **エラー発生時**
   - エラーが発生した場合は、バックアップから復旧してください
   - トランザクションログを確認し、エラーの原因を特定してください

## トラブルシューティング / Troubleshooting

1. **権限エラー**
   ```sql
   -- 必要な権限の付与
   GRANT USAGE ON SCHEMA public TO postgres;
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
   ```

2. **既存データの整合性エラー**
   ```sql
   -- NULLを許可する場合
   ALTER TABLE posts ALTER COLUMN category_id DROP NOT NULL;
   ```

3. **インデックス作成エラー**
   - 大量のデータがある場合は、非ピーク時に実行してください
   - `CONCURRENTLY`オプションの使用を検討してください 