'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Check, LogIn, Save, Eye } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { useAuth } from '@/lib/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { StepCategory } from './StepCategory';
import { StepDetails, StepDetailsHandle } from './StepDetails';
import { StepPhotos, StepPhotosData } from './StepPhotos';
import { StepContact } from './StepContact';
// Real Estate steps
import { StepPropertyType, PropertyType, PropertyPurpose } from './real-estate/StepPropertyType';
import { StepPropertyDetails, StepPropertyDetailsHandle, PropertyDetailsData } from './real-estate/StepPropertyDetails';
import { StepAddress, AddressData } from './real-estate/StepAddress';
import { StepMedia, MediaData } from './real-estate/StepMedia';
import { StepContactInfo, ContactInfoData } from './real-estate/StepContactInfo';
// Vehicles steps
import { StepVehicleType } from './vehicles/StepVehicleType';
import { StepVehicleSpecs, VehicleSpecsData } from './vehicles/StepVehicleSpecs';
import { StepVehicleCondition, VehicleConditionData } from './vehicles/StepVehicleCondition';
import { StepVehicleAddress, VehicleAddressData } from './vehicles/StepVehicleAddress';
import { StepVehicleMedia, VehicleMediaData } from './vehicles/StepVehicleMedia';
import { StepVehicleContact, VehicleContactData } from './vehicles/StepVehicleContact';
import { DynamicWizardFields, WizardFormConfig, isWizardRequiredFieldsValid } from './DynamicWizardFields';
import type { VehicleType as VehicleTypeEnum } from '@/lib/constants/vehicles';

// Category IDs
const REAL_ESTATE_CATEGORY = 2;
const VEHICLES_CATEGORY = 1;

export interface PostAdFormData {
  categoryId: number | null;
  title: string;
  description: string;
  price: number | '';
  currency: string;
  condition: string;
  city: string;
  phone: string;
  email: string;
  termsAccepted: boolean;
  photos: StepPhotosData;
}

export interface RealEstateFormData {
  propertyType: PropertyType | '';
  purpose: PropertyPurpose | '';
  propertyDetails: PropertyDetailsData;
  address: AddressData;
  media: MediaData;
  contact: ContactInfoData;
}

export interface VehiclesFormData {
  title: string;
  description: string;
  vehicleType: VehicleTypeEnum | '';
  specs: VehicleSpecsData;
  condition: VehicleConditionData;
  address: VehicleAddressData;
  media: VehicleMediaData;
  contact: VehicleContactData;
}

const INITIAL_FORM_DATA: PostAdFormData = {
  categoryId: null,
  title: '',
  description: '',
  price: '',
  currency: 'AFN',
  condition: '',
  city: '',
  phone: '',
  email: '',
  termsAccepted: false,
  photos: { photos: [] },
};

const INITIAL_RE_DATA: RealEstateFormData = {
  propertyType: '',
  purpose: '',
  propertyDetails: {
    title: '', description: '', price: '', currency: 'AFN', deposit: '',
    areaGross: '', areaNet: '', rooms: '', bathrooms: '', kitchenType: '',
    balcony: '', buildingAge: '', floor: '', totalFloors: '',
    lift: false, carParking: false, fromWho: '',
  },
  address: { city: '', district: '', street: '', unit: '', neighborhood: [] },
  media: { photos: [], videoUrl: '' },
  contact: { phone: '', whatsapp: '', email: '', termsAccepted: false },
};

const INITIAL_VH_DATA: VehiclesFormData = {
  title: '',
  description: '',
  vehicleType: '',
  specs: {
    year: '', make: '', customMake: '', model: '', customModel: '',
    engineType: '', wheelDriveType: '', trimLevel: '', customTrim: '',
    bodyType: '', gearType: '', engineSize: '', enginePower: '',
  },
  condition: {
    price: '', currency: 'AFN', mileage: '', color: '',
    hasDamage: null, exchange: null, hasNumberPlate: null,
    numberPlateCity: '', handDrive: '', damageDetails: '', otherOptions: [],
  },
  address: { city: '', street: '', area: '', lat: null, lng: null },
  media: { photos: [], videoUrl: '' },
  contact: { phone: '', whatsapp: '', whatsappSameAsPhone: false, email: '', termsAccepted: false },
};

