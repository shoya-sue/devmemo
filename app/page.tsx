'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from './contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
            DevMemo
          </h1>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl">
            技術記事を書いて共有しましょう
            <br />
            Write and share technical articles
          </p>
        </div>

        <div className="mt-10">
          {user ? (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    クイックアクション / Quick Actions
                  </h2>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Link
                      href="/posts/new"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      新しい記事を書く
                      <br />
                      Write New Article
                    </Link>
                    <Link
                      href="/posts"
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      記事一覧を見る
                      <br />
                      View Articles
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    使い方のヒント / Usage Tips
                  </h3>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="mr-2">📝</span>
                      Markdownで記事を書くことができます
                      <br />
                      Write articles in Markdown
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">🏷️</span>
                      タグとカテゴリで記事を整理できます
                      <br />
                      Organize articles with tags and categories
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">👀</span>
                      プレビューで記事を確認できます
                      <br />
                      Preview articles before publishing
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                ログインして始める
                <br />
                Sign in to Start
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 