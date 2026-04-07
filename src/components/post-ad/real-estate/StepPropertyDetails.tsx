'use client';

import React, { useImperativeHandle, forwardRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { isRTL, Locale } from '@/lib/i18n/config';
import { CURRENCIES } from '@/lib/constants/currencies';
import type { PropertyPurpose } from './StepPropertyType';

const propertyDetailsSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.coerce.number().positive(),
  currency: z.string().min(1),
  deposit: z.coerce.number().min(0).optional(),
  areaGross: z.coerce.number().positive().optional(),
  areaNet: z.coerce.number().positive().optional(),
  rooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  kitchenType: z.string().optional(),
  balcony: z.coerce.number().int().min(0).optional(),
  buildingAge: z.string().optional(),
  floor: z.coerce.number().int().min(0).optional(),
  totalFloors: z.coerce.number().int().min(1).optional(),
  lift: z.boolean().optional(),
  carParking: z.boolean().optional(),
  fromWho: z.string().optional(),
});

type PropertyDetailsFormValues = z.infer<typeof propertyDetailsSchema>;

export interface StepPropertyDetailsHandle {
  validate: () => Promise<boolean>;
}

export interface PropertyDetailsData {
  title: string;
  description: string;
  price: number | '';
  currency: string;
  deposit: number | '';
  areaGross: number | '';
  areaNet: number | '';
  rooms: number | '';
  bathrooms: number | '';
  kitchenType: string;
  balcony: number | '';
  buildingAge: string;
  floor: number | '';
  totalFloors: number | '';
  lift: boolean;
  carParking: boolean;
  fromWho: string;
}

interface StepPropertyDetailsProps {
  locale: Locale;
  purpose: PropertyPurpose;
  data: PropertyDetailsData;
  onChange: (data: Partial<PropertyDetailsData>) => void;
}

const KITCHEN_TYPES = ['openKitchen', 'closedKitchen', 'americanKitchen'] as const;
const BUILDING_AGES = ['new', 'age1_5', 'age5_10', 'age10_20', 'age20plus'] as const;
const FROM_WHO = ['owner', 'agent', 'developer'] as const;

