'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { ImageUploader, UploadedPhoto } from '../ImageUploader';
import { CheckboxField, InputField } from './HealthFieldControls';

export interface HealthMediaData {
  images: UploadedPhoto[];
  has_video: boolean;
  video: string;
}

interface StepHealthMediaProps {
  locale: Locale;
  data: HealthMediaData;
  onChange: (updates: Partial<HealthMediaData>) => void;
}

export const StepHealthMedia: React.FC<StepHealthMediaProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.healthBeauty');
  const rtl = isRTL(locale);

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('stepMedia')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('mediaDescription')}</p>
      </div>

      <div>
        <label className={`mb-2 block text-sm font-semibold text-slate-700 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('images')} <span className="text-red-500">*</span>
        </label>
        <ImageUploader
          locale={locale}
          photos={data.images}
          onChange={(images) => onChange({ images })}
          maxPhotos={12}
          folder="listings/health-beauty"
          showSourceButtons
        />
      </div>

      <CheckboxField
        label={t('hasVideo')}
        rtl={rtl}
        checked={data.has_video}
        onChange={(checked) => onChange({ has_video: checked, video: checked ? data.video : '' })}
      />

      {data.has_video && (
        <InputField
          label={t('video')}
          rtl={rtl}
          value={data.video}
          onChange={(value) => onChange({ video: value })}
          placeholder={t('videoPlaceholder')}
        />
      )}
    </div>
  );
};
