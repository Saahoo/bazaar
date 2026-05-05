'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, User } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { useCities, getManagedCityName } from '@/lib/hooks/useCities';

export interface ConstructionMaterialsLocationContactData {
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

interface StepConstructionMaterialsLocationContactProps {
  locale: Locale;
  data: ConstructionMaterialsLocationContactData;
  onChange: (updates: Partial<ConstructionMaterialsLocationContactData>) => void;
}

// Lazy-loaded Leaflet map component
const LocationMap: React.FC<{
  lat: number | null;
  lng: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}> = ({ lat, lng, onLocationChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [_mapReady, setMapReady] = useState(false);

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

  // Update marker position when lat/lng change externally
  useEffect(() => {
    if (mapInstanceRef.current && lat !== null && lng !== null) {
      mapInstanceRef.current.setView([lat, lng], 13);
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
    }
  }, [lat, lng]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <div
        ref={mapRef}
        className="h-48 w-full rounded-lg border border-slate-300"
        style={{ zIndex: 0 }}
      />
    </>
  );
};

export const StepConstructionMaterialsLocationContact: React.FC<StepConstructionMaterialsLocationContactProps> = ({
  locale,
  data,
  onChange,
}) => {
  const t = useTranslations('postAd.constructionMaterials');
  const rtl = isRTL(locale);
  const { cities } = useCities();

  return (
    <div className="space-y-6">
      {/* Location Section */}
      <div className="space-y-4">
        <h3 className={`text-sm font-semibold text-slate-800 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('location')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City */}
          <div className="relative">
            <label className={`block text-sm font-medium text-slate-700 mb-1 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('fields.city')}
              <span className="text-red-500 mr-1">*</span>
            </label>
            <div className="relative">
              <select
                value={data.city}
                onChange={(e) => onChange({ city: e.target.value })}
                title={t('fields.city')}
                className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : 'text-left'}`}
              >
                <option value="">{t('selectCity')}</option>
                {cities.map((city) => (
                  <option key={city.id} value={getManagedCityName(city, locale)}>
                    {getManagedCityName(city, locale)}
                  </option>
                ))}
              </select>
              <MapPin className={`absolute top-2.5 ${rtl ? 'left-3' : 'right-3'} h-4 w-4 text-slate-400 pointer-events-none`} />
            </div>
          </div>

          {/* Street */}
          <div>
            <label className={`block text-sm font-medium text-slate-700 mb-1 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('fields.street')}
            </label>
            <input
              type="text"
              value={data.street}
              onChange={(e) => onChange({ street: e.target.value })}
              placeholder={t('fields.streetPlaceholder')}
              className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : 'text-left'}`}
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className={`block text-sm font-medium text-slate-700 mb-1 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('fields.postalCode')}
            </label>
            <input
              type="text"
              value={data.postalCode}
              onChange={(e) => onChange({ postalCode: e.target.value })}
              placeholder={t('fields.postalCodePlaceholder')}
              className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : 'text-left'}`}
            />
          </div>
        </div>

        {/* Map */}
        <div>
          <LocationMap
            lat={data.lat}
            lng={data.lng}
            onLocationChange={(lat, lng) => onChange({ lat, lng })}
          />
        </div>
      </div>

      {/* Contact Section */}
      <div className="space-y-4">
        <h3 className={`text-sm font-semibold text-slate-800 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('contact')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Seller Name */}
          <div className="relative">
            <label className={`block text-sm font-medium text-slate-700 mb-1 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('fields.sellerName')}
              <span className="text-red-500 mr-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.sellerName}
                onChange={(e) => onChange({ sellerName: e.target.value })}
                placeholder={t('fields.sellerNamePlaceholder')}
                className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : 'text-left'}`}
              />
              <User className={`absolute top-2.5 ${rtl ? 'left-3' : 'right-3'} h-4 w-4 text-slate-400 pointer-events-none`} />
            </div>
          </div>

          {/* Phone */}
          <div className="relative">
            <label className={`block text-sm font-medium text-slate-700 mb-1 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('fields.phone')}
              <span className="text-red-500 mr-1">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder={t('fields.phonePlaceholder')}
                className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : 'text-left'}`}
              />
              <Phone className={`absolute top-2.5 ${rtl ? 'left-3' : 'right-3'} h-4 w-4 text-slate-400 pointer-events-none`} />
            </div>
            {/* Hide phone checkbox */}
            <label className={`flex items-center gap-2 mt-1 cursor-pointer text-xs text-slate-500 ${rtl ? 'flex-row-reverse' : ''}`}>
              <input
                type="checkbox"
                checked={data.hidePhone}
                onChange={(e) => onChange({ hidePhone: e.target.checked })}
                className="rounded border-slate-300"
              />
              {t('fields.hidePhone')}
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <label className={`block text-sm font-medium text-slate-700 mb-1 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('fields.email')}
            </label>
            <div className="relative">
              <input
                type="email"
                value={data.email}
                onChange={(e) => onChange({ email: e.target.value })}
                placeholder={t('fields.emailPlaceholder')}
                className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : 'text-left'}`}
              />
              <Mail className={`absolute top-2.5 ${rtl ? 'left-3' : 'right-3'} h-4 w-4 text-slate-400 pointer-events-none`} />
            </div>
          </div>

          {/* Preferred Contact */}
          <div>
            <label className={`block text-sm font-medium text-slate-700 mb-1 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('fields.preferredContact')}
            </label>
            <div className={`flex gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
              {(['phone', 'email', 'both'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => onChange({ preferredContact: method })}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    data.preferredContact === method
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t(`optionLabels.${method}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
