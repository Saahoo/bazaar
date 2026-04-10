// src/components/post-ad/ImageUploader.tsx
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Camera, X, Loader2, GripVertical } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';

export interface UploadedPhoto {
  id: string;
  url: string;
  path: string; // Storage path for deletion
}

interface ImageUploaderProps {
  locale: Locale;
  photos: UploadedPhoto[];
  onChange: (photos: UploadedPhoto[]) => void;
  maxPhotos?: number;
  folder?: string; // Storage folder prefix e.g. "listings/draft-123"
  showSourceButtons?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  locale,
  photos,
  onChange,
  maxPhotos = 20,
  folder = 'listings/temp',
  showSourceButtons = false,
}) => {
  const t = useTranslations('form');
  const isRtl = isRTL(locale);
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remaining = maxPhotos - photos.length;

    if (remaining <= 0) {
      setError(t('maxPhotos'));
      return;
    }

    const toUpload = fileArray.slice(0, remaining);
    const invalid = toUpload.filter(
      (f) => !ACCEPTED_TYPES.includes(f.type) || f.size > MAX_FILE_SIZE
    );

    if (invalid.length > 0) {
      setError(
        locale === 'en'
          ? 'Some files were skipped (max 5MB, JPG/PNG/WebP only).'
          : locale === 'ps'
            ? 'ځینې فایلونه پریښودل شول (اعظمي ۵MB, JPG/PNG/WebP).'
            : 'برخی فایل‌ها رد شدند (حداکثر ۵ مگابایت، فقط JPG/PNG/WebP).'
      );
    }

    const valid = toUpload.filter(
      (f) => ACCEPTED_TYPES.includes(f.type) && f.size <= MAX_FILE_SIZE
    );

    if (valid.length === 0) return;

    setUploading(true);
    setError('');

    const newPhotos: UploadedPhoto[] = [];
    const failedCount: number[] = [];

    for (const file of valid) {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${folder}/${id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('listing-photos')
        .upload(path, file, { upsert: false });

      if (uploadError) {
        console.error('Photo upload failed:', uploadError);
        failedCount.push(1);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('listing-photos')
        .getPublicUrl(path);

      newPhotos.push({ id, url: publicUrl, path });
    }

    if (failedCount.length > 0) {
      setError(
        locale === 'en'
          ? `${failedCount.length} photo(s) failed to upload. Please try again.`
          : locale === 'ps'
            ? `${failedCount.length} عکس(ونه) اپلوډ نشول. بیا هڅه وکړئ.`
            : `${failedCount.length} عکس آپلود نشد. لطفاً دوباره تلاش کنید.`
      );
    }

    if (newPhotos.length > 0) {
      onChange([...photos, ...newPhotos]);
    }

    setUploading(false);
  }, [photos, onChange, maxPhotos, folder, supabase, locale, t]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
      e.target.value = ''; // Reset so same file can be re-selected
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removePhoto = async (photo: UploadedPhoto) => {
    // Remove from storage
    await supabase.storage.from('listing-photos').remove([photo.path]);
    // Remove from state
    onChange(photos.filter((p) => p.id !== photo.id));
  };

  const movePhoto = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= photos.length) return;
    const updated = [...photos];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  };

  const cameraLabel = locale === 'en' ? 'Use Camera' : locale === 'ps' ? 'کامره وکاروئ' : 'استفاده از دوربین';
  const galleryLabel = locale === 'en' ? 'Choose from Gallery' : locale === 'ps' ? 'له ګالري وټاکئ' : 'انتخاب از گالری';

  return (
    <div className="space-y-4">
      {showSourceButtons && (
        <div className={`flex flex-col sm:flex-row gap-3 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
          <button
            type="button"
            onClick={() => !uploading && cameraInputRef.current?.click()}
            className="px-4 py-2.5 rounded-lg border border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100 transition text-sm font-medium"
          >
            {cameraLabel}
          </button>
          <button
            type="button"
            onClick={() => !uploading && galleryInputRef.current?.click()}
            className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition text-sm font-medium"
          >
            {galleryLabel}
          </button>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
            aria-label={cameraLabel}
            title={cameraLabel}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            multiple
            onChange={handleFileSelect}
            className="hidden"
            aria-label={galleryLabel}
            title={galleryLabel}
          />
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${dragOver ? 'border-primary-400 bg-primary-50' : 'border-slate-300 hover:border-primary-300 hover:bg-slate-50'}
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          multiple
          onChange={handleFileSelect}
          className="hidden"
          aria-label={galleryLabel}
          title={galleryLabel}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            <p className="text-sm text-primary-600 font-medium">
              {locale === 'en' ? 'Uploading...' : locale === 'ps' ? 'اپلوډ کیږي...' : 'در حال آپلود...'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Camera className="w-10 h-10 text-slate-400" />
            <p className="text-sm font-medium text-slate-700">{t('dragPhotos')}</p>
            <p className="text-xs text-slate-400">
              {t('maxPhotos')} &middot; JPG, PNG, WebP &middot; Max 5MB
            </p>
            <span className="mt-2 px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
              {photos.length}/{maxPhotos} {locale === 'en' ? 'Photos' : locale === 'ps' ? 'عکسونه' : 'عکس‌ها'}
            </span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 ${isRtl ? 'direction-rtl' : ''}`}>
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100"
            >
              <img
                src={photo.url}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Cover badge on first photo */}
              {index === 0 && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-primary-600 text-white text-[10px] font-bold rounded">
                  {locale === 'en' ? 'COVER' : locale === 'ps' ? 'پوښ' : 'کاور'}
                </span>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Move left */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); movePhoto(index, -1); }}
                    className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-slate-700 hover:bg-white"
                    aria-label={locale === 'en' ? 'Move photo' : locale === 'ps' ? 'عکس خوځول' : 'جابجایی عکس'}
                    title={locale === 'en' ? 'Move photo' : locale === 'ps' ? 'عکس خوځول' : 'جابجایی عکس'}
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                  </button>
                )}
                {/* Remove */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removePhoto(photo); }}
                  className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                  aria-label={locale === 'en' ? 'Remove photo' : locale === 'ps' ? 'عکس لرې کول' : 'حذف عکس'}
                  title={locale === 'en' ? 'Remove photo' : locale === 'ps' ? 'عکس لرې کول' : 'حذف عکس'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
