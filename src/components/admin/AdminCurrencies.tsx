'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Save, Trash2, Coins, Check } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';
import { SECTION_LABELS, CurrencyRow } from './adminShared';

interface AdminCurrenciesProps {
  locale: Locale;
}

interface CurrencyFormState {
  code: string;
  name: string;
  symbol: string;
  exchange_rate: string;
  is_default: boolean;
  sort_order: string;
}

const EMPTY_FORM: CurrencyFormState = {
  code: '',
  name: '',
  symbol: '',
  exchange_rate: '1',
  is_default: false,
  sort_order: '0',
};

export const AdminCurrencies: React.FC<AdminCurrenciesProps> = ({ locale }) => {
  const rtl = isRTL(locale);
  const supabase = createClient();

  const [currencies, setCurrencies] = useState<CurrencyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CurrencyFormState>(EMPTY_FORM);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const title = SECTION_LABELS.currencies[locale] || SECTION_LABELS.currencies.en;

  const loadCurrencies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('currencies')
        .select('*')
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;
      setCurrencies((data as CurrencyRow[]) || []);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrencies();
  }, [loadCurrencies]);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      setError(locale === 'ps' ? 'کوډ او نوم اړین دی' : locale === 'fa' ? 'کد و نام الزامی است' : 'Currency code and name are required');
      return;
    }

    setSaving(true);
    clearMessages();

    try {
      const payload: Record<string, unknown> = {
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        symbol: form.symbol.trim(),
        exchange_rate: parseFloat(form.exchange_rate) || 1,
        is_default: form.is_default,
        sort_order: parseInt(form.sort_order) || 0,
      };

      if (editingCode !== null) {
        // For currencies, code is the primary key, so if code changes we need upsert
        const { error: updateError } = await supabase
          .from('currencies')
          .upsert(payload);
        if (updateError) throw updateError;

        // If the code changed, delete the old one
        if (editingCode !== form.code.trim().toUpperCase()) {
          await supabase
            .from('currencies')
            .delete()
            .eq('code', editingCode);
        }

        setSuccess(locale === 'ps' ? 'اسعار تازه شو' : locale === 'fa' ? 'ارز بروزرسانی شد' : 'Currency updated');
      } else {
        const { error: insertError } = await supabase
          .from('currencies')
          .insert(payload);
        if (insertError) throw insertError;
        setSuccess(locale === 'ps' ? 'اسعار اضافه شو' : locale === 'fa' ? 'ارز اضافه شد' : 'Currency added');
      }

      // If setting as default, unset other defaults
      if (form.is_default) {
        const otherCurrencies = currencies.filter(c => c.code !== form.code.trim().toUpperCase() && c.is_default);
        for (const oc of otherCurrencies) {
          await supabase
            .from('currencies')
            .update({ is_default: false })
            .eq('code', oc.code);
        }
      }

      setForm(EMPTY_FORM);
      setEditingCode(null);
      await loadCurrencies();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (currency: CurrencyRow) => {
    setEditingCode(currency.code);
    setForm({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      exchange_rate: String(currency.exchange_rate),
      is_default: currency.is_default,
      sort_order: String(currency.sort_order),
    });
    clearMessages();
  };

  const handleDelete = async (code: string) => {
    if (!confirm(locale === 'ps' ? 'ایا اسعار حذف کړئ؟' : locale === 'fa' ? 'حذف ارز؟' : 'Delete this currency?')) return;

    clearMessages();
    try {
      const { error: deleteError } = await supabase
        .from('currencies')
        .delete()
        .eq('code', code);
      if (deleteError) throw deleteError;
      setSuccess(locale === 'ps' ? 'اسعار حذف شو' : locale === 'fa' ? 'ارز حذف شد' : 'Currency deleted');
      if (editingCode === code) {
        setForm(EMPTY_FORM);
        setEditingCode(null);
      }
      await loadCurrencies();
    } catch (err) {
      setError(String(err));
    }
  };

  const handleSetDefault = async (currency: CurrencyRow) => {
    clearMessages();
    try {
      // Unset all defaults first
      const defaultCurrencies = currencies.filter(c => c.is_default);
      for (const dc of defaultCurrencies) {
        await supabase
          .from('currencies')
          .update({ is_default: false })
          .eq('code', dc.code);
      }
      // Set this one as default
      const { error: updateError } = await supabase
        .from('currencies')
        .update({ is_default: true })
        .eq('code', currency.code);
      if (updateError) throw updateError;
      setSuccess(locale === 'ps' ? 'ډیفالټ اسعار ټاکل شو' : locale === 'fa' ? 'ارز پیش‌فرض تنظیم شد' : 'Default currency set');
      await loadCurrencies();
    } catch (err) {
      setError(String(err));
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditingCode(null);
    clearMessages();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className={`ml-3 text-slate-500 ${rtl ? 'mr-3 ml-0' : ''}`}>
          {locale === 'ps' ? 'اسعار لوډیږي...' : locale === 'fa' ? 'بارگذاری ارزها...' : 'Loading currencies...'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>

      {/* Messages */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>
      )}

      {/* Add/Edit Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">
          {editingCode !== null
            ? locale === 'ps' ? 'اسعار تازه کړئ' : locale === 'fa' ? 'بروزرسانی ارز' : 'Edit Currency'
            : locale === 'ps' ? 'نوی اسعار اضافه کړئ' : locale === 'fa' ? 'اضافه ارز جدید' : 'Add New Currency'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              {locale === 'ps' ? 'کوډ' : locale === 'fa' ? 'کد' : 'Code'} *
            </label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="AFN"
              maxLength={10}
              title={locale === 'ps' ? 'د اسعار کوډ' : locale === 'fa' ? 'کد ارز' : 'Currency code (e.g. AFN, USD)'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              {locale === 'ps' ? 'نوم' : locale === 'fa' ? 'نام' : 'Name'} *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Afghan Afghani"
              title={locale === 'ps' ? 'د اسعار نوم' : locale === 'fa' ? 'نام ارز' : 'Currency full name'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              {locale === 'ps' ? 'نښان' : locale === 'fa' ? 'نماد' : 'Symbol'}
            </label>
            <input
              type="text"
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="؋"
              maxLength={10}
              title={locale === 'ps' ? 'د اسعار نښان' : locale === 'fa' ? 'نماد ارز' : 'Currency symbol'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              {locale === 'ps' ? 'تبادله نرخ (USD ته)' : locale === 'fa' ? 'نرخ تبدیل (به USD)' : 'Exchange Rate (to USD)'}
            </label>
            <input
              type="number"
              step="0.000001"
              value={form.exchange_rate}
              onChange={(e) => setForm({ ...form, exchange_rate: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="1.000000"
              title={locale === 'ps' ? 'تبادله نرخ' : locale === 'fa' ? 'نرخ تبدیل' : 'Exchange rate relative to USD'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              {locale === 'ps' ? 'ډیفالټ' : locale === 'fa' ? 'پیش‌فرض' : 'Default'}
            </label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                checked={form.is_default}
                onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                title={locale === 'ps' ? 'ډیفالټ اسعار' : locale === 'fa' ? 'ارز پیش‌فرض' : 'Set as default currency'}
              />
              <span className="text-sm text-slate-500">
                {locale === 'ps' ? 'ډیفالټ اسعار ټاکل' : locale === 'fa' ? 'تنظیم ارز پیش‌فرض' : 'Set as default'}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              {locale === 'ps' ? 'ترتیب' : locale === 'fa' ? 'ترتیب' : 'Sort Order'}
            </label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              title={locale === 'ps' ? 'ترتیب' : locale === 'fa' ? 'ترتیب' : 'Sort order'}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            <Save className="w-4 h-4" />
            {saving
              ? locale === 'ps' ? 'ساتل...' : locale === 'fa' ? 'ذخیره...' : 'Saving...'
              : locale === 'ps' ? 'ساتل' : locale === 'fa' ? 'ذخیره' : 'Save'}
          </button>
          {editingCode !== null && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 text-sm"
            >
              {locale === 'ps' ? 'پرې کړئ' : locale === 'fa' ? 'لغو' : 'Cancel'}
            </button>
          )}
        </div>
      </div>

      {/* Currencies Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <Coins className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">
            {currencies.length} {locale === 'ps' ? 'اسعار' : locale === 'fa' ? 'ارز' : 'currencies'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                  {locale === 'ps' ? 'کوډ' : locale === 'fa' ? 'کد' : 'Code'}
                </th>
                <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                  {locale === 'ps' ? 'نوم' : locale === 'fa' ? 'نام' : 'Name'}
                </th>
                <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                  {locale === 'ps' ? 'نښان' : locale === 'fa' ? 'نماد' : 'Symbol'}
                </th>
                <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                  {locale === 'ps' ? 'نرخ' : locale === 'fa' ? 'نرخ' : 'Rate'}
                </th>
                <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                  {locale === 'ps' ? 'ډیفالټ' : locale === 'fa' ? 'پیش‌فرض' : 'Default'}
                </th>
                <th className={`px-4 py-3 text-right font-medium text-slate-600 ${rtl ? 'text-left' : ''}`}>
                  {locale === 'ps' ? 'عملیات' : locale === 'fa' ? 'عملیات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currencies.map((currency) => (
                <tr key={currency.code} className={editingCode === currency.code ? 'bg-blue-50' : 'hover:bg-slate-50'}>
                  <td className={`px-4 py-3 font-medium text-slate-800 ${rtl ? 'text-right' : ''}`}>{currency.code}</td>
                  <td className={`px-4 py-3 text-slate-600 ${rtl ? 'text-right' : ''}`}>{currency.name}</td>
                  <td className={`px-4 py-3 text-slate-700 ${rtl ? 'text-right' : ''}`}>{currency.symbol}</td>
                  <td className={`px-4 py-3 text-slate-600 ${rtl ? 'text-right' : ''}`}>{currency.exchange_rate}</td>
                  <td className={`px-4 py-3 ${rtl ? 'text-right' : ''}`}>
                    {currency.is_default ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <Check className="w-3 h-3" />
                        {locale === 'ps' ? 'ډیفالټ' : locale === 'fa' ? 'پیش‌فرض' : 'Default'}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(currency)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                        title={locale === 'ps' ? 'ډیفالټ ټاکل' : locale === 'fa' ? 'تنظیم پیش‌فرض' : 'Set as default'}
                      >
                        {locale === 'ps' ? 'ډیفالټ ټاکل' : locale === 'fa' ? 'تنظیم پیش‌فرض' : 'Set default'}
                      </button>
                    )}
                  </td>
                  <td className={`px-4 py-3 ${rtl ? 'text-left' : 'text-right'}`}>
                    <div className={`flex items-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                      <button
                        onClick={() => handleEdit(currency)}
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-600"
                        title={locale === 'ps' ? 'تازه کړئ' : locale === 'fa' ? 'بروزرسانی' : 'Edit'}
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(currency.code)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-500"
                        title={locale === 'ps' ? 'حذف' : locale === 'fa' ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currencies.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    {locale === 'ps' ? 'اسعار نشته' : locale === 'fa' ? 'ارزها یافت نشد' : 'No currencies found. Run the database migration to seed default currencies.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};