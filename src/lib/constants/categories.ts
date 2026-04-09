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
    name_ps: 'پرزې',
    name_fa: 'قطعات یدکی',
    icon: 'puzzle',
  },
  {
    id: 6,
    name_en: 'Home & Furniture',
    name_ps: 'کور او فرنیچر',
    name_fa: 'خانه و مبلمان',
    icon: 'sofa',
  },
  {
    id: 7,
    name_en: 'Mobile Phones',
    name_ps: 'ګرځنده تلیفون',
    name_fa: 'گوشی موبایل',
    icon: 'phone',
  },
  {
    id: 8,
    name_en: 'Jobs',
    name_ps: 'دندې',
    name_fa: 'کار و استخدام',
    icon: 'briefcase',
  },
  {
    id: 9,
    name_en: 'Services',
    name_ps: 'خدمتونه',
    name_fa: 'خدمات',
    icon: 'wrench',
  },
  {
    id: 10,
    name_en: 'Animals & Livestock',
    name_ps: 'حیوانات او مالداري',
    name_fa: 'حیوانات و دامداری',
    icon: 'paw',
  },
  {
    id: 11,
    name_en: 'Food & Agriculture',
    name_ps: 'خوراکي توکي او کرنه',
    name_fa: 'مواد غذایی و کشاورزی',
    icon: 'leaf',
  },
  {
    id: 12,
    name_en: 'Books & Education',
    name_ps: 'کتابونه او زده کړه',
    name_fa: 'کتاب و آموزش',
    icon: 'book',
  },
  {
    id: 13,
    name_en: 'Health & Beauty',
    name_ps: 'روغتیا او ښکلا',
    name_fa: 'بهداشت و زیبایی',
    icon: 'heart',
  },
  {
    id: 14,
    name_en: 'Sports & Hobbies',
    name_ps: 'سپورت او تفریح',
    name_fa: 'ورزش و سرگرمی',
    icon: 'bike',
  },
  {
    id: 15,
    name_en: 'Kids & Baby',
    name_ps: 'ماشومان او کوچنیان',
    name_fa: 'کودک و نوزاد',
    icon: 'baby',
  },
  {
    id: 16,
    name_en: 'Business & Industry',
    name_ps: 'سوداګري او صنعت',
    name_fa: 'تجارت و صنعت',
    icon: 'zap',
  },
  {
    id: 17,
    name_en: 'Shopping & Groceries',
    name_ps: 'پلورنځي او پیرود',
    name_fa: 'خرید و سوپرمارکت',
    icon: 'shopping-bag',
  },
  {
    id: 18,
    name_en: 'Construction & Materials',
    name_ps: 'ساختماني توکي',
    name_fa: 'مصالح ساختمانی',
    icon: 'hammer',
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
