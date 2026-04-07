// src/lib/constants/mock-data.ts
import { Locale } from '@/lib/i18n/config';

export interface MockListing {
  id: string;
  title: { en: string; ps: string; fa: string };
  description: { en: string; ps: string; fa: string };
  price: number;
  currency: string;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  category_id: number;
  city: string;
  photos: string[];
  user_id: string;
  status: 'active' | 'sold' | 'expired' | 'draft';
  view_count: number;
  favorite_count: number;
  phone: string;
  created_at: string;
}

export interface MockUser {
  id: string;
  display_name: string;
  email: string;
  phone: string;
  bio: string;
  verified: boolean;
  rating: number;
  review_count: number;
  listing_count: number;
  member_since: string;
}

export interface MockMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  listing_id: string;
  listing_title: string;
  last_message: string;
  unread: boolean;
  created_at: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'u1',
    display_name: 'Ahmad Khan',
    email: 'ahmad@example.com',
    phone: '+93 700 123 456',
    bio: 'Trusted seller in Kabul since 2020. Specializing in electronics and vehicles.',
    verified: true,
    rating: 4.8,
    review_count: 47,
    listing_count: 12,
    member_since: '2020-03-15',
  },
  {
    id: 'u2',
    display_name: 'Fatima Noori',
    email: 'fatima@example.com',
    phone: '+93 799 555 123',
    bio: 'Fashion and home decor enthusiast.',
    verified: true,
    rating: 4.5,
    review_count: 23,
    listing_count: 8,
    member_since: '2021-06-10',
  },
  {
    id: 'u3',
    display_name: 'Mohammad Rafi',
    email: 'rafi@example.com',
    phone: '+92 321 999 8877',
    bio: 'Real estate agent with 5 years experience.',
    verified: false,
    rating: 4.2,
    review_count: 15,
    listing_count: 6,
    member_since: '2022-01-20',
  },
  {
    id: 'u4',
    display_name: 'Zahra Ahmadi',
    email: 'zahra@example.com',
    phone: '+93 788 432 100',
    bio: 'Selling quality second-hand items.',
    verified: true,
    rating: 4.9,
    review_count: 62,
    listing_count: 18,
    member_since: '2019-11-05',
  },
];

