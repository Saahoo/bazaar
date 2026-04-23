export type ServicesSubcategory =
  | 'home-services'
  | 'repair-maintenance'
  | 'automotive-services'
  | 'beauty-wellness'
  | 'education-tutoring'
  | 'it-digital-services'
  | 'events-entertainment'
  | 'business-services'
  | 'health-medical'
  | 'other-services';

export type ServiceType = 'on-site' | 'at-shop' | 'online-remote';

export type PricingType = 'fixed-price' | 'hourly-rate' | 'daily-rate' | 'custom-quote';

export interface ServicesSubcategoryOption {
  value: ServicesSubcategory;
  labelKey: string;
}

export type ServicesSpecFieldType = 'text' | 'number' | 'select' | 'multiselect' | 'toggle' | 'textarea';

export interface ServicesSpecField {
  key: string;
  labelKey: string;
  type: ServicesSpecFieldType;
  required?: boolean;
  options?: Array<{ value: string; labelKey: string }>;
}

export const SERVICES_SUBCATEGORIES: ServicesSubcategoryOption[] = [
  { value: 'home-services', labelKey: 'services.subcategories.homeServices' },
  { value: 'repair-maintenance', labelKey: 'services.subcategories.repairMaintenance' },
  { value: 'automotive-services', labelKey: 'services.subcategories.automotiveServices' },
  { value: 'beauty-wellness', labelKey: 'services.subcategories.beautyWellness' },
  { value: 'education-tutoring', labelKey: 'services.subcategories.educationTutoring' },
  { value: 'it-digital-services', labelKey: 'services.subcategories.itDigitalServices' },
  { value: 'events-entertainment', labelKey: 'services.subcategories.eventsEntertainment' },
  { value: 'business-services', labelKey: 'services.subcategories.businessServices' },
  { value: 'health-medical', labelKey: 'services.subcategories.healthMedical' },
  { value: 'other-services', labelKey: 'services.subcategories.otherServices' },
];

const HOME_SERVICES_FIELDS: ServicesSpecField[] = [
  { key: 'service_type', labelKey: 'services.fields.serviceType', type: 'select', required: true, options: [
    { value: 'Plumbing', labelKey: 'services.options.plumbing' },
    { value: 'Electrical', labelKey: 'services.options.electrical' },
    { value: 'Carpentry', labelKey: 'services.options.carpentry' },
    { value: 'General Repairs', labelKey: 'services.options.generalRepairs' },
    { value: 'Painting', labelKey: 'services.options.painting' },
    { value: 'Other', labelKey: 'common.other' },
  ]},
  { key: 'experience_years', labelKey: 'services.fields.experienceYears', type: 'number', required: false },
  { key: 'certification', labelKey: 'services.fields.certification', type: 'toggle' },
  { key: 'tools_provided', labelKey: 'services.fields.toolsProvided', type: 'toggle' },
  { key: 'spare_parts_included', labelKey: 'services.fields.sparePartsIncluded', type: 'toggle' },
  { key: 'warranty', labelKey: 'services.fields.warranty', type: 'toggle' },
  { key: 'warranty_duration', labelKey: 'services.fields.warrantyDuration', type: 'text' },
  { key: 'service_duration', labelKey: 'services.fields.serviceDuration', type: 'text' },
  { key: 'materials_included', labelKey: 'services.fields.materialsIncluded', type: 'toggle' },
];

const REPAIR_MAINTENANCE_FIELDS: ServicesSpecField[] = [
  { key: 'service_type', labelKey: 'services.fields.serviceType', type: 'select', required: true, options: [
    { value: 'Electronics', labelKey: 'services.options.electronics' },
    { value: 'Appliances', labelKey: 'services.options.appliances' },
    { value: 'HVAC', labelKey: 'services.options.hvac' },
    { value: 'Plumbing', labelKey: 'services.options.plumbing' },
    { value: 'General', labelKey: 'services.options.general' },
    { value: 'Other', labelKey: 'common.other' },
  ]},
  { key: 'experience_years', labelKey: 'services.fields.experienceYears', type: 'number', required: false },
  { key: 'certification', labelKey: 'services.fields.certification', type: 'toggle' },
  { key: 'warranty', labelKey: 'services.fields.warranty', type: 'toggle' },
  { key: 'warranty_duration', labelKey: 'services.fields.warrantyDuration', type: 'text' },
];

const AUTOMOTIVE_SERVICES_FIELDS: ServicesSpecField[] = [
  { key: 'service_type', labelKey: 'services.fields.serviceType', type: 'select', required: true, options: [
    { value: 'Maintenance', labelKey: 'services.options.maintenance' },
    { value: 'Repair', labelKey: 'services.options.repair' },
    { value: 'Detailing', labelKey: 'services.options.detailing' },
    { value: 'Inspection', labelKey: 'services.options.inspection' },
    { value: 'Custom Work', labelKey: 'services.options.customWork' },
    { value: 'Other', labelKey: 'common.other' },
  ]},
  { key: 'experience_years', labelKey: 'services.fields.experienceYears', type: 'number', required: false },
  { key: 'specialized_in', labelKey: 'services.fields.specializedIn', type: 'text' },
  { key: 'certification', labelKey: 'services.fields.certification', type: 'toggle' },
  { key: 'warranty', labelKey: 'services.fields.warranty', type: 'toggle' },
];

