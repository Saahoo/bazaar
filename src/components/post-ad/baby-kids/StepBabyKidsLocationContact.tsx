'use client';

import React, { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useCities, getManagedCityName } from '@/lib/hooks/useCities';
import { MapPin, User, Phone, Mail } from 'lucide-react';

export interface BabyKidsLocationContactData {
  street: string;
  city: string;
  postalCode: string;
  lat: number | null;
  lng: number | null;
  sellerName: string;
  phone: string;
  email: string;
  preferredContact: 'phone' | 'email' | 'both';
  hidePhone: boolean;
}

interface StepBabyKidsLocationContactProps {
  locale: Locale;
  data: BabyKidsLocationContactData;
  onChange: (updates: Partial<BabyKidsLocationContactData>) => void;
}

// ─── Location Map (dynamic Leaflet import) ────────────────────────────────────
const LocationMap: React.FC<{
  lat: number | null;
  lng: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}> = ({ lat, lng, onLocationChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;
      // @ts-expect-error leaflet CSS module has no type declarations
      await import('leaflet/dist/leaflet.css');

      // Fix default marker icon
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const defaultLat = lat || 34.52;
      const defaultLng = lng || 69.18;
      const zoom = lat ? 14 : 6;

      const map = L.map(mapRef.current).setView([defaultLat, defaultLng], zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      if (lat && lng) {
        const marker = L.marker([lat, lng]).addTo(map);
        markerRef.current = marker;
      }

      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat: clickedLat, lng: clickedLng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng([clickedLat, clickedLng]);
        } else {
          const marker = L.marker([clickedLat, clickedLng]).addTo(map);
          markerRef.current = marker;
        }
        onLocationChange(clickedLat, clickedLng);
      });

      mapInstanceRef.current = map;
    };

    if (isMounted) initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker position when lat/lng change externally
  useEffect(() => {
    if (mapInstanceRef.current && lat && lng) {
      mapInstanceRef.current.setView([lat, lng], 14);
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const L = require('leaflet');
        const marker = L.marker([lat, lng]).addTo(mapInstanceRef.current);
        markerRef.current = marker;
      }
    }
  }, [lat, lng]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"
      />
      <div ref={mapRef} className="h-64 w-full rounded-lg border border-slate-300 z-0" />
    </>
  );
};

export const StepBabyKidsLocationContact: React.FC<StepBabyKidsLocationContactProps> = ({
  locale,
  data,
  onChange,
}) => {
  const t = useTranslations('postAd.babyKids');
  const rtl = isRTL(locale);
  const { cities } = useCities();

  useEffect(() => {
    if (data.city) {
      const cityData = cities.find((c) => getManagedCityName(c, locale) === data.city);
      if (cityData?.latitude && cityData?.longitude) {
        onChange({
          lat: cityData.latitude,
          lng: cityData.longitude,
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.city, cities, locale]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : ''}`}>
          {t('locationContactHeading')}
        </h2>
        <p className={`text-sm text-slate-500 mt-1 ${rtl ? 'text-right' : ''}`}>
          {t('locationContactDescription')}
        </p>
      </div>

      {/* Location Details */}
      <div className="space-y-4">
        <h3 className={`text-sm font-semibold text-slate-800 ${rtl ? 'text-right' : ''}`}>
          {t('locationDetails')}
        </h3>

        <div className="relative">
          <MapPin className={`absolute top-3 ${rtl ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400`} />
          <select
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            className={`w-full appearance-none rounded-lg border border-slate-300 bg-white ${rtl ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : ''}`}
          >
            <option value="">{t('selectCity')}</option>
            {cities.map((city) => (
              <option key={city.id} value={getManagedCityName(city, locale)}>
                {getManagedCityName(city, locale)}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          value={data.street}
          onChange={(e) => onChange({ street: e.target.value })}
          placeholder={t('enterStreet')}
          className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : ''}`}
        />

        <input
          type="text"
          value={data.postalCode}
          onChange={(e) => onChange({ postalCode: e.target.value })}
          placeholder={t('enterPostalCode')}
          className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : ''}`}
        />

        <div>
          <p className={`text-xs text-slate-500 mb-2 ${rtl ? 'text-right' : ''}`}>
            {t('clickMapToPin')}
          </p>
          <LocationMap
            lat={data.lat}
            lng={data.lng}
            onLocationChange={(lat, lng) => onChange({ lat, lng })}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className={`text-sm font-semibold text-slate-800 ${rtl ? 'text-right' : ''}`}>
          {t('contactInformation')}
        </h3>

        <div className="relative">
          <User className={`absolute top-3 ${rtl ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400`} />
          <input
            type="text"
            value={data.sellerName}
            onChange={(e) => onChange({ sellerName: e.target.value })}
            placeholder={t('enterSellerName')}
            className={`w-full rounded-lg border border-slate-300 bg-white ${rtl ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : ''}`}
          />
        </div>

        <div className="relative">
          <Phone className={`absolute top-3 ${rtl ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400`} />
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder={t('enterPhone')}
            className={`w-full rounded-lg border border-slate-300 bg-white ${rtl ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : ''}`}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="bk-hide-phone"
            checked={data.hidePhone}
            onChange={(e) => onChange({ hidePhone: e.target.checked })}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="bk-hide-phone" className={`text-xs text-slate-500 ${rtl ? 'text-right' : ''}`}>
            {t('hidePhoneFromPublic')}
          </label>
        </div>

        <div className="relative">
          <Mail className={`absolute top-3 ${rtl ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400`} />
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder={t('enterEmail')}
            className={`w-full rounded-lg border border-slate-300 bg-white ${rtl ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : ''}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium text-slate-700 mb-1 ${rtl ? 'text-right' : ''}`}>
            {t('preferredContact')}
          </label>
          <p className={`text-xs text-slate-500 mb-2 ${rtl ? 'text-right' : ''}`}>
            {t('preferredContactHint')}
          </p>
          <select
            value={data.preferredContact}
            onChange={(e) => onChange({ preferredContact: e.target.value as 'phone' | 'email' | 'both' })}
            className={`w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : ''}`}
          >
            <option value="both">{t('bothPhoneEmail')}</option>
            <option value="phone">{t('phoneOnly')}</option>
            <option value="email">{t('emailOnly')}</option>
          </select>
        </div>
      </div>
    </div>
  );
};
