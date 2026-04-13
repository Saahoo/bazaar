'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import {
  getElectronicsSpecsConfig,
  ELECTRONICS_SUBCATEGORIES,
  ElectronicsSubcategory,
} from '@/lib/constants/electronics-wizard';
import {
  HOME_FURNITURE_SUBCATEGORIES,
  HomeFurnitureSubcategory,
  getHomeFurnitureSpecsConfig,
} from '@/lib/constants/home-furniture-wizard';

const VEHICLES_CATEGORY = 1;
const REAL_ESTATE_CATEGORY = 2;
const ELECTRONICS_CATEGORY = 3;
const FASHION_CATEGORY = 4;
const SPARE_PARTS_CATEGORY = 5;
const HEALTH_BEAUTY_CATEGORY = 13;

interface ListingAllDetailsProps {
  metadata: Record<string, unknown>;
  locale: Locale;
  categoryId: number;
}

interface DetailEntry {
  keyPath: string;
  value: string;
}

const isElectronicsSubcategory = (value: string): value is ElectronicsSubcategory =>
  ELECTRONICS_SUBCATEGORIES.some((subcategory) => subcategory.value === value);

const isHomeFurnitureSubcategory = (value: string): value is HomeFurnitureSubcategory =>
  HOME_FURNITURE_SUBCATEGORIES.some((subcategory) => subcategory.value === value);

const humanizeToken = (token: string): string =>
  token
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (s) => s.toUpperCase());

const formatArrayValue = (items: unknown[], yesLabel: string, noLabel: string): string =>
  items
    .map((item) => {
      if (item === null || item === undefined) return '';
      if (typeof item === 'boolean') return item ? yesLabel : noLabel;
      if (typeof item === 'string') return item.trim();
      if (typeof item === 'number') return String(item);
      if (typeof item === 'object') {
        const pair = item as { key?: unknown; value?: unknown };
        if (typeof pair.key === 'string' && typeof pair.value === 'string') {
          return `${pair.key}: ${pair.value}`;
        }
        return JSON.stringify(item);
      }
      return String(item);
    })
    .filter(Boolean)
    .join(', ');

const flattenMetadata = (
  source: Record<string, unknown>,
  yesLabel: string,
  noLabel: string,
  parent = ''
): DetailEntry[] => {
  const rows: DetailEntry[] = [];

  Object.entries(source).forEach(([key, rawValue]) => {
    const keyPath = parent ? `${parent}.${key}` : key;

    if (rawValue === null || rawValue === undefined) return;

    if (typeof rawValue === 'string') {
      const trimmed = rawValue.trim();
      if (!trimmed) return;
      rows.push({ keyPath, value: trimmed });
      return;
    }

    if (typeof rawValue === 'number') {
      rows.push({ keyPath, value: String(rawValue) });
      return;
    }

    if (typeof rawValue === 'boolean') {
      rows.push({ keyPath, value: rawValue ? yesLabel : noLabel });
      return;
    }

    if (Array.isArray(rawValue)) {
      if (rawValue.length === 0) return;
      const arrayValue = formatArrayValue(rawValue, yesLabel, noLabel);
      if (!arrayValue) return;
      rows.push({ keyPath, value: arrayValue });
      return;
    }

    const obj = rawValue as Record<string, unknown>;
    if (Object.keys(obj).length === 0) return;

    rows.push(...flattenMetadata(obj, yesLabel, noLabel, keyPath));
  });

  return rows;
};

