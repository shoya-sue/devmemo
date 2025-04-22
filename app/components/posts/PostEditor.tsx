'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { Post, Category, Tag } from '@/types/post';
import { createPost, updatePost } from '@/lib/api/posts';
import { getCategories } from '@/lib/api/categories';
import { getTags } from '@/lib/api/tags';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => <div>エディタを読み込み中... / Loading editor...</div>,
});

interface PostEditorProps {
  post?: Post;
  isEdit?: boolean;
}

export default function PostEditor({ post, isEdit = false }: PostEditorProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [isPublished, setIsPublished] = useState(post?.is_published ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categoryId, setCategoryId] = useState(post?.category?.id || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    post?.tags?.map(tag => tag.id) || []
  );
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    loadCategories();
    loadTags();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadTags = async () => {
    try {
      const data = await getTags();
      setTags(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);

      const postData = {
        title,
        content,
        is_published: isPublished,
        user_id: user.id,
        category_id: categoryId || null,
      };

      let savedPost;
      if (isEdit && post) {
        savedPost = await updatePost(post.id, postData);
      } else {
        savedPost = await createPost(postData);
      }

      // タグの関連付けは別途処理が必要

      router.push(`/posts/${savedPost.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          タイトル / Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="記事のタイトルを入力 / Enter article title"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          カテゴリ / Category
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">選択なし / None</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          タグ / Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTags.includes(tag.id)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            内容 / Content
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setPreviewMode('edit')}
              className={`px-3 py-1 rounded-md text-sm ${
                previewMode === 'edit'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              編集 / Edit
            </button>
            <button
              onClick={() => setPreviewMode('preview')}
              className={`px-3 py-1 rounded-md text-sm ${
                previewMode === 'preview'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              プレビュー / Preview
            </button>
          </div>
        </div>

        <div data-color-mode="light" className="dark:hidden">
          {previewMode === 'edit' ? (
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || '')}
              preview="edit"
              height={400}
            />
          ) : (
            <div className="prose max-w-none">
              <MDEditor.Markdown source={content} />
            </div>
          )}
        </div>
        <div data-color-mode="dark" className="hidden dark:block">
          {previewMode === 'edit' ? (
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || '')}
              preview="edit"
              height={400}
            />
          ) : (
            <div className="prose prose-invert max-w-none">
              <MDEditor.Markdown source={content} />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            公開する / Publish
          </label>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            キャンセル / Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? '保存中... / Saving...' : '保存 / Save'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
} 