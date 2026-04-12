'use client';

import React from 'react';
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
  const rtl = isRTL(locale);
  const optionsWithOther = brandOptions.includes('Other') ? brandOptions : [...brandOptions, 'Other'];

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">General Details</h3>
        <p className="mt-1 text-sm text-slate-600">Keep field names aligned with filters: price, condition, brand, sellerType.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="price"
          required
          rtl={rtl}
          value={data.price}
          onChange={(value) => onChange({ price: value ? Number(value) : '' })}
          type="number"
          placeholder="0"
        />

        <SelectField
          label="condition"
          required
          rtl={rtl}
          value={data.condition}
          onChange={(value) => onChange({ condition: value as 'New' | 'Used' | '' })}
          options={['New', 'Used']}
        />

        <SelectField
          label="brand"
          required
          rtl={rtl}
          value={data.brand}
          onChange={(value) => onChange({ brand: value, brandOther: value === 'Other' ? data.brandOther : '' })}
          options={optionsWithOther}
          placeholder="Select brand"
        />

        {data.brand === 'Other' && (
          <InputField
            label="brandOther"
            required
            rtl={rtl}
            value={data.brandOther}
            onChange={(value) => onChange({ brandOther: value })}
            placeholder="Enter brand name"
          />
        )}

        <SelectField
          label="sellerType"
          required
          rtl={rtl}
          value={data.sellerType}
          onChange={(value) => onChange({ sellerType: value as 'Individual' | 'Dealer' | '' })}
          options={['Individual', 'Dealer']}
          placeholder="Select seller type"
        />
      </div>
    </div>
  );
};
