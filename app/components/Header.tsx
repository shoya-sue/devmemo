'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                DevMemo
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              aria-label="テーマ切り替え / Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {user ? (
              <>
                <Link
                  href="/posts"
                  className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                >
                  記事一覧 / Posts
                </Link>
                <button
                  onClick={signOut}
                  className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                >
                  ログアウト / Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
              >
                ログイン / Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 