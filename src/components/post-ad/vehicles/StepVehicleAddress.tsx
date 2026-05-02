'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { useCities, getManagedCityName } from '@/lib/hooks/useCities';

export interface VehicleAddressData {
  city: string;
  street: string;
  area: string;
  lat: number | null;
  lng: number | null;
  // Privacy and visibility settings
  showExactAddress: boolean;
  showOnMap: boolean;
  // Region-specific address fields
  postalCode: string;
  landmark: string;
  // Dealer information (if applicable)
  isDealerListing: boolean;
  dealerName: string;
  dealerLicense: string;
}

interface StepVehicleAddressProps {
  locale: Locale;
  data: VehicleAddressData;
  onChange: (data: Partial<VehicleAddressData>) => void;
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

export const StepVehicleAddress: React.FC<StepVehicleAddressProps> = ({
  locale,
  data,
  onChange,
}) => {
  const t = useTranslations('postAd.vehicles');
  const rtl = isRTL(locale);
  const { cities } = useCities();

  const inputClass =
    `w-full px-4 py-2.5 border border-slate-300 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`;
  const labelClass = `block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`;

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        {t('address')}
      </h3>

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

      {/* Street */}
      <div>
        <label className={labelClass}>{t('street')}</label>
        <input
          type="text"
          value={data.street}
          onChange={(e) => onChange({ street: e.target.value })}
          placeholder={t('enterStreet')}
          className={inputClass}
          dir={rtl ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Area */}
      <div>
        <label className={labelClass}>{t('area')}</label>
        <input
          type="text"
          value={data.area}
          onChange={(e) => onChange({ area: e.target.value })}
          placeholder={t('enterArea')}
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
          dir={rtl ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Landmark */}
      <div>
        <label className={labelClass}>{t('landmark')}</label>
        <input
          type="text"
          value={data.landmark}
          onChange={(e) => onChange({ landmark: e.target.value })}
          placeholder={t('enterLandmark')}
          className={inputClass}
          dir={rtl ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Privacy Toggles */}
      <div className="space-y-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
        <h4 className={`text-md font-medium text-slate-800 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('privacySettings')}
        </h4>
        
        <div className={`flex items-center justify-between ${rtl ? 'flex-row-reverse' : ''}`}>
          <div>
            <label className={`block text-sm font-medium text-slate-700 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('showExactAddress')}
            </label>
            <p className={`text-xs text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('showExactAddressHint')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange({ showExactAddress: !data.showExactAddress })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              data.showExactAddress ? 'bg-primary-600' : 'bg-slate-300'
            }`}
            aria-label={data.showExactAddress ? t('exactAddressShown') : t('exactAddressHidden')}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                data.showExactAddress ? (rtl ? 'translate-x-[-1.25rem]' : 'translate-x-6') : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className={`flex items-center justify-between ${rtl ? 'flex-row-reverse' : ''}`}>
          <div>
            <label className={`block text-sm font-medium text-slate-700 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('showOnMap')}
            </label>
            <p className={`text-xs text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('showOnMapHint')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange({ showOnMap: !data.showOnMap })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              data.showOnMap ? 'bg-primary-600' : 'bg-slate-300'
            }`}
            aria-label={data.showOnMap ? t('mapShown') : t('mapHidden')}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                data.showOnMap ? (rtl ? 'translate-x-[-1.25rem]' : 'translate-x-6') : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dealer Information */}
      <div className="space-y-4 p-4 border border-slate-200 rounded-lg bg-blue-50">
        <div className={`flex items-center justify-between ${rtl ? 'flex-row-reverse' : ''}`}>
          <h4 className={`text-md font-medium text-blue-800 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('dealerInformation')}
          </h4>
          <button
            type="button"
            onClick={() => onChange({ isDealerListing: !data.isDealerListing })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              data.isDealerListing ? 'bg-blue-600' : 'bg-slate-300'
            }`}
            aria-label={data.isDealerListing ? t('dealerModeOn') : t('dealerModeOff')}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                data.isDealerListing ? (rtl ? 'translate-x-[-1.25rem]' : 'translate-x-6') : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {data.isDealerListing && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>{t('dealerName')}</label>
              <input
                type="text"
                value={data.dealerName}
                onChange={(e) => onChange({ dealerName: e.target.value })}
                placeholder={t('enterDealerName')}
                className={inputClass}
                dir={rtl ? 'rtl' : 'ltr'}
              />
            </div>

            <div>
              <label className={labelClass}>{t('dealerLicense')}</label>
              <input
                type="text"
                value={data.dealerLicense}
                onChange={(e) => onChange({ dealerLicense: e.target.value })}
                placeholder={t('enterDealerLicense')}
                className={inputClass}
                dir={rtl ? 'rtl' : 'ltr'}
              />
            </div>

            <p className={`text-xs text-blue-600 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('dealerInfoHint')}
            </p>
          </div>
        )}
      </div>

      {/* Map Location */}
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
    </div>
  );
};
