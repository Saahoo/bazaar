'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Save,
  GripVertical,
  Eye,
  EyeOff,
  LayoutGrid,
  ChevronUp,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';
import {
  SECTION_LABELS,
  HomepageBlockOrderItem,
} from './adminShared';

interface AdminHomepageLayoutProps {
  locale: Locale;
}

const DEFAULT_BLOCKS: HomepageBlockOrderItem[] = [
  { id: 'hero', enabled: true, order: 1 },
  { id: 'categorySidebar', enabled: true, order: 2 },
  { id: 'showcase', enabled: true, order: 3 },
  { id: 'trending', enabled: true, order: 4 },
  { id: 'mostWatched', enabled: true, order: 5 },
  { id: 'popularArea', enabled: true, order: 6 },
];

const BLOCK_LABELS: Record<string, Record<Locale, string>> = {
  hero: { en: 'Hero Banner / Header', ps: 'هیرو بینر / سرلیک', fa: 'هیرو بنر / سربرگ' },
  categorySidebar: { en: 'Category Sidebar', ps: 'د کټګورۍ سایدبار', fa: 'سایدبار دسته‌بندی' },
  showcase: { en: 'Showcase Listings', ps: 'ښکاره اعلانونه', fa: 'آگهی‌های ویژه' },
  trending: { en: 'Trending Listings', ps: 'د اعلانونو رجحان', fa: 'آگهی‌های داغ' },
  mostWatched: { en: 'Most Watched', ps: 'ترټولو لیدل شوي', fa: 'پربازدیدترین‌ها' },
  popularArea: { en: 'Popular Areas', ps: 'مشهور سیمې', fa: 'مناطق محبوب' },
};

const BLOCK_DESCRIPTIONS: Record<string, Record<Locale, string>> = {
  hero: { en: 'Main hero section with search, CTA, and optional carousel', ps: 'اصلي هیرو برخه د لټون، CTA او اختیاري کاروسل سره', fa: 'بخش اصلی هیرو با جستجو، دکمه CTA و کاروسل اختیاری' },
  categorySidebar: { en: 'Category grid/sidebar for quick navigation', ps: 'د کټګورۍ ګرید/سایدبار د ګړندي لارښود لپاره', fa: 'گرید/سایدبار دسته‌بندی برای ناوبری سریع' },
  showcase: { en: 'Featured/promoted listings showcase', ps: 'ځانګړي/ترویج شوي اعلانونه ښکاره', fa: 'نمایش آگهی‌های ویژه/تبلیغاتی' },
  trending: { en: 'Trending/popular listings based on views', ps: 'د لیدونو پر بنسټ د اعلانونو رجحان', fa: 'آگهی‌های داغ/محبوب بر اساس بازدید' },
  mostWatched: { en: 'Most watched/favorited listings', ps: 'ترټولو لیدل شوي/خوښ شوي اعلانونه', fa: 'پربازدیدترین/محبوب‌ترین آگهی‌ها' },
  popularArea: { en: 'Popular cities/areas section', ps: 'مشهور ښارونو/سیمو برخه', fa: 'بخش شهرها/مناطق محبوب' },
};

