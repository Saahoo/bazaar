'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, User, MessageSquare } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useCities, getManagedCityName } from '@/lib/hooks/useCities';
import { LegalReadNotice } from '@/components/common/LegalReadNotice';
// InputField import removed - not used in this component

export interface HealthContactData {
  city: string;
  street: string;
  postalCode: string;
  lat: number | null;
  lng: number | null;
  sellerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  preferredContact: 'phone' | 'email' | 'both' | '';
  hidePhone: boolean;
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
  const tForm = useTranslations('form');
  const rtl = isRTL(locale);
  const { cities } = useCities();
  const [hasReadLegal, setHasReadLegal] = useState(data.termsAccepted);
  const [showMap, setShowMap] = useState(!!data.city);

  const inputClass =
    `w-full px-4 py-2.5 border border-slate-300 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 ${rtl ? 'text-right' : 'text-left'}`;
  const labelClass = `block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`;

  // Show map when city is selected
  useEffect(() => {
    if (data.city) {
      setShowMap(true);
    }
  }, [data.city]);

  return (
    <div className="space-y-8">
      <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('locationContact')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('contactDescription')}</p>
      </div>

      {/* Location Section */}
      <div className="space-y-6">
        <h4 className={`text-md font-medium text-slate-800 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('locationDetails')}
        </h4>

        {/* City */}
        <div>
          <label className={labelClass}>
            {t('city')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              aria-label={t('city')}
              value={data.city}
              onChange={(e) => onChange({ city: e.target.value })}
              className={`${inputClass} appearance-none bg-white pr-10`}
              dir={rtl ? 'rtl' : 'ltr'}
            >
              <option value="">{t('selectCity')}</option>
              {cities.map((city) => (
                <option key={city.name_en} value={city.name_en}>
                  {getManagedCityName(city, locale)}{city.country ? ` — ${city.country}` : ''}
                </option>
              ))}
            </select>
            <MapPin
              className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                rtl ? 'left-3' : 'right-3'
              }`}
            />
          </div>
        </div>

        {/* Street Address */}
        <div>
          <label className={labelClass}>{t('streetAddress')}</label>
          <input
            type="text"
            value={data.street}
            onChange={(e) => onChange({ street: e.target.value })}
            placeholder={t('enterStreet')}
            className={inputClass}
            dir={rtl ? 'rtl' : 'ltr'}
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className={labelClass}>{t('postalCode')}</label>
          <input
            type="text"
            value={data.postalCode}
            onChange={(e) => onChange({ postalCode: e.target.value })}
            placeholder={t('enterPostalCode')}
            className={inputClass}
            dir="ltr"
          />
        </div>

        {/* Interactive Map - Conditionally shown after city selection */}
        {showMap && (
          <div>
            <label className={labelClass}>{t('mapLocation')}</label>
            <p className={`text-sm text-slate-500 mb-3 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('clickMapToPin')}
            </p>
            <LocationMap
              lat={data.lat}
              lng={data.lng}
              onLocationChange={(lat, lng) => onChange({ lat, lng })}
            />
            {data.lat !== null && data.lng !== null && (
              <p className={`mt-2 text-xs text-green-600 ${rtl ? 'text-right' : 'text-left'}`}>
                📍 {data.lat.toFixed(6)}, {data.lng.toFixed(6)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Contact Information Section */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <h4 className={`text-md font-medium text-slate-800 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('contactInformation')}
        </h4>

        {/* Seller Name */}
        <div>
          <label className={labelClass}>
            {t('sellerName')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.sellerName}
              onChange={(e) => onChange({ sellerName: e.target.value })}
              placeholder={t('enterSellerName')}
              className={inputClass}
              dir={rtl ? 'rtl' : 'ltr'}
            />
            <User
              className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                rtl ? 'left-3' : 'right-3'
              }`}
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className={labelClass}>
            {tForm('phone')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder={t('enterPhone')}
              className={inputClass}
              dir="ltr"
            />
            <Phone
              className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                rtl ? 'left-3' : 'right-3'
              }`}
            />
          </div>
          <div className="mt-2 flex items-center">
            <input
              type="checkbox"
              id="hb-hidePhone"
              checked={data.hidePhone}
              onChange={(e) => onChange({ hidePhone: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-200"
            />
            <label htmlFor="hb-hidePhone" className={`text-sm text-slate-600 ${rtl ? 'mr-2' : 'ml-2'}`}>
              {t('hidePhoneFromPublic')}
            </label>
          </div>
        </div>

        {/* WhatsApp */}
        <div>
          <label className={labelClass}>{t('whatsapp')}</label>
          <div className="relative">
            <input
              type="tel"
              value={data.whatsapp}
              onChange={(e) => onChange({ whatsapp: e.target.value })}
              placeholder={t('whatsappPlaceholder')}
              className={inputClass}
              dir="ltr"
            />
            <MessageSquare
              className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                rtl ? 'left-3' : 'right-3'
              }`}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>
            {tForm('email')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder={t('enterEmail')}
              className={inputClass}
              dir="ltr"
            />
            <Mail
              className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                rtl ? 'left-3' : 'right-3'
              }`}
            />
          </div>
        </div>

        {/* Preferred Contact Method */}
        <div>
          <label className={labelClass}>{t('preferredContact')}</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => onChange({ preferredContact: 'phone' })}
              className={`px-4 py-3 rounded-lg border transition ${
                data.preferredContact === 'phone'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{t('phoneOnly')}</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => onChange({ preferredContact: 'email' })}
              className={`px-4 py-3 rounded-lg border transition ${
                data.preferredContact === 'email'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{t('emailOnly')}</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => onChange({ preferredContact: 'both' })}
              className={`px-4 py-3 rounded-lg border transition ${
                data.preferredContact === 'both'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>{t('bothPhoneEmail')}</span>
              </div>
            </button>
          </div>
          <p className={`mt-2 text-sm text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('preferredContactHint')}
          </p>
        </div>
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
