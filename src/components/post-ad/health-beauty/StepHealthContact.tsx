'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useCities, getManagedCityName } from '@/lib/hooks/useCities';
import { LegalReadNotice } from '@/components/common/LegalReadNotice';
import { InputField } from './HealthFieldControls';

export interface HealthContactData {
  city: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  whatsapp: string;
  email: string;
  termsAccepted: boolean;
}

interface StepHealthContactProps {
  locale: Locale;
  data: HealthContactData;
  onChange: (updates: Partial<HealthContactData>) => void;
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

export const StepHealthContact: React.FC<StepHealthContactProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.healthBeauty');
  const rtl = isRTL(locale);
  const { cities } = useCities();
  const [hasReadLegal, setHasReadLegal] = useState(data.termsAccepted);

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('stepContact')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('contactDescription')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={`mb-1.5 block text-sm font-semibold text-slate-700 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('city')} <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 ${rtl ? 'text-right' : 'text-left'}`}
            dir={rtl ? 'rtl' : 'ltr'}
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            aria-label={t('city')}
            title={t('city')}
          >
            <option value="">{t('selectCity')}</option>
            {cities.map((city) => (
              <option key={city.name_en} value={city.name_en}>
                {getManagedCityName(city, locale)}
              </option>
            ))}
          </select>
        </div>

        <InputField
          label={t('phone')}
          required
          rtl={rtl}
          value={data.phone}
          onChange={(value) => onChange({ phone: value })}
          placeholder={t('phonePlaceholder')}
        />

        <InputField
          label={t('whatsapp')}
          rtl={rtl}
          value={data.whatsapp}
          onChange={(value) => onChange({ whatsapp: value })}
          placeholder={t('whatsappPlaceholder')}
        />

        <InputField
          label={t('email')}
          rtl={rtl}
          value={data.email}
          onChange={(value) => onChange({ email: value })}
          placeholder={t('emailPlaceholder')}
        />
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
      </div>

      <LegalReadNotice locale={locale} initialRead={hasReadLegal} onReadChange={setHasReadLegal} />

      <label className={`inline-flex items-start gap-2 text-sm text-slate-700 ${rtl ? 'flex-row-reverse' : ''}`}>
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-200 disabled:opacity-40"
          disabled={!hasReadLegal}
          checked={data.termsAccepted}
          onChange={(e) => onChange({ termsAccepted: e.target.checked && hasReadLegal })}
        />
        {t('terms')}
      </label>
    </div>
  );
};
