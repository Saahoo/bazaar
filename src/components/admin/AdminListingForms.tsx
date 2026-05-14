'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Copy,
  FileText,
  ListChecks,
  X,
} from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';
import {
  SECTION_LABELS,
  CategoryRow,
  WizardFormConfig,
  WizardSection,
  WizardField,
  WizardListGroup,
  WizardSubList,
  WizardFieldType,
  normalizeWizardConfig,
  hasWizardContent,
  deepCloneWizardConfig,
  EMPTY_WIZARD_CONFIG,
  BUILTIN_WIZARD_TEMPLATES,
  getWizardStepsForSlug,
} from './adminShared';

interface AdminListingFormsProps {
  locale: Locale;
}

const FIELD_TYPE_OPTIONS: { value: WizardFieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select (Dropdown)' },
  { value: 'checkbox', label: 'Checkbox' },
];

export const AdminListingForms: React.FC<AdminListingFormsProps> = ({ locale }) => {
  const rtl = isRTL(locale);
  const supabase = createClient();

  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [wizardConfig, setWizardConfig] = useState<WizardFormConfig>(EMPTY_WIZARD_CONFIG);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedLists, setExpandedLists] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const title = SECTION_LABELS.listingForms[locale] || SECTION_LABELS.listingForms.en;

  const L = (en: string, ps: string, fa: string) => locale === 'ps' ? ps : locale === 'fa' ? fa : en;

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;
      setCategories((data as CategoryRow[]) || []);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const selectCategory = (catId: number) => {
    clearMessages();
    setSelectedCatId(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat?.options_json) {
      const config = normalizeWizardConfig(cat.options_json);
      setWizardConfig(config);
      // Expand all sections and lists by default
      setExpandedSections(new Set(config.sections.map((s) => s.id)));
      setExpandedLists(new Set(config.lists.map((l) => l.id)));
    } else {
      setWizardConfig(deepCloneWizardConfig(EMPTY_WIZARD_CONFIG));
      setExpandedSections(new Set());
      setExpandedLists(new Set());
    }
  };

  const handleSave = async () => {
    if (selectedCatId === null) return;

    setSaving(true);
    clearMessages();
    try {
      const { error: updateError } = await supabase
        .from('categories')
        .update({ options_json: wizardConfig as unknown as Record<string, unknown> })
        .eq('id', selectedCatId);
      if (updateError) throw updateError;
      setSuccess(L('Form configuration saved', 'فورم تنظیمات ساتل شو', 'تنظیمات فرم ذخیره شد'));
      await loadCategories();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleApplyTemplate = (templateKey: string) => {
    const template = BUILTIN_WIZARD_TEMPLATES[templateKey];
    if (!template) return;
    setWizardConfig(deepCloneWizardConfig(template));
    setExpandedSections(new Set(template.sections.map((s) => s.id)));
    setExpandedLists(new Set(template.lists.map((l) => l.id)));
    clearMessages();
  };

  const handleClearConfig = () => {
    if (!confirm(L('Clear all form fields?', 'ټول فورم فیلډونه پاک کړئ؟', 'تمام فیلدهای فرم پاک شوند؟'))) return;
    setWizardConfig(deepCloneWizardConfig(EMPTY_WIZARD_CONFIG));
    setExpandedSections(new Set());
    setExpandedLists(new Set());
    clearMessages();
  };

  // Section management
  const addSection = () => {
    const newSection: WizardSection = {
      id: `section_${Date.now()}`,
      title: '',
      fields: [],
    };
    setWizardConfig({ ...wizardConfig, sections: [...wizardConfig.sections, newSection] });
    setExpandedSections(new Set([...expandedSections, newSection.id]));
  };

  const updateSection = (sectionIdx: number, updates: Partial<WizardSection>) => {
    const newSections = [...wizardConfig.sections];
    newSections[sectionIdx] = { ...newSections[sectionIdx], ...updates };
    setWizardConfig({ ...wizardConfig, sections: newSections });
  };

  const removeSection = (sectionIdx: number) => {
    const newSections = wizardConfig.sections.filter((_, i) => i !== sectionIdx);
    setWizardConfig({ ...wizardConfig, sections: newSections });
  };

  const moveSection = (sectionIdx: number, direction: 'up' | 'down') => {
    const newSections = [...wizardConfig.sections];
    const targetIdx = direction === 'up' ? sectionIdx - 1 : sectionIdx + 1;
    if (targetIdx < 0 || targetIdx >= newSections.length) return;
    [newSections[sectionIdx], newSections[targetIdx]] = [newSections[targetIdx], newSections[sectionIdx]];
    setWizardConfig({ ...wizardConfig, sections: newSections });
  };

  // Field management
  const addField = (sectionIdx: number) => {
    const newField: WizardField = {
      id: `field_${Date.now()}`,
      label: '',
      type: 'text',
      required: false,
      options: [],
    };
    const newSections = [...wizardConfig.sections];
    newSections[sectionIdx] = {
      ...newSections[sectionIdx],
      fields: [...newSections[sectionIdx].fields, newField],
    };
    setWizardConfig({ ...wizardConfig, sections: newSections });
  };

  const updateField = (sectionIdx: number, fieldIdx: number, updates: Partial<WizardField>) => {
    const newSections = [...wizardConfig.sections];
    const newFields = [...newSections[sectionIdx].fields];
    newFields[fieldIdx] = { ...newFields[fieldIdx], ...updates };
    newSections[sectionIdx] = { ...newSections[sectionIdx], fields: newFields };
    setWizardConfig({ ...wizardConfig, sections: newSections });
  };

  const removeField = (sectionIdx: number, fieldIdx: number) => {
    const newSections = [...wizardConfig.sections];
    newSections[sectionIdx] = {
      ...newSections[sectionIdx],
      fields: newSections[sectionIdx].fields.filter((_, i) => i !== fieldIdx),
    };
    setWizardConfig({ ...wizardConfig, sections: newSections });
  };

  // List management
  const addList = () => {
    const newList: WizardListGroup = {
      id: `list_${Date.now()}`,
      title: '',
      values: [],
      sub_lists: [],
    };
    setWizardConfig({ ...wizardConfig, lists: [...wizardConfig.lists, newList] });
    setExpandedLists(new Set([...expandedLists, newList.id]));
  };

  const updateList = (listIdx: number, updates: Partial<WizardListGroup>) => {
    const newLists = [...wizardConfig.lists];
    newLists[listIdx] = { ...newLists[listIdx], ...updates };
    setWizardConfig({ ...wizardConfig, lists: newLists });
  };

  const removeList = (listIdx: number) => {
    const newLists = wizardConfig.lists.filter((_, i) => i !== listIdx);
    setWizardConfig({ ...wizardConfig, lists: newLists });
  };

  // Sub-list management
  const addSubList = (listIdx: number) => {
    const newSubList: WizardSubList = {
      id: `sub_${Date.now()}`,
      title: '',
      values: [],
    };
    const newLists = [...wizardConfig.lists];
    newLists[listIdx] = {
      ...newLists[listIdx],
      sub_lists: [...newLists[listIdx].sub_lists, newSubList],
    };
    setWizardConfig({ ...wizardConfig, lists: newLists });
  };

  const updateSubList = (listIdx: number, subIdx: number, updates: Partial<WizardSubList>) => {
    const newLists = [...wizardConfig.lists];
    const newSubLists = [...newLists[listIdx].sub_lists];
    newSubLists[subIdx] = { ...newSubLists[subIdx], ...updates };
    newLists[listIdx] = { ...newLists[listIdx], sub_lists: newSubLists };
    setWizardConfig({ ...wizardConfig, lists: newLists });
  };

  const removeSubList = (listIdx: number, subIdx: number) => {
    const newLists = [...wizardConfig.lists];
    newLists[listIdx] = {
      ...newLists[listIdx],
      sub_lists: newLists[listIdx].sub_lists.filter((_, i) => i !== subIdx),
    };
    setWizardConfig({ ...wizardConfig, lists: newLists });
  };

  // Value management for lists
  const addValueToList = (listIdx: number, value: string) => {
    if (!value.trim()) return;
    const newLists = [...wizardConfig.lists];
    newLists[listIdx] = {
      ...newLists[listIdx],
      values: [...newLists[listIdx].values, value.trim()],
    };
    setWizardConfig({ ...wizardConfig, lists: newLists });
  };

  const removeValueFromList = (listIdx: number, valIdx: number) => {
    const newLists = [...wizardConfig.lists];
    newLists[listIdx] = {
      ...newLists[listIdx],
      values: newLists[listIdx].values.filter((_, i) => i !== valIdx),
    };
    setWizardConfig({ ...wizardConfig, lists: newLists });
  };

  const addValueToSubList = (listIdx: number, subIdx: number, value: string) => {
    if (!value.trim()) return;
    const newLists = [...wizardConfig.lists];
    const newSubLists = [...newLists[listIdx].sub_lists];
    newSubLists[subIdx] = {
      ...newSubLists[subIdx],
      values: [...newSubLists[subIdx].values, value.trim()],
    };
    newLists[listIdx] = { ...newLists[listIdx], sub_lists: newSubLists };
    setWizardConfig({ ...wizardConfig, lists: newLists });
  };

  const removeValueFromSubList = (listIdx: number, subIdx: number, valIdx: number) => {
    const newLists = [...wizardConfig.lists];
    const newSubLists = [...newLists[listIdx].sub_lists];
    newSubLists[subIdx] = {
      ...newSubLists[subIdx],
      values: newSubLists[subIdx].values.filter((_, i) => i !== valIdx),
    };
    newLists[listIdx] = { ...newLists[listIdx], sub_lists: newSubLists };
    setWizardConfig({ ...wizardConfig, lists: newLists });
  };

  // Option management for select fields
  const addOptionToField = (sectionIdx: number, fieldIdx: number, option: string) => {
    if (!option.trim()) return;
    const newSections = [...wizardConfig.sections];
    const newFields = [...newSections[sectionIdx].fields];
    newFields[fieldIdx] = {
      ...newFields[fieldIdx],
      options: [...newFields[fieldIdx].options, option.trim()],
    };
    newSections[sectionIdx] = { ...newSections[sectionIdx], fields: newFields };
    setWizardConfig({ ...wizardConfig, sections: newSections });
  };

  const removeOptionFromField = (sectionIdx: number, fieldIdx: number, optIdx: number) => {
    const newSections = [...wizardConfig.sections];
    const newFields = [...newSections[sectionIdx].fields];
    newFields[fieldIdx] = {
      ...newFields[fieldIdx],
      options: newFields[fieldIdx].options.filter((_, i) => i !== optIdx),
    };
    newSections[sectionIdx] = { ...newSections[sectionIdx], fields: newFields };
    setWizardConfig({ ...wizardConfig, sections: newSections });
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleList = (id: string) => {
    setExpandedLists((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedCat = categories.find((c) => c.id === selectedCatId);
  const availableSteps = selectedCat ? getWizardStepsForSlug(selectedCat.slug) : [];
  const hasContent = hasWizardContent(wizardConfig);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className={`ml-3 text-slate-500 ${rtl ? 'mr-3 ml-0' : ''}`}>
          {L('Loading categories...', 'کټګورۍ لوډیږي...', 'بارگذاری دسته‌بندی‌ها...')}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {success && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Selector */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              {L('Select Category', 'کټګوري غوره کړئ', 'انتخاب دسته‌بندی')}
            </h3>
            <div className="space-y-1 max-h-[60vh] overflow-y-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCatId === cat.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  } ${rtl ? 'text-right' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{cat.name_en}</span>
                    {hasWizardContent(normalizeWizardConfig(cat.options_json)) && (
                      <span className="ml-auto w-2 h-2 bg-green-400 rounded-full flex-shrink-0" title="Has form config" />
                    )}
                  </div>
                </button>
              ))}
              {categories.length === 0 && (
                <p className="text-xs text-slate-400 px-3 py-2">
                  {L('No categories found', 'کټګورۍ ونه موندل شوې', 'دسته‌بندی یافت نشد')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Builder */}
        <div className="lg:col-span-3">
          {selectedCatId === null ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">
                {L('Select a category to manage its listing form', 'د فورم ادارې لپاره کټګوري غوره کړئ', 'برای مدیریت فرم آگهی، یک دسته‌بندی انتخاب کنید')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-700">
                      {selectedCat?.name_en}{' '}
                      <span className="text-sm font-normal text-slate-400">
                        ({selectedCat?.slug})
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {L(
                        `${wizardConfig.sections.length} sections, ${wizardConfig.lists.length} lists`,
                        `${wizardConfig.sections.length} برخې، ${wizardConfig.lists.length} لیستونه`,
                        `${wizardConfig.sections.length} بخش، ${wizardConfig.lists.length} لیست`
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Template buttons */}
                    {Object.keys(BUILTIN_WIZARD_TEMPLATES).map((key) => (
                      <button
                        key={key}
                        onClick={() => handleApplyTemplate(key)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100"
                        title={L(`Apply ${key} template`, `${key} ټیمپلیټ پلې کړئ`, `اعمال قالب ${key}`)}
                      >
                        <Copy className="w-3 h-3" />
                        {key}
                      </button>
                    ))}
                    {hasContent && (
                      <button
                        onClick={handleClearConfig}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        title={L('Clear all', 'ټول پاک کړئ', 'پاک کردن همه')}
                      >
                        <Trash2 className="w-3 h-3" />
                        {L('Clear', 'پاک کړئ', 'پاک کردن')}
                      </button>
                    )}
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1 px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {saving ? L('Saving...', 'ساتل...', 'ذخیره...') : L('Save', 'ساتل', 'ذخیره')}
                    </button>
                  </div>
                </div>

                {/* Available steps hint */}
                {availableSteps.length > 0 && (
                  <div className="mt-3 px-3 py-2 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">
                      {L('Available wizard steps:', 'شتون لرونکي ګامونه:', 'مراحل ویزارد موجود:')}{' '}
                      <code className="text-xs bg-slate-200 px-1 rounded">{availableSteps.join(', ')}</code>
                    </p>
                  </div>
                )}
              </div>

              {/* Sections */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {L('Form Sections', 'فورم برخې', 'بخش‌های فرم')}
                  </h4>
                  <button
                    onClick={addSection}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  >
                    <Plus className="w-3 h-3" />
                    {L('Add Section', 'برخه اضافه کړئ', 'اضافه بخش')}
                  </button>
                </div>

                {wizardConfig.sections.length === 0 && (
                  <p className="text-sm text-slate-400 py-4 text-center">
                    {L('No sections yet. Add a section to define form fields.', 'برخې نشته. فورم فیلډونو لپاره برخه اضافه کړئ.', 'هنوز بخشی وجود ندارد. برای تعریف فیلدها یک بخش اضافه کنید.')}
                  </p>
                )}

                <div className="space-y-3">
                  {wizardConfig.sections.map((section, sIdx) => (
                    <div key={section.id} className="border border-slate-200 rounded-lg overflow-hidden">
                      {/* Section header */}
                      <div
                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 cursor-pointer hover:bg-slate-100"
                        onClick={() => toggleSection(section.id)}
                      >
                        {expandedSections.has(section.id) ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="text-sm font-medium text-slate-700 flex-1">
                          {section.title || L('(Untitled Section)', '(بې نومه برخه)', '(بخش بدون عنوان)')}
                        </span>
                        <span className="text-xs text-slate-400">
                          {section.fields.length} {L('fields', 'فیلډونه', 'فیلد')}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveSection(sIdx, 'up'); }}
                          className="p-1 hover:bg-slate-200 rounded text-slate-400 text-xs"
                          disabled={sIdx === 0}
                          title={L('Move up', 'بورته یوړئ', 'جابجایی به بالا')}
                        >
                          ▲
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveSection(sIdx, 'down'); }}
                          className="p-1 hover:bg-slate-200 rounded text-slate-400 text-xs"
                          disabled={sIdx === wizardConfig.sections.length - 1}
                          title={L('Move down', 'کمته یوړئ', 'جابجایی به پایین')}
                        >
                          ▼
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeSection(sIdx); }}
                          className="p-1 hover:bg-red-100 rounded text-red-400"
                          title={L('Remove section', 'برخه لرې کړئ', 'حذف بخش')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Section body */}
                      {expandedSections.has(section.id) && (
                        <div className="p-3 space-y-3">
                          {/* Section settings */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                {L('Section Title', 'د برخې سرلیک', 'عنوان بخش')}
                              </label>
                              <input
                                type="text"
                                value={section.title}
                                onChange={(e) => updateSection(sIdx, { title: e.target.value })}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g. Basic Details"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                {L('Wizard Step ID', 'د ویزارد ګام آی‌دی', 'شناسه مرحله ویزارد')}
                              </label>
                              <input
                                type="text"
                                value={section.step || ''}
                                onChange={(e) => updateSection(sIdx, { step: e.target.value || undefined })}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g. stepDetails"
                              />
                            </div>
                          </div>

                          {/* Fields */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-slate-500">
                                {L('Fields', 'فیلډونه', 'فیلدها')}
                              </span>
                              <button
                                onClick={() => addField(sIdx)}
                                className="flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100"
                              >
                                <Plus className="w-3 h-3" />
                                {L('Add Field', 'فیلډ اضافه کړئ', 'اضافه فیلد')}
                              </button>
                            </div>

                            {section.fields.map((field, fIdx) => (
                              <div key={field.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                                  <div className="md:col-span-1">
                                    <label className="block text-xs text-slate-400 mb-0.5">{L('Label', 'لیبل', 'برچسب')}</label>
                                    <input
                                      type="text"
                                      value={field.label}
                                      onChange={(e) => updateField(sIdx, fIdx, { label: e.target.value })}
                                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      placeholder="Field label"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-slate-400 mb-0.5">{L('ID', 'آی‌دی', 'شناسه')}</label>
                                    <input
                                      type="text"
                                      value={field.id}
                                      onChange={(e) => updateField(sIdx, fIdx, { id: e.target.value })}
                                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      placeholder="field_id"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-slate-400 mb-0.5">{L('Type', 'ډول', 'نوع')}</label>
                                    <select
                                      value={field.type}
                                      onChange={(e) => updateField(sIdx, fIdx, { type: e.target.value as WizardFieldType })}
                                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      title={L('Field type', 'ډول فیلډ', 'نوع فیلد')}
                                    >
                                      {FIELD_TYPE_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="flex items-end gap-2">
                                    <label className="flex items-center gap-1 text-xs text-slate-500 pb-1">
                                      <input
                                        type="checkbox"
                                        checked={field.required}
                                        onChange={(e) => updateField(sIdx, fIdx, { required: e.target.checked })}
                                        className="w-3.5 h-3.5 rounded"
                                        title={L('Required field', 'اړین فیلډ', 'فیلد الزامی')}
                                      />
                                      {L('Required', 'اړین', 'الزامی')}
                                    </label>
                                    <button
                                      onClick={() => removeField(sIdx, fIdx)}
                                      className="p-1 hover:bg-red-100 rounded text-red-400 ml-auto"
                                      title={L('Remove field', 'فیلډ لرې کړئ', 'حذف فیلد')}
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Options for select type */}
                                {field.type === 'select' && (
                                  <div className="mt-2 pt-2 border-t border-slate-200">
                                    <label className="block text-xs text-slate-400 mb-1">{L('Options', 'غوراوی', 'گزینه‌ها')}</label>
                                    <div className="flex flex-wrap gap-1 mb-1">
                                      {field.options.map((opt, oIdx) => (
                                        <span
                                          key={oIdx}
                                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-xs text-slate-600"
                                        >
                                          {opt}
                                          <button
                                            onClick={() => removeOptionFromField(sIdx, fIdx, oIdx)}
                                            className="text-red-400 hover:text-red-600"
                                            title={L('Remove option', 'غوراوی لرې کړئ', 'حذف گزینه')}
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                    <input
                                      type="text"
                                      className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      placeholder={L('Type and press Enter to add option', 'غوراوی اضافه کولو لپاره لیکل او Enter فشار ورکړئ', 'برای اضافه کردن گزینه تایپ کنید و Enter بزنید')}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          addOptionToField(sIdx, fIdx, (e.target as HTMLInputElement).value);
                                          (e.target as HTMLInputElement).value = '';
                                        }
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Lists */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <ListChecks className="w-4 h-4" />
                    {L('Checklist Groups', 'چک‌لیست ګروپونه', 'گروه‌های چک‌لیست')}
                  </h4>
                  <button
                    onClick={addList}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  >
                    <Plus className="w-3 h-3" />
                    {L('Add List', 'لیست اضافه کړئ', 'اضافه لیست')}
                  </button>
                </div>

                {wizardConfig.lists.length === 0 && (
                  <p className="text-sm text-slate-400 py-4 text-center">
                    {L('No lists yet. Add a list for checkbox/selection groups.', 'لیستونه نشته. چک‌باکس/غوراوي ګروپونو لپاره لیست اضافه کړئ.', 'هنوز لیستی وجود ندارد. برای گروه‌های چک‌باکس/انتخاب یک لیست اضافه کنید.')}
                  </p>
                )}

                <div className="space-y-3">
                  {wizardConfig.lists.map((list, lIdx) => (
                    <div key={list.id} className="border border-slate-200 rounded-lg overflow-hidden">
                      {/* List header */}
                      <div
                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 cursor-pointer hover:bg-slate-100"
                        onClick={() => toggleList(list.id)}
                      >
                        {expandedLists.has(list.id) ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="text-sm font-medium text-slate-700 flex-1">
                          {list.title || L('(Untitled List)', '(بې نومه لیست)', '(لیست بدون عنوان)')}
                        </span>
                        <span className="text-xs text-slate-400">
                          {list.values.length} {L('items', 'توکی', 'مورد')}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeList(lIdx); }}
                          className="p-1 hover:bg-red-100 rounded text-red-400"
                          title={L('Remove list', 'لیست لرې کړئ', 'حذف لیست')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* List body */}
                      {expandedLists.has(list.id) && (
                        <div className="p-3 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                {L('List Title', 'د لیست سرلیک', 'عنوان لیست')}
                              </label>
                              <input
                                type="text"
                                value={list.title}
                                onChange={(e) => updateList(lIdx, { title: e.target.value })}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g. Features"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                {L('Wizard Step ID', 'د ویزارد ګام آی‌دی', 'شناسه مرحله ویزارد')}
                              </label>
                              <input
                                type="text"
                                value={list.step || ''}
                                onChange={(e) => updateList(lIdx, { step: e.target.value || undefined })}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g. stepDetails"
                              />
                            </div>
                          </div>

                          {/* Values */}
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                              {L('Values', 'ارزښتونه', 'مقادیر')}
                            </label>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {list.values.map((val, vIdx) => (
                                <span
                                  key={vIdx}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700"
                                >
                                  {val}
                                  <button
                                    onClick={() => removeValueFromList(lIdx, vIdx)}
                                    className="text-blue-400 hover:text-red-500"
                                    title={L('Remove', 'لرې کړئ', 'حذف')}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                            <input
                              type="text"
                              className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={L('Type and press Enter to add value', 'ارزښت اضافه کولو لپاره لیکل او Enter فشار ورکړئ', 'برای اضافه کردن مقدار تایپ کنید و Enter بزنید')}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addValueToList(lIdx, (e.target as HTMLInputElement).value);
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }}
                            />
                          </div>

                          {/* Sub-lists */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-slate-500">
                                {L('Sub-lists', 'فرعي لیستونه', 'زیرلیست‌ها')}
                              </span>
                              <button
                                onClick={() => addSubList(lIdx)}
                                className="flex items-center gap-1 px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
                              >
                                <Plus className="w-3 h-3" />
                                {L('Add Sub-list', 'فرعي لیست اضافه کړئ', 'اضافه زیرلیست')}
                              </button>
                            </div>

                            {list.sub_lists.map((sub, subIdx) => (
                              <div key={sub.id} className="border border-slate-100 rounded-lg p-2 mb-2 bg-slate-50/50">
                                <div className="flex items-center gap-2 mb-2">
                                  <input
                                    type="text"
                                    value={sub.title}
                                    onChange={(e) => updateSubList(lIdx, subIdx, { title: e.target.value })}
                                    className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={L('Sub-list title', 'فرعي لیست سرلیک', 'عنوان زیرلیست')}
                                  />
                                  <button
                                    onClick={() => removeSubList(lIdx, subIdx)}
                                    className="p-1 hover:bg-red-100 rounded text-red-400"
                                    title={L('Remove sub-list', 'فرعي لیست لرې کړئ', 'حذف زیرلیست')}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-1">
                                  {sub.values.map((val, vIdx) => (
                                    <span
                                      key={vIdx}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-xs text-slate-600"
                                    >
                                      {val}
                                      <button
                                        onClick={() => removeValueFromSubList(lIdx, subIdx, vIdx)}
                                        className="text-red-400 hover:text-red-600"
                                        title={L('Remove', 'لرې کړئ', 'حذف')}
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                                <input
                                  type="text"
                                  className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder={L('Add value...', 'ارزښت اضافه کړئ...', 'اضافه مقدار...')}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      addValueToSubList(lIdx, subIdx, (e.target as HTMLInputElement).value);
                                      (e.target as HTMLInputElement).value = '';
                                    }
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};