'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Save, Trash2, GripVertical, Plus, RefreshCw, ChevronDown, ChevronRight, X, Edit3 } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';
import { MAIN_CATEGORIES } from '@/lib/constants/categories';
import { SECTION_LABELS, CategoryRow, slugify } from './adminShared';

interface AdminCategoriesProps {
  locale: Locale;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({ locale }) => {
  const rtl = isRTL(locale);
  const supabase = createClient();

  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [syncingDefaults, setSyncingDefaults] = useState(false);

  // Expanded state for tree view
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  // Form state
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

  // Drag state
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  // Item editing state for options_json lists
  const [editingItemsCatId, setEditingItemsCatId] = useState<number | null>(null);
  const [editingItemsKey, setEditingItemsKey] = useState<string>('');
  const [editingItemsValues, setEditingItemsValues] = useState<string[]>([]);

  const title = SECTION_LABELS.categories[locale] || SECTION_LABELS.categories.en;

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const loadCategories = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('categories')
      .select('id, name_en, name_ps, name_fa, slug, parent_id, options_json, icon_name, sort_order')
      .order('sort_order', { ascending: true });
    setCategories((data as CategoryRow[]) || []);
    setLoading(false);
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
    await supabase.from('categories').upsert(payload, { onConflict: 'slug' });
    setSyncingDefaults(false);
    await loadCategories();
  }, [supabase, loadCategories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (!loading && categories.length > 0 && categories.length < MAIN_CATEGORIES.length) {
      syncDefaultCategories();
    }
  }, [loading, categories, syncDefaultCategories]);

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
      locale === 'en' ? 'Delete this category and all its children?' : locale === 'ps' ? 'دا کټګوري او ټول ماشومان حذف شي؟' : 'این دسته‌بندی و تمام زیردسته‌ها حذف شود؟'
    );
    if (!ok) return;
    await supabase.from('categories').delete().eq('id', categoryId);
    loadCategories();
  };

  const saveSortOrder = async (updates: { id: number; sort_order: number }[]) => {
    setSavingOrder(true);
    await Promise.all(
      updates.map(({ id, sort_order }) =>
        supabase.from('categories').update({ sort_order }).eq('id', id)
      )
    );
    setSavingOrder(false);
  };

  // Build tree structure
  const parentCategories = useMemo(() => categories.filter((c) => c.parent_id === null), [categories]);

  const childMap = useMemo(() => {
    const map = new Map<number, CategoryRow[]>();
    categories
      .filter((c) => c.parent_id !== null)
      .forEach((child) => {
        const parentId = child.parent_id as number;
        const existing = map.get(parentId) || [];
        existing.push(child);
        map.set(parentId, existing);
      });
    return map;
  }, [categories]);

  // Get children at any level
  const getChildren = (parentId: number): CategoryRow[] => childMap.get(parentId) || [];

  // Handle drop for reorder
  const handleDrop = (targetId: number, parentId: number | null) => {
    if (draggingId === null || draggingId === targetId) {
      setDraggingId(null);
      setDragOverId(null);
      return;
    }

    const siblings = parentId ? getChildren(parentId) : parentCategories;
    const fromIdx = siblings.findIndex((c) => c.id === draggingId);
    const toIdx = siblings.findIndex((c) => c.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;

    const sorted = [...siblings];
    const [moved] = sorted.splice(fromIdx, 1);
    sorted.splice(toIdx, 0, moved);
    const updates = sorted.map((c, i) => ({ id: c.id, sort_order: (i + 1) * 10 }));

    setCategories((prev) =>
      prev.map((c) => {
        const idx = updates.findIndex((u) => u.id === c.id);
        return idx !== -1 ? { ...c, sort_order: updates[idx].sort_order } : c;
      })
    );
    saveSortOrder(updates);
    setDraggingId(null);
    setDragOverId(null);
  };

  // Items editing (for options_json list values)
  const startEditingItems = (catId: number, key: string) => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat?.options_json) return;
    const raw = cat.options_json as Record<string, unknown>;
    const values = Array.isArray(raw[key]) ? (raw[key] as string[]).map(String) : [];
    setEditingItemsCatId(catId);
    setEditingItemsKey(key);
    setEditingItemsValues(values);
  };

  const saveItems = async () => {
    if (!editingItemsCatId || !editingItemsKey) return;
    const cat = categories.find((c) => c.id === editingItemsCatId);
    if (!cat) return;

    const existing = (cat.options_json || {}) as Record<string, unknown>;
    const updated = { ...existing, [editingItemsKey]: editingItemsValues.filter(Boolean) };

    await supabase.from('categories').update({ options_json: updated }).eq('id', editingItemsCatId);
    setEditingItemsCatId(null);
    setEditingItemsKey('');
    setEditingItemsValues([]);
    loadCategories();
  };

  const addNewItem = () => {
    setEditingItemsValues((prev) => [...prev, '']);
  };

  const removeItem = (index: number) => {
    setEditingItemsValues((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string) => {
    setEditingItemsValues((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  // Render a category tree node
  const renderTreeNode = (cat: CategoryRow, level: number = 0) => {
    const children = getChildren(cat.id);
    const isExpanded = expandedIds.has(cat.id);
    const isDragging = draggingId === cat.id;
    const isDropTarget = dragOverId === cat.id && draggingId !== cat.id;
    const indent = level * 24;

    // Get list keys from options_json for item editing
    const options = (cat.options_json || {}) as Record<string, unknown>;
    const listKeys = Object.keys(options).filter((k) => Array.isArray(options[k]));

    return (
      <div key={cat.id}>
        <div
          draggable
          onDragStart={() => setDraggingId(cat.id)}
          onDragOver={(e) => { e.preventDefault(); setDragOverId(cat.id); }}
          onDrop={(e) => { e.stopPropagation(); handleDrop(cat.id, cat.parent_id); }}
          onDragEnd={() => { setDraggingId(null); setDragOverId(null); }}
          className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 transition-all select-none ${
            isDragging ? 'opacity-40 cursor-grabbing' : 'cursor-grab'
          } ${isDropTarget ? 'border-primary-400 ring-2 ring-primary-100' : 'border-slate-200'} ${
            level === 0 ? 'bg-white' : level === 1 ? 'bg-slate-50' : 'bg-slate-100/50'
          }`}
          style={{ marginLeft: rtl ? 0 : indent, marginRight: rtl ? indent : 0 }}
        >
          {/* Expand toggle */}
          {children.length > 0 ? (
            <button type="button" onClick={() => toggleExpand(cat.id)} className="text-slate-400 hover:text-slate-600">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <span className="w-4" />
          )}

          <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />

          <div className={`flex-1 min-w-0 ${rtl ? 'text-right' : 'text-left'}`}>
            <p className="text-sm font-semibold text-slate-900 truncate">
              {level > 0 && <span className="text-slate-400 mr-1">↳</span>}
              {cat.name_en}
            </p>
            <p className="text-xs text-slate-500 truncate">/{cat.slug} • ID: {cat.id} • {cat.icon_name || 'no icon'}</p>
          </div>

          <div className={`flex items-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
            <button onClick={() => editCategory(cat)} className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1">
              <Edit3 className="w-3 h-3" /> Edit
            </button>
            <button onClick={() => deleteCategory(cat.id)} className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> Del
            </button>
          </div>
        </div>

        {/* List items within this category */}
        {listKeys.length > 0 && (
          <div
            className={`mt-1 border border-dashed border-slate-300 rounded-lg px-3 py-2 ${rtl ? 'mr-' + indent : 'ml-' + indent}`}
            style={{ marginLeft: rtl ? 0 : indent + 16, marginRight: rtl ? indent + 16 : 0 }}
          >
            <div className={`flex items-center justify-between mb-1 ${rtl ? 'flex-row-reverse' : ''}`}>
              <span className="text-xs font-medium text-slate-600">
                {locale === 'ps' ? 'د لیست توکي' : locale === 'fa' ? 'موارد لیست' : 'List Items'}
              </span>
            </div>
            {listKeys.map((key) => {
              const values = (options[key] as string[]).map(String);
              const isEditingThis = editingItemsCatId === cat.id && editingItemsKey === key;
              return (
                <div key={key} className="mb-2">
                  <div className={`flex items-center gap-2 mb-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs font-semibold text-primary-600">{key}</span>
                    <span className="text-xs text-slate-400">({values.length})</span>
                    <button
                      type="button"
                      onClick={() => isEditingThis ? saveItems() : startEditingItems(cat.id, key)}
                      className="text-xs px-1.5 py-0.5 rounded bg-primary-50 text-primary-600 hover:bg-primary-100"
                    >
                      {isEditingThis ? (locale === 'ps' ? 'خوندي' : locale === 'fa' ? 'ذخیره' : 'Save') : (locale === 'ps' ? 'سمول' : locale === 'fa' ? 'ویرایش' : 'Edit')}
                    </button>
                  </div>
                  {isEditingThis ? (
                    <div className="space-y-1">
                      {editingItemsValues.map((val, idx) => (
                        <div key={idx} className={`flex items-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                          <input
                            value={val}
                            onChange={(e) => updateItem(idx, e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded"
                            placeholder={locale === 'ps' ? 'توکی...' : locale === 'fa' ? 'مورد...' : 'Item...'}
                          />
                          <button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700" title={locale === 'ps' ? 'لرې کړئ' : locale === 'fa' ? 'حذف' : 'Remove item'}>
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button onClick={addNewItem} className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> {locale === 'ps' ? 'توکی زیاتول' : locale === 'fa' ? 'افزودن مورد' : 'Add item'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {values.map((v, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">{v}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Render children if expanded */}
        {isExpanded && children.length > 0 && (
          <div className="mt-1 space-y-1.5">
            {children.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
          {savingOrder && <span className="text-xs text-slate-500 animate-pulse">Saving order…</span>}
          <button
            type="button"
            onClick={syncDefaultCategories}
            disabled={syncingDefaults}
            className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 disabled:opacity-60 flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            {syncingDefaults ? 'Syncing...' : locale === 'ps' ? 'ټولې کټګورۍ همغږي کړئ' : locale === 'fa' ? 'همگام‌سازی همه دسته‌ها' : 'Sync defaults'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Form Panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            {catForm.id
              ? locale === 'en' ? 'Edit Category' : locale === 'ps' ? 'کټګوري سمول' : 'ویرایش دسته‌بندی'
              : locale === 'en' ? 'Add Category' : locale === 'ps' ? 'کټګوري اضافه کول' : 'افزودن دسته‌بندی'}
          </h3>

          <div className="space-y-3">
            <input
              value={catForm.name_en}
              onChange={(e) => setCatForm((p) => ({ ...p, name_en: e.target.value, slug: p.id ? p.slug : slugify(e.target.value) }))}
              placeholder="Name (EN)"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm"
            />
            <input
              value={catForm.name_ps}
              onChange={(e) => setCatForm((p) => ({ ...p, name_ps: e.target.value }))}
              placeholder="Name (PS)"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm"
            />
            <input
              value={catForm.name_fa}
              onChange={(e) => setCatForm((p) => ({ ...p, name_fa: e.target.value }))}
              placeholder="Name (FA)"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm"
            />
            <input
              value={catForm.slug}
              onChange={(e) => setCatForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="slug"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm"
            />

            <div className="grid grid-cols-2 gap-3">
              <select
                aria-label="Parent category"
                value={catForm.parent_id}
                onChange={(e) => setCatForm((p) => ({ ...p, parent_id: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-sm"
              >
                <option value="">Parent: none (top-level)</option>
                {parentCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name_en}</option>
                ))}
                {categories.filter((c) => c.parent_id !== null).map((c) => (
                  <option key={c.id} value={c.id}>↳ {c.name_en}</option>
                ))}
              </select>
              <input
                value={catForm.sort_order}
                onChange={(e) => setCatForm((p) => ({ ...p, sort_order: e.target.value }))}
                type="number"
                placeholder="sort_order"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <input
              value={catForm.icon_name}
              onChange={(e) => setCatForm((p) => ({ ...p, icon_name: e.target.value }))}
              placeholder="icon_name (e.g. car, home, smartphone)"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm"
            />
            <textarea
              value={catForm.options_json}
              onChange={(e) => setCatForm((p) => ({ ...p, options_json: e.target.value }))}
              rows={6}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg font-mono text-xs"
              placeholder={`{\n  "makes": ["Toyota", "Honda"],\n  "options": ["ABS", "Sunroof"]\n}`}
            />
          </div>

          <div className={`mt-4 flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={saveCategory}
              disabled={saving || !catForm.name_en.trim() || !catForm.slug.trim()}
              className="px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-60 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : catForm.id ? 'Update' : 'Create'}
            </button>
            {catForm.id > 0 && (
              <button onClick={resetCategoryForm} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200">
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Tree View Panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            {locale === 'ps' ? 'کټګوري ونه' : locale === 'fa' ? 'درخت دسته‌بندی' : 'Category Tree'}
          </h3>
          {loading ? (
            <p className="text-slate-500 text-sm">Loading...</p>
          ) : parentCategories.length === 0 ? (
            <p className="text-slate-500 text-sm">
              {locale === 'ps' ? 'هیڅ کټګوري نشته' : locale === 'fa' ? 'دسته‌بندی وجود ندارد' : 'No categories found'}
            </p>
          ) : (
            <div className="space-y-2 max-h-[70vh] overflow-y-auto">
              {parentCategories.map((parent) => renderTreeNode(parent, 0))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};