const BEAUTY_WELLNESS_FIELDS: ServicesSpecField[] = [
  { key: 'service_type', labelKey: 'services.fields.serviceType', type: 'select', required: true, options: [
    { value: 'Haircut', labelKey: 'services.options.haircut' },
    { value: 'Makeup', labelKey: 'services.options.makeup' },
    { value: 'Facial', labelKey: 'services.options.facial' },
    { value: 'Massage', labelKey: 'services.options.massage' },
    { value: 'Waxing', labelKey: 'services.options.waxing' },
    { value: 'Nail Care', labelKey: 'services.options.nailCare' },
    { value: 'Other', labelKey: 'common.other' },
  ]},
  { key: 'gender_served', labelKey: 'services.fields.genderServed', type: 'select', options: [
    { value: 'Male', labelKey: 'common.male' },
    { value: 'Female', labelKey: 'common.female' },
    { value: 'Both', labelKey: 'common.both' },
  ]},
  { key: 'experience_years', labelKey: 'services.fields.experienceYears', type: 'number', required: false },
  { key: 'certified_professional', labelKey: 'services.fields.certifiedProfessional', type: 'toggle' },
  { key: 'products_used', labelKey: 'services.fields.productsUsed', type: 'text' },
  { key: 'session_duration', labelKey: 'services.fields.sessionDuration', type: 'text' },
  { key: 'home_service_available', labelKey: 'services.fields.homeServiceAvailable', type: 'toggle' },
];

const EDUCATION_TUTORING_FIELDS: ServicesSpecField[] = [
  { key: 'subject_course', labelKey: 'services.fields.subjectCourse', type: 'text', required: true },
  { key: 'level', labelKey: 'services.fields.level', type: 'select', options: [
    { value: 'Beginner', labelKey: 'services.options.beginner' },
    { value: 'Intermediate', labelKey: 'services.options.intermediate' },
    { value: 'Advanced', labelKey: 'services.options.advanced' },
  ]},
  { key: 'mode', labelKey: 'services.fields.mode', type: 'select', options: [
    { value: 'Online', labelKey: 'services.options.online' },
    { value: 'In-person', labelKey: 'services.options.inPerson' },
    { value: 'Both', labelKey: 'common.both' },
  ]},
  { key: 'group_or_individual', labelKey: 'services.fields.groupOrIndividual', type: 'select', options: [
    { value: 'Group', labelKey: 'services.options.group' },
    { value: 'Individual', labelKey: 'services.options.individual' },
    { value: 'Both', labelKey: 'common.both' },
  ]},
  { key: 'duration_per_session', labelKey: 'services.fields.durationPerSession', type: 'text' },
  { key: 'experience_years', labelKey: 'services.fields.experienceYears', type: 'number', required: false },
  { key: 'certification', labelKey: 'services.fields.certification', type: 'toggle' },
];

const IT_DIGITAL_SERVICES_FIELDS: ServicesSpecField[] = [
  { key: 'service_type', labelKey: 'services.fields.serviceType', type: 'select', required: true, options: [
    { value: 'Web Development', labelKey: 'services.options.webDevelopment' },
    { value: 'Mobile Development', labelKey: 'services.options.mobileDevelopment' },
    { value: 'SEO', labelKey: 'services.options.seo' },
    { value: 'Design', labelKey: 'services.options.design' },
    { value: 'Consulting', labelKey: 'services.options.consulting' },
    { value: 'Other', labelKey: 'common.other' },
  ]},
  { key: 'skills', labelKey: 'services.fields.skills', type: 'multiselect', options: [
    { value: 'Business Strategy', labelKey: 'services.options.businessStrategy' },
    { value: 'Marketing', labelKey: 'services.options.marketing' },
    { value: 'Content Writing', labelKey: 'services.options.contentWriting' },
    { value: 'Graphics Design', labelKey: 'services.options.graphicsDesign' },
  ]},
  { key: 'experience_years', labelKey: 'services.fields.experienceYears', type: 'number', required: false },
  { key: 'tools_technologies', labelKey: 'services.fields.toolsTechnologies', type: 'text' },
  { key: 'delivery_time', labelKey: 'services.fields.deliveryTime', type: 'text' },
  { key: 'revisions_included', labelKey: 'services.fields.revisionsIncluded', type: 'number' },
  { key: 'portfolio_link', labelKey: 'services.fields.portfolioLink', type: 'text' },
];