// Default steps for non-specialized categories
const DEFAULT_STEPS = ['stepCategory', 'stepDetails', 'stepPhotos', 'stepContact'] as const;
// Real estate steps
const RE_STEPS = ['stepCategory', 'reStepType', 'reStepDetails', 'reStepAddress', 'reStepMedia', 'reStepContact'] as const;
// Vehicle steps
const VH_STEPS = ['stepCategory', 'vhStepType', 'vhStepSpecs', 'vhStepCondition', 'vhStepAddress', 'vhStepMedia', 'vhStepContact'] as const;

type StepKey = typeof DEFAULT_STEPS[number] | typeof RE_STEPS[number] | typeof VH_STEPS[number];

interface PostAdWizardProps {
  locale: Locale;
}

export const PostAdWizard: React.FC<PostAdWizardProps> = ({ locale }) => {
  const t = useTranslations('postAd');
  const tRE = useTranslations('postAd.realEstate');
  const tVH = useTranslations('postAd.vehicles');
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');
  const rtl = isRTL(locale);
  const { user, loading: authLoading } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PostAdFormData>(INITIAL_FORM_DATA);
  const [reData, setReData] = useState<RealEstateFormData>(INITIAL_RE_DATA);
  const [vhData, setVhData] = useState<VehiclesFormData>(INITIAL_VH_DATA);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [wizardConfig, setWizardConfig] = useState<WizardFormConfig>({ sections: [], lists: [] });
  const [wizardValues, setWizardValues] = useState<Record<string, unknown>>({});
  const [loadingWizardConfig, setLoadingWizardConfig] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const supabase = createClient();

  const detailsRef = useRef<StepDetailsHandle>(null);
  const reDetailsRef = useRef<StepPropertyDetailsHandle>(null);

  const updateFormData = useCallback((updates: Partial<PostAdFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateREData = useCallback((updates: Partial<RealEstateFormData>) => {
    setReData((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateVHData = useCallback((updates: Partial<VehiclesFormData>) => {
    setVhData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleCategorySelect = useCallback(
    (categoryId: number) => {
      const changingCategory = formData.categoryId !== categoryId;
      updateFormData({ categoryId });
      if (changingCategory) {
        setReData(INITIAL_RE_DATA);
        setVhData(INITIAL_VH_DATA);
        setWizardValues({});
      }
    },
    [updateFormData, formData.categoryId]
  );

  useEffect(() => {
    let mounted = true;

    const loadWizardConfig = async () => {
      if (!formData.categoryId) {
        if (mounted) setWizardConfig({ sections: [], lists: [] });
        return;
      }

      setLoadingWizardConfig(true);
      const { data } = await supabase
        .from('categories')
        .select('options_json')
        .eq('id', formData.categoryId)
        .single();

      if (!mounted) return;

      const raw = (data?.options_json || {}) as Record<string, unknown>;
      const wf = (raw.wizard_forms || {}) as Partial<WizardFormConfig>;
      setWizardConfig({
        sections: Array.isArray(wf.sections) ? (wf.sections as WizardFormConfig['sections']) : [],
        lists: Array.isArray(wf.lists) ? (wf.lists as WizardFormConfig['lists']) : [],
      });
      setLoadingWizardConfig(false);
    };

    loadWizardConfig();

    return () => {
      mounted = false;
    };
  }, [formData.categoryId, supabase]);

  // Auth gate — require login to post an ad
  if (authLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <p className="text-slate-500">{tCommon('loading')}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <LogIn className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">{tAuth('loginTitle')}</h2>
        <p className="text-slate-500 mb-6 text-sm">
          {locale === 'en'
            ? 'You need to be logged in to post an ad.'
            : locale === 'ps'
              ? 'د اعلان د خپرولو لپاره تاسو باید ننوتل شوي وئ.'
              : 'برای ارسال آگهی باید وارد شوید.'}
        </p>
        <Link
          href={`/${locale}/login`}
          className="inline-block px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
        >
          {tAuth('loginButton')}
        </Link>
      </div>
    );
  }

  const isRealEstate = formData.categoryId === REAL_ESTATE_CATEGORY;
  const isVehicles = formData.categoryId === VEHICLES_CATEGORY;
  const steps: readonly string[] = isRealEstate ? RE_STEPS : isVehicles ? VH_STEPS : DEFAULT_STEPS;

  const getStepLabel = (step: string): string => {
    switch (step) {
      case 'stepCategory': return t('stepCategory');
      case 'stepDetails': return t('stepDetails');
      case 'stepPhotos': return t('stepPhotos');
      case 'stepContact': return t('stepContact');
      case 'reStepType': return tRE('stepType');
      case 'reStepDetails': return tRE('stepDetails');
      case 'reStepAddress': return tRE('stepAddress');
      case 'reStepMedia': return tRE('stepMedia');
      case 'reStepContact': return tRE('stepContact');
      case 'vhStepType': return tVH('stepType');
      case 'vhStepSpecs': return tVH('stepSpecs');
      case 'vhStepCondition': return tVH('stepCondition');
      case 'vhStepAddress': return tVH('stepAddress');
      case 'vhStepMedia': return tVH('stepMedia');
      case 'vhStepContact': return tVH('stepContact');
      default: return '';
    }
  };

  const currentStepKey = steps[currentStep] as StepKey;

  const shouldShowDynamicFields =
    currentStepKey === 'stepDetails' || currentStepKey === 'reStepDetails' || currentStepKey === 'vhStepSpecs';

  const hasDynamicFields = wizardConfig.sections.length > 0 || wizardConfig.lists.length > 0;

  const canProceed = (): boolean => {
    const requiredDynamicValid = !shouldShowDynamicFields || !hasDynamicFields || isWizardRequiredFieldsValid(wizardConfig, wizardValues);

    switch (currentStepKey) {
      case 'stepCategory':
        return formData.categoryId !== null;
      case 'stepDetails':
        return requiredDynamicValid;
      case 'stepPhotos':
        return true;
      case 'stepContact':
        return formData.city !== '' && formData.phone !== '' && formData.termsAccepted;
      // Real estate steps
      case 'reStepType':
        return reData.propertyType !== '' && reData.purpose !== '';
      case 'reStepDetails':
        return requiredDynamicValid;
      case 'reStepAddress':
        return reData.address.city !== '';
      case 'reStepMedia':
        return true;
      case 'reStepContact':
        return reData.contact.phone !== '' && reData.contact.termsAccepted;
      // Vehicle steps
      case 'vhStepType':
        return vhData.title !== '' && vhData.title.length <= 100 && vhData.description.length >= 50 && vhData.vehicleType !== '';
      case 'vhStepSpecs':
        return vhData.specs.year !== '' && (vhData.specs.make !== '' || vhData.specs.customMake !== '') && (vhData.specs.model !== '' || vhData.specs.customModel !== '') && requiredDynamicValid;
      case 'vhStepCondition':
        return vhData.condition.price !== '' && vhData.condition.mileage !== '';
      case 'vhStepAddress':
        return vhData.address.city !== '' && vhData.address.lat !== null && vhData.address.lng !== null;
      case 'vhStepMedia':
        return vhData.media.photos.length >= 1;
      case 'vhStepContact':
        return vhData.contact.phone !== '' && vhData.contact.termsAccepted;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStepKey === 'stepDetails' && detailsRef.current) {
      const valid = await detailsRef.current.validate();
      if (!valid) return;
    }
    if (currentStepKey === 'reStepDetails' && reDetailsRef.current) {
      const valid = await reDetailsRef.current.validate();
      if (!valid) return;
    }

    if (!canProceed()) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed() || !user) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Build metadata based on category
      let metadata: Record<string, unknown> = {};
      let title = formData.title;
      let description = formData.description;
      let price = typeof formData.price === 'number' ? formData.price : 0;
      let currency = formData.currency;
      let city = formData.city;
      let _phone = formData.phone;
      let condition = formData.condition;
      let photosList = formData.photos.photos;

      if (isRealEstate) {
        metadata = {
          propertyType: reData.propertyType,
          purpose: reData.purpose,
          ...reData.propertyDetails,
          ...reData.address,
          wizard_forms: wizardValues,
        };
        title = reData.propertyDetails.title || title;
        description = reData.propertyDetails.description || description;
        price = Number(reData.propertyDetails.price) || price;
        currency = reData.propertyDetails.currency || currency;
        city = reData.address.city || city;
        _phone = reData.contact.phone || _phone;
        condition = 'good';
        photosList = reData.media.photos;
      } else if (isVehicles) {
        metadata = {
          vehicleType: vhData.vehicleType,
          ...vhData.specs,
          ...vhData.condition,
          wizard_forms: wizardValues,
        };
        title = vhData.title || title;
        description = vhData.description || description;
        price = Number(vhData.condition.price) || price;
        currency = vhData.condition.currency || currency;
        city = vhData.address.city || city;
        _phone = vhData.contact.phone || _phone;
        condition = 'good';
        photosList = vhData.media.photos;
      } else {
        metadata = {
          ...metadata,
          wizard_forms: wizardValues,
        };
      }

      // Insert listing
      const { data: listing, error: insertError } = await supabase
        .from('listings')
        .insert({
          user_id: user.id,
          category_id: formData.categoryId,
          title,
          description,
          price,
          currency,
          condition: condition || 'good',
          city,
          phone_visible: true,
          metadata,
          status: 'active',
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Listing insert failed:', insertError);
        throw new Error(insertError.message);
      }

      // Insert photos into photos table
      if (listing && photosList.length > 0) {
        const photoRows = photosList.map((photo, index) => ({
          listing_id: listing.id,
          photo_url: photo.url,
          display_order: index,
          uploaded_by: user.id,
        }));

        const { error: photosError } = await supabase
          .from('photos')
          .insert(photoRows);

        if (photosError) {
          console.error('Photos insert failed:', photosError);
        }
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit listing.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostAnother = () => {
    setFormData(INITIAL_FORM_DATA);
    setReData(INITIAL_RE_DATA);
    setVhData(INITIAL_VH_DATA);
    setCurrentStep(0);
    setSubmitted(false);
    setWizardValues({});
    setShowPreview(false);
  };

  const handleSaveDraft = async () => {
    if (!user) return;
    setSavingDraft(true);
    try {
      let draftData: Record<string, unknown> = { formData, wizardValues };
      if (isRealEstate) draftData = { ...draftData, reData };
      else if (isVehicles) draftData = { ...draftData, vhData };
      await supabase.from('listing_drafts').upsert({
        user_id: user.id,
        category_id: formData.categoryId,
        draft_data: draftData,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,category_id' });
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 3000);
    } catch {
      // silently fail for draft save
    } finally {
      setSavingDraft(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{tCommon('success')}</h2>
        <p className="text-slate-600 mb-8">{t('success')}</p>
        <div className={`flex items-center justify-center gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
          <Link
            href={`/${locale}`}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            {t('viewListing')}
          </Link>
          <button
            onClick={handlePostAnother}
            className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium"
          >
            {t('postAnother')}
          </button>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStepKey) {
      case 'stepCategory':
        return (
          <StepCategory
            locale={locale}
            selectedCategory={formData.categoryId}
            onSelect={handleCategorySelect}
          />
        );
      case 'stepDetails':
        return (
          <StepDetails
            ref={detailsRef}
            locale={locale}
            data={{
              title: formData.title,
              description: formData.description,
              price: formData.price,
              currency: formData.currency,
              condition: formData.condition,
            }}
            onChange={(data) => updateFormData(data)}
          />
        );
      case 'stepPhotos':
        return (
          <StepPhotos
            locale={locale}
            data={formData.photos}
            onChange={(data) => updateFormData({ photos: { ...formData.photos, ...data } })}
          />
        );
      case 'stepContact':
        return (
          <StepContact
            locale={locale}
            data={{
              city: formData.city,
              phone: formData.phone,
              email: formData.email,
              termsAccepted: formData.termsAccepted,
            }}
            onChange={(data) => updateFormData(data)}
            formData={formData}
          />
        );
      // Real Estate steps
      case 'reStepType':
        return (
          <StepPropertyType
            locale={locale}
            propertyType={reData.propertyType}
            purpose={reData.purpose}
            onChange={(data) => updateREData(data as Partial<RealEstateFormData>)}
          />
        );
      case 'reStepDetails':
        return (
          <StepPropertyDetails
            ref={reDetailsRef}
            locale={locale}
            purpose={reData.purpose as PropertyPurpose}
            data={reData.propertyDetails}
            onChange={(data) =>
              setReData((prev) => ({
                ...prev,
                propertyDetails: { ...prev.propertyDetails, ...data },
              }))
            }
          />
        );
      case 'reStepAddress':
        return (
          <StepAddress
            locale={locale}
            data={reData.address}
            onChange={(data) =>
              setReData((prev) => ({
                ...prev,
                address: { ...prev.address, ...data },
              }))
            }
          />
        );
      case 'reStepMedia':
        return (
          <StepMedia
            locale={locale}
            data={reData.media}
            onChange={(data) =>
              setReData((prev) => ({
                ...prev,
                media: { ...prev.media, ...data },
              }))
            }
          />
        );
      case 'reStepContact':
        return (
          <StepContactInfo
            locale={locale}
            data={reData.contact}
            onChange={(data) =>
              setReData((prev) => ({
                ...prev,
                contact: { ...prev.contact, ...data },
              }))
            }
          />
        );
      // Vehicle steps
      case 'vhStepType':
        return (
          <StepVehicleType
            locale={locale}
            title={vhData.title}
            description={vhData.description}
            vehicleType={vhData.vehicleType}
            onChange={(data) => {
              if ('vehicleType' in data && data.vehicleType !== vhData.vehicleType) {
                // Reset specs when vehicle type changes
                updateVHData({
                  ...data,
                  specs: { ...INITIAL_VH_DATA.specs },
                });
              } else {
                updateVHData(data);
              }
            }}
          />
        );
      case 'vhStepSpecs':
        return (
          <StepVehicleSpecs
            locale={locale}
            vehicleType={vhData.vehicleType as VehicleTypeEnum}
            data={vhData.specs}
            onChange={(data) =>
              setVhData((prev) => ({
                ...prev,
                specs: { ...prev.specs, ...data },
              }))
            }
          />
        );
      case 'vhStepCondition':
        return (
          <StepVehicleCondition
            locale={locale}
            vehicleType={vhData.vehicleType as VehicleTypeEnum}
            make={vhData.specs.make}
            model={vhData.specs.model}
            data={vhData.condition}
            onChange={(data) =>
              setVhData((prev) => ({
                ...prev,
                condition: { ...prev.condition, ...data },
              }))
            }
          />
        );
      case 'vhStepAddress':
        return (
          <StepVehicleAddress
            locale={locale}
            data={vhData.address}
            onChange={(data) =>
              setVhData((prev) => ({
                ...prev,
                address: { ...prev.address, ...data },
              }))
            }
          />
        );
      case 'vhStepMedia':
        return (
          <StepVehicleMedia
            locale={locale}
            data={vhData.media}
            onChange={(data) =>
              setVhData((prev) => ({
                ...prev,
                media: { ...prev.media, ...data },
              }))
            }
          />
        );
      case 'vhStepContact':
        return (
          <StepVehicleContact
            locale={locale}
            data={vhData.contact}
            onChange={(data) =>
              setVhData((prev) => ({
                ...prev,
                contact: { ...prev.contact, ...data },
              }))
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className={`flex items-center justify-between ${rtl ? 'flex-row-reverse' : ''}`}>
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <span
                  className={`text-xs font-medium text-center hidden sm:block ${
                    index === currentStep ? 'text-primary-600' : 'text-slate-500'
                  }`}
                >
                  {getStepLabel(step)}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    index < currentStep ? 'bg-green-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-center justify-between">
            <span>{submitError}</span>
            <button onClick={() => setSubmitError(null)} className="text-red-500 hover:text-red-700 font-bold ml-2">&times;</button>
          </div>
        )}
        {renderStepContent()}
        {loadingWizardConfig && shouldShowDynamicFields && (
          <p className="text-sm text-slate-500 mt-4">Loading extra fields...</p>
        )}
        {!loadingWizardConfig && shouldShowDynamicFields && hasDynamicFields && (
          <DynamicWizardFields
            locale={locale}
            config={wizardConfig}
            values={wizardValues}
            onChange={(key, value) => setWizardValues((prev) => ({ ...prev, [key]: value }))}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className={`flex items-center justify-between gap-2 flex-wrap ${rtl ? 'flex-row-reverse' : ''}`}>
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${
            currentStep === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          } ${rtl ? 'flex-row-reverse' : ''}`}
        >
          {rtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {tCommon('previous')}
        </button>

        <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
          {/* Save Draft */}
          {formData.categoryId !== null && (
            <button
              onClick={handleSaveDraft}
              disabled={savingDraft}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition border-2 ${
                draftSaved
                  ? 'border-green-400 bg-green-50 text-green-700'
                  : 'border-slate-300 bg-white text-slate-600 hover:border-primary-300 hover:bg-primary-50'
              } ${rtl ? 'flex-row-reverse' : ''}`}
            >
              <Save className="w-4 h-4" />
              {draftSaved ? tCommon('saved') : savingDraft ? tCommon('loading') : t('saveDraft')}
            </button>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${
                canProceed()
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-primary-300 text-white cursor-not-allowed'
              } ${rtl ? 'flex-row-reverse' : ''}`}
            >
              {tCommon('next')}
              {rtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
              {/* Preview Ad */}
              <button
                onClick={() => setShowPreview(true)}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition border-2 ${
                  canProceed()
                    ? 'border-orange-400 bg-orange-50 text-orange-700 hover:bg-orange-100'
                    : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                } ${rtl ? 'flex-row-reverse' : ''}`}
              >
                <Eye className="w-4 h-4" />
                {t('previewAd')}
              </button>
              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || submitting}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition ${
                  canProceed() && !submitting
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-primary-300 text-white cursor-not-allowed'
                } ${rtl ? 'flex-row-reverse' : ''}`}
              >
                {submitting ? tCommon('loading') : t('submitListing')}
                <Check className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className={`flex items-center justify-between mb-6 ${rtl ? 'flex-row-reverse' : ''}`}>
              <h2 className="text-xl font-bold text-slate-900">{t('previewAd')}</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4 text-sm">
              {isVehicles && (
                <>
                  <div><span className="font-semibold text-slate-700">{t('stepDetails')}:</span> {vhData.title}</div>
                  <div><span className="font-semibold text-slate-700">{tVH('vehicleType')}:</span> {vhData.vehicleType}</div>
                  <div><span className="font-semibold text-slate-700">{tVH('year')}:</span> {vhData.specs.year}</div>
                  <div><span className="font-semibold text-slate-700">{tVH('make')}:</span> {vhData.specs.make === '__other__' ? vhData.specs.customMake : vhData.specs.make}</div>
                  <div><span className="font-semibold text-slate-700">{tVH('model')}:</span> {vhData.specs.model === '__other__' ? vhData.specs.customModel : vhData.specs.model}</div>
                  <div><span className="font-semibold text-slate-700">{tCommon('price')}:</span> {vhData.condition.price} {vhData.condition.currency}</div>
                  <div><span className="font-semibold text-slate-700">{tVH('mileage')}:</span> {vhData.condition.mileage} km</div>
                  <div><span className="font-semibold text-slate-700">{tVH('city')}:</span> {vhData.address.city}</div>
                  {vhData.media.photos.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-700">{tVH('photos')}:</span> {vhData.media.photos.length} photo(s)
                    </div>
                  )}
                </>
              )}
              {!isVehicles && !isRealEstate && (
                <>
                  <div><span className="font-semibold text-slate-700">{t('stepDetails')}:</span> {formData.title}</div>
                  <div><span className="font-semibold text-slate-700">{tCommon('price')}:</span> {formData.price} {formData.currency}</div>
                </>
              )}
            </div>
            <div className={`flex items-center justify-end gap-3 mt-6 ${rtl ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => setShowPreview(false)}
                className="px-5 py-2.5 rounded-lg font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                {tCommon('close')}
              </button>
              <button
                onClick={() => { setShowPreview(false); handleSubmit(); }}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium bg-primary-600 text-white hover:bg-primary-700 transition"
              >
                {submitting ? tCommon('loading') : t('submitListing')}
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
