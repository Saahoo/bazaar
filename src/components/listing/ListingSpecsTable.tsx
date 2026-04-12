// src/components/listing/ListingSpecsTable.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { getMakesForType, getMakeName, VEHICLE_TYPES } from '@/lib/constants/vehicles';
import {
  getElectronicsSpecsConfig,
  ELECTRONICS_SUBCATEGORIES,
  ElectronicsSubcategory,
} from '@/lib/constants/electronics-wizard';

const VEHICLES_CATEGORY = 1;
const REAL_ESTATE_CATEGORY = 2;
const ELECTRONICS_CATEGORY = 3;
const FASHION_CATEGORY = 4;

interface ListingSpecsTableProps {
  metadata: Record<string, unknown>;
  categoryId: number;
  locale: Locale;
}

const isElectronicsSubcategory = (value: string): value is ElectronicsSubcategory =>
  ELECTRONICS_SUBCATEGORIES.some((subcategory) => subcategory.value === value);

function SpecRow({
  label,
  value,
  rtl,
}: {
  label: string;
  value: React.ReactNode;
  rtl: boolean;
}) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div
      className={`flex justify-between items-start py-2 border-b border-slate-100 last:border-0 text-sm gap-4 ${
        rtl ? 'flex-row-reverse' : ''
      }`}
    >
      <span className={`text-slate-500 shrink-0 ${rtl ? 'text-right' : 'text-left'}`}>
        {label}
      </span>
      <span className={`text-slate-800 font-medium ${rtl ? 'text-left' : 'text-right'}`}>
        {value}
      </span>
    </div>
  );
}

