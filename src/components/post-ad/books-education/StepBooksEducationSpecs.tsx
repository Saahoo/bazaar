'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import {
  BooksEducationSubcategory,
  BooksEducationSpecField,
  getBooksEducationSpecsConfig,
  getBooksEducationOptionTranslationKey,
  getBooksEducationFieldTranslationKey,
  SUBJECT_MATTER_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  LANGUAGE_OPTIONS,
  PRICE_TYPE_OPTIONS,
  DELIVERY_OPTIONS,
  BOOK_CONDITION_OPTIONS,
  BOOK_FORMAT_OPTIONS,
  EBOOK_FORMAT_OPTIONS,
  COURSE_DURATION_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  CERTIFICATION_OPTIONS,
  TEACHING_MODE_OPTIONS,
  SUPPLY_TYPE_OPTIONS,
} from '@/lib/constants/books-education-wizard';
import { InputField, SelectField, ToggleField } from './BooksEducationFieldControls';

type BooksEducationSpecsData = {
  subcategory: BooksEducationSubcategory | '';
  subjectMatter: string;
  educationLevel: string;
  language: string;
  price: string;
  priceType: string;
  deliveryAvailable: string;
  [key: string]: string | number | boolean | undefined;
};

interface StepBooksEducationSpecsProps {
  locale: Locale;
  data: BooksEducationSpecsData;
  onChange: (updates: Partial<BooksEducationSpecsData>) => void;
}

