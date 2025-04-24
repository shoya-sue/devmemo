import '@testing-library/jest-dom';

// モックSupabaseクライアントの設定
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      getSession: jest.fn(),
    },
  }),
  createRouteHandlerClient: () => ({
    auth: {
      exchangeCodeForSession: jest.fn(),
    },
  }),
}));

// Next.jsのルーターのモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
})); 