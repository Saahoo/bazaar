// src/components/common/RtlSupport.tsx
// Comprehensive RTL support component for right-to-left languages

import React from 'react';
import { Locale, isRTL, getDir } from '@/lib/i18n/config';

interface RtlSupportProps {
  locale: Locale;
  children: React.ReactNode;
  className?: string;
}

/**
 * RtlSupport component provides comprehensive RTL layout support
 * for right-to-left languages (Arabic, Persian, Hebrew, Urdu, etc.)
 */
export const RtlSupport: React.FC<RtlSupportProps> = ({ 
  locale, 
  children, 
  className = '' 
}) => {
  const isRtl = isRTL(locale);
  const dir = getDir(locale);
  
  return (
    <div 
      dir={dir}
      className={`${className} ${isRtl ? 'rtl-layout' : 'ltr-layout'}`}
      data-locale={locale}
      data-rtl={isRtl}
    >
      {children}
    </div>
  );
};

/**
 * RtlText component for handling bidirectional text and text alignment
 */
interface RtlTextProps {
  locale: Locale;
  text: string;
  className?: string;
  align?: 'start' | 'end' | 'center' | 'justify';
}

export const RtlText: React.FC<RtlTextProps> = ({ 
  locale, 
  text, 
  className = '',
  align = 'start'
}) => {
  const isRtl = isRTL(locale);
  
  const alignmentClass = isRtl 
    ? `text-${align === 'start' ? 'right' : align === 'end' ? 'left' : align}`
    : `text-${align === 'start' ? 'left' : align === 'end' ? 'right' : align}`;
  
  return (
    <div 
      className={`${className} ${alignmentClass}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {text}
    </div>
  );
};

/**
 * RtlIcon component for mirroring directional icons in RTL layouts
 */
interface RtlIconProps {
  locale: Locale;
  icon: React.ReactNode;
  mirrorDirectional?: boolean;
  className?: string;
}

export const RtlIcon: React.FC<RtlIconProps> = ({ 
  locale, 
  icon, 
  mirrorDirectional = true,
  className = ''
}) => {
  const isRtl = isRTL(locale);
  
  const mirrorClass = mirrorDirectional && isRtl ? 'icon-mirror' : '';
  
  return (
    <span className={`${className} ${mirrorClass}`}>
      {icon}
    </span>
  );
};

/**
 * RtlGrid component for reversing grid column order in RTL layouts
 */
interface RtlGridProps {
  locale: Locale;
  children: React.ReactNode;
  className?: string;
  reverseColumns?: boolean;
}

export const RtlGrid: React.FC<RtlGridProps> = ({ 
  locale, 
  children, 
  className = '',
  reverseColumns = true
}) => {
  const isRtl = isRTL(locale);
  
  const gridClass = reverseColumns && isRtl 
    ? `${className} grid grid-cols-reverse-rtl`
    : `${className} grid`;
  
  return (
    <div className={gridClass}>
      {children}
    </div>
  );
};

/**
 * RtlFlex component for reversing flex direction in RTL layouts
 */
interface RtlFlexProps {
  locale: Locale;
  children: React.ReactNode;
  className?: string;
  reverseRow?: boolean;
}

export const RtlFlex: React.FC<RtlFlexProps> = ({ 
  locale, 
  children, 
  className = '',
  reverseRow = true
}) => {
  const isRtl = isRTL(locale);
  
  const flexClass = reverseRow && isRtl 
    ? `${className} flex flex-row-reverse-rtl`
    : `${className} flex`;
  
  return (
    <div className={flexClass}>
      {children}
    </div>
  );
};

/**
 * RtlNumber component for displaying numbers in appropriate numeral system
 */
interface RtlNumberProps {
  locale: Locale;
  value: number | string;
  format?: 'decimal' | 'currency' | 'percent';
  currency?: string;
  className?: string;
}

export const RtlNumber: React.FC<RtlNumberProps> = ({ 
  locale, 
  value, 
  format = 'decimal',
  currency = 'USD',
  className = ''
}) => {
  const isRtl = isRTL(locale);
  
  // Format the number based on locale and format type
  const formatNumber = () => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) return value.toString();
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat(
          locale === 'en' ? 'en-US' : 
          locale === 'fa' ? 'fa-IR' : 'ps-AF',
          {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }
        ).format(numValue);
      
      case 'percent':
        return new Intl.NumberFormat(
          locale === 'en' ? 'en-US' : 
          locale === 'fa' ? 'fa-IR' : 'ps-AF',
          {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
          }
        ).format(numValue / 100);
      
      default:
        return new Intl.NumberFormat(
          locale === 'en' ? 'en-US' : 
          locale === 'fa' ? 'fa-IR' : 'ps-AF'
        ).format(numValue);
    }
  };
  
  const formattedValue = formatNumber();
  const numeralClass = isRtl && locale === 'fa' ? 'eastern-numerals' : '';
  
  return (
    <span className={`${className} ${numeralClass}`} dir="ltr">
      {formattedValue}
    </span>
  );
};

/**
 * RtlDate component for displaying dates in appropriate calendar system
 */
interface RtlDateProps {
  locale: Locale;
  date: Date | string;
  format?: 'short' | 'medium' | 'long' | 'full';
  className?: string;
}

export const RtlDate: React.FC<RtlDateProps> = ({ 
  locale, 
  date, 
  format = 'medium',
  className = ''
}) => {
  const isRtl = isRTL(locale);
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Format options based on format type
  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'short' : 
           format === 'long' || format === 'full' ? 'long' : 'short',
    day: 'numeric',
  };
  
  if (format === 'full') {
    formatOptions.weekday = 'long';
  }
  
  // For Persian locale, we might want to use Jalali calendar
  // This is a simplified version - in production you'd use a proper Jalali library
  const formattedDate = dateObj.toLocaleDateString(
    locale === 'en' ? 'en-US' : 
    locale === 'fa' ? 'fa-IR' : 'ps-AF',
    formatOptions
  );
  
  return (
    <span className={className} dir={isRtl ? 'rtl' : 'ltr'}>
      {formattedDate}
    </span>
  );
};

/**
 * RtlBreadcrumb component for reversing breadcrumb order in RTL
 */
interface RtlBreadcrumbProps {
  locale: Locale;
  items: Array<{ label: string; href?: string }>;
  className?: string;
  separator?: React.ReactNode;
}

export const RtlBreadcrumb: React.FC<RtlBreadcrumbProps> = ({ 
  locale, 
  items, 
  className = '',
  separator = '›'
}) => {
  const isRtl = isRTL(locale);
  const orderedItems = isRtl ? [...items].reverse() : items;
  
  return (
    <nav className={`${className} breadcrumb`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2" dir={isRtl ? 'rtl' : 'ltr'}>
        {orderedItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <a 
                href={item.href} 
                className="text-sm text-slate-600 hover:text-blue-600"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-sm font-medium text-slate-900">
                {item.label}
              </span>
            )}
            {index < orderedItems.length - 1 && (
              <span className="mx-2 breadcrumb-separator">{separator}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

/**
 * Hook for RTL-aware styling
 */
export const useRtlStyles = (locale: Locale) => {
  const isRtl = isRTL(locale);
  
  return {
    isRtl,
    dir: isRtl ? 'rtl' : 'ltr',
    textAlign: isRtl ? 'right' : 'left',
    marginStart: isRtl ? 'margin-right' : 'margin-left',
    marginEnd: isRtl ? 'margin-left' : 'margin-right',
    paddingStart: isRtl ? 'padding-right' : 'padding-left',
    paddingEnd: isRtl ? 'padding-left' : 'padding-right',
    borderStart: isRtl ? 'border-right' : 'border-left',
    borderEnd: isRtl ? 'border-left' : 'border-right',
    flexDirection: isRtl ? 'row-reverse' : 'row',
    transformIcon: (icon: React.ReactNode) => 
      isRtl ? <span className="icon-mirror">{icon}</span> : icon,
  };
};

/**
 * Utility function to get RTL-aware class names
 */
export const getRtlClasses = (locale: Locale, baseClasses: string): string => {
  const isRtl = isRTL(locale);
  
  if (!isRtl) return baseClasses;
  
  // Replace direction-specific classes
  return baseClasses
    .replace(/\bleft\b/g, 'START_PLACEHOLDER')
    .replace(/\bright\b/g, 'left')
    .replace(/START_PLACEHOLDER/g, 'right')
    .replace(/\bml-\b/g, 'MS_PLACEHOLDER')
    .replace(/\bmr-\b/g, 'ml-')
    .replace(/MS_PLACEHOLDER/g, 'mr-')
    .replace(/\bpl-\b/g, 'PS_PLACEHOLDER')
    .replace(/\bpr-\b/g, 'pl-')
    .replace(/PS_PLACEHOLDER/g, 'pr-')
    .replace(/\btext-left\b/g, 'text-right')
    .replace(/\btext-right\b/g, 'text-left')
    .replace(/\bfloat-left\b/g, 'float-right')
    .replace(/\bfloat-right\b/g, 'float-left');
};