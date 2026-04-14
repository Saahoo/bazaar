'use client';

import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import { useForm, FieldPath } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Locale, isRTL } from '@/lib/i18n/config';
import type {
  RealEstatePropertyType,
  RealEstateCondition,
  RealEstateKitchenType,
  RoomBathroomType,
  UtilitiesAvailable,
} from './types';

const optionalNumber = z.preprocess((value) => {
  if (value === '' || value === undefined || value === null) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}, z.number().int().nonnegative().optional());

const specsSchema = z.object({
  bedrooms: optionalNumber,
  bathrooms: optionalNumber,
  area_size: optionalNumber,
  floor_number: optionalNumber,
  total_floors: optionalNumber,
  year_built: optionalNumber,
  parking_spaces: optionalNumber,
  balcony: z.boolean().optional(),
  elevator: z.boolean().optional(),
  heating_type: z.string().optional(),
  cooling: z.boolean().optional(),
  kitchen_type: z.string().optional(),
  living_rooms: optionalNumber,
  condition: z.string().optional(),
  commercial_type: z.string().optional(),
  furnished: z.boolean().optional(),
  meeting_rooms: optionalNumber,
  washrooms: optionalNumber,
  reception_area: z.boolean().optional(),
  suitable_for: z.string().optional(),
  land_type: z.string().optional(),
  plot_dimensions: z.string().optional(),
  road_access: z.boolean().optional(),
  corner_plot: z.boolean().optional(),
  zoning_type: z.string().optional(),
  utilities_available: z.array(z.string()).optional(),
  industrial_type: z.string().optional(),
  ceiling_height: z.string().optional(),
  loading_docks: z.string().optional(),
  power_supply: z.string().optional(),
  office_space_included: z.boolean().optional(),
  security_features: z.string().optional(),
  room_type: z.string().optional(),
  number_of_occupants: optionalNumber,
  bathroom_type: z.string().optional(),
  bills_included: z.boolean().optional(),
  gender_preference: z.string().optional(),
  custom_property_type: z.string().optional(),
  custom_specifications: z.string().optional(),
});

type RealEstateSpecsFormValues = z.infer<typeof specsSchema>;

export interface RealEstateSpecsData extends RealEstateSpecsFormValues {}

export interface StepRealEstateSpecsHandle {
  validate: () => Promise<boolean>;
}

interface StepRealEstateSpecsProps {
  locale: Locale;
  propertyType: RealEstatePropertyType;
  data: RealEstateSpecsData;
  onChange: (data: Partial<RealEstateSpecsData>) => void;
}

const CONDITION_OPTIONS: Array<{ key: RealEstateCondition; label: string }> = [
  { key: 'new', label: 'newCondition' },
  { key: 'used', label: 'usedCondition' },
  { key: 'renovated', label: 'renovatedCondition' },
];

const KITCHEN_OPTIONS: Array<{ key: RealEstateKitchenType; label: string }> = [
  { key: 'open', label: 'openKitchenType' },
  { key: 'closed', label: 'closedKitchenType' },
];

const ROOM_TYPE_OPTIONS: Array<{ key: RoomBathroomType; label: string }> = [
  { key: 'private', label: 'privateRoomType' },
  { key: 'shared', label: 'sharedRoomType' },
];

const UTILITIES_OPTIONS: Array<{ key: UtilitiesAvailable; label: string }> = [
  { key: 'water', label: 'waterUtility' },
  { key: 'electricity', label: 'electricityUtility' },
  { key: 'gas', label: 'gasUtility' },
];

