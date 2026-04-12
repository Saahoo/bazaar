'use client';

import React from 'react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { ImageUploader, UploadedPhoto } from '../ImageUploader';

export interface FashionMediaData {
  images: UploadedPhoto[];
  video: string;
}

interface StepFashionMediaProps {
  locale: Locale;
  data: FashionMediaData;
  onChange: (updates: Partial<FashionMediaData>) => void;
}

export const StepFashionMedia: React.FC<StepFashionMediaProps> = ({ locale, data, onChange }) => {
  const rtl = isRTL(locale);

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">Media Upload</h3>
        <p className="mt-1 text-sm text-slate-600">Upload multiple images and optionally a video URL.</p>
      </div>

      <div>
        <label className={`block text-sm font-semibold text-slate-700 mb-2 ${rtl ? 'text-right' : 'text-left'}`}>
          images <span className="text-red-500">*</span>
        </label>
        <ImageUploader
          locale={locale}
          photos={data.images}
          onChange={(images) => onChange({ images })}
          maxPhotos={12}
          folder="listings/fashion-clothing"
          showSourceButtons
        />
      </div>

      <div>
        <label className={`block text-sm font-semibold text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
          video
        </label>
        <input
          type="url"
          value={data.video}
          onChange={(e) => onChange({ video: e.target.value })}
          placeholder="https://youtube.com/..."
          className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 ${rtl ? 'text-right' : 'text-left'}`}
          dir="ltr"
        />
      </div>
    </div>
  );
};