export const StepBooksEducationSpecs: React.FC<StepBooksEducationSpecsProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.booksEducation');
  const rtl = isRTL(locale);

  // Helper to get translated option label
  const getOptionLabel = (option: string) => {
    const translationKey = getBooksEducationOptionTranslationKey(option);
    return t.has(translationKey as Parameters<typeof t>[0])
      ? t(translationKey as Parameters<typeof t>[0])
      : option;
  };

  const subcategory = data.subcategory as BooksEducationSubcategory;
  const specConfig = subcategory ? getBooksEducationSpecsConfig(subcategory) : [];

  const handleFieldChange = (key: string, value: string | number | boolean | undefined) => {
    onChange({ [key]: value });
  };

  // Helper to safely get a string value from data (avoids TS2322 from index signature)
  const getStringValue = (key: string): string => {
    const val = data[key];
    return val != null ? String(val) : '';
  };

  // Common field keys that are rendered explicitly at the top
  const commonFieldKeys = ['subjectMatter', 'educationLevel', 'language', 'price', 'priceType', 'deliveryAvailable'];

  const renderField = (field: BooksEducationSpecField) => {
    const { key, label, type, required, options, placeholder } = field;
    const value = data[key] !== undefined && data[key] !== null ? String(data[key]) : '';

    // Helper to create option objects with translated labels
    const createTranslatedOptions = (opts: string[]) =>
      opts.map(opt => ({
        value: opt,
        label: getOptionLabel(opt)
      }));

    // Get field translation key
    const fieldTranslationKey = getBooksEducationFieldTranslationKey(key);
    const fieldLabel = t.has(fieldTranslationKey as Parameters<typeof t>[0])
      ? t(fieldTranslationKey as Parameters<typeof t>[0])
      : label;

    switch (type) {
      case 'text':
        return (
          <InputField
            key={key}
            label={fieldLabel}
            required={required}
            rtl={rtl}
            value={value}
            onChange={(val) => handleFieldChange(key, val)}
            placeholder={placeholder || undefined}
          />
        );
      case 'number':
        return (
          <InputField
            key={key}
            label={fieldLabel}
            required={required}
            rtl={rtl}
            value={value}
            onChange={(val) => handleFieldChange(key, val)}
            placeholder={placeholder || undefined}
            type="number"
          />
        );
      case 'select':
        return (
          <SelectField
            key={key}
            label={fieldLabel}
            required={required}
            rtl={rtl}
            value={value}
            onChange={(val) => handleFieldChange(key, val)}
            options={options ? createTranslatedOptions(options) : []}
            placeholder={placeholder || undefined}
          />
        );
      case 'toggle':
        return (
          <ToggleField
            key={key}
            label={fieldLabel}
            rtl={rtl}
            checked={!!data[key]}
            onChange={(checked) => handleFieldChange(key, checked)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 p-4 ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('specsHeading')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('specsDescription')}</p>
      </div>

      {!subcategory ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-amber-800">
            {t('selectSubcategoryFirst')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subject Matter */}
          <SelectField
            label={t('subjectMatterLabel')}
            required
            rtl={rtl}
            value={getStringValue('subjectMatter')}
            onChange={(val) => handleFieldChange('subjectMatter', val)}
            options={SUBJECT_MATTER_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt)
            }))}
            placeholder={t('subjectMatterPlaceholder')}
          />

          {/* Education Level */}
          <SelectField
            label={t('educationLevelLabel')}
            required
            rtl={rtl}
            value={getStringValue('educationLevel')}
            onChange={(val) => handleFieldChange('educationLevel', val)}
            options={EDUCATION_LEVEL_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt)
            }))}
            placeholder={t('educationLevelPlaceholder')}
          />

          {/* Language */}
          <SelectField
            label={t('languageLabel')}
            required
            rtl={rtl}
            value={getStringValue('language')}
            onChange={(val) => handleFieldChange('language', val)}
            options={LANGUAGE_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt)
            }))}
            placeholder={t('languagePlaceholder')}
          />

          {/* Price */}
          <InputField
            label={t('priceLabel')}
            required
            rtl={rtl}
            value={getStringValue('price')}
            onChange={(val) => handleFieldChange('price', val)}
            placeholder={t('pricePlaceholder')}
            type="number"
          />

          {/* Price Type */}
          <SelectField
            label={t('priceTypeLabel')}
            required
            rtl={rtl}
            value={getStringValue('priceType')}
            onChange={(val) => handleFieldChange('priceType', val)}
            options={PRICE_TYPE_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt)
            }))}
            placeholder={t('priceTypePlaceholder')}
          />

          {/* Delivery Available */}
          <SelectField
            label={t('deliveryAvailableLabel')}
            required={false}
            rtl={rtl}
            value={getStringValue('deliveryAvailable')}
            onChange={(val) => handleFieldChange('deliveryAvailable', val)}
            options={DELIVERY_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt)
            }))}
            placeholder={t('deliveryAvailablePlaceholder')}
          />

          {/* ─── Conditional fields based on subcategory ─── */}

          {/* Physical Books specific */}
          {subcategory === 'physical-books' && (
            <>
              <InputField
                label={t('authorLabel')}
                required
                rtl={rtl}
                value={getStringValue('author')}
                onChange={(val) => handleFieldChange('author', val)}
                placeholder={t('authorPlaceholder')}
              />
              <InputField
                label={t('isbnLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('isbn')}
                onChange={(val) => handleFieldChange('isbn', val)}
                placeholder={t('isbnPlaceholder')}
              />
              <InputField
                label={t('editionLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('edition')}
                onChange={(val) => handleFieldChange('edition', val)}
                placeholder={t('editionPlaceholder')}
              />
              <InputField
                label={t('publicationYearLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('publicationYear')}
                onChange={(val) => handleFieldChange('publicationYear', val)}
                placeholder={t('publicationYearPlaceholder')}
                type="number"
              />
              <InputField
                label={t('publisherLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('publisher')}
                onChange={(val) => handleFieldChange('publisher', val)}
                placeholder={t('publisherPlaceholder')}
              />
              <SelectField
                label={t('bookConditionLabel')}
                required
                rtl={rtl}
                value={getStringValue('bookCondition')}
                onChange={(val) => handleFieldChange('bookCondition', val)}
                options={BOOK_CONDITION_OPTIONS.map(opt => ({
                  value: opt,
                  label: getOptionLabel(opt)
                }))}
                placeholder={t('bookConditionPlaceholder')}
              />
              <SelectField
                label={t('bookFormatLabel')}
                required
                rtl={rtl}
                value={getStringValue('bookFormat')}
                onChange={(val) => handleFieldChange('bookFormat', val)}
                options={BOOK_FORMAT_OPTIONS.map(opt => ({
                  value: opt,
                  label: getOptionLabel(opt)
                }))}
                placeholder={t('bookFormatPlaceholder')}
              />
              <InputField
                label={t('pagesLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('pages')}
                onChange={(val) => handleFieldChange('pages', val)}
                placeholder={t('pagesPlaceholder')}
                type="number"
              />
              <div className="md:col-span-2">
                <ToggleField
                  label={t('isTextbookLabel')}
                  rtl={rtl}
                  checked={!!data.isTextbook}
                  onChange={(checked) => handleFieldChange('isTextbook', checked)}
                />
              </div>
            </>
          )}

          {/* E-Books specific */}
          {subcategory === 'e-books' && (
            <>
              <InputField
                label={t('authorLabel')}
                required
                rtl={rtl}
                value={getStringValue('author')}
                onChange={(val) => handleFieldChange('author', val)}
                placeholder={t('authorPlaceholder')}
              />
              <InputField
                label={t('isbnLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('isbn')}
                onChange={(val) => handleFieldChange('isbn', val)}
                placeholder={t('isbnPlaceholder')}
              />
              <InputField
                label={t('editionLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('edition')}
                onChange={(val) => handleFieldChange('edition', val)}
                placeholder={t('editionPlaceholder')}
              />
              <InputField
                label={t('publicationYearLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('publicationYear')}
                onChange={(val) => handleFieldChange('publicationYear', val)}
                placeholder={t('publicationYearPlaceholder')}
                type="number"
              />
              <InputField
                label={t('publisherLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('publisher')}
                onChange={(val) => handleFieldChange('publisher', val)}
                placeholder={t('publisherPlaceholder')}
              />
              <SelectField
                label={t('ebookFormatLabel')}
                required
                rtl={rtl}
                value={getStringValue('ebookFormat')}
                onChange={(val) => handleFieldChange('ebookFormat', val)}
                options={EBOOK_FORMAT_OPTIONS.map(opt => ({
                  value: opt,
                  label: getOptionLabel(opt)
                }))}
                placeholder={t('ebookFormatPlaceholder')}
              />
              <InputField
                label={t('fileSizeLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('fileSize')}
                onChange={(val) => handleFieldChange('fileSize', val)}
                placeholder={t('fileSizePlaceholder')}
              />
              <InputField
                label={t('pagesLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('pages')}
                onChange={(val) => handleFieldChange('pages', val)}
                placeholder={t('pagesPlaceholder')}
                type="number"
              />
              <div className="md:col-span-2">
                <ToggleField
                  label={t('drmProtectedLabel')}
                  rtl={rtl}
                  checked={!!data.drmProtected}
                  onChange={(checked) => handleFieldChange('drmProtected', checked)}
                />
              </div>
              <div className="md:col-span-2">
                <ToggleField
                  label={t('isTextbookLabel')}
                  rtl={rtl}
                  checked={!!data.isTextbook}
                  onChange={(checked) => handleFieldChange('isTextbook', checked)}
                />
              </div>
            </>
          )}

          {/* Online Courses specific */}
          {subcategory === 'online-courses' && (
            <>
              <InputField
                label={t('instructorLabel')}
                required
                rtl={rtl}
                value={getStringValue('instructor')}
                onChange={(val) => handleFieldChange('instructor', val)}
                placeholder={t('instructorPlaceholder')}
              />
              <InputField
                label={t('platformLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('platform')}
                onChange={(val) => handleFieldChange('platform', val)}
                placeholder={t('platformPlaceholder')}
              />
              <SelectField
                label={t('courseDurationLabel')}
                required
                rtl={rtl}
                value={getStringValue('courseDuration')}
                onChange={(val) => handleFieldChange('courseDuration', val)}
                options={COURSE_DURATION_OPTIONS.map(opt => ({
                  value: opt,
                  label: getOptionLabel(opt)
                }))}
                placeholder={t('courseDurationPlaceholder')}
              />
              <SelectField
                label={t('experienceLevelLabel')}
                required
                rtl={rtl}
                value={getStringValue('experienceLevel')}
                onChange={(val) => handleFieldChange('experienceLevel', val)}
                options={EXPERIENCE_LEVEL_OPTIONS.map(opt => ({
                  value: opt,
                  label: getOptionLabel(opt)
                }))}
                placeholder={t('experienceLevelPlaceholder')}
              />
              <SelectField
                label={t('certificationLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('certification')}
                onChange={(val) => handleFieldChange('certification', val)}
                options={CERTIFICATION_OPTIONS.map(opt => ({
                  value: opt,
                  label: getOptionLabel(opt)
                }))}
                placeholder={t('certificationPlaceholder')}
              />
              <SelectField
                label={t('teachingModeLabel')}
                required
                rtl={rtl}
                value={getStringValue('teachingMode')}
                onChange={(val) => handleFieldChange('teachingMode', val)}
                options={TEACHING_MODE_OPTIONS.map(opt => ({
                  value: opt,
                  label: getOptionLabel(opt)
                }))}
                placeholder={t('teachingModePlaceholder')}
              />
              <InputField
                label={t('lessonsCountLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('lessonsCount')}
                onChange={(val) => handleFieldChange('lessonsCount', val)}
                placeholder={t('lessonsCountPlaceholder')}
                type="number"
              />
              <div className="md:col-span-2">
                <ToggleField
                  label={t('hasLiveSessionsLabel')}
                  rtl={rtl}
                  checked={!!data.hasLiveSessions}
                  onChange={(checked) => handleFieldChange('hasLiveSessions', checked)}
                />
              </div>
              <div className="md:col-span-2">
                <ToggleField
                  label={t('hasAssignmentsLabel')}
                  rtl={rtl}
                  checked={!!data.hasAssignments}
                  onChange={(checked) => handleFieldChange('hasAssignments', checked)}
                />
              </div>
            </>
          )}

          {/* Tutoring Services specific */}
          {subcategory === 'tutoring-services' && (
            <>
              <InputField
                label={t('tutorNameLabel')}
                required
                rtl={rtl}
                value={getStringValue('tutorName')}
                onChange={(val) => handleFieldChange('tutorName', val)}
                placeholder={t('tutorNamePlaceholder')}
              />
              <InputField
                label={t('qualificationLabel')}
                required
                rtl={rtl}
                value={getStringValue('qualification')}
                onChange={(val) => handleFieldChange('qualification', val)}
                placeholder={t('qualificationPlaceholder')}
              />
              <InputField
                label={t('experienceYearsLabel')}
                required
                rtl={rtl}
                value={getStringValue('experienceYears')}
                onChange={(val) => handleFieldChange('experienceYears', val)}
                placeholder={t('experienceYearsPlaceholder')}
                type="number"
              />
              <SelectField
                label={t('teachingModeLabel')}
                required
                rtl={rtl}
                value={getStringValue('teachingMode')}
                onChange={(val) => handleFieldChange('teachingMode', val)}
                options={TEACHING_MODE_OPTIONS.map(opt => ({
                  value: opt,
                  label: getOptionLabel(opt)
                }))}
                placeholder={t('teachingModePlaceholder')}
              />
              <SelectField
                label={t('experienceLevelLabel')}
                required
                rtl={rtl}
                value={getStringValue('experienceLevel')}
                onChange={(val) => handleFieldChange('experienceLevel', val)}
                options={EXPERIENCE_LEVEL_OPTIONS.map(opt => ({
                  value: opt,
                  label: getOptionLabel(opt)
                }))}
                placeholder={t('experienceLevelPlaceholder')}
              />
              <InputField
                label={t('sessionDurationLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('sessionDuration')}
                onChange={(val) => handleFieldChange('sessionDuration', val)}
                placeholder={t('sessionDurationPlaceholder')}
              />
              <InputField
                label={t('availableDaysLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('availableDays')}
                onChange={(val) => handleFieldChange('availableDays', val)}
                placeholder={t('availableDaysPlaceholder')}
              />
              <div className="md:col-span-2">
                <ToggleField
                  label={t('groupTutoringLabel')}
                  rtl={rtl}
                  checked={!!data.groupTutoring}
                  onChange={(checked) => handleFieldChange('groupTutoring', checked)}
                />
              </div>
              <div className="md:col-span-2">
                <ToggleField
                  label={t('freeTrialLabel')}
                  rtl={rtl}
                  checked={!!data.freeTrial}
                  onChange={(checked) => handleFieldChange('freeTrial', checked)}
                />
              </div>
            </>
          )}

          {/* Educational Supplies specific */}
          {subcategory === 'educational-supplies' && (
            <>
              <SelectField
                label={t('supplyTypeLabel')}
                required
                rtl={rtl}
                value={getStringValue('supplyType')}
                onChange={(val) => handleFieldChange('supplyType', val)}
                options={SUPPLY_TYPE_OPTIONS.map(opt => ({
                  value: opt,
                  label: getOptionLabel(opt)
                }))}
                placeholder={t('supplyTypePlaceholder')}
              />
              <InputField
                label={t('brandLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('brand')}
                onChange={(val) => handleFieldChange('brand', val)}
                placeholder={t('brandPlaceholder')}
              />
              <InputField
                label={t('quantityLabel')}
                required
                rtl={rtl}
                value={getStringValue('quantity')}
                onChange={(val) => handleFieldChange('quantity', val)}
                placeholder={t('quantityPlaceholder')}
                type="number"
              />
              <SelectField
                label={t('itemConditionLabel')}
                required
                rtl={rtl}
                value={getStringValue('itemCondition')}
                onChange={(val) => handleFieldChange('itemCondition', val)}
                options={['New', 'Like New', 'Good', 'Fair', 'Refurbished'].map(opt => ({
                  value: opt,
                  label: getOptionLabel(opt)
                }))}
                placeholder={t('itemConditionPlaceholder')}
              />
              <InputField
                label={t('ageRangeLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('ageRange')}
                onChange={(val) => handleFieldChange('ageRange', val)}
                placeholder={t('ageRangePlaceholder')}
              />
              <InputField
                label={t('colorLabel')}
                required={false}
                rtl={rtl}
                value={getStringValue('color')}
                onChange={(val) => handleFieldChange('color', val)}
                placeholder={t('colorPlaceholder')}
              />
            </>
          )}

          {/* Render any remaining subcategory-specific spec fields dynamically */}
          {specConfig
            .filter(field => !commonFieldKeys.includes(field.key))
            .filter(field => {
              // Filter out fields already rendered explicitly above
              const explicitlyRenderedKeys: Record<string, string[]> = {
                'physical-books': ['author', 'isbn', 'edition', 'publicationYear', 'publisher', 'bookCondition', 'bookFormat', 'pages', 'isTextbook'],
                'e-books': ['author', 'isbn', 'edition', 'publicationYear', 'publisher', 'ebookFormat', 'fileSize', 'pages', 'drmProtected', 'isTextbook'],
                'online-courses': ['instructor', 'platform', 'courseDuration', 'experienceLevel', 'certification', 'teachingMode', 'lessonsCount', 'hasLiveSessions', 'hasAssignments'],
                'tutoring-services': ['tutorName', 'qualification', 'experienceYears', 'teachingMode', 'experienceLevel', 'sessionDuration', 'availableDays', 'groupTutoring', 'freeTrial'],
                'educational-supplies': ['supplyType', 'brand', 'quantity', 'itemCondition', 'ageRange', 'color'],
              };
              const rendered = explicitlyRenderedKeys[subcategory] || [];
              return !rendered.includes(field.key);
            })
            .map(renderField)}
        </div>
      )}
    </div>
  );
};
