'use client';

import React, { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { useCities, getManagedCityName } from '@/lib/hooks/useCities';
import { LegalReadNotice } from '@/components/common/LegalReadNotice';

export interface ElectronicsDetailsData {
	city: string;
	sellerType: 'individual' | 'dealer' | '';
	phone: string;
	whatsapp: string;
	email: string;
	termsAccepted: boolean;
}

interface StepElectronicsDetailsProps {
	locale: Locale;
	data: ElectronicsDetailsData;
	onChange: (data: Partial<ElectronicsDetailsData>) => void;
}

type FormValues = {
	city: string;
	sellerType: string;
	phone: string;
	whatsapp: string;
	email: string;
	termsAccepted: boolean;
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
	const [hasReadLegal, setHasReadLegal] = React.useState(data.termsAccepted);

	const schema = useMemo(
		() =>
			z.object({
				city: z.string().min(1, tForm('required')),
				sellerType: z.string().optional().default(''),
				phone: z.string().trim().min(5, tForm('required')),
				whatsapp: z.string().optional(),
				email: z.string().trim().email('invalid').or(z.literal('')),
				termsAccepted: z.boolean(),
			}),
		[tForm]
	);

	const {
		register,
		watch,
		setValue,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			city: data.city,
			sellerType: data.sellerType,
			phone: data.phone,
			whatsapp: data.whatsapp,
			email: data.email,
			termsAccepted: data.termsAccepted,
		},
		mode: 'onBlur',
	});

	const watched = watch();

	useEffect(() => {
		if (!hasReadLegal) {
			setValue('termsAccepted', false, { shouldValidate: true });
		}
	}, [hasReadLegal, setValue]);

	useEffect(() => {
		onChange({
			city: watched.city || '',
			sellerType: (watched.sellerType as ElectronicsDetailsData['sellerType']) || '',
			phone: watched.phone || '',
			whatsapp: watched.whatsapp || '',
			email: watched.email || '',
			termsAccepted: watched.termsAccepted === true,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		watched.city,
		watched.sellerType, watched.phone, watched.whatsapp, watched.email, watched.termsAccepted,
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
				{t('contactHeading')}
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

			{/* Phone */}
			<div>
				<label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
					<span className={`flex items-center gap-1.5 ${rtl ? 'flex-row-reverse justify-end' : ''}`}>
						<Phone className="w-4 h-4 text-slate-400" />
						{t('phone')} <span className="text-red-500">*</span>
					</span>
				</label>
				<input
					type="tel"
					placeholder={t('phonePlaceholder')}
					className={inputClass(!!errors.phone)}
					dir="ltr"
					{...register('phone')}
				/>
				{errors.phone && (
					<p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>{tForm('required')}</p>
				)}
			</div>

			{/* WhatsApp */}
			<div>
				<label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
					<span className={`flex items-center gap-1.5 ${rtl ? 'flex-row-reverse justify-end' : ''}`}>
						<MessageCircle className="w-4 h-4 text-slate-400" />
						{t('whatsapp')}
					</span>
				</label>
				<input
					type="tel"
					placeholder={t('whatsappPlaceholder')}
					className={inputClass(false)}
					dir="ltr"
					{...register('whatsapp')}
				/>
			</div>

			{/* Email */}
			<div>
				<label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
					<span className={`flex items-center gap-1.5 ${rtl ? 'flex-row-reverse justify-end' : ''}`}>
						<Mail className="w-4 h-4 text-slate-400" />
						{t('email')}
					</span>
				</label>
				<input
					type="email"
					placeholder={t('emailPlaceholder')}
					className={inputClass(!!errors.email)}
					dir="ltr"
					{...register('email')}
				/>
				{errors.email && (
					<p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>{tForm('invalid')}</p>
				)}
			</div>

			{/* Legal Read Notice */}
			<LegalReadNotice locale={locale} initialRead={hasReadLegal} onReadChange={setHasReadLegal} />

			{/* Terms */}
			<div className={`flex items-start gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
				<input
					type="checkbox"
					id="el-terms"
					className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-200 disabled:opacity-40"
					disabled={!hasReadLegal}
					{...register('termsAccepted')}
				/>
				<label
					htmlFor="el-terms"
					className={`text-sm text-slate-700 cursor-pointer ${!hasReadLegal ? 'opacity-40' : ''} ${rtl ? 'text-right' : 'text-left'}`}
				>
					{t('terms')}
				</label>
			</div>
		</div>
	);
};
