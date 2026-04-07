'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { isRTL, Locale } from '@/lib/i18n/config';
import { ImageUploader, UploadedPhoto } from './ImageUploader';

export interface StepPhotosData {
  photos: UploadedPhoto[];
}

interface StepPhotosProps {
  locale: Locale;
  data: StepPhotosData;
  onChange: (data: Partial<StepPhotosData>) => void;
}

export const StepPhotos: React.FC<StepPhotosProps> = ({ locale, data, onChange }) => {
  const tPostAd = useTranslations('postAd');
  const rtl = isRTL(locale);

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        {tPostAd('stepPhotos')}
      </h3>

      <ImageUploader
        locale={locale}
        photos={data.photos}
        onChange={(photos) => onChange({ photos })}
        maxPhotos={20}
        folder="listings/general"
      />
    </div>
  );
};
