/**
 * Locale-specific formatting utilities for dates, numbers, and currencies
 */

export type Locale = 'en' | 'ps' | 'fa';

/**
 * Get the Intl locale code for a given application locale
 */
export const getIntlLocale = (locale: Locale): string => {
  switch (locale) {
    case 'en':
      return 'en-US';
    case 'fa':
      return 'fa-IR';
    case 'ps':
      return 'ps-AF';
    default:
      return 'en-US';
  }
};

/**
 * Format a number with locale-specific thousands separators
 */
export const formatNumber = (value: number, locale: Locale): string => {
  return value.toLocaleString(getIntlLocale(locale));
};

/**
 * Format a currency amount with locale-specific formatting
 */
export const formatCurrency = (
  amount: number,
  currencyCode: string,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string => {
  const formatter = new Intl.NumberFormat(getIntlLocale(locale), {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  });
  return formatter.format(amount);
};

/**
 * Format a date with locale-specific formatting
 */
export const formatDate = (
  date: Date | string,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Default options for date display
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return dateObj.toLocaleDateString(getIntlLocale(locale), {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Get locale-specific date format pattern for input placeholders
 */
export const getDateFormatPattern = (locale: Locale): string => {
  switch (locale) {
    case 'en':
      return 'YYYY-MM-DD';
    case 'fa':
      return 'YYYY/MM/DD'; // Persian (Jalali) calendar format
    case 'ps':
      return 'YYYY/MM/DD'; // Pashto uses Gregorian with slashes
    default:
      return 'YYYY-MM-DD';
  }
};

/**
 * Get locale-specific date input placeholder
 */
export const getDatePlaceholder = (locale: Locale): string => {
  switch (locale) {
    case 'en':
      return 'YYYY-MM-DD';
    case 'fa':
      return '۱۴۰۳/۰۱/۱۵'; // Example: Persian date
    case 'ps':
      return '۲۰۲۴/۰۱/۱۵'; // Example: Pashto date
    default:
      return 'YYYY-MM-DD';
  }
};

/**
 * Parse a date string in locale-specific format
 * Note: This is a simplified implementation - in production you'd want a more robust parser
 */
export const parseLocaleDate = (dateString: string, locale: Locale): Date | null => {
  try {
    // For now, assume ISO format or YYYY-MM-DD format
    // In a real app, you'd use a library like moment-jalaali for Persian dates
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

/**
 * Format a salary range with locale-specific number formatting
 */
export const formatSalaryRange = (
  minSalary: number | '' | undefined,
  maxSalary: number | '' | undefined,
  currency: string,
  locale: Locale,
  isNegotiable: boolean = false,
  t: (key: string) => string
): string => {
  if (!minSalary && !maxSalary) return t('notSpecified');
  
  const formatAmount = (amount: number): string => {
    return `${currency} ${formatNumber(amount, locale)}`;
  };
  
  const min = minSalary ? formatAmount(minSalary) : '';
  const max = maxSalary ? formatAmount(maxSalary) : '';
  
  let result = '';
  if (min && max) {
    result = `${min} - ${max}`;
  } else if (min) {
    result = `${min}+`;
  } else if (max) {
    result = `${t('upTo')} ${max}`;
  }
  
  if (isNegotiable && result) {
    result += ` (${t('negotiable')})`;
  }
  
  return result;
};