export const ListingSpecsTable: React.FC<ListingSpecsTableProps> = ({
  metadata,
  categoryId,
  locale,
}) => {
  const tVH = useTranslations('postAd.vehicles');
  const tRE = useTranslations('postAd.realEstate');
  const tEl = useTranslations('postAd.electronics');
  const tCommon = useTranslations('common');
  const rtl = isRTL(locale);

  const humanize = (value: string): string =>
    value
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (s) => s.toUpperCase());

  /* ─── VEHICLES ──────────────────────────────────────────────── */
  if (categoryId === VEHICLES_CATEGORY) {
    const vt = (metadata.vehicleType as string) || '';
    const year = metadata.year as string;
    const makeKey = metadata.make as string;
    const modelKey = metadata.model as string;
    const engineType = metadata.engineType as string;
    const wheelDriveType = metadata.wheelDriveType as string;
    const trimLevel = metadata.trimLevel as string;
    const customTrim = metadata.customTrim as string;
    const bodyType = metadata.bodyType as string;
    const gearType = metadata.gearType as string;
    const engineSize = metadata.engineSize as string;
    const enginePower = metadata.enginePower as string;
    const mileage = metadata.mileage as string;
    const color = metadata.color as string;
    const hasDamage = metadata.hasDamage as boolean | null;
    const exchange = metadata.exchange as boolean | null;
    const hasNumberPlate = metadata.hasNumberPlate as boolean | null;
    const numberPlateCity = metadata.numberPlateCity as string;
    const handDrive = metadata.handDrive as string;
    const damageDetails = (metadata.damageDetails as string[]) || [];
    const otherOptions = (metadata.otherOptions as string[]) || [];

    // Resolve make/model/type names
    const vtObj = VEHICLE_TYPES.find((v) => v.key === vt);
    const vtLabel = vtObj
      ? locale === 'ps'
        ? vtObj.name_ps
        : locale === 'fa'
          ? vtObj.name_fa
          : vtObj.name_en
      : vt;

    const makes = getMakesForType(vt as Parameters<typeof getMakesForType>[0]);
    const makeObj = makes.find((m) => m.key === makeKey);
    const makeName = makeObj ? getMakeName(makeObj, locale) : makeKey;

    const modelObj = makeObj?.models.find((m) => m.key === modelKey);
    const modelName = modelObj ? modelObj.name : modelKey;

    const resolvedTrimLevel =
      trimLevel === '__other__'
        ? (customTrim || '')
        : trimLevel;

    const hasSpecs =
      vtLabel || year || makeName || modelName || engineType || trimLevel || bodyType ||
      gearType || wheelDriveType || engineSize || enginePower || mileage || color;
    const hasConditionInfo =
      hasDamage !== null || exchange !== null || hasNumberPlate !== null || handDrive;
    const hasDamageList = damageDetails.length > 0;
    const hasOptions = otherOptions.length > 0;

    if (!hasSpecs && !hasConditionInfo && !hasDamageList && !hasOptions) return null;

    const yesLabel = tCommon('yes');
    const noLabel = tCommon('no');

    return (
      <div className="bg-white border border-slate-200 rounded-lg p-5 mb-6">
        <h2
          className={`text-lg font-semibold text-slate-900 mb-4 ${rtl ? 'text-right' : 'text-left'}`}
        >
          {tVH('specifications')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          {/* Left column */}
          <div>
            {vtLabel && <SpecRow label={tVH('vehicleType')} value={vtLabel} rtl={rtl} />}
            {year && <SpecRow label={tVH('year')} value={year} rtl={rtl} />}
            {makeName && <SpecRow label={tVH('make')} value={makeName} rtl={rtl} />}
            {modelName && <SpecRow label={tVH('model')} value={modelName} rtl={rtl} />}
            {engineType && (
              <SpecRow
                label={tVH('engineType')}
                value={tVH(engineType as Parameters<typeof tVH>[0])}
                rtl={rtl}
              />
            )}
            {resolvedTrimLevel && (
              <SpecRow
                label={tVH('trimLevel')}
                value={
                  trimLevel !== '__other__' && tVH.has((`trim_${trimLevel}`) as Parameters<typeof tVH>[0])
                    ? tVH((`trim_${trimLevel}`) as Parameters<typeof tVH>[0])
                    : resolvedTrimLevel
                }
                rtl={rtl}
              />
            )}
          </div>
          {/* Right column */}
          <div>
            {bodyType && (
              <SpecRow
                label={tVH('bodyType')}
                value={tVH(bodyType as Parameters<typeof tVH>[0])}
                rtl={rtl}
              />
            )}
            {gearType && (
              <SpecRow
                label={tVH('gearType')}
                value={tVH(gearType as Parameters<typeof tVH>[0])}
                rtl={rtl}
              />
            )}
            {wheelDriveType && (
              <SpecRow
                label={tVH('wheelDriveType')}
                value={tVH((`wd_${wheelDriveType}`) as Parameters<typeof tVH>[0])}
                rtl={rtl}
              />
            )}
            {engineSize && (
              <SpecRow label={tVH('engineSize')} value={`${engineSize}L`} rtl={rtl} />
            )}
            {enginePower && (
              <SpecRow label={tVH('enginePower')} value={enginePower} rtl={rtl} />
            )}
            {mileage && (
              <SpecRow
                label={tVH('mileage')}
                value={`${Number(mileage).toLocaleString()} km`}
                rtl={rtl}
              />
            )}
            {color && (
              <SpecRow
                label={tVH('color')}
                value={tVH((`color_${color}`) as Parameters<typeof tVH>[0])}
                rtl={rtl}
              />
            )}
          </div>
        </div>

        {/* Condition extras */}
        {hasConditionInfo && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <div>
              {handDrive && (
                <SpecRow
                  label={tVH('handDrive')}
                  value={tVH((`drive_${handDrive}`) as Parameters<typeof tVH>[0])}
                  rtl={rtl}
                />
              )}
              {hasDamage !== null && (
                <SpecRow
                  label={tVH('damage')}
                  value={
                    hasDamage ? (
                      <span className="text-red-600 font-medium">{yesLabel}</span>
                    ) : (
                      <span className="text-green-600 font-medium">{noLabel}</span>
                    )
                  }
                  rtl={rtl}
                />
              )}
            </div>
            <div>
              {exchange !== null && (
                <SpecRow
                  label={tVH('exchange')}
                  value={exchange ? yesLabel : noLabel}
                  rtl={rtl}
                />
              )}
              {hasNumberPlate !== null && (
                <SpecRow
                  label={tVH('numberPlate')}
                  value={
                    hasNumberPlate
                      ? `${yesLabel}${numberPlateCity ? ` — ${numberPlateCity}` : ''}`
                      : noLabel
                  }
                  rtl={rtl}
                />
              )}
            </div>
          </div>
        )}

        {/* Damage details */}
        {hasDamageList && (
          <div className={`mt-3 ${rtl ? 'text-right' : 'text-left'}`}>
            <p className="text-sm text-slate-500 mb-1.5">{tVH('damageDetails')}</p>
            <div className={`flex flex-wrap gap-2 ${rtl ? 'justify-end' : ''}`}>
              {damageDetails.map((d) => (
                <span
                  key={d}
                  className="px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium"
                >
                  {tVH((`damage_${d}`) as Parameters<typeof tVH>[0])}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Other options */}
        {hasOptions && (
          <div className={`mt-3 ${rtl ? 'text-right' : 'text-left'}`}>
            <p className="text-sm text-slate-500 mb-1.5">{tVH('otherOptions')}</p>
            <div className={`flex flex-wrap gap-2 ${rtl ? 'justify-end' : ''}`}>
              {otherOptions.map((o) => (
                <span
                  key={o}
                  className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium"
                >
                  {tVH((`opt_${o}`) as Parameters<typeof tVH>[0])}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ─── REAL ESTATE ─────────────────────────────────────────────── */
  if (categoryId === REAL_ESTATE_CATEGORY) {
    const propertyType = metadata.propertyType as string;
    const purpose = metadata.purpose as string;
    const deposit = metadata.deposit as number | string;
    const areaGross = metadata.areaGross as number | string;
    const areaNet = metadata.areaNet as number | string;
    const rooms = metadata.rooms as number | string;
    const bathrooms = metadata.bathrooms as number | string;
    const kitchenType = metadata.kitchenType as string;
    const balcony = metadata.balcony as number | string;
    const buildingAge = metadata.buildingAge as string;
    const floor = metadata.floor as number | string;
    const totalFloors = metadata.totalFloors as number | string;
    const lift = metadata.lift as boolean | undefined;
    const carParking = metadata.carParking as boolean | undefined;
    const fromWho = metadata.fromWho as string;
    const district = metadata.district as string;
    const street = metadata.street as string;
    const unit = metadata.unit as string;
    const neighborhood = (metadata.neighborhood as string[]) || [];

    const hasDetails =
      propertyType || purpose || rooms || bathrooms || areaGross || areaNet || floor ||
      buildingAge || typeof lift === 'boolean' || typeof carParking === 'boolean' || fromWho;

    if (!hasDetails) return null;

    const yesLabel = tCommon('yes');
    const noLabel = tCommon('no');

    return (
      <div className="bg-white border border-slate-200 rounded-lg p-5 mb-6">
        <h2
          className={`text-lg font-semibold text-slate-900 mb-4 ${rtl ? 'text-right' : 'text-left'}`}
        >
          {tRE('adDetails')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          {/* Left column */}
          <div>
            {propertyType && (
              <SpecRow
                label={tRE('propertyType')}
                value={tRE(propertyType as Parameters<typeof tRE>[0])}
                rtl={rtl}
              />
            )}
            {purpose && (
              <SpecRow
                label={tRE('purpose')}
                value={tRE(purpose as Parameters<typeof tRE>[0])}
                rtl={rtl}
              />
            )}
            {deposit ? (
              <SpecRow label={tRE('deposit')} value={deposit} rtl={rtl} />
            ) : null}
            {areaGross ? (
              <SpecRow label={tRE('areaGross')} value={`${areaGross} sqm`} rtl={rtl} />
            ) : null}
            {areaNet ? (
              <SpecRow label={tRE('areaNet')} value={`${areaNet} sqm`} rtl={rtl} />
            ) : null}
            {rooms ? <SpecRow label={tRE('rooms')} value={rooms} rtl={rtl} /> : null}
            {bathrooms ? (
              <SpecRow label={tRE('bathrooms')} value={bathrooms} rtl={rtl} />
            ) : null}
            {kitchenType && (
              <SpecRow
                label={tRE('kitchenType')}
                value={tRE(kitchenType as Parameters<typeof tRE>[0])}
                rtl={rtl}
              />
            )}
          </div>
          {/* Right column */}
          <div>
            {balcony !== undefined && balcony !== '' ? (
              <SpecRow label={tRE('balcony')} value={balcony} rtl={rtl} />
            ) : null}
            {buildingAge && (
              <SpecRow
                label={tRE('buildingAge')}
                value={tRE(buildingAge as Parameters<typeof tRE>[0])}
                rtl={rtl}
              />
            )}
            {floor !== undefined && floor !== '' ? (
              <SpecRow label={tRE('floor')} value={floor} rtl={rtl} />
            ) : null}
            {totalFloors ? (
              <SpecRow label={tRE('totalFloors')} value={totalFloors} rtl={rtl} />
            ) : null}
            {typeof lift === 'boolean' && (
              <SpecRow
                label={tRE('lift')}
                value={lift ? yesLabel : noLabel}
                rtl={rtl}
              />
            )}
            {typeof carParking === 'boolean' && (
              <SpecRow
                label={tRE('carParking')}
                value={carParking ? yesLabel : noLabel}
                rtl={rtl}
              />
            )}
            {fromWho && (
              <SpecRow
                label={tRE('fromWho')}
                value={tRE(fromWho as Parameters<typeof tRE>[0])}
                rtl={rtl}
              />
            )}
          </div>
        </div>

        {/* Address details */}
        {(district || street || unit) && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p
              className={`text-sm font-medium text-slate-700 mb-2 ${rtl ? 'text-right' : 'text-left'}`}
            >
              {tRE('address')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              <div>
                {district && <SpecRow label={tRE('district')} value={district} rtl={rtl} />}
                {street && <SpecRow label={tRE('street')} value={street} rtl={rtl} />}
              </div>
              <div>
                {unit && <SpecRow label={tRE('unit')} value={unit} rtl={rtl} />}
              </div>
            </div>
          </div>
        )}

        {/* Neighborhood features */}
        {neighborhood.length > 0 && (
          <div className={`mt-3 ${rtl ? 'text-right' : 'text-left'}`}>
            <p className="text-sm text-slate-500 mb-1.5">{tRE('neighborhood')}</p>
            <div className={`flex flex-wrap gap-2 ${rtl ? 'justify-end' : ''}`}>
              {neighborhood.map((n) => (
                <span
                  key={n}
                  className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                >
                  {tRE(n as Parameters<typeof tRE>[0])}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ─── ELECTRONICS ──────────────────────────────────────────────── */
  if (categoryId === ELECTRONICS_CATEGORY) {
    const subcategory = (metadata.subcategory as string) || '';
    const negotiable = metadata.negotiable as boolean;
    const sellerType = (metadata.sellerType as string) || '';
    const contact = (metadata.contact as Record<string, unknown>) || {};
    const media = (metadata.media as Record<string, unknown>) || {};

    // Get all spec fields for this subcategory
    const allSpecFields = isElectronicsSubcategory(subcategory)
      ? getElectronicsSpecsConfig(subcategory)
      : [];
    const subcategoryLabel = ELECTRONICS_SUBCATEGORIES.find((s) => s.value === subcategory)?.label || subcategory;

    // Build specs display object from metadata
    const displayedSpecs: Record<string, string> = {};
    allSpecFields.forEach((field) => {
      const value = metadata[field.id] as string;
      if (value && value !== '' && value !== 'Other') {
        displayedSpecs[field.id] = value;
      }
    });

    const yesLabel = tCommon('yes');
    const noLabel = tCommon('no');

    const hasSpecs = Object.keys(displayedSpecs).length > 0;
    const contactPhone = contact.phone as string | undefined;
    const contactWhatsapp = contact.whatsapp as string | undefined;
    const contactEmail = contact.email as string | undefined;
    const hasContact = contactPhone || contactWhatsapp || contactEmail;
    const videoUrl = media.video as string | undefined;

    if (!subcategory && !hasSpecs && !hasContact && !sellerType) return null;

    const specsArray = Object.entries(displayedSpecs);

    return (
      <div className="bg-white border border-slate-200 rounded-lg p-5 mb-6">
        <h2
          className={`text-lg font-semibold text-slate-900 mb-4 ${rtl ? 'text-right' : 'text-left'}`}
        >
          {tEl('specifications')}
        </h2>

        {/* Basic Info */}
        <div className="space-y-2 mb-4">
          {subcategory && (
            <SpecRow
              label={tEl('subcategoryLabel')}
              value={subcategoryLabel}
              rtl={rtl}
            />
          )}
          {sellerType && (
            <SpecRow
              label={tEl('sellerType')}
              value={
                sellerType === 'individual'
                  ? tEl('sellerTypeIndividual')
                  : sellerType === 'dealer'
                    ? tEl('sellerTypeDealer')
                    : sellerType
              }
              rtl={rtl}
            />
          )}
          {typeof negotiable === 'boolean' && (
            <SpecRow
              label={tEl('negotiable')}
              value={negotiable ? yesLabel : noLabel}
              rtl={rtl}
            />
          )}
        </div>

        {/* Specifications Grid */}
        {hasSpecs && specsArray.length > 0 && (
          <div className="mb-4 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              <div>
                {specsArray.map(([fieldId, value], idx) => {
                  // Only show first half in left column
                  const isFirstHalf = idx < Math.ceil(specsArray.length / 2);
                  if (!isFirstHalf) return null;

                  const field = allSpecFields.find((f) => f.id === fieldId);
                  const fieldLabel = field?.label || fieldId;

                  return (
                    <SpecRow
                      key={fieldId}
                      label={fieldLabel}
                      value={value}
                      rtl={rtl}
                    />
                  );
                })}
              </div>
              <div>
                {specsArray.map(([fieldId, value], idx) => {
                  // Only show second half in right column
                  const isFirstHalf = idx < Math.ceil(specsArray.length / 2);
                  if (isFirstHalf) return null;

                  const field = allSpecFields.find((f) => f.id === fieldId);
                  const fieldLabel = field?.label || fieldId;

                  return (
                    <SpecRow
                      key={fieldId}
                      label={fieldLabel}
                      value={value}
                      rtl={rtl}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        {hasContact && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p
              className={`text-sm font-medium text-slate-700 mb-3 ${rtl ? 'text-right' : 'text-left'}`}
            >
              {tEl('contactHeading')}
            </p>
            <div className="space-y-2">
              {contactPhone && (
                <div className={`flex items-center justify-between gap-4 text-sm ${rtl ? 'flex-row-reverse' : ''}`}>
                  <span className={`text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>
                    {tEl('phone')}
                  </span>
                  <span className={`text-slate-800 font-medium ${rtl ? 'text-left' : 'text-right'}`}>
                    {contactPhone}
                  </span>
                </div>
              )}
              {contactWhatsapp && (
                <div className={`flex items-center justify-between gap-4 text-sm ${rtl ? 'flex-row-reverse' : ''}`}>
                  <span className={`text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>
                    {tEl('whatsapp')}
                  </span>
                  <span className={`text-slate-800 font-medium ${rtl ? 'text-left' : 'text-right'}`}>
                    {contactWhatsapp}
                  </span>
                </div>
              )}
              {contactEmail && (
                <div className={`flex items-center justify-between gap-4 text-sm ${rtl ? 'flex-row-reverse' : ''}`}>
                  <span className={`text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>
                    {tEl('email')}
                  </span>
                  <span className={`text-slate-800 font-medium ${rtl ? 'text-left' : 'text-right'}`}>
                    {contactEmail}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Media */}
        {videoUrl && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p
              className={`text-sm font-medium text-slate-700 mb-2 ${rtl ? 'text-right' : 'text-left'}`}
            >
              {tEl('videoUrl')}
            </p>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline text-sm break-all"
            >
              {videoUrl.substring(0, 50)}...
            </a>
          </div>
        )}
      </div>
    );
  }

  /* ─── FASHION & CLOTHING ─────────────────────────────────────── */
  if (categoryId === FASHION_CATEGORY) {
    const subcategory = String(metadata.subcategory || '');
    const condition = String(metadata.condition || '');
    const brand = String(metadata.brand || '');
    const sellerType = String(metadata.sellerType || '');
    const location = (metadata.location as Record<string, unknown>) || {};
    const contact = (metadata.contact as Record<string, unknown>) || {};
    const media = (metadata.media as Record<string, unknown>) || {};

    const city = String(location.city || '');
    const lat = typeof location.lat === 'number' ? location.lat : null;
    const lng = typeof location.lng === 'number' ? location.lng : null;
    const phone = String(contact.phone || '');
    const whatsapp = String(contact.whatsapp || '');
    const email = String(contact.email || '');
    const video = String(media.video || '');

    const excludedKeys = new Set(['subcategory', 'condition', 'brand', 'sellerType', 'location', 'contact', 'media', 'wizard_forms']);
    const extraEntries = Object.entries(metadata).filter(([key, value]) => {
      if (excludedKeys.has(key)) return false;
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim() !== '';
      if (Array.isArray(value)) return value.length > 0;
      return true;
    });

    if (!subcategory && !brand && !condition && extraEntries.length === 0 && !city && !phone) return null;

    const yesLabel = tCommon('yes');
    const noLabel = tCommon('no');

    return (
      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className={`mb-4 text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
          Fashion & Clothing Details
        </h2>

        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
          <div>
            {subcategory && <SpecRow label="Subcategory" value={subcategory} rtl={rtl} />}
            {brand && <SpecRow label="Brand" value={brand} rtl={rtl} />}
            {condition && <SpecRow label="Condition" value={condition} rtl={rtl} />}
            {sellerType && <SpecRow label="Seller Type" value={sellerType} rtl={rtl} />}
          </div>
          <div>
            {city && <SpecRow label="City" value={city} rtl={rtl} />}
            {lat !== null && lng !== null && (
              <SpecRow label="Map" value={`${lat.toFixed(5)}, ${lng.toFixed(5)}`} rtl={rtl} />
            )}
            {phone && <SpecRow label="Phone" value={phone} rtl={rtl} />}
            {whatsapp && <SpecRow label="WhatsApp" value={whatsapp} rtl={rtl} />}
            {email && <SpecRow label="Email" value={email} rtl={rtl} />}
          </div>
        </div>

        {extraEntries.length > 0 && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className={`mb-2 text-sm font-medium text-slate-700 ${rtl ? 'text-right' : 'text-left'}`}>Specifications</p>
            <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              {extraEntries.map(([key, value]) => (
                <SpecRow
                  key={key}
                  label={humanize(key)}
                  value={Array.isArray(value) ? value.join(', ') : typeof value === 'boolean' ? (value ? yesLabel : noLabel) : String(value)}
                  rtl={rtl}
                />
              ))}
            </div>
          </div>
        )}

        {video && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className={`mb-2 text-sm font-medium text-slate-700 ${rtl ? 'text-right' : 'text-left'}`}>Video</p>
            <a href={video} target="_blank" rel="noopener noreferrer" className="break-all text-sm text-primary-600 underline hover:text-primary-700">
              {video}
            </a>
          </div>
        )}
      </div>
    );
  }

  return null;
};
