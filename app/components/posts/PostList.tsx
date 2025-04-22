'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { Post, Category, Tag } from '@/types/post';
import { getPosts, deletePost } from '@/lib/api/posts';
import { getCategories } from '@/lib/api/categories';
import { getTags } from '@/lib/api/tags';
import { useDebounce } from '@/lib/hooks/useDebounce';

export default function PostList() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [postsData, categoriesData, tagsData] = await Promise.all([
        getPosts(user.id),
        getCategories(),
        getTags()
      ]);
      setPosts(postsData);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('この記事を削除してもよろしいですか？\nAre you sure you want to delete this post?')) {
      return;
    }

    try {
      await deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = !selectedCategory || post.category?.id === selectedCategory;
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tagId => post.tags?.some(tag => tag.id === tagId));
    const matchesSearch = !debouncedSearchQuery || 
      post.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    return matchesCategory && matchesTags && matchesSearch;
  });

  if (loading) return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              エラーが発生しました / Error occurred
            </h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">記事一覧 / Posts</h1>
        <Link
          href="/posts/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          新規作成 / New Post
        </Link>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              検索 / Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="タイトルや内容で検索 / Search by title or content"
                className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="sm:w-64">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              カテゴリでフィルタ / Filter by Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategorySelect(null)}
                className={`px-3 py-1 rounded ${
                  selectedCategory === null ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                すべて
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`px-3 py-1 rounded ${
                    selectedCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            タグでフィルタ / Filter by Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={`px-3 py-1 rounded ${
                  selectedTags.includes(tag.id) ? 'bg-green-500 text-white' : 'bg-gray-200'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">
                    <Link
                      href={`/posts/${post.id}`}
                      className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <time dateTime={post.created_at} className="flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(post.created_at).toLocaleDateString()}
                    </time>
                    {post.category && (
                      <span className="flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700">
                        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {post.category.name}
                      </span>
                    )}
                    {!post.is_published && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                        下書き / Draft
                      </span>
                    )}
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.map(tag => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        >
                          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    編集 / Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    削除 / Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">記事が見つかりません / No posts found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">新しい記事を作成するか、検索条件を変更してください。</p>
            <div className="mt-6">
              <Link
                href="/posts/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                新しい記事を作成 / Create new post
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 