export const MOCK_LISTINGS: MockListing[] = [
  {
    id: 'l1',
    title: { en: 'Toyota Corolla 2020 - Excellent Condition', ps: 'ټویوټا کرولا 2020 - عالي حالت', fa: 'تویوتا کرولا 2020 - وضعیت عالی' },
    description: { en: 'Well maintained Toyota Corolla 2020 model. Single owner, full service history. Low mileage, perfect for family use.', ps: 'ښه ساتل شوی ټویوټا کرولا 2020 ماډل. یو مالک, بشپړ سروس تاریخ.', fa: 'تویوتا کرولا 2020 با نگهداری عالی. یک مالکه، تاریخچه سرویس کامل.' },
    price: 850000,
    currency: 'AFN',
    condition: 'like_new',
    category_id: 1,
    city: 'Kabul',
    photos: [],
    user_id: 'u1',
    status: 'active',
    view_count: 234,
    favorite_count: 18,
    phone: '+93 700 123 456',
    created_at: '2026-03-28',
  },
  {
    id: 'l2',
    title: { en: '3 Bedroom Apartment for Rent - Karte-e-Char', ps: '3 خونه اپارتمان د کرایې لپاره - کارته چهار', fa: 'آپارتمان 3 خوابه اجاره ای - کارته چهار' },
    description: { en: 'Spacious 3 bedroom apartment in Karte-e-Char area. Modern kitchen, 2 bathrooms, parking space included. Close to schools and markets.', ps: 'پراخ 3 خونه اپارتمان د کارته چهار سیمه کې. عصري آشپزخانه, 2 حمامونه.', fa: 'آپارتمان 3 خوابه جادار در منطقه کارته چهار. آشپزخانه مدرن، 2 حمام.' },
    price: 25000,
    currency: 'AFN',
    condition: 'good',
    category_id: 2,
    city: 'Kabul',
    photos: [],
    user_id: 'u3',
    status: 'active',
    view_count: 567,
    favorite_count: 42,
    phone: '+92 321 999 8877',
    created_at: '2026-04-01',
  },
  {
    id: 'l3',
    title: { en: 'iPhone 15 Pro Max 256GB - Brand New', ps: 'آیفون 15 پرو مکس 256GB - بالکل نوی', fa: 'آیفون 15 پرو مکس 256GB - کاملا نو' },
    description: { en: 'Brand new iPhone 15 Pro Max, 256GB storage. Sealed box with warranty. Natural Titanium color.', ps: 'بالکل نوی آیفون 15 پرو مکس, 256GB ذخیره. مهر شوی بکس.', fa: 'آیفون 15 پرو مکس کاملا نو، 256GB حافظه. جعبه مهر شده با گارانتی.' },
    price: 1200,
    currency: 'USD',
    condition: 'new',
    category_id: 3,
    city: 'Kabul',
    photos: [],
    user_id: 'u1',
    status: 'active',
    view_count: 892,
    favorite_count: 65,
    phone: '+93 700 123 456',
    created_at: '2026-04-03',
  },
  {
    id: 'l4',
    title: { en: 'Wedding Dress - Designer Collection', ps: 'واده جامې - ډیزاینر کلکسیون', fa: 'لباس عروسی - کلکسیون طراح' },
    description: { en: 'Beautiful designer wedding dress. Worn once, dry cleaned. Size M. Includes veil and accessories.', ps: 'ښکلی ډیزاینر واده جامې. یو ځل اغوستل شوي.', fa: 'لباس عروسی زیبای طراح. یک بار پوشیده شده، خشکشویی شده.' },
    price: 15000,
    currency: 'AFN',
    condition: 'like_new',
    category_id: 4,
    city: 'Herat',
    photos: [],
    user_id: 'u2',
    status: 'active',
    view_count: 156,
    favorite_count: 12,
    phone: '+93 799 555 123',
    created_at: '2026-03-25',
  },
  {
    id: 'l5',
    title: { en: 'Samsung Galaxy S24 Ultra - Used', ps: 'سامسنګ ګلکسي S24 الترا - کارول شوی', fa: 'سامسونگ گلکسی S24 اولترا - کارکرده' },
    description: { en: 'Samsung Galaxy S24 Ultra in good condition. Minor scratches on back. Comes with original charger and box.', ps: 'سامسنګ ګلکسي S24 الترا په ښه حالت کې. اصلي چارجر او بکس.', fa: 'سامسونگ گلکسی S24 اولترا در وضعیت خوب. شارژر و جعبه اصلی.' },
    price: 45000,
    currency: 'AFN',
    condition: 'good',
    category_id: 3,
    city: 'Mazar-e-Sharif',
    photos: [],
    user_id: 'u2',
    status: 'active',
    view_count: 312,
    favorite_count: 22,
    phone: '+93 799 555 123',
    created_at: '2026-03-30',
  },
  {
    id: 'l6',
    title: { en: 'Honda Civic 2018 - Well Maintained', ps: 'هونډا سیویک 2018 - ښه ساتل شوی', fa: 'هوندا سیویک 2018 - نگهداری عالی' },
    description: { en: 'Honda Civic 2018 model in excellent condition. Automatic transmission. Recently serviced.', ps: 'هونډا سیویک 2018 ماډل په عالي حالت کې. اتوماتیک.', fa: 'هوندا سیویک مدل 2018 در وضعیت عالی. گیربکس اتوماتیک.' },
    price: 650000,
    currency: 'AFN',
    condition: 'good',
    category_id: 1,
    city: 'Peshawar',
    photos: [],
    user_id: 'u3',
    status: 'active',
    view_count: 445,
    favorite_count: 33,
    phone: '+92 321 999 8877',
    created_at: '2026-03-15',
  },
  {
    id: 'l7',
    title: { en: 'Toyota Brake Pads - Original', ps: 'ټویوټا بریک پیډونه - اصلي', fa: 'لنت ترمز تویوتا - اصلی' },
    description: { en: 'Original Toyota brake pads. Fits Corolla 2015-2023. Brand new, sealed package.', ps: 'اصلي ټویوټا بریک پیډونه. کرولا 2015-2023 لپاره.', fa: 'لنت ترمز اصلی تویوتا. مناسب کرولا 2015-2023. نو، بسته بندی.' },
    price: 3500,
    currency: 'AFN',
    condition: 'new',
    category_id: 5,
    city: 'Kabul',
    photos: [],
    user_id: 'u1',
    status: 'active',
    view_count: 189,
    favorite_count: 8,
    phone: '+93 700 123 456',
    created_at: '2026-04-02',
  },
  {
    id: 'l8',
    title: { en: 'Men\'s Leather Jacket - Size L', ps: 'نارینه چرمي جاکټ - اندازه L', fa: 'کاپشن چرم مردانه - سایز L' },
    description: { en: 'Premium leather jacket in excellent condition. Barely worn. Dark brown color, size L.', ps: 'لوړ کیفیت چرمي جاکټ په عالي حالت کې. تور نسواري رنګ.', fa: 'کاپشن چرم با کیفیت در وضعیت عالی. رنگ قهوه ای تیره، سایز L.' },
    price: 8000,
    currency: 'AFN',
    condition: 'like_new',
    category_id: 4,
    city: 'Kandahar',
    photos: [],
    user_id: 'u4',
    status: 'active',
    view_count: 98,
    favorite_count: 5,
    phone: '+93 788 432 100',
    created_at: '2026-03-20',
  },
  {
    id: 'l9',
    title: { en: 'Land for Sale - 500 sqm Karte-e-Mamorin', ps: 'ځمکه پلورل کیږي - 500 مربع متره کارته مامورین', fa: 'زمین فروشی - 500 متر مربع کارته مامورین' },
    description: { en: 'Prime residential land in Karte-e-Mamorin. 500 sqm with clear title deed. Road access on two sides.', ps: 'د کارته مامورین کې عالي استوګنځي ځمکه. 500 مربع متره.', fa: 'زمین مسکونی عالی در کارته مامورین. 500 متر مربع با سند رسمی.' },
    price: 50000,
    currency: 'USD',
    condition: 'new',
    category_id: 2,
    city: 'Kabul',
    photos: [],
    user_id: 'u3',
    status: 'active',
    view_count: 678,
    favorite_count: 35,
    phone: '+92 321 999 8877',
    created_at: '2026-04-05',
  },
  {
    id: 'l10',
    title: { en: 'Engine Oil Filter - Universal', ps: 'د انجن تیلو فلتر - عمومي', fa: 'فیلتر روغن موتور - یونیورسال' },
    description: { en: 'Universal engine oil filter. Compatible with most Japanese and Korean vehicles. High quality aftermarket.', ps: 'عمومي انجن تیلو فلتر. ډیری جاپاني او کوریایي موټرونو سره مطابقت لري.', fa: 'فیلتر روغن موتور یونیورسال. سازگار با اکثر خودروهای ژاپنی و کره ای.' },
    price: 450,
    currency: 'AFN',
    condition: 'new',
    category_id: 5,
    city: 'Kabul',
    photos: [],
    user_id: 'u4',
    status: 'active',
    view_count: 134,
    favorite_count: 11,
    phone: '+93 788 432 100',
    created_at: '2026-04-06',
  },
  {
    id: 'l11',
    title: { en: 'Toyota Hilux 2019 - 4x4', ps: 'ټویوټا هایلکس 2019 - 4x4', fa: 'تویوتا هایلوکس 2019 - 4x4' },
    description: { en: 'Toyota Hilux 2019 double cab 4x4. Diesel engine, 80,000 km. Great for off-road and business use.', ps: 'ټویوټا هایلکس 2019 ډبل کیب 4x4. ډیزل انجن, 80,000 کم.', fa: 'تویوتا هایلوکس 2019 دوکابین 4x4. موتور دیزل، 80,000 کیلومتر.' },
    price: 1200000,
    currency: 'AFN',
    condition: 'good',
    category_id: 1,
    city: 'Kabul',
    photos: [],
    user_id: 'u1',
    status: 'sold',
    view_count: 890,
    favorite_count: 47,
    phone: '+93 700 123 456',
    created_at: '2026-02-15',
  },
  {
    id: 'l12',
    title: { en: 'MacBook Pro M3 14-inch - Like New', ps: 'مک بوک پرو M3 14 انچه - نوی په شان', fa: 'مک بوک پرو M3 14 اینچ - مانند نو' },
    description: { en: 'MacBook Pro M3 chip, 14-inch display, 16GB RAM, 512GB SSD. Used for 2 months only. Includes charger and box.', ps: 'مک بوک پرو M3 چپ, 14 انچه ډسپلی, 16GB رام. یوازې 2 میاشتې کارول شوی.', fa: 'مک بوک پرو با تراشه M3، صفحه 14 اینچ، 16 گیگ رم. فقط 2 ماه استفاده شده.' },
    price: 1800,
    currency: 'USD',
    condition: 'like_new',
    category_id: 3,
    city: 'Kabul',
    photos: [],
    user_id: 'u2',
    status: 'active',
    view_count: 567,
    favorite_count: 38,
    phone: '+93 799 555 123',
    created_at: '2026-04-04',
  },
];