export const ListingAllDetails: React.FC<ListingAllDetailsProps> = ({ metadata, locale, categoryId }) => {
  const tCommon = useTranslations('common');
  const rtl = isRTL(locale);

  const yesLabel = tCommon('yes');
  const noLabel = tCommon('no');

  const entries = useMemo(
    () => flattenMetadata(metadata, yesLabel, noLabel),
    [metadata, yesLabel, noLabel]
  );

  const dedupedEntries = useMemo(() => {
    const excludedExact = new Set<string>(['wizard_forms']);
    const excludedRoots = new Set<string>();

    if (categoryId === VEHICLES_CATEGORY) {
      [
        'vehicleType', 'year', 'make', 'model', 'engineType', 'wheelDriveType', 'trimLevel',
        'customTrim', 'bodyType', 'gearType', 'engineSize', 'enginePower', 'mileage', 'color',
        'hasDamage', 'exchange', 'hasNumberPlate', 'numberPlateCity', 'handDrive', 'damageDetails',
        'otherOptions', 'wizard_forms',
      ].forEach((k) => excludedExact.add(k));
    } else if (categoryId === REAL_ESTATE_CATEGORY) {
      [
        'propertyType', 'purpose', 'deposit', 'areaGross', 'areaNet', 'rooms', 'bathrooms',
        'kitchenType', 'balcony', 'buildingAge', 'floor', 'totalFloors', 'lift', 'carParking',
        'fromWho', 'district', 'street', 'unit', 'neighborhood', 'wizard_forms',
      ].forEach((k) => excludedExact.add(k));
    } else if (categoryId === ELECTRONICS_CATEGORY) {
      ['subcategory', 'negotiable', 'sellerType', 'contact.phone', 'contact.whatsapp', 'contact.email', 'media.video', 'wizard_forms']
        .forEach((k) => excludedExact.add(k));

      const subcategory = String(metadata.subcategory || '');
      if (isElectronicsSubcategory(subcategory)) {
        getElectronicsSpecsConfig(subcategory).forEach((field) => excludedExact.add(field.id));
      }
    } else if (categoryId === FASHION_CATEGORY) {
      ['subcategory', 'brand', 'condition', 'sellerType', 'location.city', 'location.lat', 'location.lng', 'contact.phone', 'contact.whatsapp', 'contact.email', 'media.video', 'wizard_forms']
        .forEach((k) => excludedExact.add(k));

      Object.entries(metadata).forEach(([key, value]) => {
        if (['subcategory', 'condition', 'brand', 'sellerType', 'location', 'contact', 'media', 'wizard_forms'].includes(key)) return;
        if (value === null || value === undefined) return;
        if (typeof value === 'string' && !value.trim()) return;
        if (Array.isArray(value) && value.length === 0) return;
        excludedRoots.add(key);
      });
    } else if (categoryId === SPARE_PARTS_CATEGORY) {
      Object.keys(metadata).forEach((key) => {
        if (key === 'wizard_forms') return;
        excludedRoots.add(key);
      });
    } else if (categoryId === HEALTH_BEAUTY_CATEGORY) {
      ['subcategory', 'brand', 'condition', 'seller_type', 'location.city', 'location.lat', 'location.lng', 'contact.phone', 'contact.whatsapp', 'contact.email', 'media.video', 'wizard_forms']
        .forEach((k) => excludedExact.add(k));

      Object.entries(metadata).forEach(([key, value]) => {
        if (['subcategory', 'condition', 'brand', 'seller_type', 'location', 'contact', 'media', 'wizard_forms'].includes(key)) return;
        if (value === null || value === undefined) return;
        if (typeof value === 'string' && !value.trim()) return;
        if (Array.isArray(value) && value.length === 0) return;
        excludedRoots.add(key);
      });
    }

    const subcategory = String(metadata.subcategory || '');
    const looksLikeHomeFurniture = isHomeFurnitureSubcategory(subcategory)
      && 'sellerType' in metadata
      && 'location' in metadata;

    if (looksLikeHomeFurniture) {
      [
        'subcategory',
        'brand',
        'condition',
        'sellerType',
        'location.city',
        'location.lat',
        'location.lng',
        'contact.phone',
        'contact.whatsapp',
        'contact.email',
        'media.video',
        'wizard_forms',
      ].forEach((k) => excludedExact.add(k));

      getHomeFurnitureSpecsConfig(subcategory as HomeFurnitureSubcategory)
        .forEach((field) => excludedExact.add(field.key));
    }

    return entries.filter((entry) => {
      if (excludedExact.has(entry.keyPath)) return false;
      const root = entry.keyPath.split('.')[0];
      if (excludedRoots.has(root)) return false;
      return true;
    });
  }, [categoryId, entries, metadata]);

  if (dedupedEntries.length === 0) return null;

  return (
    <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
      <h2 className={`mb-4 text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        {locale === 'en' ? 'All Listing Details' : locale === 'ps' ? 'د اعلان ټول جزیات' : 'تمام جزئیات آگهی'}
      </h2>

      <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
        {dedupedEntries.map((entry) => {
          const label = entry.keyPath
            .split('.')
            .map((token) => humanizeToken(token))
            .join(' > ');

          return (
            <div
              key={entry.keyPath}
              className={`flex items-start justify-between gap-4 border-b border-slate-100 py-2 text-sm last:border-0 ${rtl ? 'flex-row-reverse' : ''}`}
            >
              <span className={`shrink-0 text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>
                {label}
              </span>
              <span className={`font-medium text-slate-800 ${rtl ? 'text-left' : 'text-right'}`}>
                {entry.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
