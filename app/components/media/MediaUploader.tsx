'use client';

import React, { useState, useCallback } from 'react';
import { uploadMedia, Media } from '@/lib/api/media';

interface MediaUploaderProps {
  onUpload: (media: Media) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number; // in bytes
}

export default function MediaUploader({
  onUpload,
  onError,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024 // 5MB default
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    // Validate file size
    if (file.size > maxSize) {
      onError?.(`ファイルサイズが大きすぎます。最大${Math.floor(maxSize / 1024 / 1024)}MBまでです。`);
      return;
    }

    // Validate file type
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      onError?.('対応していないファイル形式です。');
      return;
    }

    try {
      setUploading(true);
      const media = await uploadMedia(file);
      onUpload(media);
    } catch (error: any) {
      onError?.(error.message || 'アップロードに失敗しました。');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        dragActive
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={uploading}
      />

      <div className="space-y-2">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {uploading ? (
            <p>アップロード中...</p>
          ) : (
            <>
              <p>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  クリックして選択
                </span>
                {' '}またはドラッグ＆ドロップ
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                最大{Math.floor(maxSize / 1024 / 1024)}MBまで
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}