'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { POPULAR_CITIES } from '@/lib/constants/cities';
import { InputField, SelectField, ToggleField, MultiSelectField } from './ServicesFieldControls';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface StepServicesLocationProps {
  locale: Locale;
  data: {
    city: string;
    area: string;
    service_radius_km: number | '';
    multiple_cities: string[];
    days_available: string[];
    working_hours_from: string;
    working_hours_to: string;
    emergency_service: boolean;
    advance_booking_required: boolean;
  };
  onChange: (updates: Partial<{
    city: string;
    area: string;
    service_radius_km: number | '';
    multiple_cities: string[];
    days_available: string[];
    working_hours_from: string;
    working_hours_to: string;
    emergency_service: boolean;
    advance_booking_required: boolean;
  }>) => void;
}

export const StepServicesLocation: React.FC<StepServicesLocationProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.services');
  const rtl = isRTL(locale);

  const cityOptions = POPULAR_CITIES.map((city) => ({ value: city.name_en, label: locale === 'fa' ? city.name_fa : locale === 'ps' ? city.name_ps : city.name_en }));

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-gradient-to-r from-green-50 via-teal-50 to-cyan-50 p-4 ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('stepLocation')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('locationDescription')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <SelectField
          label={t('city')}
          required
          rtl={rtl}
          value={data.city}
          onChange={(value) => onChange({ city: value })}
          placeholder={t('selectCity')}
          options={cityOptions}
        />

        <InputField
          label={t('area')}
          rtl={rtl}
          value={data.area}
          onChange={(value) => onChange({ area: value })}
          placeholder={t('areaPlaceholder')}
        />

        <InputField
          label={t('serviceRadiusKm')}
          rtl={rtl}
          type="number"
          value={data.service_radius_km}
          onChange={(value) => onChange({ service_radius_km: value ? Number(value) : '' })}
          placeholder={t('radiusPlaceholder')}
        />

        <MultiSelectField
          label={t('multipleCities')}
          rtl={rtl}
          value={data.multiple_cities}
          onChange={(value) => onChange({ multiple_cities: value })}
          options={cityOptions}
        />

        <MultiSelectField
          label={t('daysAvailable')}
          rtl={rtl}
          value={data.days_available}
          onChange={(value) => onChange({ days_available: value })}
          options={DAYS_OF_WEEK.map((day) => {
            const dayKey = `days.${day.toLowerCase()}`;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return { value: day, label: t(dayKey as any) };
          })}
        />

        <div className={`grid grid-cols-2 gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
          <InputField
            label={t('workingHoursFrom')}
            rtl={rtl}
            type="text"
            value={data.working_hours_from}
            onChange={(value) => onChange({ working_hours_from: value })}
            placeholder="09:00"
          />

          <InputField
            label={t('workingHoursTo')}
            rtl={rtl}
            type="text"
            value={data.working_hours_to}
            onChange={(value) => onChange({ working_hours_to: value })}
            placeholder="17:00"
          />
        </div>

        <ToggleField
          label={t('emergencyService')}
          rtl={rtl}
          value={data.emergency_service}
          onChange={(value) => onChange({ emergency_service: value })}
          trueLabel={t('yes')}
          falseLabel={t('no')}
        />

        <ToggleField
          label={t('advanceBookingRequired')}
          rtl={rtl}
          value={data.advance_booking_required}
          onChange={(value) => onChange({ advance_booking_required: value })}
          trueLabel={t('yes')}
          falseLabel={t('no')}
        />
      </div>
    </div>
  );
};
