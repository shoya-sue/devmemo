# DevMemo ベストプラクティス

最終更新: 2025-07-28

## コーディング規約

### TypeScript

#### 型定義
- 明示的な型定義を使用する
- `any`型の使用を避ける
- インターフェースは`I`プレフィックスを付けない
- 型エイリアスよりインターフェースを優先

```typescript
// Good
interface User {
  id: string;
  email: string;
  createdAt: Date;
}

// Bad
type User = {
  id: any;
  email: any;
  created_at: any;
}
```

#### 命名規則
- 変数・関数: camelCase
- 定数: UPPER_SNAKE_CASE
- 型・インターフェース: PascalCase
- ファイル名: kebab-case（React コンポーネントは PascalCase）

### React コンポーネント

#### コンポーネント構造
```typescript
// 1. インポート
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. 型定義
interface ComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

// 3. コンポーネント定義
export default function Component({ title, onSubmit }: ComponentProps) {
  // 4. State定義
  const [loading, setLoading] = useState(false);
  
  // 5. Hooks
  const router = useRouter();
  
  // 6. Effect
  useEffect(() => {
    // 副作用
  }, []);
  
  // 7. イベントハンドラ
  const handleSubmit = async () => {
    // 処理
  };
  
  // 8. レンダリング
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

#### Hooks の使用
- カスタムフックは`use`プレフィックスを付ける
- 複雑なロジックはカスタムフックに切り出す
- 条件分岐内でフックを呼ばない

### Supabase 使用規約

#### クライアントの作成
```typescript
// サーバーコンポーネント
import { createClient } from '@/utils/supabase/server';

// クライアントコンポーネント
import { createClient } from '@/utils/supabase/client';
```

#### エラーハンドリング
```typescript
try {
  const { data, error } = await supabase
    .from('posts')
    .select();
    
  if (error) throw error;
  
  return data;
} catch (error) {
  console.error('Error:', error);
  // ユーザーへのフィードバック
  throw new Error('データの取得に失敗しました');
}
```

### セキュリティ

#### 環境変数
- 機密情報は必ず環境変数に格納
- `NEXT_PUBLIC_`プレフィックスはクライアントサイドで使用する変数のみ
- `.env.local`はGitにコミットしない

#### 入力検証
```typescript
// サーバーサイドで必ず検証
if (!title || title.trim().length === 0) {
  throw new Error('タイトルは必須です');
}

if (title.length > 200) {
  throw new Error('タイトルは200文字以内で入力してください');
}
```

#### XSS対策
- ユーザー入力は必ずエスケープ
- `dangerouslySetInnerHTML`の使用を避ける
- Markdownは信頼できるライブラリでサニタイズ

### パフォーマンス

#### 画像最適化
```typescript
import Image from 'next/image';

// Next.js の Image コンポーネントを使用
<Image
  src="/image.jpg"
  alt="説明"
  width={800}
  height={600}
  loading="lazy"
/>
```

#### コード分割
```typescript
// 動的インポートでバンドルサイズを削減
const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  { 
    loading: () => <Skeleton />,
    ssr: false 
  }
);
```

#### データフェッチング
- 必要なフィールドのみ選択
- ページネーションを実装
- 適切なインデックスを使用

```typescript
// 必要なフィールドのみ
const { data } = await supabase
  .from('posts')
  .select('id, title, created_at')
  .range(0, 9); // ページネーション
```

### テスト

#### ユニットテスト
```typescript
describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-01');
    expect(formatDate(date)).toBe('2024年1月1日');
  });
});
```

#### コンポーネントテスト
```typescript
it('should render post title', () => {
  render(<Post title="テストタイトル" />);
  expect(screen.getByText('テストタイトル')).toBeInTheDocument();
});
```

### Git コミット

#### コミットメッセージ
```bash
# 形式: <type>: <subject>

feat: ユーザープロフィール機能を追加
fix: ログイン時のリダイレクトエラーを修正
docs: APIドキュメントを更新
refactor: 認証ロジックをカスタムフックに分離
test: PostEditorコンポーネントのテストを追加
style: コードフォーマットを修正
chore: 依存関係を更新
```

#### ブランチ戦略
```bash
main         # 本番環境
├── develop  # 開発環境
    ├── feature/user-profile    # 機能開発
    ├── fix/login-error        # バグ修正
    └── refactor/auth-logic    # リファクタリング
```

### ドキュメント

#### コードコメント
```typescript
/**
 * 投稿を作成します
 * @param post - 投稿データ
 * @returns 作成された投稿
 * @throws {Error} 認証エラーまたはバリデーションエラー
 */
export async function createPost(post: PostInput): Promise<Post> {
  // 実装
}
```

#### README
- セットアップ手順を明確に
- 環境変数の説明を含める
- トラブルシューティングを記載

### アクセシビリティ

#### セマンティックHTML
```typescript
// Good
<nav aria-label="メインナビゲーション">
  <ul>
    <li><a href="/">ホーム</a></li>
  </ul>
</nav>

// Bad
<div class="nav">
  <div class="nav-item">ホーム</div>
</div>
```

#### ARIA属性
```typescript
<button
  aria-label="メニューを開く"
  aria-expanded={isOpen}
  onClick={toggleMenu}
>
  <MenuIcon />
</button>
```

### 継続的改善

1. **定期的なレビュー**
   - コードレビューの実施
   - パフォーマンス監視
   - セキュリティ監査

2. **アップデート**
   - 依存関係の定期更新
   - セキュリティパッチの適用
   - 新機能の評価

3. **フィードバック**
   - ユーザーフィードバックの収集
   - エラーログの分析
   - 改善提案の実装