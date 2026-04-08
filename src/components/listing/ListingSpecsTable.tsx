// src/components/listing/ListingSpecsTable.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { getMakesForType, getMakeName, VEHICLE_TYPES } from '@/lib/constants/vehicles';

const VEHICLES_CATEGORY = 1;
const REAL_ESTATE_CATEGORY = 2;

interface ListingSpecsTableProps {
  metadata: Record<string, unknown>;
  categoryId: number;
  locale: Locale;
}

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
  const tCommon = useTranslations('common');
  const rtl = isRTL(locale);

  /* ─── VEHICLES ──────────────────────────────────────────────── */
  if (categoryId === VEHICLES_CATEGORY) {
    const vt = (metadata.vehicleType as string) || '';
    const year = metadata.year as string;
    const makeKey = metadata.make as string;
    const modelKey = metadata.model as string;
    const engineType = metadata.engineType as string;
    const trimLevel = metadata.trimLevel as string;
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

    const hasSpecs =
      vtLabel || year || makeName || modelName || engineType || trimLevel || bodyType ||
      gearType || engineSize || enginePower || mileage || color;
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
            {trimLevel && (
              <SpecRow
                label={tVH('trimLevel')}
                value={tVH((`trim_${trimLevel}`) as Parameters<typeof tVH>[0])}
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

  return null;
};
