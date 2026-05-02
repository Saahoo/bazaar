'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import {
  BabyKidsSubcategory,
  BabyKidsSpecField,
  getBabyKidsSpecsConfig,
  getBabyKidsFieldTranslationKey,
  getBabyKidsOptionTranslationKey,
  CONDITION_OPTIONS,
  AGE_RANGE_OPTIONS,
  GENDER_OPTIONS,
  PRICE_TYPE_OPTIONS,
  DELIVERY_OPTIONS,
  BABY_CLOTHING_TYPE_OPTIONS,
  BABY_CLOTHING_SIZE_OPTIONS,
  MATERIAL_OPTIONS,
  SEASON_OPTIONS,
  KIDS_CLOTHING_TYPE_OPTIONS,
  KIDS_CLOTHING_SIZE_OPTIONS,
  TOY_TYPE_OPTIONS,
  TOY_MATERIAL_OPTIONS,
  GEAR_TYPE_OPTIONS,
  FEEDING_TYPE_OPTIONS,
  STROLLER_TYPE_OPTIONS,
  FURNITURE_TYPE_OPTIONS,
  FURNITURE_MATERIAL_OPTIONS,
  DIAPER_TYPE_OPTIONS,
  DIAPER_SIZE_OPTIONS,
  FOOTWEAR_TYPE_OPTIONS,
  FOOTWEAR_SIZE_OPTIONS,
  FOOTWEAR_MATERIAL_OPTIONS,
  SUPPLY_TYPE_OPTIONS,
  GRADE_LEVEL_OPTIONS,
} from '@/lib/constants/baby-kids-wizard';
import { InputField, SelectField, ToggleField } from './BabyKidsFieldControls';

type BabyKidsSpecsData = {
  subcategory: BabyKidsSubcategory | '';
  condition: string;
  ageRange: string;
  gender: string;
  price: number | '';
  priceType: string;
  deliveryAvailable: string;
  [key: string]: unknown;
};

interface StepBabyKidsSpecsProps {
  locale: Locale;
  data: BabyKidsSpecsData;
  onChange: (updates: Partial<BabyKidsSpecsData>) => void;
}