export const AdminHomepageLayout: React.FC<AdminHomepageLayoutProps> = ({ locale }) => {
  const rtl = isRTL(locale);
  const supabase = createClient();

  const [blocks, setBlocks] = useState<HomepageBlockOrderItem[]>(DEFAULT_BLOCKS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const title = SECTION_LABELS.homepageLayout[locale] || SECTION_LABELS.homepageLayout.en;

  const L = (en: string, ps: string, fa: string) => locale === 'ps' ? ps : locale === 'fa' ? fa : en;

  const loadBlocks = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'homepage_blocks_order')
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data?.setting_value) {
        const raw = data.setting_value as Record<string, unknown>;
        const rawBlocks = Array.isArray(raw.blocks) ? raw.blocks : [];
        if (rawBlocks.length > 0) {
          const parsed: HomepageBlockOrderItem[] = rawBlocks.map((b: unknown) => {
            const block = b as Record<string, unknown>;
            return {
              id: String(block.id || ''),
              enabled: Boolean(block.enabled),
              order: Number(block.order) || 0,
            };
          });
          setBlocks(parsed.sort((a, b) => a.order - b.order));
        }
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlocks();
  }, [loadBlocks]);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    setSaving(true);
    clearMessages();
    try {
      const orderedBlocks = blocks.map((b, idx) => ({ ...b, order: idx + 1 }));
      const { error: upsertError } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: 'homepage_blocks_order',
          setting_value: { blocks: orderedBlocks },
        });
      if (upsertError) throw upsertError;
      setBlocks(orderedBlocks);
      setSuccess(L('Layout saved successfully', 'بڼه په بریالیتوب سره ساتل شو', 'طرح با موفقیت ذخیره شد'));
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (blockId: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, enabled: !b.enabled } : b))
    );
    clearMessages();
  };

  const handleMoveUp = (blockId: string) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === blockId);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
    clearMessages();
  };

  const handleMoveDown = (blockId: string) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === blockId);
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
    clearMessages();
  };

  const handleReset = () => {
    if (!confirm(L('Reset to default layout?', 'ډیفالټ بڼې ته بیرته ورکړئ؟', 'بازنشانی به طرح پیش‌فرض؟'))) return;
    setBlocks([...DEFAULT_BLOCKS]);
    clearMessages();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className={`ml-3 text-slate-500 ${rtl ? 'mr-3 ml-0' : ''}`}>
          {L('Loading layout...', 'بڼه لوډیږي...', 'بارگذاری طرح...')}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
            {L('Reset Default', 'ډیفالټ', 'پیش‌فرض')}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? L('Saving...', 'ساتل...', 'ذخیره...') : L('Save Layout', 'بڼه ساتل', 'ذخیره طرح')}
          </button>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {success && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}

      {/* Preview hint */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <LayoutGrid className="w-4 h-4 inline-block mr-1" />
          {L(
            'Drag or use arrows to reorder homepage blocks. Toggle visibility with the eye icon.',
            'د کورپاڼې بلاکونو بیا ترتیب کولو لپاره تړل یا پاڼې کارول. د سترګو آیکن سره لیدل وړتیا بدل کړئ.',
            'برای تغییر ترتیب بلوک‌های صفحه اصلی، بکشید یا از فلش‌ها استفاده کنید. نمایش را با آیکون چشم تغییر دهید.'
          )}
        </p>
      </div>

      {/* Blocks List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {blocks.map((block, idx) => {
            const label = BLOCK_LABELS[block.id]?.[locale] || BLOCK_LABELS[block.id]?.en || block.id;
            const description = BLOCK_DESCRIPTIONS[block.id]?.[locale] || BLOCK_DESCRIPTIONS[block.id]?.en || '';

            return (
              <div
                key={block.id}
                className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                  block.enabled ? 'bg-white' : 'bg-slate-50 opacity-60'
                }`}
              >
                {/* Drag handle */}
                <div className="text-slate-300 cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Order number */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  block.enabled ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-400'
                }`}>
                  {idx + 1}
                </div>

                {/* Block info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">{label}</span>
                    <code className="text-xs bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">{block.id}</code>
                    {!block.enabled && (
                      <span className="text-xs bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                        {L('Hidden', 'پټ', 'مخفی')}
                      </span>
                    )}
                  </div>
                  {description && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className={`flex items-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => handleMoveUp(block.id)}
                    disabled={idx === 0}
                    className="p-1.5 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-30"
                    title={L('Move up', 'بورته', 'به بالا')}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(block.id)}
                    disabled={idx === blocks.length - 1}
                    className="p-1.5 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-30"
                    title={L('Move down', 'کمته', 'به پایین')}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggle(block.id)}
                    className={`p-1.5 rounded ${
                      block.enabled
                        ? 'hover:bg-blue-50 text-blue-600'
                        : 'hover:bg-slate-100 text-slate-300'
                    }`}
                    title={block.enabled
                      ? L('Hide block', 'بلاک پټ کړئ', 'مخفی کردن بلوک')
                      : L('Show block', 'بلاک ښکاره کړئ', 'نمایش بلوک')}
                  >
                    {block.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Homepage Settings Link */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <p className="text-sm text-slate-500">
          {L(
            'Note: To edit the content of each block (titles, descriptions, carousel settings), use the Homepage Content settings in site_settings.',
            'یادونه: د هر بلاک منځپانګه (سرلیکونه، تشریحات، کاروسل تنظیمات) تازه کولو لپاره، د site_settings کې د کورپاڼې منځپانګې تنظیمات وکاروئ.',
            'توجه: برای ویرایش محتوای هر بلوک (عناوین، توضیحات، تنظیمات کاروسل)، از تنظیمات محتوای صفحه اصلی در site_settings استفاده کنید.'
          )}
        </p>
      </div>
    </div>
  );
};