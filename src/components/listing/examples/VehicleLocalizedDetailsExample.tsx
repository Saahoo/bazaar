// src/components/listing/examples/VehicleLocalizedDetailsExample.tsx
'use client';

import React from 'react';
import { VehicleLocalizedDetails } from '../VehicleLocalizedDetails';
import { Locale } from '@/lib/i18n/config';
import { VehicleListing, SellerData } from '../types';

// Example data for a vehicle listing
const exampleListingData: VehicleListing & { category: 'vehicles' } = {
  id: '12345',
  user_id: 'user-1',
  category_id: 1,
  category: 'vehicles',
  title: 'Toyota Corolla 2020 - Excellent Condition',
  description: 'Toyota Corolla 2020 model in excellent condition. Regular maintenance, no accidents, fuel efficient. Perfect for city driving.',
  price: 15000,
  currency: 'USD',
  condition: 'like_new',
  city: 'Kabul',
  view_count: 245,
  favorite_count: 0,
  status: 'active',
  from_owner: true,
  created_at: '2024-03-15T10:30:00Z',
  phone_visible: true,
  photos: [
    '/sample-vehicle-1.jpg',
    '/sample-vehicle-2.jpg',
    '/sample-vehicle-3.jpg'
  ],
  metadata: {
    vehicleType: 'sedan',
    year: 2020,
    make: 'Toyota',
    model: 'Corolla',
    engineType: 'petrol',
    trimLevel: 'LE',
    bodyType: 'sedan',
    gearType: 'automatic',
    wheelDriveType: 'FWD',
    engineSize: '1800',
    enginePower: '132',
    mileage: 45000,
    color: 'white',
    handDrive: 'left',
    damage: false,
    exchange: false,
    numberPlate: true,
    damageDetails: '',
    otherOptions: ['ABS', 'Airbags'],
  },
};

const exampleSellerData: SellerData = {
  id: '789',
  display_name: 'Ahmad Khan',
  avatar_url: null,
  phone: '+93 70 123 4567',
  city: 'Kabul',
  bio: null,
  profile_type: null,
  company_name: null,
  age: null,
  sex: null,
  verified: true,
  rating: 4.8,
  member_since: '2022-05-10',
};

interface VehicleLocalizedDetailsExampleProps {
  locale?: Locale;
}

export const VehicleLocalizedDetailsExample: React.FC<VehicleLocalizedDetailsExampleProps> = ({
  locale = 'en'
}) => {
  return (
    <div className="p-4 border border-slate-300 rounded-lg bg-slate-50">
      <h2 className="text-xl font-bold mb-4">Vehicle Localized Details Example</h2>
      <p className="text-slate-600 mb-6">
        This example demonstrates the comprehensive localization features for vehicle listings.
        The component automatically adapts to the selected locale ({locale}) with:
      </p>
      
      <ul className="list-disc pl-5 mb-6 text-slate-700 space-y-1">
        <li>Dynamic content personalization based on locale</li>
        <li>SEO optimization with hreflang tags</li>
        <li>RTL layout support for Arabic/Persian scripts</li>
        <li>Cultural imagery adaptation</li>
        <li>Legal compliance sections</li>
        <li>Region-specific vehicle attributes</li>
      </ul>
      
      <div className="border-t border-slate-300 pt-6">
        <VehicleLocalizedDetails
          listingData={exampleListingData}
          sellerData={exampleSellerData}
          loading={false}
          locale={locale}
          showLegalCompliance={true}
          showCulturalAdaptation={true}
          showRegionSpecificAttributes={true}
          enableSeoOptimization={true}
        />
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-800 mb-2">Usage Instructions:</h3>
        <pre className="text-sm bg-white p-3 rounded border border-slate-200 overflow-x-auto">
{`import { VehicleLocalizedDetails } from '@/components/listing/VehicleLocalizedDetails';

// In your page component:
<VehicleLocalizedDetails
  listingData={listingData}
  sellerData={sellerData}
  loading={false}
  locale={locale}
  showLegalCompliance={true}
  showCulturalAdaptation={true}
  showRegionSpecificAttributes={true}
  enableSeoOptimization={true}
/>`}
        </pre>
        
        <div className="mt-4 text-sm text-slate-700">
          <p className="font-medium">Key Features:</p>
          <ol className="list-decimal pl-5 mt-1 space-y-1">
            <li><strong>Personalization:</strong> Content adapts based on user&apos;s locale preferences</li>
            <li><strong>SEO:</strong> Automatic hreflang tags, structured data, and meta tags</li>
            <li><strong>RTL Support:</strong> Full right-to-left layout for ps/fa locales</li>
            <li><strong>Cultural Adaptation:</strong> Culturally relevant imagery and iconography</li>
            <li><strong>Legal Compliance:</strong> Region-specific legal requirements for vehicle sales</li>
            <li><strong>Measurement Systems:</strong> Automatic conversion between metric/imperial</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default VehicleLocalizedDetailsExample;