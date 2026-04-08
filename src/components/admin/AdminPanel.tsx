'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Shield, Tags, Flag, Save, Trash2, GripVertical, Building2, ClipboardList, Plus } from 'lucide-react';
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

interface CityRow {
  id: number;
  name_en: string;
  name_ps: string | null;
  name_fa: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  featured: boolean;
  sort_order: number;
}

type WizardFieldType = 'text' | 'number' | 'textarea' | 'select' | 'checkbox';

interface WizardField {
  id: string;
  label: string;
  type: WizardFieldType;
  required: boolean;
  options: string[];
}

interface WizardSection {
  id: string;
  title: string;
  fields: WizardField[];
}

interface WizardSubList {
  id: string;
  title: string;
  values: string[];
}

interface WizardListGroup {
  id: string;
  title: string;
  values: string[];
  sub_lists: WizardSubList[];
}

interface WizardFormConfig {
  sections: WizardSection[];
  lists: WizardListGroup[];
}

const TAB_CATEGORIES = 'categories';
const TAB_CITIES = 'cities';
const TAB_WIZARD = 'wizard';
const TAB_MODERATION = 'moderation';

const EMPTY_WIZARD_CONFIG: WizardFormConfig = {
  sections: [],
  lists: [],
};

const BUILTIN_WIZARD_TEMPLATES: Record<string, WizardFormConfig> = {
  vehicles: {
    sections: [
      {
        id: 'vh_basic',
        title: 'Vehicle Basic Details',
        fields: [
          { id: 'title', label: 'Title', type: 'text', required: true, options: [] },
          { id: 'description', label: 'Description', type: 'textarea', required: true, options: [] },
          { id: 'vehicle_type', label: 'Vehicle Type', type: 'select', required: true, options: ['sedan', 'suv', 'truck', 'pickup', 'van', 'motorcycle'] },
        ],
      },
      {
        id: 'vh_specs',
        title: 'Vehicle Specs',
        fields: [
          { id: 'year', label: 'Year', type: 'number', required: true, options: [] },
          { id: 'make', label: 'Make', type: 'text', required: true, options: [] },
          { id: 'model', label: 'Model', type: 'text', required: true, options: [] },
          { id: 'mileage', label: 'Mileage', type: 'number', required: false, options: [] },
          { id: 'price', label: 'Price', type: 'number', required: true, options: [] },
        ],
      },
    ],
    lists: [
      {
        id: 'vh_damage',
        title: 'Damage Details',
        values: ['No damage', 'Minor scratches', 'Body repair', 'Engine issue'],
        sub_lists: [
          { id: 'vh_damage_area', title: 'Damage Area', values: ['Front', 'Rear', 'Left side', 'Right side'] },
        ],
      },
    ],
  },
  'real-estate': {
    sections: [
      {
        id: 're_type',
        title: 'Property Type & Purpose',
        fields: [
          { id: 'property_type', label: 'Property Type', type: 'select', required: true, options: ['house', 'apartment', 'land', 'office', 'shop'] },
          { id: 'purpose', label: 'Purpose', type: 'select', required: true, options: ['sale', 'rent'] },
        ],
      },
      {
        id: 're_details',
        title: 'Property Details',
        fields: [
          { id: 'title', label: 'Title', type: 'text', required: true, options: [] },
          { id: 'description', label: 'Description', type: 'textarea', required: true, options: [] },
          { id: 'price', label: 'Price', type: 'number', required: true, options: [] },
          { id: 'rooms', label: 'Rooms', type: 'number', required: false, options: [] },
          { id: 'bathrooms', label: 'Bathrooms', type: 'number', required: false, options: [] },
          { id: 'area', label: 'Area (sqm)', type: 'number', required: false, options: [] },
        ],
      },
    ],
    lists: [
      {
        id: 're_neighborhood',
        title: 'Neighborhood Features',
        values: ['Park', 'School', 'Hospital', 'Market', 'Mosque', 'Transport'],
        sub_lists: [
          { id: 're_utilities', title: 'Utilities', values: ['Water', 'Electricity', 'Gas', 'Internet'] },
        ],
      },
    ],
  },
};

const normalizeStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.map((v) => String(v).trim()).filter(Boolean) : [];

const normalizeWizardConfig = (value: unknown): WizardFormConfig => {
  if (!value || typeof value !== 'object') return EMPTY_WIZARD_CONFIG;

  const raw = value as Record<string, unknown>;
  const rawSections = Array.isArray(raw.sections) ? raw.sections : [];
  const rawLists = Array.isArray(raw.lists) ? raw.lists : [];

  const sections: WizardSection[] = rawSections.map((section, sectionIdx) => {
    const s = (section && typeof section === 'object' ? section : {}) as Record<string, unknown>;
    const rawFields = Array.isArray(s.fields) ? s.fields : [];

    return {
      id: String(s.id || `section_${sectionIdx + 1}`),
      title: String(s.title || ''),
      fields: rawFields.map((field, fieldIdx) => {
        const f = (field && typeof field === 'object' ? field : {}) as Record<string, unknown>;
        const rawType = String(f.type || 'text');
        const type: WizardFieldType = ['text', 'number', 'textarea', 'select', 'checkbox'].includes(rawType)
          ? (rawType as WizardFieldType)
          : 'text';

        return {
          id: String(f.id || `field_${sectionIdx + 1}_${fieldIdx + 1}`),
          label: String(f.label || ''),
          type,
          required: Boolean(f.required),
          options: normalizeStringArray(f.options),
        };
      }),
    };
  });

  const lists: WizardListGroup[] = rawLists.map((list, listIdx) => {
    const l = (list && typeof list === 'object' ? list : {}) as Record<string, unknown>;
    const rawSubLists = (Array.isArray(l.sub_lists) ? l.sub_lists : Array.isArray(l.subLists) ? l.subLists : []) as unknown[];

    return {
      id: String(l.id || `list_${listIdx + 1}`),
      title: String(l.title || ''),
      values: normalizeStringArray(l.values),
      sub_lists: rawSubLists.map((sub, subIdx) => {
        const s = (sub && typeof sub === 'object' ? sub : {}) as Record<string, unknown>;
        return {
          id: String(s.id || `sub_${listIdx + 1}_${subIdx + 1}`),
          title: String(s.title || ''),
          values: normalizeStringArray(s.values),
        };
      }),
    };
  });

  return { sections, lists };
};

const hasWizardContent = (config: WizardFormConfig): boolean =>
  config.sections.length > 0 || config.lists.length > 0;

const deepCloneWizardConfig = (config: WizardFormConfig): WizardFormConfig =>
  JSON.parse(JSON.stringify(config)) as WizardFormConfig;

