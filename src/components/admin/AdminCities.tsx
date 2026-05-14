'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Save, Trash2, RefreshCw, Star, StarOff, MapPin } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';
import { POPULAR_CITIES } from '@/lib/constants/cities';
import { SECTION_LABELS, CityRow } from './adminShared';

interface AdminCitiesProps {
  locale: Locale;
}

interface CityFormState {
  id: 0 | number;
  name_en: string;
  name_ps: string;
  name_fa: string;
  country: string;
  latitude: string;
  longitude: string;
  featured: boolean;
  sort_order: string;
}

const EMPTY_FORM: CityFormState = {
  id: 0,
  name_en: '',
  name_ps: '',
  name_fa: '',
  country: 'Afghanistan',
  latitude: '',
  longitude: '',
  featured: false,
  sort_order: '0',
};

export const AdminCities: React.FC<AdminCitiesProps> = ({ locale }) => {
  const rtl = isRTL(locale);
  const supabase = createClient();

  const [cities, setCities] = useState<CityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncingDefaults, setSyncingDefaults] = useState(false);
  const [form, setForm] = useState<CityFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const title = SECTION_LABELS.cities[locale] || SECTION_LABELS.cities.en;

  const loadCities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('cities')
        .select('*')
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;
      setCities((data as CityRow[]) || []);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!form.name_en.trim()) {
      setError(locale === 'ps' ? 'د ښار نوم اړین دی' : locale === 'fa' ? 'نام شهر الزامی است' : 'City name (English) is required');
      return;
    }

    setSaving(true);
    clearMessages();

    try {
      const payload: Record<string, unknown> = {
        name_en: form.name_en.trim(),
        name_ps: form.name_ps.trim() || null,
        name_fa: form.name_fa.trim() || null,
        country: form.country.trim() || 'Afghanistan',
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        featured: form.featured,
        sort_order: parseInt(form.sort_order) || 0,
      };

      if (editingId !== null) {
        const { error: updateError } = await supabase
          .from('cities')
          .update(payload)
          .eq('id', editingId);
        if (updateError) throw updateError;
        setSuccess(locale === 'ps' ? 'ښار تازه شو' : locale === 'fa' ? 'شهر بروزرسانی شد' : 'City updated successfully');
      } else {
        const { error: insertError } = await supabase
          .from('cities')
          .insert(payload);
        if (insertError) throw insertError;
        setSuccess(locale === 'ps' ? 'ښار اضافه شو' : locale === 'fa' ? 'شهر اضافه شد' : 'City added successfully');
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadCities();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (city: CityRow) => {
    setEditingId(city.id);
    setForm({
      id: city.id,
      name_en: city.name_en,
      name_ps: city.name_ps || '',
      name_fa: city.name_fa || '',
      country: city.country || 'Afghanistan',
      latitude: city.latitude != null ? String(city.latitude) : '',
      longitude: city.longitude != null ? String(city.longitude) : '',
      featured: city.featured,
      sort_order: String(city.sort_order),
    });
    clearMessages();
  };

  const handleDelete = async (id: number) => {
    if (!confirm(locale === 'ps' ? 'ایا ښار حذف کړئ؟' : locale === 'fa' ? 'حذف شهر؟' : 'Delete this city?')) return;

    clearMessages();
    try {
      const { error: deleteError } = await supabase
        .from('cities')
        .delete()
        .eq('id', id);
      if (deleteError) throw deleteError;
      setSuccess(locale === 'ps' ? 'ښار حذف شو' : locale === 'fa' ? 'شهر حذف شد' : 'City deleted');
      if (editingId === id) {
        setForm(EMPTY_FORM);
        setEditingId(null);
      }
      await loadCities();
    } catch (err) {
      setError(String(err));
    }
  };

  const handleToggleFeatured = async (city: CityRow) => {
    clearMessages();
    try {
      const { error: updateError } = await supabase
        .from('cities')
        .update({ featured: !city.featured })
        .eq('id', city.id);
      if (updateError) throw updateError;
      await loadCities();
    } catch (err) {
      setError(String(err));
    }
  };

  const handleSyncDefaults = async () => {
    setSyncingDefaults(true);
    clearMessages();
    try {
      for (const city of POPULAR_CITIES) {
        const { data: existing } = await supabase
          .from('cities')
          .select('id')
          .eq('name_en', city.name_en)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('cities')
            .update({
              name_ps: city.name_ps,
              name_fa: city.name_fa,
              country: city.country,
              latitude: city.latitude,
              longitude: city.longitude,
              featured: city.featured,
            })
            .eq('id', existing.id);
        } else {
          await supabase
            .from('cities')
            .insert({
              name_en: city.name_en,
              name_ps: city.name_ps,
              name_fa: city.name_fa,
              country: city.country,
              latitude: city.latitude,
              longitude: city.longitude,
              featured: city.featured,
              sort_order: 0,
            });
        }
      }
      setSuccess(locale === 'ps' ? 'ښارونه همغږي شو' : locale === 'fa' ? 'شهرها همگام‌سازی شد' : 'Cities synced with defaults');
      await loadCities();
    } catch (err) {
      setError(String(err));
    } finally {
      setSyncingDefaults(false);
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    clearMessages();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className={`ml-3 text-slate-500 ${rtl ? 'mr-3 ml-0' : ''}`}>
          {locale === 'ps' ? 'ښارونه لوډیږي...' : locale === 'fa' ? 'بارگذاری شهرها...' : 'Loading cities...'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <button
          onClick={handleSyncDefaults}
          disabled={syncingDefaults}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncingDefaults ? 'animate-spin' : ''}`} />
          {locale === 'ps' ? 'همغږي کړئ' : locale === 'fa' ? 'همگام‌سازی' : 'Sync Defaults'}
        </button>
      </div>

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
          {editingId !== null
            ? locale === 'ps' ? 'ښار تازه کړئ' : locale === 'fa' ? 'بروزرسانی شهر' : 'Edit City'
            : locale === 'ps' ? 'نوی ښار اضافه کړئ' : locale === 'fa' ? 'اضافه شهر جدید' : 'Add New City'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              {locale === 'ps' ? 'نوم (انګلیسي)' : locale === 'fa' ? 'نام (انگلیسی)' : 'Name (English)'} *
            </label>
            <input
              type="text"
              value={form.name_en}
              onChange={(e) => setForm({ ...form, name_en: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Kabul"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              {locale === 'ps' ? 'نوم (پښتو)' : locale === 'fa' ? 'نام (پشتو)' : 'Name (Pashto)'}
            </label>
            <input
              type="text"
              value={form.name_ps}
              onChange={(e) => setForm({ ...form, name_ps: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              dir="rtl"
              placeholder="کابل"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              {locale === 'ps' ? 'نوم (دري)' : locale === 'fa' ? 'نام (دری)' : 'Name (Dari/Farsi)'}
            </label>
            <input
              type="text"
              value={form.name_fa}
              onChange={(e) => setForm({ ...form, name_fa: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              dir="rtl"
              placeholder="کابل"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              {locale === 'ps' ? 'هیواد' : locale === 'fa' ? 'کشور' : 'Country'}
            </label>
            <select
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Afghanistan">Afghanistan</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Iran">Iran</option>
              <option value="UAE">UAE</option>
              <option value="Turkey">Turkey</option>
              <option value="India">India</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              {locale === 'ps' ? 'عرض' : locale === 'fa' ? 'عرض جغرافیایی' : 'Latitude'}
            </label>
            <input
              type="number"
              step="0.000001"
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="34.5199"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              {locale === 'ps' ? 'طول' : locale === 'fa' ? 'طول جغرافیایی' : 'Longitude'}
            </label>
            <input
              type="number"
              step="0.000001"
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="69.1976"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              {locale === 'ps' ? 'ځانګړی' : locale === 'fa' ? 'ویژه' : 'Featured'}
            </label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-500">
                {locale === 'ps' ? 'د کورپاڼې ښارونو کې ښکاره کړئ' : locale === 'fa' ? 'نمایش در شهرهای صفحه اصلی' : 'Show on homepage'}
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
          {editingId !== null && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 text-sm"
            >
              {locale === 'ps' ? 'پرې کړئ' : locale === 'fa' ? 'لغو' : 'Cancel'}
            </button>
          )}
        </div>
      </div>

      {/* Cities Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">
            {cities.length} {locale === 'ps' ? 'ښارونه' : locale === 'fa' ? 'شهر' : 'cities'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                  {locale === 'ps' ? 'نوم' : locale === 'fa' ? 'نام' : 'Name'}
                </th>
                <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                  {locale === 'ps' ? 'هیواد' : locale === 'fa' ? 'کشور' : 'Country'}
                </th>
                <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                  {locale === 'ps' ? 'ځانګړی' : locale === 'fa' ? 'ویژه' : 'Featured'}
                </th>
                <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                  {locale === 'ps' ? 'ترتیب' : locale === 'fa' ? 'ترتیب' : 'Order'}
                </th>
                <th className={`px-4 py-3 text-right font-medium text-slate-600 ${rtl ? 'text-left' : ''}`}>
                  {locale === 'ps' ? 'عملیات' : locale === 'fa' ? 'عملیات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cities.map((city) => (
                <tr key={city.id} className={editingId === city.id ? 'bg-blue-50' : 'hover:bg-slate-50'}>
                  <td className={`px-4 py-3 ${rtl ? 'text-right' : ''}`}>
                    <div className="font-medium text-slate-800">{city.name_en}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {city.name_ps && <span className={rtl ? 'ml-1' : 'mr-1'} dir="rtl">{city.name_ps}</span>}
                      {city.name_fa && <span className={rtl ? 'ml-1' : 'mr-1'} dir="rtl">{city.name_fa}</span>}
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-slate-600 ${rtl ? 'text-right' : ''}`}>{city.country || '—'}</td>
                  <td className={`px-4 py-3 ${rtl ? 'text-right' : ''}`}>
                    <button
                      onClick={() => handleToggleFeatured(city)}
                      className={`p-1 rounded hover:bg-slate-100 ${city.featured ? 'text-yellow-500' : 'text-slate-300'}`}
                      title={city.featured
                        ? locale === 'ps' ? 'ځانګړی لرې کړئ' : locale === 'fa' ? 'حذف ویژه' : 'Remove featured'
                        : locale === 'ps' ? 'ځانګړی کړئ' : locale === 'fa' ? 'ویژه کردن' : 'Mark featured'}
                    >
                      {city.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className={`px-4 py-3 text-slate-600 ${rtl ? 'text-right' : ''}`}>{city.sort_order}</td>
                  <td className={`px-4 py-3 ${rtl ? 'text-left' : 'text-right'}`}>
                    <div className={`flex items-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                      <button
                        onClick={() => handleEdit(city)}
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-600"
                        title={locale === 'ps' ? 'تازه کړئ' : locale === 'fa' ? 'بروزرسانی' : 'Edit'}
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(city.id)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-500"
                        title={locale === 'ps' ? 'حذف' : locale === 'fa' ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cities.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    {locale === 'ps' ? 'ښارونه نشته' : locale === 'fa' ? 'شهرها یافت نشد' : 'No cities found. Click "Sync Defaults" to add default cities.'}
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