'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { isRTL, Locale } from '@/lib/i18n/config';
import { ELECTRONICS_SUBCATEGORIES, ElectronicsSubcategory } from '@/lib/constants/electronics-wizard';

interface StepElectronicsCategoryProps {
  locale: Locale;
  subcategory: ElectronicsSubcategory | '';
  onChange: (subcategory: ElectronicsSubcategory) => void;
}

const SUBCATEGORY_LABEL_KEYS: Record<ElectronicsSubcategory, string> = {
  'phones': 'subcategoryPhones',
  'tablets': 'subcategoryTablets',
  'tv': 'subcategoryTv',
  'laptops': 'subcategoryLaptops',
  'desktops': 'subcategoryDesktops',
  'home-appliances': 'subcategoryHomeAppliances',
  'music-instruments': 'subcategoryMusicInstruments',
  'other-electronics': 'subcategoryOther',
};

export const StepElectronicsCategory: React.FC<StepElectronicsCategoryProps> = ({
  locale,
  subcategory,
  onChange,
}) => {
  const t = useTranslations('postAd.electronics');
  const rtl = isRTL(locale);

  const inputClass =
    `w-full px-4 py-2.5 border border-slate-300 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 bg-white ${rtl ? 'text-right' : 'text-left'}`;

  return (
    <div className="space-y-4 mt-6 pt-6 border-t border-slate-200">
      <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        {t('subcategoryHeading')}
      </h3>

      <div>
        <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('subcategoryLabel')} <span className="text-red-500">*</span>
        </label>
        <select
          value={subcategory}
          onChange={(e) => onChange(e.target.value as ElectronicsSubcategory)}
          className={inputClass}
          dir={rtl ? 'rtl' : 'ltr'}
          aria-label={t('subcategoryLabel')}
          title={t('subcategoryLabel')}
        >
          <option value="">{t('subcategoryPlaceholder')}</option>
          {ELECTRONICS_SUBCATEGORIES.map((option) => (
            <option key={option.value} value={option.value}>
              {t(SUBCATEGORY_LABEL_KEYS[option.value] as Parameters<typeof t>[0])}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
