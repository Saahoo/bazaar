'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { SelectField, InputField } from './FashionFieldControls';

interface StepFashionGeneralDetailsProps {
  locale: Locale;
  data: {
    price: number | '';
    condition: 'New' | 'Used' | '';
    brand: string;
    brandOther: string;
    sellerType: 'Individual' | 'Dealer' | '';
  };
  brandOptions: string[];
  onChange: (updates: Partial<{ price: number | ''; condition: 'New' | 'Used' | ''; brand: string; brandOther: string; sellerType: 'Individual' | 'Dealer' | '' }>) => void;
}

export const StepFashionGeneralDetails: React.FC<StepFashionGeneralDetailsProps> = ({ locale, data, brandOptions, onChange }) => {
  const t = useTranslations('postAd.fashion');
  const rtl = isRTL(locale);
  const optionsWithOther = brandOptions.includes('Other') ? brandOptions : [...brandOptions, 'Other'];

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('generalHeading')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('generalDescription')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label={t('price')}
          required
          rtl={rtl}
          value={data.price}
          onChange={(value) => onChange({ price: value ? Number(value) : '' })}
          type="number"
          placeholder={t('pricePlaceholder')}
        />

        <SelectField
          label={t('condition')}
          required
          rtl={rtl}
          value={data.condition}
          onChange={(value) => onChange({ condition: value as 'New' | 'Used' | '' })}
          options={[
            { value: 'New', label: t('optionLabels.new') },
            { value: 'Used', label: t('optionLabels.used') },
          ]}
        />

        <SelectField
          label={t('brand')}
          required
          rtl={rtl}
          value={data.brand}
          onChange={(value) => onChange({ brand: value, brandOther: value === 'Other' ? data.brandOther : '' })}
          options={optionsWithOther.map((option) => ({
            value: option,
            label: t.has(`optionLabels.${option.toLowerCase().replace(/&/g, 'and').replace(/\+/g, 'plus').replace(/\//g, '_').replace(/[()]/g, '').replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}` as Parameters<typeof t>[0])
              ? t(`optionLabels.${option.toLowerCase().replace(/&/g, 'and').replace(/\+/g, 'plus').replace(/\//g, '_').replace(/[()]/g, '').replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}` as Parameters<typeof t>[0])
              : option,
          }))}
          placeholder={t('brandPlaceholder')}
        />

        {data.brand === 'Other' && (
          <InputField
            label={t('fields.brandOther')}
            required
            rtl={rtl}
            value={data.brandOther}
            onChange={(value) => onChange({ brandOther: value })}
            placeholder={t('brandOtherPlaceholder')}
          />
        )}

        <SelectField
          label={t('sellerType')}
          required
          rtl={rtl}
          value={data.sellerType}
          onChange={(value) => onChange({ sellerType: value as 'Individual' | 'Dealer' | '' })}
          options={[
            { value: 'Individual', label: t('sellerTypeIndividual') },
            { value: 'Dealer', label: t('sellerTypeDealer') },
          ]}
          placeholder={t('sellerTypePlaceholder')}
        />
      </div>
    </div>
  );
};
