# API エンドポイント仕様

最終更新: 2025-07-28

## 概要

DevMemoプロジェクトで使用するAPIエンドポイントの仕様書です。

## 認証

すべてのAPIエンドポイントは、Supabaseの認証システムを使用します。認証が必要なエンドポイントでは、リクエストヘッダーに認証トークンを含める必要があります。

## エンドポイント一覧

### カテゴリ管理

#### GET /api/categories
カテゴリ一覧を取得します。

**認証**: 不要

**レスポンス例**:
```json
[
  {
    "id": "uuid",
    "name": "技術",
    "description": "技術関連の記事",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /api/categories
新しいカテゴリを作成します。

**認証**: 必要（管理者のみ）

**リクエストボディ**:
```json
{
  "name": "新しいカテゴリ"
}
```

**レスポンス例**:
```json
{
  "id": "uuid",
  "name": "新しいカテゴリ",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### DELETE /api/categories
カテゴリを削除します。

**認証**: 必要（管理者のみ）

**リクエストボディ**:
```json
{
  "id": "uuid"
}
```

### タグ管理

#### GET /api/tags
タグ一覧を取得します。

**認証**: 不要

**レスポンス例**:
```json
[
  {
    "id": "uuid",
    "name": "JavaScript",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /api/tags
新しいタグを作成します。

**認証**: 必要（管理者のみ）

**リクエストボディ**:
```json
{
  "name": "新しいタグ"
}
```

#### DELETE /api/tags
タグを削除します。

**認証**: 必要（管理者のみ）

**リクエストボディ**:
```json
{
  "id": "uuid"
}
```

### 認証関連

#### GET /auth/callback
OAuth認証のコールバックエンドポイント。

**パラメータ**:
- `code`: 認証コード

**動作**:
- 認証コードをセッションに変換
- ホームページにリダイレクト

## エラーレスポンス

すべてのエンドポイントは、エラー時に以下の形式でレスポンスを返します：

```json
{
  "error": "エラーメッセージ"
}
```

### HTTPステータスコード

- `200 OK`: 成功
- `400 Bad Request`: リクエストが不正
- `401 Unauthorized`: 認証が必要
- `403 Forbidden`: 権限不足
- `500 Internal Server Error`: サーバーエラー

## 使用例

### JavaScriptでの使用例

```javascript
// カテゴリ一覧の取得
const response = await fetch('/api/categories');
const categories = await response.json();

// 新しいタグの作成（認証済みの管理者として）
const response = await fetch('/api/tags', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'React' })
});
const newTag = await response.json();
```

## 今後の拡張予定

- 記事のバージョン管理API
- コメント機能API
- 検索API（全文検索）
- 統計情報API