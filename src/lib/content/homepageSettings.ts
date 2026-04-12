import { Locale } from '@/lib/i18n/config';

export interface LocalizedText {
  en: string;
  ps: string;
  fa: string;
}

export interface HeaderAnimationConfig {
  style: 'none' | 'pulse-circles' | 'floating-cards' | 'gradient-orbs';
  speed: number;
  density: number;
}

export interface HeaderAdConfig {
  enabled: boolean;
  client: string;
  slot: string;
  format: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  responsive: boolean;
}

export interface HeaderBlockConfig {
  title: LocalizedText;
  subtitle: LocalizedText;
  badge: LocalizedText;
  primaryCta: LocalizedText;
  primaryCtaUrl: string;
  secondaryCta: LocalizedText;
  secondaryCtaUrl: string;
  animation: HeaderAnimationConfig;
  ad: HeaderAdConfig;
}

export interface HomeBlockConfig {
  enabled: boolean;
  title: LocalizedText;
}

export interface HomepageContentConfig {
  header: HeaderBlockConfig;
  blocks: {
    categorySidebar: HomeBlockConfig;
    showcase: HomeBlockConfig;
    trending: HomeBlockConfig;
    mostWatched: HomeBlockConfig;
    popularArea: HomeBlockConfig;
  };
}

export const DEFAULT_HOMEPAGE_CONFIG: HomepageContentConfig = {
  header: {
    title: {
      en: 'ADVANTAGEOUS MARKETPLACE DEALS',
      ps: 'ګټور د بازار اعلانونه',
      fa: 'پیشنهادهای ویژه بازار',
    },
    subtitle: {
      en: 'ON BAZAAR!',
      ps: 'په بازار کې!',
      fa: 'در بازار!',
    },
    badge: {
      en: 'TOP DEALS',
      ps: 'غوره اعلانونه',
      fa: 'بهترین پیشنهاد',
    },
    primaryCta: {
      en: 'Post Ad',
      ps: 'اعلان پوسټ کړئ',
      fa: 'درج آگهی',
    },
    primaryCtaUrl: '/post-ad',
    secondaryCta: {
      en: 'Browse Market',
      ps: 'بازار وپلټئ',
      fa: 'بازار را ببینید',
    },
    secondaryCtaUrl: '/search',
    animation: {
      style: 'floating-cards',
      speed: 1,
      density: 3,
    },
    ad: {
      enabled: false,
      client: '',
      slot: '',
      format: 'auto',
      responsive: true,
    },
  },
  blocks: {
    categorySidebar: {
      enabled: true,
      title: {
        en: 'Categories',
        ps: 'کټګورۍ',
        fa: 'دسته‌بندی‌ها',
      },
    },
    showcase: {
      enabled: true,
      title: {
        en: 'Homepage Showcase',
        ps: 'د کورپاڼې نندارتون',
        fa: 'ویترین صفحه اصلی',
      },
    },
    trending: {
      enabled: true,
      title: {
        en: 'Trending Items',
        ps: 'مشهور توکي',
        fa: 'موارد پرطرفدار',
      },
    },
    mostWatched: {
      enabled: true,
      title: {
        en: 'Most Watched',
        ps: 'ډېر کتل شوي',
        fa: 'پربیننده‌ترین',
      },
    },
    popularArea: {
      enabled: true,
      title: {
        en: 'Popular in Your Area',
        ps: 'ستاسو په سیمه کې مشهور',
        fa: 'محبوب در منطقه شما',
      },
    },
  },
};

const mergeLocalized = (input: unknown, fallback: LocalizedText): LocalizedText => {
  const raw = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  return {
    en: typeof raw.en === 'string' ? raw.en : fallback.en,
    ps: typeof raw.ps === 'string' ? raw.ps : fallback.ps,
    fa: typeof raw.fa === 'string' ? raw.fa : fallback.fa,
  };
};

