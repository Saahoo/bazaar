'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Video } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { ImageUploader, UploadedPhoto } from '../ImageUploader';

export interface MediaData {
  photos: UploadedPhoto[];
  videoUrl: string;
}

interface StepMediaProps {
  locale: Locale;
  data: MediaData;
  onChange: (data: Partial<MediaData>) => void;
}

export const StepMedia: React.FC<StepMediaProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.realEstate');
  const rtl = isRTL(locale);

  const inputClass =
    `w-full px-4 py-2.5 border border-slate-300 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`;

  return (
    <div className="space-y-8">
      {/* Photos */}
      <div>
        <h3 className={`text-lg font-semibold text-slate-900 mb-4 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('photos')}
        </h3>

        <ImageUploader
          locale={locale}
          photos={data.photos}
          onChange={(photos) => onChange({ photos })}
          maxPhotos={20}
          folder="listings/real-estate"
        />
      </div>

      {/* Video */}
      <div>
        <h3 className={`text-lg font-semibold text-slate-900 mb-4 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('video')}
        </h3>
        <div className="relative">
          <input
            type="url"
            value={data.videoUrl}
            onChange={(e) => onChange({ videoUrl: e.target.value })}
            placeholder={t('enterVideoUrl')}
            className={inputClass}
            dir="ltr"
          />
          <Video
            className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
              rtl ? 'left-3' : 'right-3'
            }`}
          />
        </div>
        <p className={`mt-1.5 text-xs text-slate-400 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('videoUrl')}
        </p>
      </div>
    </div>
  );
};
