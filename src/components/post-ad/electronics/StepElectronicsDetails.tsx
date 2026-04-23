'use client';

import React, { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { isRTL, Locale } from '@/lib/i18n/config';
import { useCities, getManagedCityName } from '@/lib/hooks/useCities';

export interface ElectronicsDetailsData {
	city: string;
	sellerType: 'individual' | 'dealer' | '';
}

interface StepElectronicsDetailsProps {
	locale: Locale;
	data: ElectronicsDetailsData;
	onChange: (data: Partial<ElectronicsDetailsData>) => void;
}

type FormValues = {
	city: string;
	sellerType: string;
};

export const StepElectronicsDetails: React.FC<StepElectronicsDetailsProps> = ({
	locale,
	data,
	onChange,
}) => {
	const t = useTranslations('postAd.electronics');
	const tForm = useTranslations('form');
	const rtl = isRTL(locale);
	const { cities } = useCities();

	const schema = useMemo(
		() =>
			z.object({
				city: z.string().min(1, tForm('required')),
				sellerType: z.string().optional().default(''),
			}),
		[tForm]
	);

	const {
		register,
		watch,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			city: data.city,
			sellerType: data.sellerType,
		},
		mode: 'onBlur',
	});

	const watched = watch();

	useEffect(() => {
		onChange({
			city: watched.city || '',
			sellerType: (watched.sellerType as ElectronicsDetailsData['sellerType']) || '',
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		watched.city,
		watched.sellerType,
	]);

	const inputClass = (hasError: boolean) =>
		`w-full px-4 py-2.5 border rounded-lg transition focus:outline-none focus:ring-2 ${
			hasError
				? 'border-red-400 focus:ring-red-200 focus:border-red-500'
				: 'border-slate-300 focus:ring-primary-200 focus:border-primary-500'
		} ${rtl ? 'text-right' : 'text-left'}`;

	return (
		<div className="space-y-6">
			<h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
				{t('locationHeading')}
			</h3>

			{/* City */}
			<div>
				<label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
					{t('city')} <span className="text-red-500">*</span>
				</label>
				<select
					className={`${inputClass(!!errors.city)} bg-white`}
					dir={rtl ? 'rtl' : 'ltr'}
					aria-label={t('city')}
					title={t('city')}
					{...register('city')}
				>
					<option value="">{t('selectCity')}</option>
					{cities.map((city) => (
						<option key={city.name_en} value={city.name_en}>
							{getManagedCityName(city, locale)}
						</option>
					))}
				</select>
				{errors.city && (
					<p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>{tForm('required')}</p>
				)}
			</div>

			{/* Seller Type */}
			<div>
				<label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
					{t('sellerType')}
				</label>
				<select
					className={`${inputClass(false)} bg-white`}
					dir={rtl ? 'rtl' : 'ltr'}
					aria-label={t('sellerType')}
					title={t('sellerType')}
					{...register('sellerType')}
				>
					<option value="">{t('sellerTypePlaceholder')}</option>
					<option value="individual">{t('sellerTypeIndividual')}</option>
					<option value="dealer">{t('sellerTypeDealer')}</option>
				</select>
			</div>
		</div>
	);
};
