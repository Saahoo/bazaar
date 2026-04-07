// src/lib/constants/categories.ts
export interface Category {
  id: number;
  name_en: string;
  name_ps: string;
  name_fa: string;
  icon: string;
}

export const MAIN_CATEGORIES: Category[] = [
  {
    id: 1,
    name_en: 'Vehicles',
    name_ps: 'موټرونه',
    name_fa: 'وسایل نقلیه',
    icon: 'car',
  },
  {
    id: 2,
    name_en: 'Real Estate',
    name_ps: 'ملکیت',
    name_fa: 'ملک و ملکیت',
    icon: 'home',
  },
  {
    id: 3,
    name_en: 'Electronics',
    name_ps: 'بریښنایي توکي',
    name_fa: 'لوازم الکترونیکی',
    icon: 'smartphone',
  },
  {
    id: 4,
    name_en: 'Fashion & Clothing',
    name_ps: 'فیشن او جامې',
    name_fa: 'مد و لباس',
    icon: 'shirt',
  },
  {
    id: 5,
    name_en: 'Spare Parts',
    name_ps: 'سپیئر پارټونه',
    name_fa: 'قطعات یدکی',
    icon: 'puzzle',
  },
];

export const getCategoryName = (categoryId: number, locale: 'en' | 'ps' | 'fa'): string => {
  const category = MAIN_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return 'Unknown';

  switch (locale) {
    case 'en':
      return category.name_en;
    case 'ps':
      return category.name_ps;
    case 'fa':
      return category.name_fa;
    default:
      return category.name_en;
  }
};
