// src/lib/listing/listingFieldUtils.ts
/**
 * Shared utilities for formatting listing field labels and values.
 * Ensures consistency between Listing Wizard forms and ListingDetails page display.
 *
 * These utilities handle:
 * - Namespace-aware label resolution (postAd.realEstate.* vs common.*)
 * - Type-appropriate value formatting (boolean, number, array, currency, etc.)
 * - Safe translation with fallback to humanized tokens
 * - Normalization of raw backend data (city names, addresses, etc.)
 */

import { Locale } from '@/lib/i18n/config';
import { ListingField } from '@/config/listingFields';
import { translateSafe, translateOption, normalizeDisplayString } from '@/lib/i18n/safeTranslate';

type TranslatorFn = (key: string, values?: Record<string, unknown>) => string;

/**
 * Resolve a field label by handling namespace-prefixed keys and fallback logic.
 *
 * Supports three key formats:
 * 1. "postAd.realEstate.someField" → strips prefix, uses tRE translator
 * 2. "common.someField" → strips prefix, uses tCommon translator
 * 3. "someField" → tries tRE first, then tCommon, then humanizes
 *
 * Returns humanized fallback (e.g. "Some Field") if translation not found.
 *
 * @param labelKey - The label key to resolve (may include namespace prefix)
 * @param tRE - Translator for postAd.realEstate namespace
 * @param tCommon - Translator for common namespace
 * @returns Translated label or humanized fallback
 *
 * @example
 * resolveFieldLabel('postAd.realEstate.propertyType', tRE, tCommon)
 * → "Property Type" (from postAd.realEstate.propertyType)
 *
 * resolveFieldLabel('common.location', tRE, tCommon)
 * → "Location" (from common.location)
 *
 * resolveFieldLabel('unknownKey', tRE, tCommon)
 * → "Unknown Key" (humanized fallback)
 */
export const resolveFieldLabel = (
  labelKey: string,
  tRE: TranslatorFn,
  tCommon: TranslatorFn
): string => {
  if (labelKey.startsWith('postAd.realEstate.')) {
    return translateSafe(tCommon, labelKey) ?? translateSafe(tRE, labelKey) ?? translateSafe(tCommon, labelKey.replace(/^postAd\.realEstate\./, '')) ?? normalizeDisplayString(labelKey.replace(/^postAd\.realEstate\./, ''));
  }
  if (labelKey.startsWith('common.')) {
    const subKey = labelKey.replace(/^common\./, '');
    return translateSafe(tCommon, subKey) ?? normalizeDisplayString(subKey);
  }
  return translateSafe(tCommon, labelKey) ?? translateSafe(tRE, labelKey) ?? translateSafe(tCommon, `postAd.realEstate.${labelKey}`) ?? normalizeDisplayString(labelKey);
};

/**
 * Format a raw value using translation and normalization.
 * Basic formatter without field-specific logic.
 *
 * Handles:
 * - Boolean: "Yes"/"No"
 * - Number: string conversion
 * - Array: comma-separated translated items
 * - Other: translateOption (smart translation with pattern-matching)
 *
 * @param value - The value to format
 * @param tRE - Translator for postAd.realEstate namespace
 * @param tCommon - Translator for common namespace
 * @param _locale - Locale (reserved for future use)
 * @param _metadata - Metadata (reserved for future use)
 * @returns Formatted string
 */
export const formatValue = (
  value: unknown,
  tRE: TranslatorFn,
  tCommon: TranslatorFn,
  _locale: Locale,
  _metadata?: Record<string, unknown>
): string => {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return value.toString();
  if (Array.isArray(value)) {
    return value.map((item) => translateOption(tRE, tCommon, item)).filter(Boolean).join(', ');
  }
  return translateOption(tRE, tCommon, value);
};

/**
 * Unified field value formatter with full support for field-specific logic.
 *
 * Flow:
 * 1. If field has custom format function, use it and process the result
 * 2. If result is a translation key (postAd.realEstate.* or common.*), translate it
 * 3. If translation missing, normalize as display string
 * 4. Handle specific types: boolean → Yes/No, number → normalized string, array → comma-separated
 * 5. Fallback: use translateOption for smart key/data detection
 *
 * This is the primary formatter used by ListingDetails for all field values.
 *
 * @param field - The field definition containing type and format function
 * @param value - The raw value to format
 * @param tRE - Translator for postAd.realEstate namespace
 * @param tCommon - Translator for common namespace
 * @param locale - Current locale (passed to format function)
 * @param metadata - Listing metadata (passed to format function and conditions)
 * @returns Formatted string or React.ReactNode
 *
 * @example
 * // Field with custom formatter
 * const field = { type: 'text', format: (v) => v === 'sale' ? 'postAd.realEstate.forSale' : v };
 * formatFieldValueShared(field, 'sale', tRE, tCommon, 'en', {})
 * → "For Sale" (custom format returned key, was translated)
 *
 * // Boolean field
 * const field = { type: 'boolean' };
 * formatFieldValueShared(field, true, tRE, tCommon, 'en', {})
 * → "Yes"
 *
 * // Raw data (city name)
 * const field = { type: 'text' };
 * formatFieldValueShared(field, 'Kandahar afghanistan', tRE, tCommon, 'en', {})
 * → "Kandahar Afghanistan" (normalized, not translated)
 */
export const formatFieldValueShared = (
  field: ListingField,
  value: unknown,
  tRE: TranslatorFn,
  tCommon: TranslatorFn,
  locale: Locale,
  metadata?: Record<string, unknown>
): string | React.ReactNode => {
  if (value === null || value === undefined || value === '') return '';
  if (field.format) {
    const formatted = field.format(value, locale, metadata);
    if (typeof formatted === 'string') {
      if (formatted.startsWith('postAd.realEstate.') || formatted.startsWith('postAd.')) {
        return translateSafe(tCommon, formatted) ?? translateSafe(tRE, formatted) ?? normalizeDisplayString(formatted.replace(/^postAd\./, ''));
      }
      if (formatted.startsWith('common.')) {
        const subKey = formatted.replace(/^common\./, '');
        return translateSafe(tCommon, subKey) ?? translateSafe(tRE, subKey) ?? normalizeDisplayString(subKey);
      }
      return translateSafe(tCommon, formatted) ?? translateSafe(tRE, formatted) ?? normalizeDisplayString(formatted);
    }
    return formatted;
  }
  if (field.type === 'boolean') {
    const yesLabel = translateSafe(tCommon, 'yes') ?? 'Yes';
    const noLabel = translateSafe(tCommon, 'no') ?? 'No';
    return (value as boolean) ? yesLabel : noLabel;
  }
  if (field.type === 'number') return normalizeDisplayString(String(value));
  if (Array.isArray(value)) {
    return value.map((item) => translateOption(tRE, tCommon, item)).filter(Boolean).join(', ');
  }
  return translateOption(tRE, tCommon, value);
};