export const StepRealEstateSpecs = forwardRef<StepRealEstateSpecsHandle, StepRealEstateSpecsProps>(
  ({ locale, propertyType, data, onChange }, ref) => {
    const rtl = isRTL(locale);
    const t = useTranslations('postAd.realEstate');
    const {
      register,
      watch,
      trigger,
      setValue,
      setError,
      clearErrors,
      formState: { errors },
    } = useForm<RealEstateSpecsFormValues>({
      resolver: zodResolver(specsSchema),
      mode: 'onBlur',
      defaultValues: data,
    });

    const values = watch();

    useEffect(() => {
      onChange({ ...values });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      values.bedrooms,
      values.bathrooms,
      values.area_size,
      values.floor_number,
      values.total_floors,
      values.year_built,
      values.parking_spaces,
      values.balcony,
      values.elevator,
      values.heating_type,
      values.cooling,
      values.kitchen_type,
      values.living_rooms,
      values.condition,
      values.commercial_type,
      values.furnished,
      values.meeting_rooms,
      values.washrooms,
      values.reception_area,
      values.suitable_for,
      values.land_type,
      values.plot_dimensions,
      values.road_access,
      values.corner_plot,
      values.zoning_type,
      values.utilities_available,
      values.industrial_type,
      values.ceiling_height,
      values.loading_docks,
      values.power_supply,
      values.office_space_included,
      values.security_features,
      values.room_type,
      values.number_of_occupants,
      values.bathroom_type,
      values.bills_included,
      values.gender_preference,
      values.custom_property_type,
      values.custom_specifications,
    ]) ;

    useImperativeHandle(ref, () => ({
      validate: async () => {
        const valid = await trigger();
        if (!valid) return false;

        let success = true;
        const requiredChecks: Array<[boolean, string, string]> = [];

        if (!values.area_size) {
          requiredChecks.push([false, 'area_size', t('areaSizeRequired')]);
        }
        if (propertyType === 'apartment' || propertyType === 'house_villa') {
          if (!values.bedrooms && values.bedrooms !== 0) {
            requiredChecks.push([false, 'bedrooms', t('bedroomsRequired')]);
          }
          if (!values.bathrooms && values.bathrooms !== 0) {
            requiredChecks.push([false, 'bathrooms', t('bathroomsRequired')]);
          }
        }
        if (propertyType === 'commercial' || propertyType === 'office' || propertyType === 'shop_retail') {
          if (!values.commercial_type) {
            requiredChecks.push([false, 'commercial_type', t('propertySubtypeRequired')]);
          }
        }
        if (propertyType === 'land_plot') {
          if (!values.land_type) {
            requiredChecks.push([false, 'land_type', t('landTypeRequired')]);
          }
        }
        if (propertyType === 'industrial') {
          if (!values.industrial_type) {
            requiredChecks.push([false, 'industrial_type', t('industrialTypeRequired')]);
          }
        }
        if (propertyType === 'room_shared') {
          if (!values.room_type) {
            requiredChecks.push([false, 'room_type', t('roomTypeRequired')]);
          }
          if (!values.number_of_occupants && values.number_of_occupants !== 0) {
            requiredChecks.push([false, 'number_of_occupants', t('occupantsRequired')]);
          }
          if (!values.bathroom_type) {
            requiredChecks.push([false, 'bathroom_type', t('bathroomTypeRequired')]);
          }
        }
        if (propertyType === 'other') {
          if (!values.custom_property_type?.trim()) {
            requiredChecks.push([false, 'custom_property_type', t('propertyTypeRequired')]);
          }
        }
        if (!values.condition) {
          requiredChecks.push([false, 'condition', t('conditionRequired')]);
        }

        requiredChecks.forEach(([ok, field, message]: [boolean, string, string]) => {
          if (!ok) {
            setError(field as FieldPath<RealEstateSpecsData>, { type: 'manual', message });
            success = false;
          } else {
            clearErrors(field as FieldPath<RealEstateSpecsData>);
          }
        });

        return success;
      },
    }));

    const inputClass = (hasError = false) =>
      `w-full px-4 py-3 border rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${
        hasError ? 'border-red-400 focus:ring-red-200' : 'border-slate-300'
      } ${rtl ? 'text-right' : 'text-left'}`;
    const labelClass = `block text-sm font-semibold text-slate-700 mb-2 ${rtl ? 'text-right' : 'text-left'}`;

    const renderSummary = () => {
      switch (propertyType) {
        case 'apartment':
        case 'house_villa':
          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('bedrooms')}</label>
                  <input type="number" min="0" {...register('bedrooms')} className={inputClass(!!errors.bedrooms)} dir="ltr" />
                  {errors.bedrooms && <p className="mt-1 text-xs text-red-500">{errors.bedrooms.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>{t('bathrooms')}</label>
                  <input type="number" min="0" {...register('bathrooms')} className={inputClass(!!errors.bathrooms)} dir="ltr" />
                  {errors.bathrooms && <p className="mt-1 text-xs text-red-500">{errors.bathrooms.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('areaSize')}</label>
                  <input type="number" min="0" step="0.1" {...register('area_size')} className={inputClass(!!errors.area_size)} dir="ltr" />
                  {errors.area_size && <p className="mt-1 text-xs text-red-500">{errors.area_size.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>{t('livingRooms')}</label>
                  <input type="number" min="0" {...register('living_rooms')} className={inputClass(!!errors.living_rooms)} dir="ltr" />
                  {errors.living_rooms && <p className="mt-1 text-xs text-red-500">{errors.living_rooms.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('floorNumber')}</label>
                  <input type="number" min="0" {...register('floor_number')} className={inputClass(!!errors.floor_number)} dir="ltr" />
                </div>
                <div>
                  <label className={labelClass}>{t('yearBuilt')}</label>
                  <input type="number" min="1800" max="2100" {...register('year_built')} className={inputClass(!!errors.year_built)} dir="ltr" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('parkingSpaces')}</label>
                  <input type="number" min="0" {...register('parking_spaces')} className={inputClass(!!errors.parking_spaces)} dir="ltr" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input type="checkbox" {...register('balcony')} className="w-4 h-4 rounded border-slate-300 text-primary-600" id="re-balcony" />
                  <label htmlFor="re-balcony" className="text-sm text-slate-700">{t('balcony')}</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" {...register('elevator')} className="w-4 h-4 rounded border-slate-300 text-primary-600" id="re-elevator" />
                  <label htmlFor="re-elevator" className="text-sm text-slate-700">{t('elevator')}</label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('heatingTypeLabel')}</label>
                  <input type="text" {...register('heating_type')} className={inputClass(!!errors.heating_type)} dir={rtl ? 'rtl' : 'ltr'} />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" {...register('cooling')} className="w-4 h-4 rounded border-slate-300 text-primary-600" id="re-cooling" />
                  <label htmlFor="re-cooling" className="text-sm text-slate-700">{t('coolingLabel')}</label>
                </div>
              </div>
              <div>
                <label className={labelClass}>{t('kitchenTypeLabel')}</label>
                <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                  {KITCHEN_OPTIONS.map((option) => {
                    const selected = values.kitchen_type === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setValue('kitchen_type', option.key)}
                        className={`px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition ${
                          selected
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                      >
                        {t(option.label)}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className={labelClass}>{t('conditionLabel')}</label>
                <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                  {CONDITION_OPTIONS.map((option) => {
                    const selected = values.condition === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setValue('condition', option.key)}
                        className={`px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition ${
                          selected
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                      >
                        {t(option.label)}
                      </button>
                    );
                  })}
                </div>
                {errors.condition && <p className="mt-1 text-xs text-red-500">{errors.condition.message}</p>}
              </div>
            </>
          );
        case 'commercial':
        case 'office':
        case 'shop_retail':
          return (
            <>
              <div>
                <label className={labelClass}>{t('propertyTypeLabel')}</label>
                <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                  {['office', 'shop', 'showroom'].map((type) => {
                    const selected = values.commercial_type === type;
                    const typeKey = type === 'office' ? 'officeCommercialType' : type === 'shop' ? 'shopCommercialType' : 'showroomCommercialType';
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setValue('commercial_type', type)}
                        className={`px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition ${
                          selected
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                      >
                        {t(typeKey)}
                      </button>
                    );
                  })}
                </div>
                {errors.commercial_type && <p className="mt-1 text-xs text-red-500">{errors.commercial_type.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('areaSizeLabel')}</label>
                  <input type="number" min="0" step="0.1" {...register('area_size')} className={inputClass(!!errors.area_size)} dir="ltr" />
                </div>
                <div>
                  <label className={labelClass}>{t('parkingSpacesLabel')}</label>
                  <input type="number" min="0" {...register('parking_spaces')} className={inputClass(!!errors.parking_spaces)} dir="ltr" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('floorNumberLabel')}</label>
                  <input type="number" min="0" {...register('floor_number')} className={inputClass(!!errors.floor_number)} dir="ltr" />
                </div>
                <div>
                  <label className={labelClass}>{t('totalFloorsLabel')}</label>
                  <input type="number" min="0" {...register('total_floors')} className={inputClass(!!errors.total_floors)} dir="ltr" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('meetingRoomsLabel')}</label>
                  <input type="number" min="0" {...register('meeting_rooms')} className={inputClass(!!errors.meeting_rooms)} dir="ltr" />
                </div>
                <div>
                  <label className={labelClass}>{t('washroomsLabel')}</label>
                  <input type="number" min="0" {...register('washrooms')} className={inputClass(!!errors.washrooms)} dir="ltr" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input type="checkbox" {...register('reception_area')} className="w-4 h-4 rounded border-slate-300 text-primary-600" id="re-reception" />
                  <label htmlFor="re-reception" className="text-sm text-slate-700">{t('receptionAreaLabel')}</label>
                </div>
                <div>
                  <label className={labelClass}>{t('suitableForLabel')}</label>
                  <input type="text" {...register('suitable_for')} className={inputClass(!!errors.suitable_for)} dir={rtl ? 'rtl' : 'ltr'} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" {...register('furnished')} className="w-4 h-4 rounded border-slate-300 text-primary-600" id="re-furnished" />
                <label htmlFor="re-furnished" className="text-sm text-slate-700">{t('furnishedLabel')}</label>
              </div>
              <div>
                <label className={labelClass}>{t('conditionLabel')}</label>
                <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                  {CONDITION_OPTIONS.map((option) => {
                    const selected = values.condition === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setValue('condition', option.key)}
                        className={`px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition ${
                          selected
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                      >
                        {t(option.label)}
                      </button>
                    );
                  })}
                </div>
                {errors.condition && <p className="mt-1 text-xs text-red-500">{errors.condition.message}</p>}
              </div>
            </>
          );
        case 'land_plot':
          return (
            <>
              <div className="grid gap-4">
                <div>
                  <label className={labelClass}>{t('landTypeLabel')}</label>
                  <select {...register('land_type')} className={inputClass(false)} dir={rtl ? 'rtl' : 'ltr'}>
                    <option value="">{t('selectLandShape')}</option>
                    <option value="residential">{t('residentialLandType')}</option>
                    <option value="commercial">{t('commercialLandType')}</option>
                    <option value="agricultural">{t('agriculturalLandType')}</option>
                  </select>
                  {errors.land_type && <p className="mt-1 text-xs text-red-500">{errors.land_type.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>{t('areaSizeLabel')}</label>
                  <input type="number" min="0" step="0.1" {...register('area_size')} className={inputClass(!!errors.area_size)} dir="ltr" />
                </div>
                <div>
                  <label className={labelClass}>{t('plotDimensionsLabel')}</label>
                  <input type="text" {...register('plot_dimensions')} className={inputClass(!!errors.plot_dimensions)} dir={rtl ? 'rtl' : 'ltr'} placeholder="e.g. 50x120 meters" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" {...register('road_access')} className="w-4 h-4 rounded border-slate-300 text-primary-600" id="re-road-access" />
                    <label htmlFor="re-road-access" className="text-sm text-slate-700">{t('roadAccessLabel')}</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" {...register('corner_plot')} className="w-4 h-4 rounded border-slate-300 text-primary-600" id="re-corner-plot" />
                    <label htmlFor="re-corner-plot" className="text-sm text-slate-700">{t('cornerPlotLabel')}</label>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{t('zoningTypeLabel')}</label>
                  <input type="text" {...register('zoning_type')} className={inputClass(!!errors.zoning_type)} dir={rtl ? 'rtl' : 'ltr'} />
                </div>
                <div>
                  <label className={labelClass}>{t('utilitiesAvailableLabel')}</label>
                  <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                    {UTILITIES_OPTIONS.map((item) => {
                      const selected = values.utilities_available?.includes(item.key);
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            const current = values.utilities_available || [];
                            if (current.includes(item.key)) {
                              setValue('utilities_available', current.filter((value) => value !== item.key));
                            } else {
                              setValue('utilities_available', [...current, item.key]);
                            }
                          }}
                          className={`px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition ${
                            selected
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                          }`}
                        >
                          {t(item.label)}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{t('conditionLabel')}</label>
                  <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                    {CONDITION_OPTIONS.map((option) => {
                      const selected = values.condition === option.key;
                      return (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() => setValue('condition', option.key)}
                          className={`px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition ${
                            selected
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                          }`}
                        >
                          {t(option.label)}
                        </button>
                      );
                    })}
                  </div>
                  {errors.condition && <p className="mt-1 text-xs text-red-500">{errors.condition.message}</p>}
                </div>
              </div>
            </>
          );
        case 'industrial':
          return (
            <>
              <div>
                <label className={labelClass}>{t('propertyTypeLabel')}</label>
                <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                  {['warehouse', 'factory'].map((type) => {
                    const selected = values.industrial_type === type;
                    const typeKey = type === 'warehouse' ? 'warehouseIndustrialType' : 'factoryIndustrialType';
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setValue('industrial_type', type)}
                        className={`px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition ${
                          selected
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                      >
                        {t(typeKey)}
                      </button>
                    );
                  })}
                </div>
                {errors.industrial_type && <p className="mt-1 text-xs text-red-500">{errors.industrial_type.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('areaSizeLabel')}</label>
                  <input type="number" min="0" step="0.1" {...register('area_size')} className={inputClass(!!errors.area_size)} dir="ltr" />
                </div>
                <div>
                  <label className={labelClass}>{t('ceilingHeightLabel')}</label>
                  <input type="text" {...register('ceiling_height')} className={inputClass(!!errors.ceiling_height)} dir={rtl ? 'rtl' : 'ltr'} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('loadingDocksLabel')}</label>
                  <input type="text" {...register('loading_docks')} className={inputClass(!!errors.loading_docks)} dir={rtl ? 'rtl' : 'ltr'} />
                </div>
                <div>
                  <label className={labelClass}>{t('powerSupplyLabel')}</label>
                  <input type="text" {...register('power_supply')} className={inputClass(!!errors.power_supply)} dir={rtl ? 'rtl' : 'ltr'} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input type="checkbox" {...register('office_space_included')} className="w-4 h-4 rounded border-slate-300 text-primary-600" id="re-office-space" />
                  <label htmlFor="re-office-space" className="text-sm text-slate-700">{t('officeSpaceIncludedLabel')}</label>
                </div>
                <div>
                  <label className={labelClass}>{t('securityFeaturesLabel')}</label>
                  <input type="text" {...register('security_features')} className={inputClass(!!errors.security_features)} dir={rtl ? 'rtl' : 'ltr'} />
                </div>
              </div>
              <div>
                <label className={labelClass}>{t('conditionLabel')}</label>
                <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                  {CONDITION_OPTIONS.map((option) => {
                    const selected = values.condition === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setValue('condition', option.key)}
                        className={`px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition ${
                          selected
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                      >
                        {t(option.label)}
                      </button>
                    );
                  })}
                </div>
                {errors.condition && <p className="mt-1 text-xs text-red-500">{errors.condition.message}</p>}
              </div>
            </>
          );
        case 'room_shared':
          return (
            <>
              <div>
                <label className={labelClass}>{t('roomTypeLabel')}</label>
                <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                  {ROOM_TYPE_OPTIONS.map((option) => {
                    const selected = values.room_type === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setValue('room_type', option.key)}
                        className={`px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition ${
                          selected
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                      >
                        {t(option.label)}
                      </button>
                    );
                  })}
                </div>
                {errors.room_type && <p className="mt-1 text-xs text-red-500">{errors.room_type.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('occupantsLabel')}</label>
                  <input type="number" min="0" {...register('number_of_occupants')} className={inputClass(!!errors.number_of_occupants)} dir="ltr" />
                  {errors.number_of_occupants && <p className="mt-1 text-xs text-red-500">{errors.number_of_occupants.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>{t('bathroomTypeLabel')}</label>
                  <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                    {ROOM_TYPE_OPTIONS.map((option) => {
                      const selected = values.bathroom_type === option.key;
                      return (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() => setValue('bathroom_type', option.key)}
                          className={`px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition ${
                            selected
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                          }`}
                        >
                          {t(option.label)}
                        </button>
                      );
                    })}
                  </div>
                  {errors.bathroom_type && <p className="mt-1 text-xs text-red-500">{errors.bathroom_type.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('areaSizeLabel')}</label>
                  <input type="number" min="0" step="0.1" {...register('area_size')} className={inputClass(!!errors.area_size)} dir="ltr" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" {...register('furnished')} className="w-4 h-4 rounded border-slate-300 text-primary-600" id="re-furnished-room" />
                  <label htmlFor="re-furnished-room" className="text-sm text-slate-700">{t('furnishedLabel')}</label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input type="checkbox" {...register('bills_included')} className="w-4 h-4 rounded border-slate-300 text-primary-600" id="re-bills-included" />
                  <label htmlFor="re-bills-included" className="text-sm text-slate-700">{t('billsIncludedLabel')}</label>
                </div>
                <div>
                  <label className={labelClass}>{t('genderPreferenceLabel')}</label>
                  <input type="text" {...register('gender_preference')} className={inputClass(!!errors.gender_preference)} dir={rtl ? 'rtl' : 'ltr'} />
                </div>
              </div>
              <div>
                <label className={labelClass}>{t('conditionLabel')}</label>
                <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                  {CONDITION_OPTIONS.map((option) => {
                    const selected = values.condition === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setValue('condition', option.key)}
                        className={`px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition ${
                          selected
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                      >
                        {t(option.label)}
                      </button>
                    );
                  })}
                </div>
                {errors.condition && <p className="mt-1 text-xs text-red-500">{errors.condition.message}</p>}
              </div>
            </>
          );
        case 'other':
          return (
            <>
              <div>
                <label className={labelClass}>{t('customPropertyTypeLabel')}</label>
                <input type="text" {...register('custom_property_type')} className={inputClass(!!errors.custom_property_type)} dir={rtl ? 'rtl' : 'ltr'} placeholder="e.g. Boutique Studio" />
                {errors.custom_property_type && <p className="mt-1 text-xs text-red-500">{errors.custom_property_type.message}</p>}
              </div>
              <div>
                <label className={labelClass}>{t('customSpecificationsLabel')}</label>
                <textarea rows={4} {...register('custom_specifications')} className={`${inputClass} resize-none`} dir={rtl ? 'rtl' : 'ltr'} placeholder="Add custom details or special notes" />
              </div>
              <div>
                <label className={labelClass}>{t('conditionLabel')}</label>
                <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                  {CONDITION_OPTIONS.map((option) => {
                    const selected = values.condition === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setValue('condition', option.key)}
                        className={`px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition ${
                          selected
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                      >
                        {t(option.label)}
                      </button>
                    );
                  })}
                </div>
                {errors.condition && <p className="mt-1 text-xs text-red-500">{errors.condition.message}</p>}
              </div>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div className="space-y-8">
        <div>
          <h3 className={`text-lg font-semibold text-slate-900 mb-4 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('propertySpecifications')}
          </h3>
          <div className="space-y-6">{renderSummary()}</div>
        </div>
      </div>
    );
  }
);

StepRealEstateSpecs.displayName = 'StepRealEstateSpecs';