export const MOCK_MESSAGES: MockMessage[] = [
  { id: 'm1', sender_id: 'u2', sender_name: 'Fatima Noori', listing_id: 'l3', listing_title: 'iPhone 15 Pro Max', last_message: 'Is this still available?', unread: true, created_at: '2026-04-07T10:30:00' },
  { id: 'm2', sender_id: 'u3', sender_name: 'Mohammad Rafi', listing_id: 'l1', listing_title: 'Toyota Corolla 2020', last_message: 'Can I see the car tomorrow?', unread: true, created_at: '2026-04-07T09:15:00' },
  { id: 'm3', sender_id: 'u4', sender_name: 'Zahra Ahmadi', listing_id: 'l3', listing_title: 'iPhone 15 Pro Max', last_message: 'What is the final price?', unread: false, created_at: '2026-04-06T18:45:00' },
  { id: 'm4', sender_id: 'u1', sender_name: 'Ahmad Khan', listing_id: 'l8', listing_title: 'Men\'s Leather Jacket', last_message: 'Can you deliver to Kabul?', unread: false, created_at: '2026-04-06T14:20:00' },
  { id: 'm5', sender_id: 'u2', sender_name: 'Fatima Noori', listing_id: 'l6', listing_title: 'Honda Civic 2018', last_message: 'Thank you for the information.', unread: false, created_at: '2026-04-05T11:00:00' },
  { id: 'm6', sender_id: 'u3', sender_name: 'Mohammad Rafi', listing_id: 'l5', listing_title: 'Samsung Galaxy S24', last_message: 'Is the warranty valid?', unread: false, created_at: '2026-04-04T16:30:00' },
];

export const getListingTitle = (listing: MockListing, locale: Locale): string => {
  return listing.title[locale] || listing.title.en;
};

export const getListingDescription = (listing: MockListing, locale: Locale): string => {
  return listing.description[locale] || listing.description.en;
};

export const getConditionKey = (condition: string): string => {
  switch (condition) {
    case 'new': return 'newCondition';
    case 'like_new': return 'likeNew';
    case 'good': return 'good';
    case 'fair': return 'fair';
    default: return 'good';
  }
};

export const getMockUser = (userId: string): MockUser | undefined => {
  return MOCK_USERS.find((u) => u.id === userId);
};

export const getMockListing = (listingId: string): MockListing | undefined => {
  return MOCK_LISTINGS.find((l) => l.id === listingId);
};
