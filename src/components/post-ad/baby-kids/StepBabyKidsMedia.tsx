'use client';

import React, { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { ImageUploader, UploadedPhoto } from '@/components/post-ad/ImageUploader';

export interface BabyKidsMediaData {
  photos: UploadedPhoto[];
  videos?: string[];
}

interface StepBabyKidsMediaProps {
  locale: Locale;
  data: BabyKidsMediaData;
  onChange: (data: BabyKidsMediaData) => void;
}

export const StepBabyKidsMedia: React.FC<StepBabyKidsMediaProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.babyKids');
  const rtl = isRTL(locale);
  const [videoInput, setVideoInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddVideo = () => {
    const url = videoInput.trim();
    if (url) {
      onChange({
        ...data,
        videos: [...(data.videos || []), url],
      });
      setVideoInput('');
    }
  };

  const handleRemoveVideo = (index: number) => {
    const updated = [...(data.videos || [])];
    updated.splice(index, 1);
    onChange({ ...data, videos: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : ''}`}>
          {t('mediaHeading')}
        </h2>
        <p className={`text-sm text-slate-500 mt-1 ${rtl ? 'text-right' : ''}`}>
          {t('mediaDescription')}
        </p>
      </div>

      <div className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className={`block text-sm font-medium text-slate-700 mb-2 ${rtl ? 'text-right' : ''}`}>
            {t('uploadImages')}
          </label>
          <p className={`text-xs text-slate-500 mb-3 ${rtl ? 'text-right' : ''}`}>
            {t('uploadImagesHint')}
          </p>
          <ImageUploader
            locale={locale}
            photos={data.photos}
            onChange={(photos: UploadedPhoto[]) => onChange({ ...data, photos })}
            maxPhotos={20}
            folder="listings/baby-kids"
          />
          <div className={`mt-3 text-xs text-slate-500 space-y-1 ${rtl ? 'text-right' : ''}`}>
            <p><strong>{t('imageRequirements')}</strong></p>
            <p>• {t('maxFileSize')}</p>
            <p>• {t('supportedFormats')}</p>
            <p>• {t('recommendedAspectRatio')}</p>
            <p>• {t('clearWellLit')}</p>
          </div>
        </div>

        {/* Video Upload */}
        <div>
          <label className={`block text-sm font-medium text-slate-700 mb-2 ${rtl ? 'text-right' : ''}`}>
            {t('uploadVideos')} <span className="text-xs text-slate-400">({t('optional')})</span>
          </label>
          <p className={`text-xs text-slate-500 mb-3 ${rtl ? 'text-right' : ''}`}>
            {t('uploadVideosHint')}
          </p>

          <div className={`flex gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
            <input
              ref={fileInputRef}
              type="text"
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              placeholder={t('videoLink')}
              className={`flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : ''}`}
            />
            <button
              type="button"
              onClick={handleAddVideo}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('addVideoLink')}
            </button>
          </div>

          {data.videos && data.videos.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className={`text-xs font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                {t('uploadedVideos')}:
              </p>
              {data.videos.map((video, index) => (
                <div key={index} className={`flex items-center gap-2 text-sm ${rtl ? 'flex-row-reverse' : ''}`}>
                  <span className="text-blue-600 truncate flex-1">{video}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveVideo(index)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className={`mt-2 text-xs text-slate-400 ${rtl ? 'text-right' : ''}`}>
            {t('videoTips')}
          </p>
        </div>

        {/* Media Tips */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className={`text-sm font-medium text-blue-800 mb-2 ${rtl ? 'text-right' : ''}`}>
            {t('mediaTipsTitle')}
          </h4>
          <ul className={`text-xs text-blue-700 space-y-1 ${rtl ? 'text-right' : ''}`}>
            <li>• {t('mediaTip1')}</li>
            <li>• {t('mediaTip2')}</li>
            <li>• {t('mediaTip3')}</li>
            <li>• {t('mediaTip4')}</li>
            <li>• {t('mediaTip5')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
