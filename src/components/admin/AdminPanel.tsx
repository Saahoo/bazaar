'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Shield, Tags, Flag, Save, Trash2, GripVertical } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';
import { MAIN_CATEGORIES } from '@/lib/constants/categories';

interface AdminPanelProps {
  locale: Locale;
}

interface CategoryRow {
  id: number;
  name_en: string;
  name_ps: string;
  name_fa: string;
  slug: string;
  parent_id: number | null;
  options_json?: Record<string, unknown> | null;
  icon_name?: string | null;
  sort_order?: number | null;
}

interface ListingRow {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  user_id: string;
  profiles?: { display_name: string | null } | null;
}

const TAB_CATEGORIES = 'categories';
const TAB_MODERATION = 'moderation';

export const AdminPanel: React.FC<AdminPanelProps> = ({ locale }) => {
  const rtl = isRTL(locale);
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState(TAB_CATEGORIES);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingListings, setLoadingListings] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncingDefaults, setSyncingDefaults] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [draggingParentId, setDraggingParentId] = useState<number | null>(null);
  const [dragOverParentId, setDragOverParentId] = useState<number | null>(null);
  const [draggingChildInfo, setDraggingChildInfo] = useState<{ id: number; parentId: number } | null>(null);
  const [dragOverChildId, setDragOverChildId] = useState<number | null>(null);

  const [catForm, setCatForm] = useState({
    id: 0,
    name_en: '',
    name_ps: '',
    name_fa: '',
    slug: '',
    parent_id: '',
    icon_name: '',
    sort_order: '0',
    options_json: '{}',
  });

  const [moderationReason, setModerationReason] = useState('policy_violation');
  const [moderationNote, setModerationNote] = useState('');

  const reasonOptions = useMemo(
    () =>
      locale === 'ps'
        ? [
            { value: 'policy_violation', label: 'د قوانینو خلاف اعلان' },
            { value: 'spam', label: 'سپم/ناسم اعلان' },
            { value: 'fraud_risk', label: 'د درغلۍ خطر' },
            { value: 'prohibited_item', label: 'منع شوی توکی' },
          ]
        : locale === 'fa'
          ? [
              { value: 'policy_violation', label: 'نقض قوانین آگهی' },
              { value: 'spam', label: 'اسپم/آگهی نامعتبر' },
              { value: 'fraud_risk', label: 'ریسک کلاهبرداری' },
              { value: 'prohibited_item', label: 'کالای ممنوعه' },
            ]
          : [
              { value: 'policy_violation', label: 'Violates posting rules' },
              { value: 'spam', label: 'Spam / fake listing' },
              { value: 'fraud_risk', label: 'Fraud risk' },
              { value: 'prohibited_item', label: 'Prohibited item' },
            ],
    [locale]
  );

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const saveSortOrder = useCallback(async (updates: { id: number; sort_order: number }[]) => {
    setSavingOrder(true);
    await Promise.all(
      updates.map(({ id, sort_order }) =>
        supabase.from('categories').update({ sort_order }).eq('id', id)
      )
    );
    setSavingOrder(false);
  }, [supabase]);

  const loadCategories = useCallback(async () => {
    setLoadingCats(true);
    const { data } = await supabase
      .from('categories')
      .select('id, name_en, name_ps, name_fa, slug, parent_id, options_json, icon_name, sort_order')
      .order('sort_order', { ascending: true });
    setCategories((data as CategoryRow[]) || []);
    setLoadingCats(false);
  }, [supabase]);

  const syncDefaultCategories = useCallback(async () => {
    setSyncingDefaults(true);

    const payload = MAIN_CATEGORIES.map((cat, idx) => ({
      name_en: cat.name_en,
      name_ps: cat.name_ps,
      name_fa: cat.name_fa,
      slug: slugify(cat.name_en),
      icon_name: cat.icon,
      parent_id: null,
      sort_order: idx + 1,
      options_json: {},
    }));

    await supabase
      .from('categories')
      .upsert(payload, { onConflict: 'slug' });

    setSyncingDefaults(false);
    await loadCategories();
  }, [supabase, loadCategories]);

  const loadListings = useCallback(async () => {
    setLoadingListings(true);
    const { data } = await supabase
      .from('listings')
      .select('id, title, description, status, created_at, user_id, profiles!listings_user_id_fkey(display_name)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(200);

    const normalized = ((data || []) as Array<Record<string, unknown>>).map((row) => {
      const rawProfile = row.profiles as { display_name: string | null } | { display_name: string | null }[] | null;
      const profile = Array.isArray(rawProfile) ? rawProfile[0] || null : rawProfile;

      return {
        id: row.id as string,
        title: row.title as string,
        description: (row.description as string) || null,
        status: row.status as string,
        created_at: row.created_at as string,
        user_id: row.user_id as string,
        profiles: profile,
      } satisfies ListingRow;
    });

    setListings(normalized);
    setLoadingListings(false);
  }, [supabase]);

  useEffect(() => {
    loadCategories();
    loadListings();
  }, [loadCategories, loadListings]);

  useEffect(() => {
    if (!loadingCats && categories.length > 0 && categories.length < MAIN_CATEGORIES.length) {
      syncDefaultCategories();
    }
  }, [loadingCats, categories, syncDefaultCategories]);

  const resetCategoryForm = () => {
    setCatForm({
      id: 0,
      name_en: '',
      name_ps: '',
      name_fa: '',
      slug: '',
      parent_id: '',
      icon_name: '',
      sort_order: '0',
      options_json: '{}',
    });
  };

  const saveCategory = async () => {
    let parsedOptions: Record<string, unknown> = {};
    try {
      parsedOptions = JSON.parse(catForm.options_json || '{}') as Record<string, unknown>;
    } catch {
      return;
    }

    setSaving(true);

    const payload = {
      name_en: catForm.name_en.trim(),
      name_ps: catForm.name_ps.trim() || catForm.name_en.trim(),
      name_fa: catForm.name_fa.trim() || catForm.name_en.trim(),
      slug: catForm.slug.trim(),
      parent_id: catForm.parent_id ? Number(catForm.parent_id) : null,
      icon_name: catForm.icon_name.trim() || null,
      sort_order: Number(catForm.sort_order) || 0,
      options_json: parsedOptions,
    };

    if (catForm.id) {
      await supabase.from('categories').update(payload).eq('id', catForm.id);
    } else {
      await supabase.from('categories').insert(payload);
    }

    setSaving(false);
    resetCategoryForm();
    loadCategories();
  };

  const editCategory = (category: CategoryRow) => {
    setCatForm({
      id: category.id,
      name_en: category.name_en,
      name_ps: category.name_ps,
      name_fa: category.name_fa,
      slug: category.slug,
      parent_id: category.parent_id ? String(category.parent_id) : '',
      icon_name: category.icon_name || '',
      sort_order: String(category.sort_order || 0),
      options_json: JSON.stringify(category.options_json || {}, null, 2),
    });
  };

  const deleteCategory = async (categoryId: number) => {
    const ok = window.confirm(
      locale === 'en' ? 'Delete this category?' : locale === 'ps' ? 'دا کټګوري حذف شي؟' : 'این دسته‌بندی حذف شود؟'
    );
    if (!ok) return;

    await supabase.from('categories').delete().eq('id', categoryId);
    loadCategories();
  };

  const moderateListing = async (listingId: string) => {
    const ok = window.confirm(
      locale === 'en' ? 'Remove this listing from public view?' : locale === 'ps' ? 'دا اعلان له عام لید څخه لیرې شي؟' : 'این آگهی از دید عمومی حذف شود؟'
    );
    if (!ok) return;

    await supabase
      .from('listings')
      .update({
        deleted_at: new Date().toISOString(),
        status: 'expired',
        deletion_reason_code: `admin_${moderationReason}`,
        deletion_reason_note: moderationNote.trim() || null,
      })
      .eq('id', listingId)
      .is('deleted_at', null);

    setListings((prev) => prev.filter((l) => l.id !== listingId));
  };

  const parentCategories = categories.filter((c) => c.parent_id === null);
  const childMap = new Map<number, CategoryRow[]>();
  categories
    .filter((c) => c.parent_id !== null)
    .forEach((child) => {
      const parentId = child.parent_id as number;
      const existing = childMap.get(parentId) || [];
      existing.push(child);
      childMap.set(parentId, existing);
    });

  const handleParentDrop = (targetId: number) => {
    if (draggingParentId === null || draggingParentId === targetId) {
      setDraggingParentId(null);
      setDragOverParentId(null);
      return;
    }
    const sorted = [...parentCategories];
    const fromIdx = sorted.findIndex((c) => c.id === draggingParentId);
    const toIdx = sorted.findIndex((c) => c.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    const [moved] = sorted.splice(fromIdx, 1);
    sorted.splice(toIdx, 0, moved);
    const updates = sorted.map((c, i) => ({ id: c.id, sort_order: (i + 1) * 10 }));
    setCategories((prev) => {
      const children = prev.filter((c) => c.parent_id !== null);
      const newParents = sorted.map((c, i) => ({ ...c, sort_order: (i + 1) * 10 }));
      return [...newParents, ...children];
    });
    saveSortOrder(updates);
    setDraggingParentId(null);
    setDragOverParentId(null);
  };

  const handleChildDrop = (targetId: number, parentId: number) => {
    if (!draggingChildInfo || draggingChildInfo.parentId !== parentId || draggingChildInfo.id === targetId) {
      setDraggingChildInfo(null);
      setDragOverChildId(null);
      return;
    }
    const children = [...(childMap.get(parentId) || [])];
    const fromIdx = children.findIndex((c) => c.id === draggingChildInfo.id);
    const toIdx = children.findIndex((c) => c.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    const [moved] = children.splice(fromIdx, 1);
    children.splice(toIdx, 0, moved);
    const updates = children.map((c, i) => ({ id: c.id, sort_order: (i + 1) * 10 }));
    setCategories((prev) =>
      prev.map((c) => {
        if (c.parent_id !== parentId) return c;
        const idx = children.findIndex((r) => r.id === c.id);
        return idx !== -1 ? { ...c, sort_order: (idx + 1) * 10 } : c;
      })
    );
    saveSortOrder(updates);
    setDraggingChildInfo(null);
    setDragOverChildId(null);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className={`text-xl font-bold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
            {locale === 'en' ? 'Admin Panel' : locale === 'ps' ? 'د اډمین پینل' : 'پنل ادمین'}
          </h1>
          <p className="text-sm text-slate-500">
            {locale === 'en' ? 'Manage categories and moderate listings.' : locale === 'ps' ? 'کټګورۍ او اعلانونه اداره کړئ.' : 'دسته‌بندی‌ها و آگهی‌ها را مدیریت کنید.'}
          </p>
        </div>
      </div>

      <div className={`flex gap-2 mb-5 ${rtl ? 'flex-row-reverse' : ''}`}>
        <button
          type="button"
          onClick={() => setActiveTab(TAB_CATEGORIES)}
          className={`px-3.5 py-2 rounded-lg text-sm font-medium ${activeTab === TAB_CATEGORIES ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
        >
          <span className={`inline-flex items-center gap-1.5 ${rtl ? 'flex-row-reverse' : ''}`}>
            <Tags className="w-4 h-4" />
            {locale === 'en' ? 'Categories' : locale === 'ps' ? 'کټګورۍ' : 'دسته‌بندی‌ها'}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab(TAB_MODERATION)}
          className={`px-3.5 py-2 rounded-lg text-sm font-medium ${activeTab === TAB_MODERATION ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
        >
          <span className={`inline-flex items-center gap-1.5 ${rtl ? 'flex-row-reverse' : ''}`}>
            <Flag className="w-4 h-4" />
            {locale === 'en' ? 'Post Moderation' : locale === 'ps' ? 'د اعلان څارنه' : 'مدیریت آگهی‌ها'}
          </span>
        </button>
      </div>

      {activeTab === TAB_CATEGORIES ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h2 className="text-base font-semibold text-slate-900 mb-3">
              {catForm.id
                ? locale === 'en'
                  ? 'Edit Category'
                  : locale === 'ps'
                    ? 'کټګوري سمول'
                    : 'ویرایش دسته‌بندی'
                : locale === 'en'
                  ? 'Add Category'
                  : locale === 'ps'
                    ? 'کټګوري اضافه کول'
                    : 'افزودن دسته‌بندی'}
            </h2>

            <div className="space-y-3">
              <input value={catForm.name_en} onChange={(e) => setCatForm((p) => ({ ...p, name_en: e.target.value }))} placeholder="Name (EN)" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg" />
              <input value={catForm.name_ps} onChange={(e) => setCatForm((p) => ({ ...p, name_ps: e.target.value }))} placeholder="Name (PS)" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg" />
              <input value={catForm.name_fa} onChange={(e) => setCatForm((p) => ({ ...p, name_fa: e.target.value }))} placeholder="Name (FA)" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg" />
              <input value={catForm.slug} onChange={(e) => setCatForm((p) => ({ ...p, slug: e.target.value }))} placeholder="slug" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg" />

              <div className="grid grid-cols-2 gap-3">
                <select value={catForm.parent_id} onChange={(e) => setCatForm((p) => ({ ...p, parent_id: e.target.value }))} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white">
                  <option value="">Parent: none</option>
                  {parentCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name_en}</option>
                  ))}
                </select>
                <input value={catForm.sort_order} onChange={(e) => setCatForm((p) => ({ ...p, sort_order: e.target.value }))} type="number" placeholder="sort_order" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg" />
              </div>

              <input value={catForm.icon_name} onChange={(e) => setCatForm((p) => ({ ...p, icon_name: e.target.value }))} placeholder="icon_name" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg" />
              <textarea value={catForm.options_json} onChange={(e) => setCatForm((p) => ({ ...p, options_json: e.target.value }))} rows={7} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg font-mono text-xs" placeholder={`{\n  "makes": ["Toyota", "Honda"],\n  "options": ["ABS", "Sunroof"]\n}`} />
            </div>

            <div className={`mt-4 flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
              <button onClick={saveCategory} disabled={saving || !catForm.name_en.trim() || !catForm.slug.trim()} className="px-3.5 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-60">
                <span className={`inline-flex items-center gap-1.5 ${rtl ? 'flex-row-reverse' : ''}`}>
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : catForm.id ? 'Update' : 'Create'}
                </span>
              </button>
              <button
                type="button"
                onClick={syncDefaultCategories}
                disabled={syncingDefaults}
                className="px-3.5 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 disabled:opacity-60"
              >
                {syncingDefaults ? 'Syncing...' : 'Sync all default categories'}
              </button>
              {catForm.id > 0 && (
                <button onClick={resetCategoryForm} className="px-3.5 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200">
                  Cancel edit
                </button>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-900">Existing Categories</h2>
              {savingOrder && <span className="text-xs text-slate-500 animate-pulse">Saving order…</span>}
            </div>
            {loadingCats ? (
              <p className="text-slate-500 text-sm">Loading...</p>
            ) : (
              <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                {parentCategories.map((parent) => {
                  const children = childMap.get(parent.id) || [];
                  const isDraggingThis = draggingParentId === parent.id;
                  const isDropTarget = dragOverParentId === parent.id && !isDraggingThis;
                  return (
                    <div
                      key={parent.id}
                      draggable
                      onDragStart={() => setDraggingParentId(parent.id)}
                      onDragOver={(e) => { e.preventDefault(); setDragOverParentId(parent.id); }}
                      onDrop={() => handleParentDrop(parent.id)}
                      onDragEnd={() => { setDraggingParentId(null); setDragOverParentId(null); }}
                      className={`border rounded-lg p-3 transition-all select-none ${isDraggingThis ? 'opacity-40 cursor-grabbing' : 'cursor-grab'} ${isDropTarget ? 'border-primary-400 ring-2 ring-primary-100' : 'border-slate-200'}`}
                    >
                      <div className={`flex items-start justify-between gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-2 min-w-0 ${rtl ? 'flex-row-reverse' : ''}`}>
                          <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
                          <div className={`min-w-0 ${rtl ? 'text-right' : 'text-left'}`}>
                            <p className="text-sm font-semibold text-slate-900 truncate">{parent.name_en}</p>
                            <p className="text-xs text-slate-500 truncate">/{parent.slug}</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                          <button onClick={() => editCategory(parent)} className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:bg-slate-200">Edit</button>
                          <button onClick={() => deleteCategory(parent.id)} className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100">
                            <span className={`inline-flex items-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </span>
                          </button>
                        </div>
                      </div>

                      {children.length > 0 && (
                        <div className="mt-2 space-y-1.5 border-t border-slate-100 pt-2">
                          {children.map((child) => {
                            const isDraggingChild = draggingChildInfo?.id === child.id;
                            const isChildDropTarget = dragOverChildId === child.id && draggingChildInfo?.id !== child.id && draggingChildInfo?.parentId === parent.id;
                            return (
                            <div
                              key={child.id}
                              draggable
                              onDragStart={(e) => { e.stopPropagation(); setDraggingChildInfo({ id: child.id, parentId: parent.id }); }}
                              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverChildId(child.id); }}
                              onDrop={(e) => { e.stopPropagation(); handleChildDrop(child.id, parent.id); }}
                              onDragEnd={(e) => { e.stopPropagation(); setDraggingChildInfo(null); setDragOverChildId(null); }}
                              className={`flex items-center justify-between text-sm rounded px-1 py-0.5 transition-all select-none ${isDraggingChild ? 'opacity-40 cursor-grabbing' : 'cursor-grab'} ${isChildDropTarget ? 'ring-2 ring-primary-300 bg-primary-50' : ''} ${rtl ? 'flex-row-reverse' : ''}`}
                            >
                              <div className={`flex items-center gap-1.5 min-w-0 ${rtl ? 'flex-row-reverse' : ''}`}>
                                <GripVertical className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                <div className={`min-w-0 ${rtl ? 'text-right' : 'text-left'}`}>
                                  <p className="text-slate-700 truncate">↳ {child.name_en}</p>
                                  <p className="text-xs text-slate-500 truncate">/{child.slug}</p>
                                </div>
                              </div>
                              <div className={`flex items-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                                <button onClick={() => editCategory(child)} className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:bg-slate-200">Edit</button>
                                <button onClick={() => deleteCategory(child.id)} className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                              </div>
                            </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={moderationReason}
              onChange={(e) => setModerationReason(e.target.value)}
              className="px-3 py-2.5 border border-slate-300 rounded-lg bg-white"
            >
              {reasonOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <input
              value={moderationNote}
              onChange={(e) => setModerationNote(e.target.value)}
              placeholder={locale === 'en' ? 'Optional moderator note' : locale === 'ps' ? 'اختیاري یادښت' : 'یادداشت اختیاری'}
              className="md:col-span-2 px-3 py-2.5 border border-slate-300 rounded-lg"
            />
          </div>

          {loadingListings ? (
            <p className="text-slate-500 text-sm">Loading listings...</p>
          ) : (
            <div className="space-y-2 max-h-[70vh] overflow-y-auto">
              {listings.map((l) => (
                <div key={l.id} className="border border-slate-200 rounded-lg p-3">
                  <div className={`flex items-start justify-between gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                    <div className={`min-w-0 ${rtl ? 'text-right' : 'text-left'}`}>
                      <p className="text-sm font-semibold text-slate-900 truncate">{l.title}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {l.profiles?.display_name || 'User'} • {new Date(l.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'fa-AF')}
                      </p>
                      {l.description && <p className="text-xs text-slate-600 mt-1 line-clamp-2">{l.description}</p>}
                    </div>
                    <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
                      <Link href={`/${locale}/listing/${l.id}`} className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:bg-slate-200">View</Link>
                      <button onClick={() => moderateListing(l.id)} className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100">
                        {locale === 'en' ? 'Remove' : locale === 'ps' ? 'لیرې کول' : 'حذف'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-slate-500 mt-4">
        {locale === 'en'
          ? 'To grant admin access, set profile.role = admin in Supabase for that user.'
          : locale === 'ps'
            ? 'د اډمین لاسرسي لپاره په Supabase کې د کارونکي profile.role = admin وټاکئ.'
            : 'برای دسترسی ادمین، در Supabase مقدار profile.role = admin برای کاربر تنظیم کنید.'}
      </p>
    </div>
  );
};