export const normalizeHomepageConfig = (value: unknown): HomepageContentConfig => {
  const raw = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  const header = (raw.header && typeof raw.header === 'object' ? raw.header : {}) as Record<string, unknown>;
  const blocks = (raw.blocks && typeof raw.blocks === 'object' ? raw.blocks : {}) as Record<string, unknown>;

  const categorySidebar = (blocks.categorySidebar && typeof blocks.categorySidebar === 'object' ? blocks.categorySidebar : {}) as Record<string, unknown>;
  const showcase = (blocks.showcase && typeof blocks.showcase === 'object' ? blocks.showcase : {}) as Record<string, unknown>;
  const trending = (blocks.trending && typeof blocks.trending === 'object' ? blocks.trending : {}) as Record<string, unknown>;
  const mostWatched = (blocks.mostWatched && typeof blocks.mostWatched === 'object' ? blocks.mostWatched : {}) as Record<string, unknown>;
  const popularArea = (blocks.popularArea && typeof blocks.popularArea === 'object' ? blocks.popularArea : {}) as Record<string, unknown>;

  const animation = (header.animation && typeof header.animation === 'object' ? header.animation : {}) as Record<string, unknown>;
  const ad = (header.ad && typeof header.ad === 'object' ? header.ad : {}) as Record<string, unknown>;

  const style = String(animation.style || DEFAULT_HOMEPAGE_CONFIG.header.animation.style);
  const validStyle = ['none', 'pulse-circles', 'floating-cards', 'gradient-orbs'].includes(style)
    ? (style as HeaderAnimationConfig['style'])
    : DEFAULT_HOMEPAGE_CONFIG.header.animation.style;

  const format = String(ad.format || DEFAULT_HOMEPAGE_CONFIG.header.ad.format);
  const validFormat = ['auto', 'horizontal', 'vertical', 'rectangle'].includes(format)
    ? (format as HeaderAdConfig['format'])
    : DEFAULT_HOMEPAGE_CONFIG.header.ad.format;

  return {
    header: {
      title: mergeLocalized(header.title, DEFAULT_HOMEPAGE_CONFIG.header.title),
      subtitle: mergeLocalized(header.subtitle, DEFAULT_HOMEPAGE_CONFIG.header.subtitle),
      badge: mergeLocalized(header.badge, DEFAULT_HOMEPAGE_CONFIG.header.badge),
      primaryCta: mergeLocalized(header.primaryCta, DEFAULT_HOMEPAGE_CONFIG.header.primaryCta),
      primaryCtaUrl: typeof header.primaryCtaUrl === 'string' ? header.primaryCtaUrl : DEFAULT_HOMEPAGE_CONFIG.header.primaryCtaUrl,
      secondaryCta: mergeLocalized(header.secondaryCta, DEFAULT_HOMEPAGE_CONFIG.header.secondaryCta),
      secondaryCtaUrl: typeof header.secondaryCtaUrl === 'string' ? header.secondaryCtaUrl : DEFAULT_HOMEPAGE_CONFIG.header.secondaryCtaUrl,
      animation: {
        style: validStyle,
        speed: Number(animation.speed) > 0 ? Number(animation.speed) : DEFAULT_HOMEPAGE_CONFIG.header.animation.speed,
        density: Number(animation.density) > 0 ? Number(animation.density) : DEFAULT_HOMEPAGE_CONFIG.header.animation.density,
      },
      ad: {
        enabled: Boolean(ad.enabled),
        client: typeof ad.client === 'string' ? ad.client : DEFAULT_HOMEPAGE_CONFIG.header.ad.client,
        slot: typeof ad.slot === 'string' ? ad.slot : DEFAULT_HOMEPAGE_CONFIG.header.ad.slot,
        format: validFormat,
        responsive: ad.responsive === undefined ? DEFAULT_HOMEPAGE_CONFIG.header.ad.responsive : Boolean(ad.responsive),
      },
    },
    blocks: {
      categorySidebar: {
        enabled: categorySidebar.enabled === undefined ? DEFAULT_HOMEPAGE_CONFIG.blocks.categorySidebar.enabled : Boolean(categorySidebar.enabled),
        title: mergeLocalized(categorySidebar.title, DEFAULT_HOMEPAGE_CONFIG.blocks.categorySidebar.title),
      },
      showcase: {
        enabled: showcase.enabled === undefined ? DEFAULT_HOMEPAGE_CONFIG.blocks.showcase.enabled : Boolean(showcase.enabled),
        title: mergeLocalized(showcase.title, DEFAULT_HOMEPAGE_CONFIG.blocks.showcase.title),
      },
      trending: {
        enabled: trending.enabled === undefined ? DEFAULT_HOMEPAGE_CONFIG.blocks.trending.enabled : Boolean(trending.enabled),
        title: mergeLocalized(trending.title, DEFAULT_HOMEPAGE_CONFIG.blocks.trending.title),
      },
      mostWatched: {
        enabled: mostWatched.enabled === undefined ? DEFAULT_HOMEPAGE_CONFIG.blocks.mostWatched.enabled : Boolean(mostWatched.enabled),
        title: mergeLocalized(mostWatched.title, DEFAULT_HOMEPAGE_CONFIG.blocks.mostWatched.title),
      },
      popularArea: {
        enabled: popularArea.enabled === undefined ? DEFAULT_HOMEPAGE_CONFIG.blocks.popularArea.enabled : Boolean(popularArea.enabled),
        title: mergeLocalized(popularArea.title, DEFAULT_HOMEPAGE_CONFIG.blocks.popularArea.title),
      },
    },
  };
};

export const pickLocalized = (text: LocalizedText, locale: Locale): string => {
  if (locale === 'ps') return text.ps;
  if (locale === 'fa') return text.fa;
  return text.en;
};
