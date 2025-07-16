export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            メール確認
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            登録されたメールアドレスに送信された確認リンクをクリックしてください。
          </p>
        </div>
      </div>
    </div>
  );
}