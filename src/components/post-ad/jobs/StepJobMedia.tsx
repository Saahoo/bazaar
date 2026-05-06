'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { isRTL, Locale } from '@/lib/i18n/config';
import { ImageUploader, UploadedPhoto } from '@/components/post-ad/ImageUploader';

export interface JobMediaData {
  photos: UploadedPhoto[];
}

interface StepJobMediaProps {
  locale: Locale;
  data: JobMediaData;
  onChange: (data: Partial<JobMediaData>) => void;
}

export const StepJobMedia: React.FC<StepJobMediaProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.jobs');
  const rtl = isRTL(locale);

  return (
    <div className="space-y-8">
      <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        {t('mediaUpload')}
      </h3>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <div>
          <h4 className={`text-md font-medium text-slate-800 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('uploadImages')}
          </h4>
          <p className={`text-sm text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('uploadImagesHint')}
          </p>
        </div>

        <ImageUploader
          locale={locale}
          photos={data.photos}
          onChange={(photos) => onChange({ photos })}
          maxPhotos={10}
          folder="listings/jobs"
          showSourceButtons={true}
        />

        <div className={`text-xs text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>
          <p>{t('imageRequirements')}</p>
          <ul className={`list-disc pl-5 mt-1 ${rtl ? 'pr-5 pl-0 text-right' : ''}`}>
            <li>{t('maxFileSize')}</li>
            <li>{t('supportedFormats')}</li>
            <li>{t('recommendedAspectRatio')}</li>
            <li>{t('clearWellLit')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
