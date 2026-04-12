'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { useCities, getManagedCityName } from '@/lib/hooks/useCities';

export interface AddressData {
  city: string;
  district: string;
  street: string;
  unit: string;
  neighborhood: string[];
  lat: number | null;
  lng: number | null;
}

const NEIGHBORHOOD_OPTIONS = [
  'park', 'transport', 'airport', 'market', 'cityCenter',
  'mosque', 'school', 'hospital', 'gym', 'restaurant',
] as const;

interface StepAddressProps {
  locale: Locale;
  data: AddressData;
  onChange: (data: Partial<AddressData>) => void;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    const load = async () => {
      const L = await import('leaflet');
      if (lat !== null && lng !== null) {
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current!);
        }
      }
    };
    load();
  }, [lat, lng, mapReady]);

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <div ref={mapRef} className="w-full h-64 rounded-xl border border-slate-300 z-0" />
    </>
  );
};

export const StepAddress: React.FC<StepAddressProps> = ({
  locale,
  data,
  onChange,
}) => {
  const t = useTranslations('postAd.realEstate');
  const rtl = isRTL(locale);
  const { cities } = useCities();

  const inputClass =
    `w-full px-4 py-2.5 border border-slate-300 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`;

  const labelClass = `block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`;

  const toggleNeighborhood = (item: string) => {
    const current = data.neighborhood || [];
    if (current.includes(item)) {
      onChange({ neighborhood: current.filter((n) => n !== item) });
    } else {
      onChange({ neighborhood: [...current, item] });
    }
  };

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
            title={t('city')}
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            className={`${inputClass} appearance-none bg-white pr-10`}
            dir={rtl ? 'rtl' : 'ltr'}
          >
            <option value="">{t('city')}</option>
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

      {/* District / Street / Unit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t('district')}</label>
          <input
            type="text"
            value={data.district}
            onChange={(e) => onChange({ district: e.target.value })}
            placeholder={t('enterDistrict')}
            className={inputClass}
            dir={rtl ? 'rtl' : 'ltr'}
          />
        </div>
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
      </div>

      <div>
        <label className={labelClass}>{t('unit')}</label>
        <input
          type="text"
          value={data.unit}
          onChange={(e) => onChange({ unit: e.target.value })}
          placeholder={t('enterUnit')}
          className={inputClass}
          dir={rtl ? 'rtl' : 'ltr'}
        />
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
            {data.lat.toFixed(6)}, {data.lng.toFixed(6)}
          </p>
        )}
      </div>

      {/* Neighborhood Multi-select */}
      <div>
        <h3 className={`text-lg font-semibold text-slate-900 mb-4 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('neighborhood')}
        </h3>
        <div className={`flex flex-wrap gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
          {NEIGHBORHOOD_OPTIONS.map((item) => {
            const isSelected = (data.neighborhood || []).includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleNeighborhood(item)}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                {t(item)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
