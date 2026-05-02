'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, User, MessageSquare } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { useCities, getManagedCityName } from '@/lib/hooks/useCities';

export interface BooksEducationLocationContactData {
  // Location fields
  street: string;
  city: string;
  postalCode: string;
  lat: number | null;
  lng: number | null;
  
  // Contact fields
  sellerName: string;
  phone: string;
  email: string;
  preferredContact: 'phone' | 'email' | 'both';
  hidePhone: boolean;
}

interface StepBooksEducationLocationContactProps {
  locale: Locale;
  data: BooksEducationLocationContactData;
  onChange: (data: Partial<BooksEducationLocationContactData>) => void;
}

// Leaflet map component loaded dynamically to avoid SSR issues
const LocationMap: React.FC<{
  lat: number | null;
  lng: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}> = ({ lat, lng, onLocationChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let L: typeof import('leaflet');
    let mounted = true;

    const initMap = async () => {
      L = await import('leaflet');

      // Fix default icon paths for webpack/next
      const defaultIconPrototype = L.Icon.Default.prototype as unknown as {
        _getIconUrl?: string;
      };
      delete defaultIconPrototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      if (!mounted || !mapRef.current || mapInstanceRef.current) return;

      const defaultLat = lat ?? 34.5553;
      const defaultLng = lng ?? 69.2075;

      const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 13);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      if (lat !== null && lng !== null) {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }

      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng([clickLat, clickLng]);
        } else {
          markerRef.current = L.marker([clickLat, clickLng]).addTo(map);
        }
        onLocationChange(clickLat, clickLng);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker if lat/lng change externally
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    const loadLeaflet = async () => {
      const L = await import('leaflet');
      if (lat !== null && lng !== null) {
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current!);
        }
        mapInstanceRef.current!.setView([lat, lng], 13);
      }
    };
    loadLeaflet();
  }, [lat, lng, mapReady]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <div ref={mapRef} className="w-full h-64 rounded-xl border border-slate-300 z-0" />
    </>
  );
};

export const StepBooksEducationLocationContact: React.FC<StepBooksEducationLocationContactProps> = ({
  locale,
  data,
  onChange,
}) => {
  const t = useTranslations('postAd.booksEducation');
  const tForm = useTranslations('form');
  const rtl = isRTL(locale);
  const { cities } = useCities();

  const inputClass =
    `w-full px-4 py-2.5 border border-slate-300 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 ${rtl ? 'text-right' : 'text-left'}`;
  const labelClass = `block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`;

  const [showMap, setShowMap] = useState(!!data.city);

  // Show map when city is selected
  useEffect(() => {
    if (data.city) {
      setShowMap(true);
    }
  }, [data.city]);

  return (
    <div className="space-y-8">
      <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        {t('locationContact')}
      </h3>

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
              id="be-hidePhone"
              checked={data.hidePhone}
              onChange={(e) => onChange({ hidePhone: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-200"
            />
            <label htmlFor="be-hidePhone" className={`text-sm text-slate-600 ${rtl ? 'mr-2' : 'ml-2'}`}>
              {t('hidePhoneFromPublic')}
            </label>
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
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
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
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
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
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
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
    </div>
  );
};
