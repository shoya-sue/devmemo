'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { Media } from '@/lib/api/media';
import MediaUploader from '@/app/components/media/MediaUploader';
import MediaGallery from '@/app/components/media/MediaGallery';

export default function MediaPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            メディア管理にはログインが必要です。
          </p>
        </div>
      </div>
    );
  }

  const handleUpload = (media: Media) => {
    setError(null);
    setRefreshKey(prev => prev + 1);
    setActiveTab('gallery');
  };

  const handleError = (error: string) => {
    setError(error);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          メディア管理 / Media Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          画像やファイルをアップロードし、記事で使用できます。
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'gallery'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          ギャラリー / Gallery
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'upload'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          アップロード / Upload
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          {activeTab === 'upload' && (
            <div className="max-w-2xl mx-auto">
              <MediaUploader
                onUpload={handleUpload}
                onError={handleError}
                maxSize={10 * 1024 * 1024} // 10MB
              />
            </div>
          )}

          {activeTab === 'gallery' && (
            <MediaGallery
              key={refreshKey}
              allowDelete={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}