export const AdminPanel: React.FC<AdminPanelProps> = ({ locale }) => {
  const rtl = isRTL(locale);
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState(TAB_CATEGORIES);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [cities, setCities] = useState<CityRow[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingCities, setLoadingCities] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncingDefaults, setSyncingDefaults] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [savingCity, setSavingCity] = useState(false);
  const [savingWizard, setSavingWizard] = useState(false);
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
  const [cityForm, setCityForm] = useState({
    id: 0,
    name_en: '',
    name_ps: '',
    name_fa: '',
    country: '',
    latitude: '',
    longitude: '',
    featured: false,
    sort_order: '0',
  });
  const [wizardCategoryId, setWizardCategoryId] = useState('');
  const [wizardConfig, setWizardConfig] = useState<WizardFormConfig>(EMPTY_WIZARD_CONFIG);

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

  const loadCities = useCallback(async () => {
    setLoadingCities(true);
    const { data } = await supabase
      .from('cities')
      .select('id, name_en, name_ps, name_fa, country, latitude, longitude, featured, sort_order')
      .order('sort_order', { ascending: true })
      .order('name_en', { ascending: true });

    setCities((data as CityRow[]) || []);
    setLoadingCities(false);
  }, [supabase]);

  useEffect(() => {
    loadCategories();
    loadListings();
    loadCities();
  }, [loadCategories, loadListings, loadCities]);

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

  const resetCityForm = () => {
    setCityForm({
      id: 0,
      name_en: '',
      name_ps: '',
      name_fa: '',
      country: '',
      latitude: '',
      longitude: '',
      featured: false,
      sort_order: '0',
    });
  };

  const saveCity = async () => {
    setSavingCity(true);

    const payload = {
      name_en: cityForm.name_en.trim(),
      name_ps: cityForm.name_ps.trim() || null,
      name_fa: cityForm.name_fa.trim() || null,
      country: cityForm.country.trim() || null,
      latitude: cityForm.latitude ? Number(cityForm.latitude) : null,
      longitude: cityForm.longitude ? Number(cityForm.longitude) : null,
      featured: cityForm.featured,
      sort_order: Number(cityForm.sort_order) || 0,
    };

    if (cityForm.id) {
      await supabase.from('cities').update(payload).eq('id', cityForm.id);
    } else {
      await supabase.from('cities').insert(payload);
    }

    setSavingCity(false);
    resetCityForm();
    loadCities();
  };

  const editCity = (city: CityRow) => {
    setCityForm({
      id: city.id,
      name_en: city.name_en,
      name_ps: city.name_ps || '',
      name_fa: city.name_fa || '',
      country: city.country || '',
      latitude: city.latitude?.toString() || '',
      longitude: city.longitude?.toString() || '',
      featured: city.featured,
      sort_order: String(city.sort_order || 0),
    });
    setActiveTab(TAB_CITIES);
  };

  const deleteCity = async (cityId: number) => {
    const ok = window.confirm(locale === 'en' ? 'Delete this city?' : locale === 'ps' ? 'دا ښار حذف شي؟' : 'این شهر حذف شود؟');
    if (!ok) return;
    await supabase.from('cities').delete().eq('id', cityId);
    loadCities();
  };

  const readWizardConfig = (category: CategoryRow | undefined): WizardFormConfig => {
    if (!category?.options_json || typeof category.options_json !== 'object') return EMPTY_WIZARD_CONFIG;

    const raw = category.options_json as Record<string, unknown>;
    const source = raw.wizard_forms ?? raw.wizardForms ?? raw.wizard_form ?? raw.wizard;
    return normalizeWizardConfig(source);
  };

  const hasPersistedWizardConfig = (category: CategoryRow | undefined): boolean => {
    if (!category?.options_json || typeof category.options_json !== 'object') return false;
    const raw = category.options_json as Record<string, unknown>;
    return raw.wizard_forms !== undefined || raw.wizardForms !== undefined || raw.wizard_form !== undefined || raw.wizard !== undefined;
  };

  const getWizardConfigWithTemplate = (category: CategoryRow | undefined): WizardFormConfig => {
    const saved = readWizardConfig(category);
    if (hasWizardContent(saved)) return saved;

    const slug = category?.slug || '';
    const template = BUILTIN_WIZARD_TEMPLATES[slug];
    return template ? deepCloneWizardConfig(template) : EMPTY_WIZARD_CONFIG;
  };

  const onSelectWizardCategory = useCallback((id: string) => {
    setWizardCategoryId(id);
    const category = categories.find((c) => c.id === Number(id));
    setWizardConfig(getWizardConfigWithTemplate(category));
  }, [categories]);

  useEffect(() => {
    if (activeTab !== TAB_WIZARD || categories.length === 0) return;

    if (wizardCategoryId) {
      const selected = categories.find((c) => c.id === Number(wizardCategoryId));
      if (selected) {
        setWizardConfig(readWizardConfig(selected));
        return;
      }
    }

    const firstWithConfig = categories.find((c) => {
      const cfg = readWizardConfig(c);
      return cfg.sections.length > 0 || cfg.lists.length > 0;
    });

    const fallback = firstWithConfig || categories[0];
    if (fallback) onSelectWizardCategory(String(fallback.id));
  }, [activeTab, categories, wizardCategoryId, onSelectWizardCategory]);

  const saveWizardConfig = async () => {
    if (!wizardCategoryId) return;
    const category = categories.find((c) => c.id === Number(wizardCategoryId));
    if (!category) return;

    setSavingWizard(true);
    const existing = (category.options_json || {}) as Record<string, unknown>;
    const payload = {
      ...existing,
      wizard_forms: wizardConfig,
    };

    await supabase
      .from('categories')
      .update({ options_json: payload })
      .eq('id', Number(wizardCategoryId));

    setSavingWizard(false);
    await loadCategories();
  };

  const addSection = () => {
    setWizardConfig((prev) => ({
      ...prev,
      sections: [...prev.sections, {
        id: `section_${Date.now()}`,
        title: '',
        fields: [],
      }],
    }));
  };

  const removeSection = (sectionId: string) => {
    setWizardConfig((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }));
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    setWizardConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === sectionId ? { ...s, title } : s)),
    }));
  };

  const addField = (sectionId: string) => {
    setWizardConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              fields: [...s.fields, { id: `field_${Date.now()}`, label: '', type: 'text', required: false, options: [] }],
            }
          : s
      ),
    }));
  };

  const updateField = (sectionId: string, fieldId: string, key: keyof WizardField, value: string | boolean | string[]) => {
    setWizardConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          fields: s.fields.map((f) => (f.id === fieldId ? { ...f, [key]: value } : f)),
        };
      }),
    }));
  };

  const removeField = (sectionId: string, fieldId: string) => {
    setWizardConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? { ...s, fields: s.fields.filter((f) => f.id !== fieldId) }
          : s
      ),
    }));
  };

  const addList = () => {
    setWizardConfig((prev) => ({
      ...prev,
      lists: [...prev.lists, { id: `list_${Date.now()}`, title: '', values: [], sub_lists: [] }],
    }));
  };

  const updateList = (listId: string, key: keyof WizardListGroup, value: string | string[] | WizardSubList[]) => {
    setWizardConfig((prev) => ({
      ...prev,
      lists: prev.lists.map((l) => (l.id === listId ? { ...l, [key]: value } : l)),
    }));
  };

  const removeList = (listId: string) => {
    setWizardConfig((prev) => ({
      ...prev,
      lists: prev.lists.filter((l) => l.id !== listId),
    }));
  };

  const addSubList = (listId: string) => {
    setWizardConfig((prev) => ({
      ...prev,
      lists: prev.lists.map((l) =>
        l.id === listId
          ? {
              ...l,
              sub_lists: [...l.sub_lists, { id: `sub_${Date.now()}`, title: '', values: [] }],
            }
          : l
      ),
    }));
  };

  const updateSubList = (listId: string, subId: string, key: keyof WizardSubList, value: string | string[]) => {
    setWizardConfig((prev) => ({
      ...prev,
      lists: prev.lists.map((l) => {
        if (l.id !== listId) return l;
        return {
          ...l,
          sub_lists: l.sub_lists.map((s) => (s.id === subId ? { ...s, [key]: value } : s)),
        };
      }),
    }));
  };

  const removeSubList = (listId: string, subId: string) => {
    setWizardConfig((prev) => ({
      ...prev,
      lists: prev.lists.map((l) =>
        l.id === listId ? { ...l, sub_lists: l.sub_lists.filter((s) => s.id !== subId) } : l
      ),
    }));
  };

  const parentCategories = categories.filter((c) => c.parent_id === null);
  const wizardSavedByCategory = categories
    .map((c) => {
      const cfg = getWizardConfigWithTemplate(c);
      return {
        id: c.id,
        name_en: c.name_en,
        parent_id: c.parent_id,
        persisted: hasPersistedWizardConfig(c),
        sections: cfg.sections.length,
        lists: cfg.lists.length,
      };
    })
    .filter((c) => c.sections > 0 || c.lists > 0);

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
          onClick={() => setActiveTab(TAB_CITIES)}
          className={`px-3.5 py-2 rounded-lg text-sm font-medium ${activeTab === TAB_CITIES ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
        >
          <span className={`inline-flex items-center gap-1.5 ${rtl ? 'flex-row-reverse' : ''}`}>
            <Building2 className="w-4 h-4" />
            {locale === 'en' ? 'Cities' : locale === 'ps' ? 'ښارونه' : 'شهرها'}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab(TAB_WIZARD)}
          className={`px-3.5 py-2 rounded-lg text-sm font-medium ${activeTab === TAB_WIZARD ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
        >
          <span className={`inline-flex items-center gap-1.5 ${rtl ? 'flex-row-reverse' : ''}`}>
            <ClipboardList className="w-4 h-4" />
            {locale === 'en' ? 'Wizard Forms' : locale === 'ps' ? 'د فورم ویزارډ' : 'فرم‌های ویزارد'}
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
      ) : activeTab === TAB_CITIES ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h2 className="text-base font-semibold text-slate-900 mb-3">
              {cityForm.id ? 'Edit City' : 'Add City'}
            </h2>
            <div className="space-y-3">
              <input value={cityForm.name_en} onChange={(e) => setCityForm((p) => ({ ...p, name_en: e.target.value }))} placeholder="City name (EN)" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg" />
              <input value={cityForm.name_ps} onChange={(e) => setCityForm((p) => ({ ...p, name_ps: e.target.value }))} placeholder="City name (PS)" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg" />
              <input value={cityForm.name_fa} onChange={(e) => setCityForm((p) => ({ ...p, name_fa: e.target.value }))} placeholder="City name (FA)" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg" />
              <input value={cityForm.country} onChange={(e) => setCityForm((p) => ({ ...p, country: e.target.value }))} placeholder="Country" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg" />
              <div className="grid grid-cols-2 gap-3">
                <input value={cityForm.latitude} onChange={(e) => setCityForm((p) => ({ ...p, latitude: e.target.value }))} type="number" step="0.000001" placeholder="latitude" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg" />
                <input value={cityForm.longitude} onChange={(e) => setCityForm((p) => ({ ...p, longitude: e.target.value }))} type="number" step="0.000001" placeholder="longitude" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={cityForm.sort_order} onChange={(e) => setCityForm((p) => ({ ...p, sort_order: e.target.value }))} type="number" placeholder="sort_order" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg" />
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={cityForm.featured} onChange={(e) => setCityForm((p) => ({ ...p, featured: e.target.checked }))} />
                  Featured city
                </label>
              </div>
            </div>
            <div className={`mt-4 flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
              <button onClick={saveCity} disabled={savingCity || !cityForm.name_en.trim()} className="px-3.5 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-60">
                <span className={`inline-flex items-center gap-1.5 ${rtl ? 'flex-row-reverse' : ''}`}>
                  <Save className="w-4 h-4" />
                  {savingCity ? 'Saving...' : cityForm.id ? 'Update city' : 'Create city'}
                </span>
              </button>
              {cityForm.id > 0 && (
                <button onClick={resetCityForm} className="px-3.5 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200">
                  Cancel edit
                </button>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Managed Cities</h2>
            {loadingCities ? (
              <p className="text-slate-500 text-sm">Loading cities...</p>
            ) : (
              <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                {cities.map((city) => (
                  <div key={city.id} className="border border-slate-200 rounded-lg p-3">
                    <div className={`flex items-start justify-between gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
                      <div className={`min-w-0 ${rtl ? 'text-right' : 'text-left'}`}>
                        <p className="text-sm font-semibold text-slate-900 truncate">{city.name_en}</p>
                        <p className="text-xs text-slate-500 truncate">{city.country || 'No country'} {city.featured ? '• featured' : ''}</p>
                      </div>
                      <div className={`flex items-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                        <button onClick={() => editCity(city)} className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:bg-slate-200">Edit</button>
                        <button onClick={() => deleteCity(city.id)} className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : activeTab === TAB_WIZARD ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Saved Wizard Forms</h3>
            {wizardSavedByCategory.length === 0 ? (
              <p className="text-sm text-slate-500">No saved wizard forms yet.</p>
            ) : (
              <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                {wizardSavedByCategory.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectWizardCategory(String(item.id))}
                    className={`w-full text-left rounded-lg border px-3 py-2 transition ${wizardCategoryId === String(item.id) ? 'border-primary-400 bg-primary-50' : 'border-slate-200 bg-white hover:border-primary-300'}`}
                  >
                    <p className="text-sm font-semibold text-slate-900">{item.parent_id ? `↳ ${item.name_en}` : item.name_en}</p>
                    <p className="text-xs text-slate-500">{item.sections} sections • {item.lists} lists • {item.persisted ? 'saved' : 'template'}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={wizardCategoryId}
              onChange={(e) => onSelectWizardCategory(e.target.value)}
              className="px-3 py-2.5 border border-slate-300 rounded-lg bg-white md:col-span-2"
            >
              <option value="">Select category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.parent_id ? `↳ ${c.name_en}` : c.name_en}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={saveWizardConfig}
              disabled={!wizardCategoryId || savingWizard}
              className="px-3.5 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-60"
            >
              {savingWizard ? 'Saving...' : 'Save wizard form'}
            </button>
            </div>

            {wizardCategoryId ? (
            <>
              <div className="border border-slate-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900">Sections</h3>
                  <button onClick={addSection} className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:bg-slate-200 inline-flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add section
                  </button>
                </div>
                <div className="space-y-3">
                  {wizardConfig.sections.map((section) => (
                    <div key={section.id} className="border border-slate-200 rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          value={section.title}
                          onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                          placeholder="Section title"
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                        />
                        <button onClick={() => removeSection(section.id)} className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                        <button onClick={() => addField(section.id)} className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:bg-slate-200">Add field</button>
                      </div>

                      <div className="space-y-2">
                        {section.fields.map((field) => (
                          <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center border border-slate-100 rounded p-2">
                            <input value={field.label} onChange={(e) => updateField(section.id, field.id, 'label', e.target.value)} placeholder="Field label" className="px-2 py-1.5 border border-slate-300 rounded text-sm" />
                            <select value={field.type} onChange={(e) => updateField(section.id, field.id, 'type', e.target.value as WizardFieldType)} className="px-2 py-1.5 border border-slate-300 rounded text-sm bg-white">
                              <option value="text">text</option>
                              <option value="number">number</option>
                              <option value="textarea">textarea</option>
                              <option value="select">select</option>
                              <option value="checkbox">checkbox</option>
                            </select>
                            <label className="text-xs text-slate-700 flex items-center gap-2">
                              <input type="checkbox" checked={field.required} onChange={(e) => updateField(section.id, field.id, 'required', e.target.checked)} /> required
                            </label>
                            <input
                              value={field.options.join(', ')}
                              onChange={(e) => updateField(section.id, field.id, 'options', e.target.value.split(',').map((v) => v.trim()).filter(Boolean))}
                              placeholder="options: a, b, c"
                              className="px-2 py-1.5 border border-slate-300 rounded text-sm md:col-span-2"
                            />
                            <button onClick={() => removeField(section.id, field.id)} className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100 md:col-span-5 justify-self-start">Remove field</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900">Lists and sub-lists</h3>
                  <button onClick={addList} className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:bg-slate-200 inline-flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add list
                  </button>
                </div>

                <div className="space-y-3">
                  {wizardConfig.lists.map((list) => (
                    <div key={list.id} className="border border-slate-200 rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          value={list.title}
                          onChange={(e) => updateList(list.id, 'title', e.target.value)}
                          placeholder="List title"
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                        />
                        <button onClick={() => addSubList(list.id)} className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:bg-slate-200">Add sub-list</button>
                        <button onClick={() => removeList(list.id)} className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                      </div>

                      <textarea
                        value={list.values.join('\n')}
                        onChange={(e) => updateList(list.id, 'values', e.target.value.split('\n').map((v) => v.trim()).filter(Boolean))}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs"
                        placeholder="One list value per line"
                      />

                      <div className="space-y-2">
                        {list.sub_lists.map((sub) => (
                          <div key={sub.id} className="border border-slate-100 rounded p-2 space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                value={sub.title}
                                onChange={(e) => updateSubList(list.id, sub.id, 'title', e.target.value)}
                                placeholder="Sub-list title"
                                className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-sm"
                              />
                              <button onClick={() => removeSubList(list.id, sub.id)} className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100">Remove</button>
                            </div>
                            <textarea
                              value={sub.values.join('\n')}
                              onChange={(e) => updateSubList(list.id, sub.id, 'values', e.target.value.split('\n').map((v) => v.trim()).filter(Boolean))}
                              rows={3}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-xs"
                              placeholder="One sub-list value per line"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">Select a category to manage its posting wizard sections/lists/sub-lists.</p>
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
