'use client';

import React, { useState, useEffect } from 'react';
import { Tag } from '@/types/post';
import { getTags, createTag, deleteTag } from '@/lib/api/tags';

export default function TagManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const data = await getTags();
      setTags(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      const tag = await createTag({ name: newTagName });
      setTags([...tags, tag]);
      setNewTagName('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('このタグを削除してもよろしいですか？\nAre you sure you want to delete this tag?')) {
      return;
    }

    try {
      await deleteTag(id);
      setTags(tags.filter(tag => tag.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div>読み込み中... / Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">タグ管理 / Tag Management</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="新しいタグ名 / New tag name"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          追加 / Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
          >
            <span>{tag.name}</span>
            <button
              onClick={() => handleDelete(tag.id)}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        ))}
        {tags.length === 0 && (
          <div className="text-gray-500">
            タグがありません。新しいタグを作成してください。
            <br />
            No tags yet. Create a new tag.
          </div>
        )}
      </div>
    </div>
  );
} 