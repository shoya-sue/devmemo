import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // セッションの更新
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 保護されたルートの定義
  const protectedRoutes = ['/dashboard', '/profile', '/posts/new'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // 認証が必要なルートへの未認証アクセスをリダイレクト
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 認証済みユーザーが認証ページにアクセスした場合のリダイレクト
  const authRoutes = ['/auth/login', '/auth/signup'];
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return res;
}

// ミドルウェアを適用するパスを指定
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 