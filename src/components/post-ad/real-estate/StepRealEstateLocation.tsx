'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useCities, getManagedCityName } from '@/lib/hooks/useCities';

export interface RealEstateLocationData {
  city: string;
  area_district: string;
  full_address: string;
  lat: number | null;
  lng: number | null;
}

interface StepRealEstateLocationProps {
  locale: Locale;
  data: RealEstateLocationData;
  onChange: (data: Partial<RealEstateLocationData>) => void;
}

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

      const defaultLat = lat ?? 34.5553;
      const defaultLng = lng ?? 69.2075;
      const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 13);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      if (lat !== null && lng !== null) {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }

      map.on('click', (e: L.LeafletMouseEvent) => {
        const clickLat = e.latlng.lat;
        const clickLng = e.latlng.lng;
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
  }, [lat, lng, onLocationChange]);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    (async () => {
      const L = await import('leaflet');
      if (lat !== null && lng !== null) {
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current!);
        }
      }
    })();
  }, [lat, lng, mapReady]);

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <div ref={mapRef} className="w-full h-64 rounded-2xl border border-slate-300" />
    </>
  );
};

export const StepRealEstateLocation: React.FC<StepRealEstateLocationProps> = ({ locale, data, onChange }) => {
  const rtl = isRTL(locale);
  const { cities } = useCities();
  const t = useTranslations('postAd.realEstate');

  const inputClass = `w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`;
  const labelClass = `block text-sm font-semibold text-slate-700 mb-2 ${rtl ? 'text-right' : 'text-left'}`;

  return (
    <div className="space-y-8">
      <div>
        <h3 className={`text-lg font-semibold text-slate-900 mb-4 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('stepLocation')}
        </h3>

        <div className="grid gap-4">
          <div>
            <label className={labelClass}>
              {t('city')} <span className="text-red-500">*</span>
            </label>
            <select
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
          </div>

          <div>
            <label className={labelClass}>{t('areaDistrict')}</label>
            <input
              type="text"
              value={data.area_district}
              onChange={(e) => onChange({ area_district: e.target.value })}
              placeholder={t('enterAreaDistrict')}
              className={inputClass}
              dir={rtl ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className={labelClass}>{t('fullAddress')}</label>
            <textarea
              rows={3}
              value={data.full_address}
              onChange={(e) => onChange({ full_address: e.target.value })}
              placeholder={t('enterFullAddress')}
              className={`${inputClass} resize-none`}
              dir={rtl ? 'rtl' : 'ltr'}
            />
          </div>

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
              <p className={`mt-2 text-xs text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>
                {data.lat.toFixed(6)}, {data.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
