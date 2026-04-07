// src/lib/constants/cities.ts
export interface City {
  name_en: string;
  name_ps: string;
  name_fa: string;
  country: string;
  latitude: number;
  longitude: number;
  featured: boolean;
}

export const POPULAR_CITIES: City[] = [
  {
    name_en: 'Kabul',
    name_ps: 'کابل',
    name_fa: 'کابل',
    country: 'Afghanistan',
    latitude: 34.5199,
    longitude: 69.1976,
    featured: true,
  },
  {
    name_en: 'Istanbul',
    name_ps: 'استنبول',
    name_fa: 'استانبول',
    country: 'Turkey',
    latitude: 41.0082,
    longitude: 28.9784,
    featured: true,
  },
  {
    name_en: 'Peshawar',
    name_ps: 'پیشاور',
    name_fa: 'پشاور',
    country: 'Pakistan',
    latitude: 34.0151,
    longitude: 71.5249,
    featured: true,
  },
  {
    name_en: 'Herat',
    name_ps: 'ہرات',
    name_fa: 'هرات',
    country: 'Afghanistan',
    latitude: 34.3425,
    longitude: 62.1944,
    featured: true,
  },
  {
    name_en: 'Kandahar',
    name_ps: 'کندھار',
    name_fa: 'قندهار',
    country: 'Afghanistan',
    latitude: 31.6068,
    longitude: 65.7096,
    featured: true,
  },
  {
    name_en: 'Mazar-e-Sharif',
    name_ps: 'مزار شریف',
    name_fa: 'مزار شریف',
    country: 'Afghanistan',
    latitude: 36.7169,
    longitude: 67.1285,
    featured: true,
  },
  {
    name_en: 'Lahore',
    name_ps: 'لاہور',
    name_fa: 'لاهور',
    country: 'Pakistan',
    latitude: 31.5204,
    longitude: 74.3587,
    featured: false,
  },
  {
    name_en: 'Karachi',
    name_ps: 'کراچی',
    name_fa: 'کراچی',
    country: 'Pakistan',
    latitude: 24.8607,
    longitude: 67.0011,
    featured: false,
  },
];

export const getCityName = (cityName: string, locale: 'en' | 'ps' | 'fa'): string => {
  const city = POPULAR_CITIES.find((c) => c.name_en.toLowerCase() === cityName.toLowerCase());
  if (!city) return cityName;

  switch (locale) {
    case 'en':
      return city.name_en;
    case 'ps':
      return city.name_ps;
    case 'fa':
      return city.name_fa;
    default:
      return city.name_en;
  }
};
