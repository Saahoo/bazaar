'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Edit2, Image as ImageIcon } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { ElectronicsSubcategory, getElectronicsSpecsConfig } from '@/lib/constants/electronics-wizard';
import { ElectronicsDetailsData } from './StepElectronicsDetails';
import { ElectronicsMediaData } from './StepElectronicsMedia';

interface StepElectronicsReviewProps {
	locale: Locale;
	subcategory: ElectronicsSubcategory | '';
	title: string;
	details: string;
	price: number | '';
	negotiable: boolean;
	condition: string;
	contactData: ElectronicsDetailsData;
	specs: Record<string, string>;
	media: ElectronicsMediaData;
	onEdit: (stepIndex: number) => void;
}

const SUBCATEGORY_LABELS: Record<ElectronicsSubcategory, Record<string, string>> = {
	phones: { en: 'Phones', ps: 'د لاس ټیلیفونونه', fa: 'تلفن همراه' },
	tablets: { en: 'Tablets', ps: 'ټیبلیټونه', fa: 'تبلت' },
	tv: { en: 'TV', ps: 'تلویزیون', fa: 'تلویزیون' },
	laptops: { en: 'Laptops', ps: 'لیپټاپونه', fa: 'لپتاپ' },
	desktops: { en: 'Desktops', ps: 'ډیسکټاپونه', fa: 'کامپیوتر رومیزی' },
	'home-appliances': { en: 'Home Appliances', ps: 'کورني وسایل', fa: 'لوازم خانگی' },
	'music-instruments': { en: 'Music Instruments', ps: 'د موسیقۍ آلات', fa: 'ساز و آلات موسیقی' },
	'other-electronics': { en: 'Other Electronics', ps: 'نور برقي توکي', fa: 'سایر الکترونیک' },
};