export const StepBabyKidsSpecs: React.FC<StepBabyKidsSpecsProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.babyKids');
  const rtl = isRTL(locale);
  const subcategory = data.subcategory;

  const getOptionLabel = (option: string) => {
    const key = getBabyKidsOptionTranslationKey(option);
    return t.has(key) ? t(key) : option;
  };

  const getStringValue = (key: string): string => {
    const val = data[key];
    if (val === undefined || val === null) return '';
    return String(val);
  };

  const getBoolValue = (key: string): boolean => {
    const val = data[key];
    return val === true || val === 'true' || val === 'Yes';
  };

  const specConfig = getBabyKidsSpecsConfig(subcategory);

  const createTranslatedOptions = (opts: readonly string[] | string[]) =>
    opts.map(opt => ({
      value: opt,
      label: getOptionLabel(opt),
    }));

  const renderField = (field: BabyKidsSpecField) => {
    const { key, type, required, placeholder } = field;
    const label = t(getBabyKidsFieldTranslationKey(key));

    switch (type) {
      case 'text':
        return (
          <InputField
            key={key}
            label={label}
            required={required}
            rtl={rtl}
            value={getStringValue(key)}
            onChange={(value) => onChange({ [key]: value })}
            placeholder={placeholder}
          />
        );
      case 'number':
        return (
          <InputField
            key={key}
            label={label}
            required={required}
            rtl={rtl}
            value={getStringValue(key)}
            onChange={(value) => onChange({ [key]: value })}
            placeholder={placeholder}
            type="number"
          />
        );
      case 'select':
        return (
          <SelectField
            key={key}
            label={label}
            required={required}
            rtl={rtl}
            value={getStringValue(key)}
            onChange={(value) => onChange({ [key]: value })}
            options={createTranslatedOptions(field.options || [])}
            placeholder={t('selectOption', { defaultValue: 'Select...' })}
          />
        );
      case 'toggle':
        return (
          <ToggleField
            key={key}
            label={label}
            rtl={rtl}
            checked={getBoolValue(key)}
            onChange={(checked) => onChange({ [key]: checked ? 'Yes' : 'No' })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : ''}`}>
          {t('specsHeading')}
        </h2>
        <p className={`text-sm text-slate-500 mt-1 ${rtl ? 'text-right' : ''}`}>
          {t('specsDescription')}
        </p>
      </div>

      {!subcategory ? (
        <div className={`text-center py-8 text-slate-500 ${rtl ? 'text-right' : ''}`}>
          <p>{t('selectSubcategoryFirst')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Common fields rendered explicitly */}
          <SelectField
            label={t(getBabyKidsFieldTranslationKey('condition'))}
            required
            rtl={rtl}
            value={data.condition}
            onChange={(value) => onChange({ condition: value })}
            options={createTranslatedOptions(CONDITION_OPTIONS)}
            placeholder={t('selectOption', { defaultValue: 'Select...' })}
          />

          <SelectField
            label={t(getBabyKidsFieldTranslationKey('ageRange'))}
            required
            rtl={rtl}
            value={data.ageRange}
            onChange={(value) => onChange({ ageRange: value })}
            options={createTranslatedOptions(AGE_RANGE_OPTIONS)}
            placeholder={t('selectOption', { defaultValue: 'Select...' })}
          />

          <SelectField
            label={t(getBabyKidsFieldTranslationKey('gender'))}
            rtl={rtl}
            value={data.gender}
            onChange={(value) => onChange({ gender: value })}
            options={createTranslatedOptions(GENDER_OPTIONS)}
            placeholder={t('selectOption', { defaultValue: 'Select...' })}
          />

          <InputField
            label={t(getBabyKidsFieldTranslationKey('price'))}
            required
            rtl={rtl}
            value={data.price}
            onChange={(value) => onChange({ price: value === '' ? '' : Number(value) || '' })}
            placeholder="0"
            type="number"
          />

          <SelectField
            label={t(getBabyKidsFieldTranslationKey('priceType'))}
            rtl={rtl}
            value={data.priceType}
            onChange={(value) => onChange({ priceType: value })}
            options={createTranslatedOptions(PRICE_TYPE_OPTIONS)}
            placeholder={t('selectOption', { defaultValue: 'Select...' })}
          />

          <SelectField
            label={t(getBabyKidsFieldTranslationKey('deliveryAvailable'))}
            rtl={rtl}
            value={data.deliveryAvailable}
            onChange={(value) => onChange({ deliveryAvailable: value })}
            options={createTranslatedOptions(DELIVERY_OPTIONS)}
            placeholder={t('selectOption', { defaultValue: 'Select...' })}
          />

          {/* Subcategory-specific fields */}
          {subcategory === 'baby-clothing' && (
            <>
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('clothingType'))}
                required
                rtl={rtl}
                value={getStringValue('clothingType')}
                onChange={(value) => onChange({ clothingType: value })}
                options={createTranslatedOptions(BABY_CLOTHING_TYPE_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('size'))}
                required
                rtl={rtl}
                value={getStringValue('size')}
                onChange={(value) => onChange({ size: value })}
                options={createTranslatedOptions(BABY_CLOTHING_SIZE_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('material'))}
                rtl={rtl}
                value={getStringValue('material')}
                onChange={(value) => onChange({ material: value })}
                options={createTranslatedOptions(MATERIAL_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('season'))}
                rtl={rtl}
                value={getStringValue('season')}
                onChange={(value) => onChange({ season: value })}
                options={createTranslatedOptions(SEASON_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <InputField
                label={t(getBabyKidsFieldTranslationKey('brand'))}
                rtl={rtl}
                value={getStringValue('brand')}
                onChange={(value) => onChange({ brand: value })}
                placeholder={t('brandPlaceholder', { defaultValue: "e.g. Carter's, H&M" })}
              />
            </>
          )}

          {subcategory === 'kids-clothing' && (
            <>
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('clothingType'))}
                required
                rtl={rtl}
                value={getStringValue('clothingType')}
                onChange={(value) => onChange({ clothingType: value })}
                options={createTranslatedOptions(KIDS_CLOTHING_TYPE_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('size'))}
                required
                rtl={rtl}
                value={getStringValue('size')}
                onChange={(value) => onChange({ size: value })}
                options={createTranslatedOptions(KIDS_CLOTHING_SIZE_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('material'))}
                rtl={rtl}
                value={getStringValue('material')}
                onChange={(value) => onChange({ material: value })}
                options={createTranslatedOptions(MATERIAL_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('season'))}
                rtl={rtl}
                value={getStringValue('season')}
                onChange={(value) => onChange({ season: value })}
                options={createTranslatedOptions(SEASON_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <InputField
                label={t(getBabyKidsFieldTranslationKey('brand'))}
                rtl={rtl}
                value={getStringValue('brand')}
                onChange={(value) => onChange({ brand: value })}
                placeholder={t('brandPlaceholder', { defaultValue: 'e.g. Zara Kids, Gap Kids' })}
              />
            </>
          )}

          {subcategory === 'toys-games' && (
            <>
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('toyType'))}
                required
                rtl={rtl}
                value={getStringValue('toyType')}
                onChange={(value) => onChange({ toyType: value })}
                options={createTranslatedOptions(TOY_TYPE_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('toyMaterial'))}
                rtl={rtl}
                value={getStringValue('toyMaterial')}
                onChange={(value) => onChange({ toyMaterial: value })}
                options={createTranslatedOptions(TOY_MATERIAL_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <div className="md:col-span-2">
                <ToggleField
                  label={t(getBabyKidsFieldTranslationKey('safetyCertified'))}
                  rtl={rtl}
                  checked={getBoolValue('safetyCertified')}
                  onChange={(checked) => onChange({ safetyCertified: checked ? 'Yes' : 'No' })}
                />
              </div>
              <InputField
                label={t(getBabyKidsFieldTranslationKey('brand'))}
                rtl={rtl}
                value={getStringValue('brand')}
                onChange={(value) => onChange({ brand: value })}
                placeholder={t('brandPlaceholder', { defaultValue: 'e.g. LEGO, Fisher-Price' })}
              />
            </>
          )}

          {subcategory === 'baby-gear' && (
            <>
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('gearType'))}
                required
                rtl={rtl}
                value={getStringValue('gearType')}
                onChange={(value) => onChange({ gearType: value })}
                options={createTranslatedOptions(GEAR_TYPE_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <InputField
                label={t(getBabyKidsFieldTranslationKey('brand'))}
                rtl={rtl}
                value={getStringValue('brand')}
                onChange={(value) => onChange({ brand: value })}
                placeholder={t('brandPlaceholder', { defaultValue: 'e.g. BabyBjörn, Chicco' })}
              />
              <InputField
                label={t(getBabyKidsFieldTranslationKey('features'))}
                rtl={rtl}
                value={getStringValue('features')}
                onChange={(value) => onChange({ features: value })}
                placeholder={t('featuresPlaceholder', { defaultValue: 'e.g. Adjustable, Foldable' })}
              />
            </>
          )}

          {subcategory === 'feeding-nursing' && (
            <>
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('feedingType'))}
                required
                rtl={rtl}
                value={getStringValue('feedingType')}
                onChange={(value) => onChange({ feedingType: value })}
                options={createTranslatedOptions(FEEDING_TYPE_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <InputField
                label={t(getBabyKidsFieldTranslationKey('brand'))}
                rtl={rtl}
                value={getStringValue('brand')}
                onChange={(value) => onChange({ brand: value })}
                placeholder={t('brandPlaceholder', { defaultValue: 'e.g. Philips Avent, Medela' })}
              />
              <div className="md:col-span-2">
                <ToggleField
                  label={t(getBabyKidsFieldTranslationKey('bpaFree'))}
                  rtl={rtl}
                  checked={getBoolValue('bpaFree')}
                  onChange={(checked) => onChange({ bpaFree: checked ? 'Yes' : 'No' })}
                />
              </div>
            </>
          )}

          {subcategory === 'strollers-car-seats' && (
            <>
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('strollerType'))}
                required
                rtl={rtl}
                value={getStringValue('strollerType')}
                onChange={(value) => onChange({ strollerType: value })}
                options={createTranslatedOptions(STROLLER_TYPE_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <InputField
                label={t(getBabyKidsFieldTranslationKey('brand'))}
                rtl={rtl}
                value={getStringValue('brand')}
                onChange={(value) => onChange({ brand: value })}
                placeholder={t('brandPlaceholder', { defaultValue: 'e.g. Bugaboo, Graco' })}
              />
              <div className="md:col-span-2">
                <ToggleField
                  label={t(getBabyKidsFieldTranslationKey('foldable'))}
                  rtl={rtl}
                  checked={getBoolValue('foldable')}
                  onChange={(checked) => onChange({ foldable: checked ? 'Yes' : 'No' })}
                />
              </div>
              <InputField
                label={t(getBabyKidsFieldTranslationKey('weightCapacity'))}
                rtl={rtl}
                value={getStringValue('weightCapacity')}
                onChange={(value) => onChange({ weightCapacity: value })}
                placeholder={t('weightCapacityPlaceholder', { defaultValue: 'e.g. 25' })}
              />
            </>
          )}

          {subcategory === 'nursery-furniture' && (
            <>
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('furnitureType'))}
                required
                rtl={rtl}
                value={getStringValue('furnitureType')}
                onChange={(value) => onChange({ furnitureType: value })}
                options={createTranslatedOptions(FURNITURE_TYPE_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('furnitureMaterial'))}
                rtl={rtl}
                value={getStringValue('furnitureMaterial')}
                onChange={(value) => onChange({ furnitureMaterial: value })}
                options={createTranslatedOptions(FURNITURE_MATERIAL_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <InputField
                label={t(getBabyKidsFieldTranslationKey('brand'))}
                rtl={rtl}
                value={getStringValue('brand')}
                onChange={(value) => onChange({ brand: value })}
                placeholder={t('brandPlaceholder', { defaultValue: 'e.g. IKEA, Delta Children' })}
              />
              <div className="md:col-span-2">
                <ToggleField
                  label={t(getBabyKidsFieldTranslationKey('assemblyRequired'))}
                  rtl={rtl}
                  checked={getBoolValue('assemblyRequired')}
                  onChange={(checked) => onChange({ assemblyRequired: checked ? 'Yes' : 'No' })}
                />
              </div>
            </>
          )}

          {subcategory === 'diapers-hygiene' && (
            <>
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('diaperType'))}
                required
                rtl={rtl}
                value={getStringValue('diaperType')}
                onChange={(value) => onChange({ diaperType: value })}
                options={createTranslatedOptions(DIAPER_TYPE_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('diaperSize'))}
                rtl={rtl}
                value={getStringValue('diaperSize')}
                onChange={(value) => onChange({ diaperSize: value })}
                options={createTranslatedOptions(DIAPER_SIZE_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <InputField
                label={t(getBabyKidsFieldTranslationKey('quantity'))}
                rtl={rtl}
                value={getStringValue('quantity')}
                onChange={(value) => onChange({ quantity: value })}
                placeholder={t('quantityPlaceholder', { defaultValue: 'e.g. 50' })}
                type="number"
              />
              <InputField
                label={t(getBabyKidsFieldTranslationKey('brand'))}
                rtl={rtl}
                value={getStringValue('brand')}
                onChange={(value) => onChange({ brand: value })}
                placeholder={t('brandPlaceholder', { defaultValue: 'e.g. Pampers, Huggies' })}
              />
            </>
          )}

          {subcategory === 'kids-footwear' && (
            <>
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('footwearType'))}
                required
                rtl={rtl}
                value={getStringValue('footwearType')}
                onChange={(value) => onChange({ footwearType: value })}
                options={createTranslatedOptions(FOOTWEAR_TYPE_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('footwearSize'))}
                required
                rtl={rtl}
                value={getStringValue('footwearSize')}
                onChange={(value) => onChange({ footwearSize: value })}
                options={createTranslatedOptions(FOOTWEAR_SIZE_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('footwearMaterial'))}
                rtl={rtl}
                value={getStringValue('footwearMaterial')}
                onChange={(value) => onChange({ footwearMaterial: value })}
                options={createTranslatedOptions(FOOTWEAR_MATERIAL_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <InputField
                label={t(getBabyKidsFieldTranslationKey('brand'))}
                rtl={rtl}
                value={getStringValue('brand')}
                onChange={(value) => onChange({ brand: value })}
                placeholder={t('brandPlaceholder', { defaultValue: 'e.g. Nike Kids, Adidas Kids' })}
              />
            </>
          )}

          {subcategory === 'school-supplies' && (
            <>
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('supplyType'))}
                required
                rtl={rtl}
                value={getStringValue('supplyType')}
                onChange={(value) => onChange({ supplyType: value })}
                options={createTranslatedOptions(SUPPLY_TYPE_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <SelectField
                label={t(getBabyKidsFieldTranslationKey('gradeLevel'))}
                rtl={rtl}
                value={getStringValue('gradeLevel')}
                onChange={(value) => onChange({ gradeLevel: value })}
                options={createTranslatedOptions(GRADE_LEVEL_OPTIONS)}
                placeholder={t('selectOption', { defaultValue: 'Select...' })}
              />
              <InputField
                label={t(getBabyKidsFieldTranslationKey('brand'))}
                rtl={rtl}
                value={getStringValue('brand')}
                onChange={(value) => onChange({ brand: value })}
                placeholder={t('brandPlaceholder', { defaultValue: 'e.g. JanSport, Crayola' })}
              />
            </>
          )}

          {/* Dynamic fallback for any unhandled fields */}
          {specConfig
            .filter(field => {
              const commonKeys = ['condition', 'ageRange', 'gender', 'price', 'priceType', 'deliveryAvailable'];
              const subcategoryKeys = getSubcategoryKeys(subcategory);
              return !commonKeys.includes(field.key) && !subcategoryKeys.includes(field.key);
            })
            .map(renderField)}
        </div>
      )}
    </div>
  );
};

/** Get keys that are already rendered explicitly for a subcategory */
function getSubcategoryKeys(subcategory: BabyKidsSubcategory): string[] {
  switch (subcategory) {
    case 'baby-clothing':
      return ['clothingType', 'size', 'material', 'season', 'brand'];
    case 'kids-clothing':
      return ['clothingType', 'size', 'material', 'season', 'brand'];
    case 'toys-games':
      return ['toyType', 'toyMaterial', 'safetyCertified', 'brand'];
    case 'baby-gear':
      return ['gearType', 'brand', 'features'];
    case 'feeding-nursing':
      return ['feedingType', 'brand', 'bpaFree'];
    case 'strollers-car-seats':
      return ['strollerType', 'brand', 'foldable', 'weightCapacity'];
    case 'nursery-furniture':
      return ['furnitureType', 'furnitureMaterial', 'brand', 'assemblyRequired'];
    case 'diapers-hygiene':
      return ['diaperType', 'diaperSize', 'quantity', 'brand'];
    case 'kids-footwear':
      return ['footwearType', 'footwearSize', 'footwearMaterial', 'brand'];
    case 'school-supplies':
      return ['supplyType', 'gradeLevel', 'brand'];
    default:
      return [];
  }
}
