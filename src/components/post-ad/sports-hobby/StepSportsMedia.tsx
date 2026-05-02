'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Video, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isRTL, Locale } from '@/lib/i18n/config';
import { ImageUploader, UploadedPhoto } from '../ImageUploader';
import { POPULAR_CITIES } from '@/lib/constants/cities';

export interface SportsMediaData {
  photos: UploadedPhoto[];
  videoUrl: string;
}

interface StepSportsMediaProps {
  locale: Locale;
  data: SportsMediaData;
  city: string;
  lat: number | null;
  lng: number | null;
  onChange: (updates: Partial<SportsMediaData & { city: string; lat: number | null; lng: number | null }>) => void;
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

export const StepSportsMedia: React.FC<StepSportsMediaProps> = ({ 
  locale, 
  data, 
  city, 
  lat, 
  lng, 
  onChange 
}) => {
  const t = useTranslations('postAd.sportsHobby');
  const rtl = isRTL(locale);

  const inputClass =
    `w-full px-4 py-2.5 border border-slate-300 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`;

  // Get city name based on locale
  const getCityName = (cityObj: typeof POPULAR_CITIES[0]) => {
    switch (locale) {
      case 'ps': return cityObj.name_ps;
      case 'fa': return cityObj.name_fa;
      default: return cityObj.name_en;
    }
  };

  // Handle city change
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    const cityObj = POPULAR_CITIES.find(c => getCityName(c) === newCity);
    
    if (cityObj) {
      onChange({ 
        city: newCity,
        lat: cityObj.latitude,
        lng: cityObj.longitude
      });
    } else {
      onChange({ city: newCity });
    }
  };

  // Handle map location change
  const handleLocationChange = (newLat: number, newLng: number) => {
    onChange({ lat: newLat, lng: newLng });
  };

  return (
    <div className="space-y-8">
      {/* Photos Section */}
      <div>
        <h3 className={`text-lg font-semibold text-slate-900 mb-1 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('photos')} <span className="text-red-500">*</span>
        </h3>
        <p className={`text-sm text-slate-500 mb-3 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('photosRequired')}
        </p>
        <ImageUploader
          locale={locale}
          photos={data.photos}
          onChange={(photos) => onChange({ photos })}
          maxPhotos={12}
          folder="listings/sports-hobby"
          showSourceButtons
        />
        <p className={`mt-2 text-xs text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('videoHint')}
        </p>
      </div>

      {/* Location Section */}
      <div>
        <h3 className={`text-lg font-semibold text-slate-900 mb-3 ${rtl ? 'text-right' : 'text-left'}`}>
          <MapPin className="inline-block w-5 h-5 mr-2" />
          {t('location') || 'Location'} <span className="text-red-500">*</span>
        </h3>
        
        {/* City Selection */}
        <div className="mb-6">
          <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('city') || 'City'}
          </label>
          <div className="relative">
            <select
              value={city}
              onChange={handleCityChange}
              className={`${inputClass} appearance-none`}
              dir={rtl ? 'rtl' : 'ltr'}
              required
            >
              <option value="">{t('selectCity') || 'Select a city'}</option>
              {POPULAR_CITIES.map((cityObj) => (
                <option key={cityObj.name_en} value={getCityName(cityObj)}>
                  {getCityName(cityObj)}
                </option>
              ))}
            </select>
            <div className={`pointer-events-none absolute inset-y-0 ${rtl ? 'left-3' : 'right-3'} flex items-center`}>
              <MapPin className="w-4 h-4 text-slate-400" />
            </div>
          </div>
          <p className={`mt-1 text-xs text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('cityRequiredHint') || 'Please select the city where your item is located'}
          </p>
        </div>

        {/* Map Picker (Optional) */}
        {city && (
          <div className="mb-6">
            <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('exactLocation') || 'Exact Location (Optional)'}
            </label>
            <p className={`text-sm text-slate-500 mb-3 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('mapHint') || 'Click on the map to pinpoint your exact location. This helps buyers find your item more easily.'}
            </p>
            <LocationMap
              lat={lat}
              lng={lng}
              onLocationChange={handleLocationChange}
            />
            {(lat !== null && lng !== null) && (
              <p className={`mt-2 text-xs text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>
                {t('locationSelected') || `Location selected: ${lat.toFixed(4)}, ${lng.toFixed(4)}`}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Video Section */}
      <div>
        <h3 className={`text-lg font-semibold text-slate-900 mb-3 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('video')}
        </h3>
        <div className="relative">
          <input
            type="url"
            value={data.videoUrl}
            onChange={(e) => onChange({ videoUrl: e.target.value })}
            placeholder={t('videoPlaceholder')}
            className={inputClass}
            dir="ltr"
          />
          <Video className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${rtl ? 'left-3' : 'right-3'}`} />
        </div>
      </div>
    </div>
  );
};