const EVENTS_ENTERTAINMENT_FIELDS: ServicesSpecField[] = [
  { key: 'service_type', labelKey: 'services.fields.serviceType', type: 'select', required: true, options: [
    { value: 'DJ', labelKey: 'services.options.dj' },
    { value: 'Photographer', labelKey: 'services.options.photographer' },
    { value: 'Event Organizer', labelKey: 'services.options.eventOrganizer' },
    { value: 'Videographer', labelKey: 'services.options.videographer' },
    { value: 'Other', labelKey: 'common.other' },
  ]},
  { key: 'event_types', labelKey: 'services.fields.eventTypes', type: 'multiselect', options: [
    { value: 'Wedding', labelKey: 'services.options.wedding' },
    { value: 'Party', labelKey: 'services.options.party' },
    { value: 'Corporate', labelKey: 'services.options.corporate' },
    { value: 'Birthday', labelKey: 'services.options.birthday' },
  ]},
  { key: 'team_size', labelKey: 'services.fields.teamSize', type: 'number' },
  { key: 'equipment_provided', labelKey: 'services.fields.equipmentProvided', type: 'toggle' },
  { key: 'travel_available', labelKey: 'services.fields.travelAvailable', type: 'toggle' },
  { key: 'duration', labelKey: 'services.fields.duration', type: 'text' },
];

const BUSINESS_SERVICES_FIELDS: ServicesSpecField[] = [
  { key: 'service_type', labelKey: 'services.fields.serviceType', type: 'select', required: true, options: [
    { value: 'Consulting', labelKey: 'services.options.consulting' },
    { value: 'Legal', labelKey: 'services.options.legal' },
    { value: 'Accounting', labelKey: 'services.options.accounting' },
    { value: 'HR Services', labelKey: 'services.options.hrServices' },
    { value: 'Other', labelKey: 'common.other' },
  ]},
  { key: 'industry', labelKey: 'services.fields.industry', type: 'text' },
  { key: 'experience_years', labelKey: 'services.fields.experienceYears', type: 'number', required: false },
  { key: 'certification', labelKey: 'services.fields.certification', type: 'toggle' },
  { key: 'consultation_mode', labelKey: 'services.fields.consultationMode', type: 'select', options: [
    { value: 'Online', labelKey: 'services.options.online' },
    { value: 'In-person', labelKey: 'services.options.inPerson' },
    { value: 'Both', labelKey: 'common.both' },
  ]},
];

const HEALTH_MEDICAL_FIELDS: ServicesSpecField[] = [
  { key: 'service_type', labelKey: 'services.fields.serviceType', type: 'select', required: true, options: [
    { value: 'Doctor', labelKey: 'services.options.doctor' },
    { value: 'Nurse', labelKey: 'services.options.nurse' },
    { value: 'Therapist', labelKey: 'services.options.therapist' },
    { value: 'Dentist', labelKey: 'services.options.dentist' },
    { value: 'Other', labelKey: 'common.other' },
  ]},
  { key: 'specialization', labelKey: 'services.fields.specialization', type: 'text' },
  { key: 'experience_years', labelKey: 'services.fields.experienceYears', type: 'number', required: false },
  { key: 'license_verified', labelKey: 'services.fields.licenseVerified', type: 'toggle' },
  { key: 'clinic_or_home', labelKey: 'services.fields.clinicOrHome', type: 'select', options: [
    { value: 'Clinic', labelKey: 'services.options.clinic' },
    { value: 'Home Visit', labelKey: 'services.options.homeVisit' },
    { value: 'Both', labelKey: 'common.both' },
  ]},
  { key: 'emergency_available', labelKey: 'services.fields.emergencyAvailable', type: 'toggle' },
];

const OTHER_SERVICES_FIELDS: ServicesSpecField[] = [
  { key: 'custom_service_type', labelKey: 'services.fields.customServiceType', type: 'text', required: true },
  { key: 'description_detail', labelKey: 'services.fields.descriptionDetail', type: 'textarea' },
];

export const getServicesSpecsConfig = (subcategory: ServicesSubcategory): ServicesSpecField[] => {
  switch (subcategory) {
    case 'home-services':
      return HOME_SERVICES_FIELDS;
    case 'repair-maintenance':
      return REPAIR_MAINTENANCE_FIELDS;
    case 'automotive-services':
      return AUTOMOTIVE_SERVICES_FIELDS;
    case 'beauty-wellness':
      return BEAUTY_WELLNESS_FIELDS;
    case 'education-tutoring':
      return EDUCATION_TUTORING_FIELDS;
    case 'it-digital-services':
      return IT_DIGITAL_SERVICES_FIELDS;
    case 'events-entertainment':
      return EVENTS_ENTERTAINMENT_FIELDS;
    case 'business-services':
      return BUSINESS_SERVICES_FIELDS;
    case 'health-medical':
      return HEALTH_MEDICAL_FIELDS;
    case 'other-services':
      return OTHER_SERVICES_FIELDS;
    default:
      return [];
  }
};
