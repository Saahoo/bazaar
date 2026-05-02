'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { isRTL, Locale } from '@/lib/i18n/config';
import { ImageUploader, UploadedPhoto } from '@/components/post-ad/ImageUploader';

export interface AnimalsMediaData {
  photos: UploadedPhoto[];
  videos?: string[]; // Optional video URLs
}

interface StepAnimalsMediaProps {
  locale: Locale;
  data: AnimalsMediaData;
  onChange: (data: Partial<AnimalsMediaData>) => void;
}

export const StepAnimalsMedia: React.FC<StepAnimalsMediaProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.animals');
  const tForm = useTranslations('form');
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
          maxPhotos={20}
          folder="listings/animals"
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

      {/* Video Upload Section (Optional) */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <div>
          <h4 className={`text-md font-medium text-slate-800 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('uploadVideos')} <span className="text-sm font-normal text-slate-500">({t('optional')})</span>
          </h4>
          <p className={`text-sm text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('uploadVideosHint')}
          </p>
        </div>

        <div className={`border-2 border-dashed border-slate-300 rounded-xl p-8 text-center transition ${
          rtl ? 'text-right' : 'text-left'
        } hover:border-primary-400 hover:bg-primary-50`}>
          <div className="max-w-md mx-auto">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h5 className="font-medium text-slate-800 mb-2">{t('dragDropVideo')}</h5>
            <p className="text-sm text-slate-500 mb-4">{t('videoRequirements')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                className="px-4 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition"
                onClick={() => {
                  // TODO: Implement video upload
                  alert('Video upload functionality would be implemented here');
                }}
              >
                {t('selectVideoFile')}
              </button>
              <button
                type="button"
                className="px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
                onClick={() => {
                  // TODO: Implement YouTube/Vimeo URL input
                  const url = prompt('Enter video URL (YouTube, Vimeo, etc.):');
                  if (url) {
                    const newVideos = [...(data.videos || []), url];
                    onChange({ videos: newVideos });
                  }
                }}
              >
                {t('addVideoLink')}
              </button>
            </div>
          </div>
        </div>

        {/* Display uploaded videos */}
        {data.videos && data.videos.length > 0 && (
          <div className="mt-6">
            <h5 className={`font-medium text-slate-700 mb-3 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('uploadedVideos')} ({data.videos.length})
            </h5>
            <div className="space-y-3">
              {data.videos.map((video, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 border border-slate-200 rounded-lg ${
                    rtl ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`flex items-center gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center">
                      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className={`${rtl ? 'text-right' : 'text-left'}`}>
                      <p className="text-sm font-medium text-slate-800 truncate max-w-xs">
                        {video.includes('youtube') || video.includes('youtu.be')
                          ? t('youtubeVideo')
                          : video.includes('vimeo')
                          ? t('vimeoVideo')
                          : t('videoLink')}
                      </p>
                      <p className="text-xs text-slate-500 truncate max-w-xs">{video}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newVideos = data.videos!.filter((_, i) => i !== index);
                      onChange({ videos: newVideos });
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                    aria-label={tForm('remove')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`text-xs text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>
          <p>{t('videoTips')}</p>
        </div>
      </div>

      {/* Media Tips */}
      <div className="pt-6 border-t border-slate-200">
        <div className={`bg-blue-50 border border-blue-200 rounded-xl p-4 ${rtl ? 'text-right' : 'text-left'}`}>
          <h5 className="font-medium text-blue-800 mb-2">{t('mediaTipsTitle')}</h5>
          <ul className={`space-y-1 text-sm text-blue-700 ${rtl ? 'list-disc pr-5 pl-0' : 'list-disc pl-5'}`}>
            <li>{t('mediaTip1')}</li>
            <li>{t('mediaTip2')}</li>
            <li>{t('mediaTip3')}</li>
            <li>{t('mediaTip4')}</li>
            <li>{t('mediaTip5')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};