'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/types/post';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/api/categories';

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    try {
      const category = await createCategory(newCategory);
      setCategories([...categories, category]);
      setNewCategory({ name: '', description: '' });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('このカテゴリを削除してもよろしいですか？\nAre you sure you want to delete this category?')) {
      return;
    }

    try {
      await deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div>読み込み中... / Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">カテゴリ管理 / Category Management</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            カテゴリ名 / Category Name
          </label>
          <input
            type="text"
            id="name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            説明 / Description
          </label>
          <textarea
            id="description"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          追加 / Add
        </button>
      </form>

      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex justify-between items-center p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-semibold">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-gray-500">{category.description}</p>
              )}
            </div>
            <button
              onClick={() => handleDelete(category.id)}
              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              削除 / Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 