'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Save,
  DollarSign,
  Globe,
  Layout,
  Sidebar,
  Settings,
  Power,
  PowerOff,
} from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';
import {
  SECTION_LABELS,
  AdSenseSlotConfig,
  AdSenseGlobalConfig,
} from './adminShared';

interface AdminMonetizationProps {
  locale: Locale;
}

type MonetizationTab = 'global' | 'header' | 'sidebar';

const DEFAULT_SLOT_CONFIG: AdSenseSlotConfig = {
  enabled: false,
  client: '',
  slot: '',
  format: 'auto',
  responsive: true,
  style: {
    margin_top: 0,
    margin_bottom: 8,
    max_width: '100%',
    bg_color: '#ffffff',
  },
};

const DEFAULT_GLOBAL_CONFIG: AdSenseGlobalConfig = {
  enabled: false,
  publisher_id: '',
  auto_ads: false,
  page_level_ads: false,
  anchor_ads: false,
  vignette_ads: false,
};

export const AdminMonetization: React.FC<AdminMonetizationProps> = ({ locale }) => {
  const rtl = isRTL(locale);
  const supabase = createClient();

  const [tab, setTab] = useState<MonetizationTab>('global');
  const [globalConfig, setGlobalConfig] = useState<AdSenseGlobalConfig>(DEFAULT_GLOBAL_CONFIG);
  const [headerConfig, setHeaderConfig] = useState<AdSenseSlotConfig>(DEFAULT_SLOT_CONFIG);
  const [sidebarConfig, setSidebarConfig] = useState<AdSenseSlotConfig>(DEFAULT_SLOT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const title = SECTION_LABELS.monetization[locale] || SECTION_LABELS.monetization.en;

  const L = (en: string, ps: string, fa: string) => locale === 'ps' ? ps : locale === 'fa' ? fa : en;

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const loadConfigs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['adsense_global', 'adsense_header', 'adsense_sidebar']);

      if (fetchError) throw fetchError;

      const settings = (data || []).reduce<Record<string, Record<string, unknown>>>((acc, row) => {
        acc[row.setting_key] = row.setting_value as Record<string, unknown>;
        return acc;
      }, {});

      if (settings.adsense_global) {
        const raw = settings.adsense_global;
        setGlobalConfig({
          enabled: Boolean(raw.enabled),
          publisher_id: String(raw.publisher_id || ''),
          auto_ads: Boolean(raw.auto_ads),
          page_level_ads: Boolean(raw.page_level_ads),
          anchor_ads: Boolean(raw.anchor_ads),
          vignette_ads: Boolean(raw.vignette_ads),
        });
      }

      if (settings.adsense_header) {
        const raw = settings.adsense_header;
        const style = (raw.style && typeof raw.style === 'object' ? raw.style : {}) as Record<string, unknown>;
        setHeaderConfig({
          enabled: Boolean(raw.enabled),
          client: String(raw.client || ''),
          slot: String(raw.slot || ''),
          format: ['auto', 'horizontal', 'vertical', 'rectangle'].includes(String(raw.format))
            ? (String(raw.format) as AdSenseSlotConfig['format'])
            : 'horizontal',
          responsive: Boolean(raw.responsive),
          style: {
            margin_top: Number(style.margin_top) || 0,
            margin_bottom: Number(style.margin_bottom) || 8,
            max_width: String(style.max_width || '100%'),
            bg_color: String(style.bg_color || '#ffffff'),
          },
        });
      }

      if (settings.adsense_sidebar) {
        const raw = settings.adsense_sidebar;
        const style = (raw.style && typeof raw.style === 'object' ? raw.style : {}) as Record<string, unknown>;
        setSidebarConfig({
          enabled: Boolean(raw.enabled),
          client: String(raw.client || ''),
          slot: String(raw.slot || ''),
          format: ['auto', 'horizontal', 'vertical', 'rectangle'].includes(String(raw.format))
            ? (String(raw.format) as AdSenseSlotConfig['format'])
            : 'vertical',
          responsive: Boolean(raw.responsive),
          style: {
            margin_top: Number(style.margin_top) || 16,
            margin_bottom: Number(style.margin_bottom) || 16,
            max_width: String(style.max_width || '300px'),
            bg_color: String(style.bg_color || '#ffffff'),
          },
        });
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  const handleSaveGlobal = async () => {
    setSaving(true);
    clearMessages();
    try {
      const { error: upsertError } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: 'adsense_global',
          setting_value: globalConfig,
        });
      if (upsertError) throw upsertError;
      setSuccess(L('Global AdSense settings saved', 'د AdSense عمومي تنظیمات ساتل شول', 'تنظیمات عمومی AdSense ذخیره شد'));
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHeader = async () => {
    setSaving(true);
    clearMessages();
    try {
      const { error: upsertError } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: 'adsense_header',
          setting_value: headerConfig,
        });
      if (upsertError) throw upsertError;
      setSuccess(L('Header ad settings saved', 'د سرلیک اعلان تنظیمات ساتل شول', 'تنظیمات تبلیغ سربرگ ذخیره شد'));
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSidebar = async () => {
    setSaving(true);
    clearMessages();
    try {
      const { error: upsertError } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: 'adsense_sidebar',
          setting_value: sidebarConfig,
        });
      if (upsertError) throw upsertError;
      setSuccess(L('Sidebar ad settings saved', 'د سایدبار اعلان تنظیمات ساتل شول', 'تنظیمات تبلیغ سایدبار ذخیره شد'));
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: MonetizationTab; label: string; icon: React.ElementType }[] = [
    { id: 'global', label: L('Global Settings', 'عمومي تنظیمات', 'تنظیمات عمومی'), icon: Globe },
    { id: 'header', label: L('Header Ad Slot', 'د سرلیک اعلان ځای', 'جایگاه تبلیغ سربرگ'), icon: Layout },
    { id: 'sidebar', label: L('Sidebar Ad Slot', 'د سایدبار اعلان ځای', 'جایگاه تبلیغ سایدبار'), icon: Sidebar },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className={`ml-3 text-slate-500 ${rtl ? 'mr-3 ml-0' : ''}`}>
          {L('Loading AdSense settings...', 'د AdSense تنظیمات لوډیږي...', 'بارگذاری تنظیمات AdSense...')}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {success && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              tab === t.id
                ? 'bg-white text-blue-700 font-medium shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Global Settings */}
      {tab === 'global' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <Globe className="w-5 h-5 text-slate-400" />
              {L('Global AdSense Configuration', 'د AdSense عمومي تنظیمات', 'تنظیمات عمومی AdSense')}
            </h3>
            <button
              onClick={() => setGlobalConfig({ ...globalConfig, enabled: !globalConfig.enabled })}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                globalConfig.enabled
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {globalConfig.enabled ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
              {globalConfig.enabled ? L('Enabled', 'چارن', 'فعال') : L('Disabled', 'غیرفعال', 'غیرفعال')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-1">
                {L('Publisher ID', 'د ناشر آی‌دی', 'شناسه ناشر')}
              </label>
              <input
                type="text"
                value={globalConfig.publisher_id}
                onChange={(e) => setGlobalConfig({ ...globalConfig, publisher_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                title={L('Google AdSense Publisher ID', 'د Google AdSense د ناشر آی‌دی', 'شناسه ناشر Google AdSense')}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-3">
                {L('Ad Types', 'د اعلان ډولونه', 'انواع تبلیغات')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={globalConfig.auto_ads}
                    onChange={(e) => setGlobalConfig({ ...globalConfig, auto_ads: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-700">{L('Auto Ads', 'اتوماتیک اعلانونه', 'تبلیغات خودکار')}</div>
                    <div className="text-xs text-slate-400">{L('Let Google place ads automatically', 'د ګوګل ته اجازه ورکړئ چې اعلانونه اتوماتیک ځای پرځای کړي', 'اجازه ده Google تبلیغات را به صورت خودکار قرار دهد')}</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={globalConfig.page_level_ads}
                    onChange={(e) => setGlobalConfig({ ...globalConfig, page_level_ads: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-700">{L('Page-Level Ads', 'د پاڼې اعلانونه', 'تبلیغات سطح صفحه')}</div>
                    <div className="text-xs text-slate-400">{L('Full-page ad formats', 'بشپړ پاڼې اعلان بڼې', 'فرمت‌های تبلیغاتی تمام صفحه')}</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={globalConfig.anchor_ads}
                    onChange={(e) => setGlobalConfig({ ...globalConfig, anchor_ads: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-700">{L('Anchor Ads', 'لنډ اعلانونه', 'تبلیغات لنگر')}</div>
                    <div className="text-xs text-slate-400">{L('Ads fixed to bottom/top of screen', 'د سکرین په باندۍ/ښکته اعلانونه', 'تبلیغات ثابت در پایین/بالای صفحه')}</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={globalConfig.vignette_ads}
                    onChange={(e) => setGlobalConfig({ ...globalConfig, vignette_ads: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-700">{L('Vignette Ads', 'وینیت اعلانونه', 'تبلیغات وینیت')}</div>
                    <div className="text-xs text-slate-400">{L('Full-screen interstitial ads', 'بشپړ سکرین بین‌صفحه‌ای اعلانونه', 'تبلیغات بین‌صفحه‌ای تمام صفحه')}</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveGlobal}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? L('Saving...', 'ساتل...', 'ذخیره...') : L('Save Global Settings', 'عمومي تنظیمات ساتل', 'ذخیره تنظیمات عمومی')}
            </button>
          </div>
        </div>
      )}

      {/* Header Ad Slot */}
      {tab === 'header' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <Layout className="w-5 h-5 text-slate-400" />
              {L('Header Ad Slot', 'د سرلیک اعلان ځای', 'جایگاه تبلیغ سربرگ')}
            </h3>
            <button
              onClick={() => setHeaderConfig({ ...headerConfig, enabled: !headerConfig.enabled })}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                headerConfig.enabled
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {headerConfig.enabled ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
              {headerConfig.enabled ? L('Enabled', 'چارن', 'فعال') : L('Disabled', 'غیرفعال', 'غیرفعال')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                {L('Ad Client', 'د اعلان کلاینت', 'کلاینت تبلیغ')}
              </label>
              <input
                type="text"
                value={headerConfig.client}
                onChange={(e) => setHeaderConfig({ ...headerConfig, client: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                title={L('AdSense ad client code', 'د AdSense د اعلان کلاینت کوډ', 'کد کلاینت تبلیغ AdSense')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                {L('Ad Slot', 'د اعلان ځای', 'جایگاه تبلیغ')}
              </label>
              <input
                type="text"
                value={headerConfig.slot}
                onChange={(e) => setHeaderConfig({ ...headerConfig, slot: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1234567890"
                title={L('AdSense ad slot ID', 'د AdSense د اعلان ځای آی‌دی', 'شناسه جایگاه تبلیغ AdSense')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                {L('Format', 'بڼه', 'فرمت')}
              </label>
              <select
                value={headerConfig.format}
                onChange={(e) => setHeaderConfig({ ...headerConfig, format: e.target.value as AdSenseSlotConfig['format'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title={L('Ad format', 'د اعلان بڼه', 'فرمت تبلیغ')}
              >
                <option value="auto">{L('Auto', 'اتوماتیک', 'خودکار')}</option>
                <option value="horizontal">{L('Horizontal', 'افقی', 'افقی')}</option>
                <option value="vertical">{L('Vertical', 'عمودي', 'عمودی')}</option>
                <option value="rectangle">{L('Rectangle', 'مستطیل', 'مستطیل')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                {L('Responsive', 'ریسپانسیو', 'واکنش‌گرا')}
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  checked={headerConfig.responsive}
                  onChange={(e) => setHeaderConfig({ ...headerConfig, responsive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  title={L('Responsive ad', 'ریسپانسیو اعلان', 'تبلیغ واکنش‌گرا')}
                />
                <span className="text-sm text-slate-500">
                  {L('Auto-resize to fit container', 'د کانتینر سره اتوماتیک اندازه', 'تغییر اندازه خودکار برای تطبیق با ظرف')}
                </span>
              </div>
            </div>
          </div>

          {/* Style settings */}
          <div>
            <h4 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {L('Style Settings', 'سټایل تنظیمات', 'تنظیمات ظاهری')}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {L('Margin Top (px)', 'بورته حاشیه (px)', 'حاشیه بالا (px)')}
                </label>
                <input
                  type="number"
                  value={headerConfig.style.margin_top}
                  onChange={(e) => setHeaderConfig({
                    ...headerConfig,
                    style: { ...headerConfig.style, margin_top: parseInt(e.target.value) || 0 },
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  title={L('Top margin in pixels', 'بورته حاشیه په پیکسلونو کې', 'حاشیه بالا به پیکسل')}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {L('Margin Bottom (px)', 'کمته حاشیه (px)', 'حاشیه پایین (px)')}
                </label>
                <input
                  type="number"
                  value={headerConfig.style.margin_bottom}
                  onChange={(e) => setHeaderConfig({
                    ...headerConfig,
                    style: { ...headerConfig.style, margin_bottom: parseInt(e.target.value) || 0 },
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  title={L('Bottom margin in pixels', 'کمته حاشیه په پیکسلونو کې', 'حاشیه پایین به پیکسل')}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {L('Max Width', 'ترټولو لوی پلنوالی', 'حداکثر عرض')}
                </label>
                <input
                  type="text"
                  value={headerConfig.style.max_width}
                  onChange={(e) => setHeaderConfig({
                    ...headerConfig,
                    style: { ...headerConfig.style, max_width: e.target.value },
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="100%"
                  title={L('Maximum width (e.g. 100%, 728px)', 'ترټولو لوی پلنوالی (مثلاً 100%, 728px)', 'حداکثر عرض (مثلاً 100%, 728px)')}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {L('Background Color', 'د شاته رنګ', 'رنگ پس‌زمینه')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={headerConfig.style.bg_color}
                    onChange={(e) => setHeaderConfig({
                      ...headerConfig,
                      style: { ...headerConfig.style, bg_color: e.target.value },
                    })}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    title={L('Background color picker', 'د شاته رنګ غوراوی', 'انتخابگر رنگ پس‌زمینه')}
                  />
                  <input
                    type="text"
                    value={headerConfig.style.bg_color}
                    onChange={(e) => setHeaderConfig({
                      ...headerConfig,
                      style: { ...headerConfig.style, bg_color: e.target.value },
                    })}
                    className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h4 className="text-sm font-semibold text-slate-600 mb-2">{L('Preview', 'مخکېنی', 'پیش‌نمایش')}</h4>
            <div
              className="border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-center p-6"
              style={{
                marginTop: `${headerConfig.style.margin_top}px`,
                marginBottom: `${headerConfig.style.margin_bottom}px`,
                maxWidth: headerConfig.style.max_width,
                backgroundColor: headerConfig.style.bg_color,
              }}
            >
              <div className="text-slate-400">
                <DollarSign className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">
                  {headerConfig.enabled
                    ? L('Header Ad Slot Active', 'د سرلیک اعلان ځای فعال', 'جایگاه تبلیغ سربرگ فعال')
                    : L('Header Ad Slot Disabled', 'د سرلیک اعلان ځای غیرفعال', 'جایگاه تبلیغ سربرگ غیرفعال')}
                </p>
                <p className="text-xs mt-1">
                  {headerConfig.client && headerConfig.slot
                    ? `${headerConfig.client} / ${headerConfig.slot}`
                    : L('Configure client & slot above', 'مخکې کلاینت او ځای تنظیم کړئ', 'کلاینت و جایگاه را در بالا تنظیم کنید')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveHeader}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? L('Saving...', 'ساتل...', 'ذخیره...') : L('Save Header Ad', 'د سرلیک اعلان ساتل', 'ذخیره تبلیغ سربرگ')}
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Ad Slot */}
      {tab === 'sidebar' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <Sidebar className="w-5 h-5 text-slate-400" />
              {L('Sidebar Ad Slot', 'د سایدبار اعلان ځای', 'جایگاه تبلیغ سایدبار')}
            </h3>
            <button
              onClick={() => setSidebarConfig({ ...sidebarConfig, enabled: !sidebarConfig.enabled })}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                sidebarConfig.enabled
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {sidebarConfig.enabled ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
              {sidebarConfig.enabled ? L('Enabled', 'چارن', 'فعال') : L('Disabled', 'غیرفعال', 'غیرفعال')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                {L('Ad Client', 'د اعلان کلاینت', 'کلاینت تبلیغ')}
              </label>
              <input
                type="text"
                value={sidebarConfig.client}
                onChange={(e) => setSidebarConfig({ ...sidebarConfig, client: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                title={L('AdSense ad client code', 'د AdSense د اعلان کلاینت کوډ', 'کد کلاینت تبلیغ AdSense')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                {L('Ad Slot', 'د اعلان ځای', 'جایگاه تبلیغ')}
              </label>
              <input
                type="text"
                value={sidebarConfig.slot}
                onChange={(e) => setSidebarConfig({ ...sidebarConfig, slot: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1234567890"
                title={L('AdSense ad slot ID', 'د AdSense د اعلان ځای آی‌دی', 'شناسه جایگاه تبلیغ AdSense')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                {L('Format', 'بڼه', 'فرمت')}
              </label>
              <select
                value={sidebarConfig.format}
                onChange={(e) => setSidebarConfig({ ...sidebarConfig, format: e.target.value as AdSenseSlotConfig['format'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title={L('Ad format', 'د اعلان بڼه', 'فرمت تبلیغ')}
              >
                <option value="auto">{L('Auto', 'اتوماتیک', 'خودکار')}</option>
                <option value="horizontal">{L('Horizontal', 'افقی', 'افقی')}</option>
                <option value="vertical">{L('Vertical', 'عمودي', 'عمودی')}</option>
                <option value="rectangle">{L('Rectangle', 'مستطیل', 'مستطیل')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                {L('Responsive', 'ریسپانسیو', 'واکنش‌گرا')}
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  checked={sidebarConfig.responsive}
                  onChange={(e) => setSidebarConfig({ ...sidebarConfig, responsive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  title={L('Responsive ad', 'ریسپانسیو اعلان', 'تبلیغ واکنش‌گرا')}
                />
                <span className="text-sm text-slate-500">
                  {L('Auto-resize to fit container', 'د کانتینر سره اتوماتیک اندازه', 'تغییر اندازه خودکار برای تطبیق با ظرف')}
                </span>
              </div>
            </div>
          </div>

          {/* Style settings */}
          <div>
            <h4 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {L('Style Settings', 'سټایل تنظیمات', 'تنظیمات ظاهری')}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {L('Margin Top (px)', 'بورته حاشیه (px)', 'حاشیه بالا (px)')}
                </label>
                <input
                  type="number"
                  value={sidebarConfig.style.margin_top}
                  onChange={(e) => setSidebarConfig({
                    ...sidebarConfig,
                    style: { ...sidebarConfig.style, margin_top: parseInt(e.target.value) || 0 },
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  title={L('Top margin in pixels', 'بورته حاشیه په پیکسلونو کې', 'حاشیه بالا به پیکسل')}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {L('Margin Bottom (px)', 'کمته حاشیه (px)', 'حاشیه پایین (px)')}
                </label>
                <input
                  type="number"
                  value={sidebarConfig.style.margin_bottom}
                  onChange={(e) => setSidebarConfig({
                    ...sidebarConfig,
                    style: { ...sidebarConfig.style, margin_bottom: parseInt(e.target.value) || 0 },
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  title={L('Bottom margin in pixels', 'کمته حاشیه په پیکسلونو کې', 'حاشیه پایین به پیکسل')}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {L('Max Width', 'ترټولو لوی پلنوالی', 'حداکثر عرض')}
                </label>
                <input
                  type="text"
                  value={sidebarConfig.style.max_width}
                  onChange={(e) => setSidebarConfig({
                    ...sidebarConfig,
                    style: { ...sidebarConfig.style, max_width: e.target.value },
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="300px"
                  title={L('Maximum width (e.g. 300px, 100%)', 'ترټولو لوی پلنوالی (مثلاً 300px, 100%)', 'حداکثر عرض (مثلاً 300px, 100%)')}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {L('Background Color', 'د شاته رنګ', 'رنگ پس‌زمینه')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={sidebarConfig.style.bg_color}
                    onChange={(e) => setSidebarConfig({
                      ...sidebarConfig,
                      style: { ...sidebarConfig.style, bg_color: e.target.value },
                    })}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    title={L('Background color picker', 'د شاته رنګ غوراوی', 'انتخابگر رنگ پس‌زمینه')}
                  />
                  <input
                    type="text"
                    value={sidebarConfig.style.bg_color}
                    onChange={(e) => setSidebarConfig({
                      ...sidebarConfig,
                      style: { ...sidebarConfig.style, bg_color: e.target.value },
                    })}
                    className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h4 className="text-sm font-semibold text-slate-600 mb-2">{L('Preview', 'مخکېنی', 'پیش‌نمایش')}</h4>
            <div className="max-w-xs mx-auto">
              <div
                className="border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-center p-8"
                style={{
                  marginTop: `${sidebarConfig.style.margin_top}px`,
                  marginBottom: `${sidebarConfig.style.margin_bottom}px`,
                  maxWidth: sidebarConfig.style.max_width,
                  backgroundColor: sidebarConfig.style.bg_color,
                }}
              >
                <div className="text-slate-400">
                  <DollarSign className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">
                    {sidebarConfig.enabled
                      ? L('Sidebar Ad Active', 'د سایدبار اعلان فعال', 'تبلیغ سایدبار فعال')
                      : L('Sidebar Ad Disabled', 'د سایدبار اعلان غیرفعال', 'تبلیغ سایدبار غیرفعال')}
                  </p>
                  <p className="text-xs mt-1">
                    {sidebarConfig.client && sidebarConfig.slot
                      ? `${sidebarConfig.client} / ${sidebarConfig.slot}`
                      : L('Configure client & slot above', 'مخکې کلاینت او ځای تنظیم کړئ', 'کلاینت و جایگاه را در بالا تنظیم کنید')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveSidebar}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? L('Saving...', 'ساتل...', 'ذخیره...') : L('Save Sidebar Ad', 'د سایدبار اعلان ساتل', 'ذخیره تبلیغ سایدبار')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};