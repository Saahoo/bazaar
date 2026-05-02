'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Video, RotateCw, Tag, Check, AlertCircle } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { ImageUploader, UploadedPhoto } from '../ImageUploader';

export interface VehicleMediaData {
  photos: UploadedPhoto[];
  videoUrl: string;
  // Enhanced media features
  has360Spin: boolean;
  vinPhotoIndex: number | null; // Index of photo that shows VIN
  photoTags: Record<number, string[]>; // Map photo index to tags
  // Quality settings
  requireHighResolution: boolean;
  // Best practice flags
  bestPracticesAccepted: boolean;
}

interface StepVehicleMediaProps {
  locale: Locale;
  data: VehicleMediaData;
  onChange: (data: Partial<VehicleMediaData>) => void;
}

export const StepVehicleMedia: React.FC<StepVehicleMediaProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.vehicles');
  const rtl = isRTL(locale);

  const inputClass =
    `w-full px-4 py-2.5 border border-slate-300 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`;

  const toggleSwitchClass = (enabled: boolean) =>
    `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-primary-600' : 'bg-slate-300'}`;


  const handleRemoveTag = (photoIndex: number, tagIndex: number) => {
    const currentTags = data.photoTags[photoIndex] || [];
    const newTags = currentTags.filter((_, idx) => idx !== tagIndex);
    onChange({
      photoTags: {
        ...data.photoTags,
        [photoIndex]: newTags
      }
    });
  };

  const commonTags = ['exterior', 'interior', 'engine', 'dashboard', 'front', 'back', 'side', 'wheel', 'seats', 'odometer'];

  return (
    <div className="space-y-8">
      {/* Photos */}
      <div>
        <h3 className={`text-lg font-semibold text-slate-900 mb-1 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('photos')} <span className="text-red-500">*</span>
        </h3>
        <p className={`text-sm text-slate-500 mb-4 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('photosRequired')}
        </p>

        <ImageUploader
          locale={locale}
          photos={data.photos}
          onChange={(photos) => onChange({ photos })}
          maxPhotos={10}
          folder="listings/vehicles"
        />
      </div>

      {/* Media Enhancements Section */}
      <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
        <h3 className={`text-lg font-semibold text-slate-900 mb-4 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('mediaEnhancements')}
        </h3>

        {/* 360Â° Spin Toggle */}
        <div className={`flex items-center justify-between mb-6 ${rtl ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <RotateCw className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-900">{t('has360Spin')}</h4>
              <p className="text-sm text-slate-500">{t('has360SpinHint')}</p>
            </div>
          </div>
          <button
            type="button"
            className={toggleSwitchClass(data.has360Spin)}
            onClick={() => onChange({ has360Spin: !data.has360Spin })}
            aria-label={t('has360Spin')}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${data.has360Spin ? (rtl ? 'translate-x-[-1.25rem]' : 'translate-x-6') : 'translate-x-1'}`}
            />
          </button>
        </div>

        {/* VIN Photo Selection */}
        {data.photos.length > 0 && (
          <div className="mb-6">
            <h4 className={`font-medium text-slate-900 mb-3 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('vinPhoto')}
            </h4>
            <p className={`text-sm text-slate-500 mb-3 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('vinPhotoHint')}
            </p>
            <div className={`flex flex-wrap gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
              {data.photos.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => onChange({ vinPhotoIndex: data.vinPhotoIndex === index ? null : index })}
                  className={`flex flex-col items-center p-2 border rounded-lg transition ${data.vinPhotoIndex === index ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-slate-400'}`}
                >
                  <div className="w-16 h-16 bg-slate-200 rounded-md overflow-hidden mb-1">
                    <img
                      src={photo.url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {data.vinPhotoIndex === index ? (
                      <span className="text-primary-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> {t('markVinPhoto')}
                      </span>
                    ) : (
                      `Photo ${index + 1}`
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Photo Tags */}
        {data.photos.length > 0 && (
          <div className="mb-6">
            <h4 className={`font-medium text-slate-900 mb-3 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('photoTags')}
            </h4>
            <p className={`text-sm text-slate-500 mb-3 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('addTags')} {t('tagExamples')}
            </p>
            
            {/* Common tags for quick selection */}
            <div className={`flex flex-wrap gap-2 mb-4 ${rtl ? 'flex-row-reverse' : ''}`}>
              {commonTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    // Add tag to all photos
                    const newPhotoTags = { ...data.photoTags };
                    data.photos.forEach((_, idx) => {
                      const currentTags = newPhotoTags[idx] || [];
                      if (!currentTags.includes(tag)) {
                        newPhotoTags[idx] = [...currentTags, tag];
                      }
                    });
                    onChange({ photoTags: newPhotoTags });
                  }}
                  className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                >
                  <Tag className="inline w-3 h-3 mr-1" /> {tag}
                </button>
              ))}
            </div>

            {/* Tags per photo */}
            <div className="space-y-4">
              {data.photos.map((photo, index) => {
                const tags = data.photoTags[index] || [];
                return (
                  <div key={photo.id} className="border border-slate-200 rounded-lg p-4">
                    <div className={`flex items-center gap-3 mb-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 bg-slate-200 rounded-md overflow-hidden">
                        <img
                          src={photo.url}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium">Photo {index + 1}</span>
                    </div>
                    <div className={`flex flex-wrap gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
                      {tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(index, tagIndex)}
                            className="hover:text-primary-900"
                            aria-label={`Remove tag ${tag}`}
                          >
                            Ã—
                          </button>
                        </span>
                      ))}
                      {tags.length === 0 && (
                        <span className="text-sm text-slate-500 italic">
                          No tags added yet
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quality Requirements */}
        <div className={`flex items-center justify-between mb-6 ${rtl ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-900">{t('requireHighResolution')}</h4>
              <p className="text-sm text-slate-500">{t('highResolutionHint')}</p>
            </div>
          </div>
          <button
            type="button"
            className={toggleSwitchClass(data.requireHighResolution)}
            onClick={() => onChange({ requireHighResolution: !data.requireHighResolution })}
            aria-label={t('requireHighResolution')}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${data.requireHighResolution ? (rtl ? 'translate-x-[-1.25rem]' : 'translate-x-6') : 'translate-x-1'}`}
            />
          </button>
        </div>

        {/* Best Practices */}
        <div className="border-t border-slate-200 pt-6">
          <h4 className={`font-medium text-slate-900 mb-3 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('bestPractices')}
          </h4>
          <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 ${rtl ? 'text-right' : 'text-left'}`}>
            <pre className="text-sm text-blue-800 whitespace-pre-wrap font-sans">
              {t('bestPracticesList')}
            </pre>
          </div>
          <div className={`flex items-start gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
            <input
              type="checkbox"
              id="bestPracticesAccepted"
              checked={data.bestPracticesAccepted}
              onChange={(e) => onChange({ bestPracticesAccepted: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-200"
            />
            <label htmlFor="bestPracticesAccepted" className="text-sm text-slate-700">
              {t('bestPracticesAccepted')}
            </label>
          </div>
        </div>
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
          {t('videoHint')}
        </p>
      </div>
    </div>
  );
};
