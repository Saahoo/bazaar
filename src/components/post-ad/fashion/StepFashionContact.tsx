'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useCities, getManagedCityName } from '@/lib/hooks/useCities';
import { LegalReadNotice } from '@/components/common/LegalReadNotice';

export interface FashionContactData {
  city: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  whatsapp: string;
  email: string;
  termsAccepted: boolean;
}

interface StepFashionContactProps {
  locale: Locale;
  data: FashionContactData;
  onChange: (updates: Partial<FashionContactData>) => void;
}

const LocationMap: React.FC<{
  lat: number | null;
  lng: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}> = ({ lat, lng, onLocationChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null);
  const markerRef = useRef<import('leaflet').Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      const L = await import('leaflet');
      const defaultIconPrototype = L.Icon.Default.prototype as unknown as { _getIconUrl?: string };
      delete defaultIconPrototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      if (!mounted || !mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current).setView([lat ?? 34.5553, lng ?? 69.2075], 13);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      if (lat !== null && lng !== null) {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }

      map.on('click', (e: import('leaflet').LeafletMouseEvent) => {
        const nextLat = e.latlng.lat;
        const nextLng = e.latlng.lng;
        if (markerRef.current) markerRef.current.setLatLng([nextLat, nextLng]);
        else markerRef.current = L.marker([nextLat, nextLng]).addTo(map);
        onLocationChange(nextLat, nextLng);
      });

      setMapReady(true);
    };

    initMap();

    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, onLocationChange]);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || lat === null || lng === null) return;

    const sync = async () => {
      const L = await import('leaflet');
      if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
      else markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current!);
    };

    sync();
  }, [lat, lng, mapReady]);

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <div ref={mapRef} className="h-64 w-full rounded-xl border border-slate-300" />
    </>
  );
};

export const StepFashionContact: React.FC<StepFashionContactProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.fashion');
  const rtl = isRTL(locale);
  const { cities } = useCities();
  const [hasReadLegal, setHasReadLegal] = useState(data.termsAccepted);

  const schema = useMemo(
    () =>
      z.object({
        city: z.string().min(1),
        phone: z.string().trim().min(5),
        whatsapp: z.string().optional(),
        email: z.string().trim().email().or(z.literal('')),
        termsAccepted: z.boolean(),
      }),
    []
  );

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<{
    city: string;
    phone: string;
    whatsapp: string;
    email: string;
    termsAccepted: boolean;
  }>({
    resolver: zodResolver(schema),
    defaultValues: {
      city: data.city,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      termsAccepted: data.termsAccepted,
    },
    mode: 'onBlur',
  });

  const watched = watch();

  useEffect(() => {
    if (!hasReadLegal) setValue('termsAccepted', false, { shouldValidate: true });
  }, [hasReadLegal, setValue]);

  useEffect(() => {
    onChange({
      city: watched.city || '',
      phone: watched.phone || '',
      whatsapp: watched.whatsapp || '',
      email: watched.email || '',
      termsAccepted: watched.termsAccepted === true,
    });
  }, [watched.city, watched.phone, watched.whatsapp, watched.email, watched.termsAccepted, onChange]);

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm shadow-sm transition focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
        : 'border-slate-300 focus:border-primary-500 focus:ring-primary-100'
    } ${rtl ? 'text-right' : 'text-left'}`;

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('contactHeading')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('contactDescription')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={`mb-1.5 block text-sm font-semibold text-slate-700 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('city')} <span className="text-red-500">*</span>
          </label>
          <select
            className={`${inputClass(!!errors.city)} bg-white`}
            dir={rtl ? 'rtl' : 'ltr'}
            {...register('city')}
          >
            <option value="">{t('selectCity')}</option>
            {cities.map((city) => (
              <option key={city.name_en} value={city.name_en}>
                {getManagedCityName(city, locale)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`mb-1.5 block text-sm font-semibold text-slate-700 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('phone')} <span className="text-red-500">*</span>
          </label>
          <input type="tel" dir="ltr" className={inputClass(!!errors.phone)} placeholder={t('phonePlaceholder')} {...register('phone')} />
        </div>

        <div>
          <label className={`mb-1.5 block text-sm font-semibold text-slate-700 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('whatsapp')}
          </label>
          <input type="tel" dir="ltr" className={inputClass(false)} placeholder={t('whatsappPlaceholder')} {...register('whatsapp')} />
        </div>

        <div>
          <label className={`mb-1.5 block text-sm font-semibold text-slate-700 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('email')}
          </label>
          <input type="email" dir="ltr" className={inputClass(!!errors.email)} placeholder={t('emailPlaceholder')} {...register('email')} />
        </div>
      </div>

      <div>
        <p className={`mb-2 text-sm font-semibold text-slate-700 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('mapLocation')}
        </p>
        <p className={`mb-3 text-xs text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>{t('mapHint')}</p>
        <LocationMap
          lat={data.lat}
          lng={data.lng}
          onLocationChange={(lat, lng) => onChange({ lat, lng })}
        />
        {data.lat !== null && data.lng !== null && (
          <p className={`mt-2 text-xs text-green-600 ${rtl ? 'text-right' : 'text-left'}`}>
            {data.lat.toFixed(6)}, {data.lng.toFixed(6)}
          </p>
        )}
      </div>

      <LegalReadNotice locale={locale} initialRead={hasReadLegal} onReadChange={setHasReadLegal} />

      <label className={`inline-flex items-start gap-2 text-sm text-slate-700 ${rtl ? 'flex-row-reverse' : ''}`}>
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-200 disabled:opacity-40"
          disabled={!hasReadLegal}
          {...register('termsAccepted')}
        />
        {t('terms')}
      </label>
    </div>
  );
};
