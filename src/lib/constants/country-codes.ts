// src/lib/constants/country-codes.ts
// International country codes with dial codes, flag emojis, and names

export interface CountryCode {
  code: string;       // ISO 2-letter code
  dial: string;       // Dial code e.g. "+93"
  name: string;       // English name
  flag: string;       // Flag emoji
  namePs?: string;    // Pashto name
  nameFa?: string;    // Dari name
}

export const COUNTRY_CODES: CountryCode[] = [
  // Afghanistan first (primary market)
  { code: 'AF', dial: '+93', name: 'Afghanistan', flag: '🇦🇫', namePs: 'افغانستان', nameFa: 'افغانستان' },
  // Neighbors & regional
  { code: 'PK', dial: '+92', name: 'Pakistan', flag: '🇵🇰', namePs: 'پاکستان', nameFa: 'پاکستان' },
  { code: 'IR', dial: '+98', name: 'Iran', flag: '🇮🇷', namePs: 'ایران', nameFa: 'ایران' },
  { code: 'IN', dial: '+91', name: 'India', flag: '🇮🇳', namePs: 'هند', nameFa: 'هند' },
  { code: 'TJ', dial: '+992', name: 'Tajikistan', flag: '🇹🇯', namePs: 'تاجکستان', nameFa: 'تاجکستان' },
  { code: 'UZ', dial: '+998', name: 'Uzbekistan', flag: '🇺🇿', namePs: 'ازبکستان', nameFa: 'ازبکستان' },
  { code: 'TM', dial: '+993', name: 'Turkmenistan', flag: '🇹🇲', namePs: 'ترکمنستان', nameFa: 'ترکمنستان' },
  { code: 'CN', dial: '+86', name: 'China', flag: '🇨🇳', namePs: 'چین', nameFa: 'چین' },
  { code: 'TR', dial: '+90', name: 'Turkey', flag: '🇹🇷', namePs: 'ترکیه', nameFa: 'ترکیه' },
  { code: 'AE', dial: '+971', name: 'UAE', flag: '🇦🇪', namePs: 'امارات', nameFa: 'امارات' },
  { code: 'SA', dial: '+966', name: 'Saudi Arabia', flag: '🇸🇦', namePs: 'سعودي عربستان', nameFa: 'عربستان سعودی' },
  { code: 'QA', dial: '+974', name: 'Qatar', flag: '🇶🇦', namePs: 'قطر', nameFa: 'قطر' },
  { code: 'KW', dial: '+965', name: 'Kuwait', flag: '🇰🇼', namePs: 'کویت', nameFa: 'کویت' },
  { code: 'BH', dial: '+973', name: 'Bahrain', flag: '🇧🇭', namePs: 'بحرین', nameFa: 'بحرین' },
  { code: 'OM', dial: '+968', name: 'Oman', flag: '🇴🇲', namePs: 'عمان', nameFa: 'عمان' },
  { code: 'IQ', dial: '+964', name: 'Iraq', flag: '🇮🇶', namePs: 'عراق', nameFa: 'عراق' },
  // Americas
  { code: 'US', dial: '+1', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', dial: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: 'MX', dial: '+52', name: 'Mexico', flag: '🇲🇽' },
  { code: 'BR', dial: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: 'AR', dial: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CO', dial: '+57', name: 'Colombia', flag: '🇨🇴' },
  // Europe
  { code: 'GB', dial: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', dial: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', dial: '+33', name: 'France', flag: '🇫🇷' },
  { code: 'IT', dial: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', dial: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: 'NL', dial: '+31', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SE', dial: '+46', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', dial: '+47', name: 'Norway', flag: '🇳🇴' },
  { code: 'FI', dial: '+358', name: 'Finland', flag: '🇫🇮' },
  { code: 'DK', dial: '+45', name: 'Denmark', flag: '🇩🇰' },
  { code: 'PL', dial: '+48', name: 'Poland', flag: '🇵🇱' },
  { code: 'AT', dial: '+43', name: 'Austria', flag: '🇦🇹' },
  { code: 'BE', dial: '+32', name: 'Belgium', flag: '🇧🇪' },
  { code: 'CH', dial: '+41', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'PT', dial: '+351', name: 'Portugal', flag: '🇵🇹' },
  { code: 'GR', dial: '+30', name: 'Greece', flag: '🇬🇷' },
  { code: 'RU', dial: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: 'UA', dial: '+380', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'RO', dial: '+40', name: 'Romania', flag: '🇷🇴' },
  { code: 'HU', dial: '+36', name: 'Hungary', flag: '🇭🇺' },
  { code: 'CZ', dial: '+420', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'IE', dial: '+353', name: 'Ireland', flag: '🇮🇪' },
  // Asia-Pacific
  { code: 'JP', dial: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', dial: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: 'AU', dial: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: 'NZ', dial: '+64', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'SG', dial: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: 'MY', dial: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'TH', dial: '+66', name: 'Thailand', flag: '🇹🇭' },
  { code: 'PH', dial: '+63', name: 'Philippines', flag: '🇵🇭' },
  { code: 'ID', dial: '+62', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'VN', dial: '+84', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'BD', dial: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'MM', dial: '+95', name: 'Myanmar', flag: '🇲🇲' },
  { code: 'KH', dial: '+855', name: 'Cambodia', flag: '🇰🇭' },
  { code: 'LK', dial: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'NP', dial: '+977', name: 'Nepal', flag: '🇳🇵' },
  { code: 'MN', dial: '+976', name: 'Mongolia', flag: '🇲🇳' },
  // Africa
  { code: 'EG', dial: '+20', name: 'Egypt', flag: '🇪🇬' },
  { code: 'ZA', dial: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: 'NG', dial: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'KE', dial: '+254', name: 'Kenya', flag: '🇰🇪' },
  { code: 'GH', dial: '+233', name: 'Ghana', flag: '🇬🇭' },
  { code: 'ET', dial: '+251', name: 'Ethiopia', flag: '🇪🇹' },
  { code: 'TZ', dial: '+255', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'MA', dial: '+212', name: 'Morocco', flag: '🇲🇦' },
  { code: 'DZ', dial: '+213', name: 'Algeria', flag: '🇩🇿' },
  { code: 'TN', dial: '+216', name: 'Tunisia', flag: '🇹🇳' },
  { code: 'LY', dial: '+218', name: 'Libya', flag: '🇱🇾' },
  { code: 'SD', dial: '+249', name: 'Sudan', flag: '🇸🇩' },
  // More Middle East
  { code: 'LB', dial: '+961', name: 'Lebanon', flag: '🇱🇧' },
  { code: 'SY', dial: '+963', name: 'Syria', flag: '🇸🇾' },
  { code: 'JO', dial: '+962', name: 'Jordan', flag: '🇯🇴' },
  { code: 'PS', dial: '+970', name: 'Palestine', flag: '🇵🇸' },
  { code: 'IL', dial: '+972', name: 'Israel', flag: '🇮🇱' },
  { code: 'YE', dial: '+967', name: 'Yemen', flag: '🇾🇪' },
  // Central Asia & Caucasus
  { code: 'KG', dial: '+996', name: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: 'KZ', dial: '+7', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'GE', dial: '+995', name: 'Georgia', flag: '🇬🇪' },
  { code: 'AM', dial: '+374', name: 'Armenia', flag: '🇦🇲' },
  { code: 'AZ', dial: '+994', name: 'Azerbaijan', flag: '🇦🇿' },
];

/** Default country code (Afghanistan – primary market) */
export const DEFAULT_COUNTRY: CountryCode = COUNTRY_CODES[0];

/** Get localized display name for a country */
export function getCountryDisplayName(country: CountryCode, locale: string): string {
  if (locale === 'ps' && country.namePs) return country.namePs;
  if (locale === 'fa' && country.nameFa) return country.nameFa;
  return country.name;
}

/** Allowed special characters for passwords */
export const PASSWORD_ALLOWED_SPECIAL_CHARS = '!@#$%^&*_?-';
export const PASSWORD_SPECIAL_CHARS_REGEX = /^[!@#$%^&*_?\-]*$/;
export const PASSWORD_MIN_LENGTH = 8;

/** Password validation rules */
export interface PasswordRule {
  key: string;
  labelEn: string;
  labelPs: string;
  labelFa: string;
  test: (pw: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  {
    key: 'minLength',
    labelEn: 'At least 8 characters',
    labelPs: 'حداقل ۸ کرکټر',
    labelFa: 'حداقل ۸ کاراکتر',
    test: (pw) => pw.length >= PASSWORD_MIN_LENGTH,
  },
  {
    key: 'uppercase',
    labelEn: 'At least one uppercase letter',
    labelPs: 'حداقل یو لوکریکټر',
    labelFa: 'حداقل یک حرف بزرگ',
    test: (pw) => /[A-Z]/.test(pw),
  },
  {
    key: 'digit',
    labelEn: 'At least one digit',
    labelPs: 'حداقل یو عدد',
    labelFa: 'حداقل یک عدد',
    test: (pw) => /[0-9]/.test(pw),
  },
  {
    key: 'specialChars',
    labelEn: `Only allowed special characters (${PASSWORD_ALLOWED_SPECIAL_CHARS})`,
    labelPs: `فقط کرکټرهای خاص مجاز (${PASSWORD_ALLOWED_SPECIAL_CHARS})`,
    labelFa: `فقط کاراکترهای خاص مجاز (${PASSWORD_ALLOWED_SPECIAL_CHARS})`,
    test: (pw) => {
      // No disallowed special characters present
      const disallowedRegex = /[^a-zA-Z0-9!@#$%^&*_?\-]/;
      return !disallowedRegex.test(pw);
    },
  },
];

/** Validate entire password – returns object with each rule's pass/fail */
export function validatePassword(pw: string): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const rule of PASSWORD_RULES) {
    result[rule.key] = rule.test(pw);
  }
  return result;
}

/** Check if all password rules pass */
export function isPasswordValid(pw: string): boolean {
  const results = validatePassword(pw);
  return Object.values(results).every(Boolean);
}