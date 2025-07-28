'use client';

import React, { useState } from 'react';
import { Media } from '@/types/media';
import MediaUploader from './MediaUploader';
import MediaGallery from './MediaGallery';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
  title?: string;
}

export default function MediaModal({
  isOpen,
  onClose,
  onSelect,
  title = 'メディアを選択'
}: MediaModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('gallery');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpload = (media: Media) => {
    setError(null);
    onSelect(media);
    onClose();
  };

  const handleSelect = (media: Media) => {
    onSelect(media);
    onClose();
  };

  const handleError = (error: string) => {
    setError(error);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b dark:border-gray-700">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'gallery'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              ギャラリー
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'upload'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              アップロード
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {activeTab === 'upload' && (
              <MediaUploader
                onUpload={handleUpload}
                onError={handleError}
              />
            )}

            {activeTab === 'gallery' && (
              <MediaGallery
                onSelect={handleSelect}
                allowDelete={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}