export const StepElectronicsReview: React.FC<StepElectronicsReviewProps> = ({
	locale,
	subcategory,
	title,
	details,
	price,
	negotiable,
	condition,
	contactData,
	specs,
	media,
	onEdit,
}) => {
	const t = useTranslations('postAd.electronics');
	const rtl = isRTL(locale);

	const specFields = getElectronicsSpecsConfig(subcategory);

	const getSpecLabel = (fieldId: string): string => {
		const labelKey = `fields.${fieldId}`;
		return t.has(labelKey as Parameters<typeof t>[0]) ? t(labelKey as Parameters<typeof t>[0]) : fieldId;
	};

	const displayedSpecs = specFields
		.filter((f) => {
			const val = specs[f.id];
			if (!val || val.trim() === '') return false;
			return true;
		})
		.map((f) => {
			let value = specs[f.id] || '';
			if (value === 'Other') {
				const customKey = f.id === 'make' || f.id === 'brand' ? 'customMake' : `custom_${f.id}`;
				value = specs[customKey] || value;
			}
			return { label: getSpecLabel(f.id), value };
		})
		.filter((s) => s.value && s.value.trim() !== '');

	const sectionClass = 'bg-slate-50 rounded-xl p-4 border border-slate-200';
	const sectionTitleClass = `flex items-center justify-between mb-3 ${rtl ? 'flex-row-reverse' : ''}`;
	const fieldRowClass = `flex items-start gap-2 text-sm ${rtl ? 'flex-row-reverse' : ''}`;

	return (
		<div className="space-y-5">
			<h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
				{t('reviewHeading')}
			</h3>

			{/* Section 1: Basic Info */}
			<div className={sectionClass}>
				<div className={sectionTitleClass}>
					<span className="font-semibold text-slate-800 text-sm">{t('reviewBasicInfo')}</span>
					<button
						type="button"
						onClick={() => onEdit(1)}
						className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
					>
						<Edit2 className="w-3.5 h-3.5" />
						{t('editSection')}
					</button>
				</div>
				<div className="space-y-1.5">
					<div className={fieldRowClass}>
						<span className="text-slate-500 min-w-[90px] shrink-0">{t('adTitle')}:</span>
						<span className="text-slate-800 font-medium break-all">{title || '—'}</span>
					</div>
					<div className={fieldRowClass}>
						<span className="text-slate-500 min-w-[90px] shrink-0">{t('adDetails')}:</span>
						<span className="text-slate-800 break-words line-clamp-3">{details || '—'}</span>
					</div>
					{subcategory && (
						<div className={fieldRowClass}>
							<span className="text-slate-500 min-w-[90px] shrink-0">{t('subcategoryLabel')}:</span>
							<span className="text-slate-800">
								{SUBCATEGORY_LABELS[subcategory]?.[locale] || subcategory}
							</span>
						</div>
					)}
				</div>
			</div>

			{/* Section 2: Specifications */}
			<div className={sectionClass}>
				<div className={sectionTitleClass}>
					<span className="font-semibold text-slate-800 text-sm">{t('reviewSpecs')}</span>
					<button
						type="button"
						onClick={() => onEdit(2)}
						className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
					>
						<Edit2 className="w-3.5 h-3.5" />
						{t('editSection')}
					</button>
				</div>
				<div className="space-y-3">
					<div className={fieldRowClass}>
						<span className="text-slate-500 min-w-[90px] shrink-0">{t('price')}:</span>
						<span className="text-slate-800 font-medium">
							{price !== '' ? `${price} AFN` : '—'}
							{negotiable && (
								<span className="ml-1.5 text-xs text-green-600 font-normal">({t('negotiable')})</span>
							)}
						</span>
					</div>
					{condition && (
						<div className={fieldRowClass}>
							<span className="text-slate-500 min-w-[90px] shrink-0">{t('condition')}:</span>
							<span className="text-slate-800">{condition}</span>
						</div>
					)}
				</div>
				{displayedSpecs.length === 0 ? (
					<p className={`text-sm text-slate-400 ${rtl ? 'text-right' : 'text-left'}`}>{t('noSpecs')}</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
						{displayedSpecs.map((s) => (
							<div key={s.label} className={fieldRowClass}>
								<span className="text-slate-500 min-w-[110px] shrink-0">{s.label}:</span>
								<span className="text-slate-800">{s.value}</span>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Section 4: Media */}
			<div className={sectionClass}>
				<div className={sectionTitleClass}>
					<span className="font-semibold text-slate-800 text-sm">{t('reviewMedia')}</span>
					<button
						type="button"
						onClick={() => onEdit(3)}
						className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
					>
						<Edit2 className="w-3.5 h-3.5" />
						{t('editSection')}
					</button>
				</div>
				<div className="space-y-2">
					{/* Photo thumbnails */}
					{media.photos.length > 0 ? (
						<div className="flex flex-wrap gap-2">
							{media.photos.slice(0, 6).map((photo, i) => (
								<div key={i} className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
									{photo.url ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img src={photo.url} alt="" className="w-full h-full object-cover" />
									) : (
										<div className="w-full h-full flex items-center justify-center">
											<ImageIcon className="w-5 h-5 text-slate-300" />
										</div>
									)}
								</div>
							))}
							{media.photos.length > 6 && (
								<div className="w-14 h-14 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center text-sm text-slate-500 font-medium">
									+{media.photos.length - 6}
								</div>
							)}
						</div>
					) : (
						<p className="text-sm text-slate-400">{t('photosRequired')}</p>
					)}
					<p className={`text-xs text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>
						{t('photosCount', { count: media.photos.length })}
					</p>
					{media.videoUrl && (
						<div className={fieldRowClass}>
							<span className="text-slate-500 shrink-0">{t('videoLink')}:</span>
							<span className="text-primary-600 text-xs break-all">{media.videoUrl}</span>
						</div>
					)}
				</div>
			</div>

			{/* Section 4: Contact Details */}
			<div className={sectionClass}>
				<div className={sectionTitleClass}>
					<span className="font-semibold text-slate-800 text-sm">{t('contactHeading')}</span>
					<button
						type="button"
						onClick={() => onEdit(4)}
						className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
					>
						<Edit2 className="w-3.5 h-3.5" />
						{t('editSection')}
					</button>
				</div>
				<div className="space-y-1.5">
					<div className={fieldRowClass}>
						<span className="text-slate-500 min-w-[90px] shrink-0">{t('city')}:</span>
						<span className="text-slate-800">{contactData.city || '—'}</span>
					</div>
					{contactData.sellerType && (
						<div className={fieldRowClass}>
							<span className="text-slate-500 min-w-[90px] shrink-0">{t('sellerType')}:</span>
							<span className="text-slate-800">
								{contactData.sellerType === 'individual' ? t('sellerTypeIndividual') : t('sellerTypeDealer')}
							</span>
						</div>
					)}
					<div className={fieldRowClass}>
						<span className="text-slate-500 min-w-[90px] shrink-0">{t('phone')}:</span>
						<span className="text-slate-800 dir-ltr">{contactData.phone || '—'}</span>
					</div>
					{contactData.whatsapp && (
						<div className={fieldRowClass}>
							<span className="text-slate-500 min-w-[90px] shrink-0">{t('whatsapp')}:</span>
							<span className="text-slate-800 dir-ltr">{contactData.whatsapp}</span>
						</div>
					)}
					{contactData.email && (
						<div className={fieldRowClass}>
							<span className="text-slate-500 min-w-[90px] shrink-0">{t('email')}:</span>
							<span className="text-slate-800 dir-ltr">{contactData.email}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
