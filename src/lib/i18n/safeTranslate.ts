// src/lib/i18n/safeTranslate.ts
/**
 * Safe translation and normalization utilities for next-intl.
 *
 * CRITICAL: These utilities prevent MISSING_MESSAGE console spam by:
 * 1. Detecting when keys are not in the selected namespace
 * 2. Preventing raw user data (city names, addresses) from being passed to translators
 * 3. Providing fallback normalization for untranslatable values
 *
 * KEY NAMESPACE MAPPING:
 * - useTranslations('common') → looks for keys in common.* section
 * - useTranslations('postAd.realEstate') → looks for keys in postAd.realEstate.* section
 *
 * EXAMPLE USAGE:
 *   const tRE = useTranslations('postAd.realEstate');
 *   const tCommon = useTranslations('common');
 *   
 *   // ✅ Correct - 'propertyOverview' is in postAd.realEstate
 *   translateSafe(tRE, 'propertyOverview')
 *   
 *   // ❌ Wrong - 'propertyOverview' is NOT in common
 *   translateSafe(tCommon, 'propertyOverview') // Returns undefined
 *
 * @see src/components/listing/ListingDetails.tsx for usage examples
 */

/**
 * Safely attempt to translate a key using a next-intl translator function.
 * Always returns a clean, human-readable string - never undefined.
 *
 * @param translator - The translator function from useTranslations(namespace)
 * @param key - The translation key to look up
 * @returns Translated string, or humanized fallback if translation fails
 */
const humanizeFallback = (key: string): string => {
  const lastPart = key.split('.').pop() ?? key;
  return humanizeToken(lastPart);
};

export const translateSafe = (translator: unknown, key: string): string => {
  try {
    const value = (translator as (key: string) => string)(key);
    if (!value || value === key) return humanizeFallback(key);
    if (typeof value === 'string' && value.includes('MISSING_MESSAGE')) return humanizeFallback(key);
    if (typeof value === 'string' && value.includes('.') && /^[\w.]+$/.test(value)) {
      return humanizeFallback(key);
    }
    return value;
  } catch {
    return humanizeFallback(key);
  }
};

/**
 * Convert Eastern Arabic/Persian digits to Western digits.
 * Handles both Arabic (٠-٩) and Persian (۰-۹) numeric systems.
 *
 * @example
 * normalizeEasternDigits("١٢٣") → "123"
 * normalizeEasternDigits("۱۲۳") → "123"
 */
export const normalizeEasternDigits = (s: string) =>
  s.replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
   .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));

/**
 * Convert camelCase/snake_case identifiers to "Title Case" human-readable format.
 * Used as fallback when translation keys are not found.
 *
 * @example
 * humanizeToken("propertyType") → "Property Type"
 * humanizeToken("area_district") → "Area District"
 */
export const humanizeToken = (token: string): string =>
  token
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (s) => s.toUpperCase());

/**
 * Comprehensive string normalization for safe display of raw user data.
 * Applies multiple transformations:
 * 1. Replaces dashes and underscores with spaces
 * 2. Trims and collapses multiple spaces
 * 3. Converts Eastern digits to Western
 * 4. Title-cases each word
 *
 * Used for displaying untranslatable values like city names, addresses, free-form input.
 *
 * @example
 * normalizeDisplayString("kandahar_afghanistan") → "Kandahar Afghanistan"
 * normalizeDisplayString("  new york  ") → "New York"
 * normalizeDisplayString("١٢٣ Main St") → "123 Main St"
 */
export const normalizeDisplayString = (input: string) => {
  let s = String(input || '');
  s = s.replace(/[-_]/g, ' '); // Replace dashes and underscores with spaces
  s = s.trim().replace(/\s+/g, ' '); // Trim and collapse multiple spaces
  s = normalizeEasternDigits(s);
  s = s.split(' ').map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w)).join(' ');
  return s;
};

/**
 * Smart translation and normalization for option values.
 * 
 * CRITICAL FEATURE: Pattern-matching to distinguish translation keys from raw data
 * - If value looks like a translation key (postAd.realEstate.* or common.*), attempts translation
 * - If value matches identifier pattern (^[a-zA-Z_][a-zA-Z0-9_]*$), tries translation
 * - Raw data with spaces, punctuation, or numbers skips translator and normalizes directly
 *
 * This prevents MISSING_MESSAGE errors when raw city names, addresses, or user input
 * are accidentally passed to the translator.
 *
 * @param tRE - Translator for postAd.realEstate namespace
 * @param tCommon - Translator for common namespace
 * @param value - The value to translate/normalize (can be raw data or translation key)
 * @returns Translated string (if key) or normalized string (if raw data)
 *
 * @example
 * // Translation keys
 * translateOption(tRE, tCommon, 'residential') → "Residential" (if in postAd.realEstate)
 * 
 * // Raw city names (skip translator, normalize for display)
 * translateOption(tRE, tCommon, 'Kandahar afghanistan') → "Kandahar Afghanistan"
 * translateOption(tRE, tCommon, '123 Main Street') → "123 Main Street"
 */
export const translateOption = (
  tRE: unknown,
  tCommon: unknown,
  value: unknown
): string => {
  if (value === null || value === undefined || value === '') return '';
  const raw = String(value);
  const token = raw.trim();

  // Handle explicit namespace prefixes
  if (token.startsWith('postAd.realEstate.')) {
    return translateSafe(tCommon, token) ?? translateSafe(tCommon, token.replace(/^postAd\.realEstate\./, '')) ?? normalizeDisplayString(token.replace(/^postAd\.realEstate\./, ''));
  }
  if (token.startsWith('common.')) {
    return translateSafe(tCommon, token) ?? translateSafe(tCommon, token.replace(/^common\./, '')) ?? normalizeDisplayString(token.replace(/^common\./, ''));
  }

  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
    const trRE = translateSafe(tRE, token);
    if (trRE) return trRE;
    const trCommon = translateSafe(tCommon, token);
    if (trCommon) return trCommon;
    const trREFull = translateSafe(tCommon, `postAd.realEstate.${token}`);
    if (trREFull) return trREFull;
    const trPostAd = translateSafe(tCommon, `postAd.${token}`);
    if (trPostAd) return trPostAd;
  }

  return normalizeDisplayString(token);
};