export const StepPropertyDetails = forwardRef<StepPropertyDetailsHandle, StepPropertyDetailsProps>(
  ({ locale, purpose, data, onChange }, ref) => {
    const t = useTranslations('postAd.realEstate');
    const tForm = useTranslations('form');
    const tPostAd = useTranslations('postAd');
    const rtl = isRTL(locale);
    const isRent = purpose === 'forRent';

    const {
      register,
      trigger,
      formState: { errors },
      watch,
      setValue,
    } = useForm<PropertyDetailsFormValues>({
      resolver: zodResolver(propertyDetailsSchema),
      defaultValues: {
        title: data.title,
        description: data.description,
        price: data.price === '' ? undefined : data.price,
        currency: data.currency || 'AFN',
        deposit: data.deposit === '' ? undefined : data.deposit,
        areaGross: data.areaGross === '' ? undefined : data.areaGross,
        areaNet: data.areaNet === '' ? undefined : data.areaNet,
        rooms: data.rooms === '' ? undefined : data.rooms,
        bathrooms: data.bathrooms === '' ? undefined : data.bathrooms,
        kitchenType: data.kitchenType || '',
        balcony: data.balcony === '' ? undefined : data.balcony,
        buildingAge: data.buildingAge || '',
        floor: data.floor === '' ? undefined : data.floor,
        totalFloors: data.totalFloors === '' ? undefined : data.totalFloors,
        lift: data.lift,
        carParking: data.carParking,
        fromWho: data.fromWho || '',
      },
      mode: 'onBlur',
    });

    const w = watch();

    useEffect(() => {
      onChange({
        title: w.title || '',
        description: w.description || '',
        price: w.price || '',
        currency: w.currency || 'AFN',
        deposit: w.deposit || '',
        areaGross: w.areaGross || '',
        areaNet: w.areaNet || '',
        rooms: w.rooms ?? '',
        bathrooms: w.bathrooms ?? '',
        kitchenType: w.kitchenType || '',
        balcony: w.balcony ?? '',
        buildingAge: w.buildingAge || '',
        floor: w.floor ?? '',
        totalFloors: w.totalFloors ?? '',
        lift: w.lift ?? false,
        carParking: w.carParking ?? false,
        fromWho: w.fromWho || '',
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      w.title, w.description, w.price, w.currency, w.deposit,
      w.areaGross, w.areaNet, w.rooms, w.bathrooms, w.kitchenType,
      w.balcony, w.buildingAge, w.floor, w.totalFloors, w.lift,
      w.carParking, w.fromWho,
    ]);

    useImperativeHandle(ref, () => ({
      validate: () => trigger(),
    }));

    const inputClass = (hasError: boolean) =>
      `w-full px-4 py-2.5 border rounded-lg transition focus:outline-none focus:ring-2 ${
        hasError
          ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
          : 'border-slate-300 focus:ring-primary-200 focus:border-primary-500'
      } ${rtl ? 'text-right' : 'text-left'}`;

    const labelClass = `block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`;

    return (
      <div className="space-y-6">
        <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('adDetails')}
        </h3>

        {/* Title */}
        <div>
          <label className={labelClass}>
            {tForm('title')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={tPostAd('enterTitle')}
            className={inputClass(!!errors.title)}
            dir={rtl ? 'rtl' : 'ltr'}
            {...register('title')}
          />
          {errors.title && (
            <p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>{tForm('required')}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>
            {tForm('description')} <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            placeholder={tPostAd('enterDescription')}
            className={`${inputClass(!!errors.description)} resize-none`}
            dir={rtl ? 'rtl' : 'ltr'}
            {...register('description')}
          />
          {errors.description && (
            <p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>{tForm('required')}</p>
          )}
        </div>

        {/* Price + Currency */}
        <div>
          <label className={labelClass}>
            {t('price')} <span className="text-red-500">*</span>
          </label>
          <div className={`flex gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
            <input
              type="number"
              min="0"
              placeholder={tPostAd('enterPrice')}
              className={`${inputClass(!!errors.price)} flex-1`}
              dir="ltr"
              {...register('price')}
            />
            <select
              className={`px-3 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 w-28 ${rtl ? 'text-right' : ''}`}
              {...register('currency')}
            >
              {Object.values(CURRENCIES).map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </option>
              ))}
            </select>
          </div>
          {errors.price && (
            <p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>{tForm('required')}</p>
          )}
        </div>

        {/* Deposit (only for rent) */}
        {isRent && (
          <div>
            <label className={labelClass}>{t('deposit')}</label>
            <input
              type="number"
              min="0"
              placeholder={t('enterDeposit')}
              className={inputClass(false)}
              dir="ltr"
              {...register('deposit')}
            />
          </div>
        )}

        <h3 className={`text-lg font-semibold text-slate-900 pt-2 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('moreDetails')}
        </h3>

        {/* Area Gross / Net */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('areaGross')}</label>
            <input
              type="number"
              min="0"
              placeholder={t('enterArea')}
              className={inputClass(false)}
              dir="ltr"
              {...register('areaGross')}
            />
          </div>
          <div>
            <label className={labelClass}>{t('areaNet')}</label>
            <input
              type="number"
              min="0"
              placeholder={t('enterArea')}
              className={inputClass(false)}
              dir="ltr"
              {...register('areaNet')}
            />
          </div>
        </div>

        {/* Rooms / Bathrooms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('rooms')}</label>
            <input
              type="number"
              min="0"
              placeholder={t('enterRooms')}
              className={inputClass(false)}
              dir="ltr"
              {...register('rooms')}
            />
          </div>
          <div>
            <label className={labelClass}>{t('bathrooms')}</label>
            <input
              type="number"
              min="0"
              placeholder={t('enterBathrooms')}
              className={inputClass(false)}
              dir="ltr"
              {...register('bathrooms')}
            />
          </div>
        </div>

        {/* Kitchen Type */}
        <div>
          <label className={labelClass}>{t('kitchenType')}</label>
          <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
            {KITCHEN_TYPES.map((kt) => {
              const isKitchenSelected = w.kitchenType === kt;
              return (
                <button
                  key={kt}
                  type="button"
                  onClick={() => setValue('kitchenType', kt, { shouldValidate: true })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition ${
                    isKitchenSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  {t(kt)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Balcony */}
        <div>
          <label className={labelClass}>{t('balcony')}</label>
          <div className={`flex gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
            {[0, 1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setValue('balcony', n, { shouldValidate: true })}
                className={`w-12 h-10 rounded-lg text-sm font-medium border-2 transition ${
                  w.balcony === n
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Building Age */}
        <div>
          <label className={labelClass}>{t('buildingAge')}</label>
          <select
            className={`${inputClass(false)} bg-white`}
            dir={rtl ? 'rtl' : 'ltr'}
            {...register('buildingAge')}
          >
            <option value="">{t('selectBuildingAge')}</option>
            {BUILDING_AGES.map((age) => (
              <option key={age} value={age}>{t(age)}</option>
            ))}
          </select>
        </div>

        {/* Floor / Total Floors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('floor')}</label>
            <input
              type="number"
              min="0"
              placeholder={t('enterFloor')}
              className={inputClass(false)}
              dir="ltr"
              {...register('floor')}
            />
          </div>
          <div>
            <label className={labelClass}>{t('totalFloors')}</label>
            <input
              type="number"
              min="1"
              placeholder={t('enterTotalFloors')}
              className={inputClass(false)}
              dir="ltr"
              {...register('totalFloors')}
            />
          </div>
        </div>

        {/* Lift + Car Parking */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`flex items-center gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
            <input
              type="checkbox"
              id="lift"
              className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              {...register('lift')}
            />
            <label htmlFor="lift" className="text-sm font-medium text-slate-700 cursor-pointer">
              {t('lift')}
            </label>
          </div>
          <div className={`flex items-center gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
            <input
              type="checkbox"
              id="carParking"
              className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              {...register('carParking')}
            />
            <label htmlFor="carParking" className="text-sm font-medium text-slate-700 cursor-pointer">
              {t('carParking')}
            </label>
          </div>
        </div>

        {/* From Who */}
        <div>
          <label className={labelClass}>{t('fromWho')}</label>
          <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
            {FROM_WHO.map((fw) => {
              const isFromSelected = w.fromWho === fw;
              return (
                <button
                  key={fw}
                  type="button"
                  onClick={() => setValue('fromWho', fw, { shouldValidate: true })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition ${
                    isFromSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  {t(fw)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

StepPropertyDetails.displayName = 'StepPropertyDetails';
