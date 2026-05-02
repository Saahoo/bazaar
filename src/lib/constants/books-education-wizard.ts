// ─── Books & Education Wizard Constants ────────────────────────────────────────
// Subcategories: physical-books, e-books, online-courses, tutoring-services, educational-supplies

export type BooksEducationSubcategory =
  | 'physical-books'
  | 'e-books'
  | 'online-courses'
  | 'tutoring-services'
  | 'educational-supplies';

export interface BooksEducationSubcategoryOption {
  value: BooksEducationSubcategory;
  label: string;
}

export const BOOKS_EDUCATION_SUBCATEGORY_LABEL_KEYS: Record<BooksEducationSubcategory, string> = {
  'physical-books': 'subcategoryPhysicalBooks',
  'e-books': 'subcategoryEBooks',
  'online-courses': 'subcategoryOnlineCourses',
  'tutoring-services': 'subcategoryTutoringServices',
  'educational-supplies': 'subcategoryEducationalSupplies',
};

export type BooksEducationSpecFieldType = 'text' | 'select' | 'multiselect' | 'checkbox' | 'toggle' | 'number' | 'unit';

export interface BooksEducationSpecField {
  key: string;
  label: string;
  type: BooksEducationSpecFieldType;
  required?: boolean;
  options?: string[];
  unitOptions?: string[];
  placeholder?: string;
  /** Only show this field for specific subcategories */
  subcategories?: BooksEducationSubcategory[];
}

export const BOOKS_EDUCATION_SUBCATEGORIES: BooksEducationSubcategoryOption[] = [
  { value: 'physical-books', label: 'Physical Books' },
  { value: 'e-books', label: 'E-Books' },
  { value: 'online-courses', label: 'Online Courses' },
  { value: 'tutoring-services', label: 'Tutoring Services' },
  { value: 'educational-supplies', label: 'Educational Supplies' },
];

// ─── Shared option lists ──────────────────────────────────────────────────────

export const BOOK_CONDITION_OPTIONS = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Poor',
  'Damaged',
];

export const EDUCATION_LEVEL_OPTIONS = [
  'Preschool',
  'Primary School',
  'Middle School',
  'High School',
  'Diploma',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'Doctorate/PhD',
  'Professional Certification',
  'Adult Education',
  'All Levels',
];

export const SUBJECT_MATTER_OPTIONS = [
  'Mathematics',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Engineering',
  'Medicine',
  'Law',
  'Business & Management',
  'Economics',
  'Accounting',
  'Literature',
  'History',
  'Geography',
  'Philosophy',
  'Psychology',
  'Sociology',
  'Political Science',
  'Art & Design',
  'Music',
  'Languages',
  'Religious Studies',
  'Islamic Studies',
  'Quran & Tajweed',
  'Physical Education',
  'Agriculture',
  'Vocational/Trade',
  'Test Preparation',
  'Other',
];

export const BOOK_FORMAT_OPTIONS = [
  'Hardcover',
  'Paperback',
  'Board Book',
  'Leather Bound',
];

export const EBOOK_FORMAT_OPTIONS = [
  'PDF',
  'EPUB',
  'MOBI',
  'AZW (Kindle)',
  'Interactive',
];

export const LANGUAGE_OPTIONS = [
  'English',
  'Pashto',
  'Farsi/Dari',
  'Arabic',
  'Urdu',
  'Turkish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Korean',
  'Russian',
  'Spanish',
  'Hindi',
  'Other',
];

export const PRICE_TYPE_OPTIONS = [
  'Fixed',
  'Negotiable',
  'Per Hour',
  'Per Session',
  'Per Month',
  'Per Course',
  'Free',
];

export const DELIVERY_OPTIONS = [
  'Available',
  'Not Available',
  'Local Only',
  'Digital Delivery',
];

export const TEACHING_MODE_OPTIONS = [
  'Online',
  'In-Person',
  'Both (Online & In-Person)',
];

export const EXPERIENCE_LEVEL_OPTIONS = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
  'All Levels',
];

export const SUPPLY_TYPE_OPTIONS = [
  'Stationery',
  'Lab Equipment',
  'Art Supplies',
  'Musical Instruments',
  'Math Instruments',
  'Maps & Globes',
  'Flashcards & Charts',
  'School Bags',
  'Uniforms',
  'Desk & Furniture',
  'Science Kits',
  'Other',
];

export const COURSE_DURATION_OPTIONS = [
  'Less than 1 week',
  '1-2 weeks',
  '1 month',
  '2-3 months',
  '6 months',
  '1 year',
  'Self-paced',
  'Other',
];

export const CERTIFICATION_OPTIONS = [
  'Certificate of Completion',
  'Accredited Certificate',
  'University Credit',
  'Professional License',
  'No Certificate',
];

// ─── Common fields for ALL subcategories ───────────────────────────────────────

const BOOKS_EDUCATION_COMMON_FIELDS: BooksEducationSpecField[] = [
  {
    key: 'subjectMatter',
    label: 'Subject Matter',
    type: 'select',
    required: true,
    options: SUBJECT_MATTER_OPTIONS,
  },
  {
    key: 'educationLevel',
    label: 'Education Level',
    type: 'select',
    required: true,
    options: EDUCATION_LEVEL_OPTIONS,
  },
  {
    key: 'language',
    label: 'Language',
    type: 'select',
    required: true,
    options: LANGUAGE_OPTIONS,
  },
  {
    key: 'price',
    label: 'Price',
    type: 'number',
    required: true,
  },
  {
    key: 'priceType',
    label: 'Price Type',
    type: 'select',
    required: true,
    options: PRICE_TYPE_OPTIONS,
  },
  {
    key: 'deliveryAvailable',
    label: 'Delivery',
    type: 'select',
    required: false,
    options: DELIVERY_OPTIONS,
  },
];

// ─── Subcategory-specific fields ──────────────────────────────────────────────

const PHYSICAL_BOOKS_FIELDS: BooksEducationSpecField[] = [
  {
    key: 'author',
    label: 'Author',
    type: 'text',
    required: true,
    placeholder: 'e.g., Khaled Hosseini',
  },
  {
    key: 'isbn',
    label: 'ISBN',
    type: 'text',
    required: false,
    placeholder: 'e.g., 978-0-7432-7356-5',
  },
  {
    key: 'edition',
    label: 'Edition',
    type: 'text',
    required: false,
    placeholder: 'e.g., 3rd Edition',
  },
  {
    key: 'publicationYear',
    label: 'Publication Year',
    type: 'number',
    required: false,
    placeholder: 'e.g., 2023',
  },
  {
    key: 'publisher',
    label: 'Publisher',
    type: 'text',
    required: false,
    placeholder: 'e.g., Oxford University Press',
  },
  {
    key: 'bookCondition',
    label: 'Condition',
    type: 'select',
    required: true,
    options: BOOK_CONDITION_OPTIONS,
  },
  {
    key: 'bookFormat',
    label: 'Format',
    type: 'select',
    required: true,
    options: BOOK_FORMAT_OPTIONS,
  },
  {
    key: 'pages',
    label: 'Number of Pages',
    type: 'number',
    required: false,
    placeholder: 'e.g., 350',
  },
  {
    key: 'isTextbook',
    label: 'Is Textbook',
    type: 'toggle',
    required: false,
  },
];

const EBOOKS_FIELDS: BooksEducationSpecField[] = [
  {
    key: 'author',
    label: 'Author',
    type: 'text',
    required: true,
    placeholder: 'e.g., Khaled Hosseini',
  },
  {
    key: 'isbn',
    label: 'ISBN',
    type: 'text',
    required: false,
    placeholder: 'e.g., 978-0-7432-7356-5',
  },
  {
    key: 'edition',
    label: 'Edition',
    type: 'text',
    required: false,
    placeholder: 'e.g., 2nd Edition',
  },
  {
    key: 'publicationYear',
    label: 'Publication Year',
    type: 'number',
    required: false,
    placeholder: 'e.g., 2023',
  },
  {
    key: 'publisher',
    label: 'Publisher',
    type: 'text',
    required: false,
    placeholder: 'e.g., Digital Press',
  },
  {
    key: 'ebookFormat',
    label: 'E-Book Format',
    type: 'select',
    required: true,
    options: EBOOK_FORMAT_OPTIONS,
  },
  {
    key: 'fileSize',
    label: 'File Size',
    type: 'text',
    required: false,
    placeholder: 'e.g., 15 MB',
  },
  {
    key: 'pages',
    label: 'Number of Pages',
    type: 'number',
    required: false,
    placeholder: 'e.g., 280',
  },
  {
    key: 'drmProtected',
    label: 'DRM Protected',
    type: 'toggle',
    required: false,
  },
  {
    key: 'isTextbook',
    label: 'Is Textbook',
    type: 'toggle',
    required: false,
  },
];

const ONLINE_COURSES_FIELDS: BooksEducationSpecField[] = [
  {
    key: 'instructor',
    label: 'Instructor',
    type: 'text',
    required: true,
    placeholder: 'e.g., Dr. Ahmad Khan',
  },
  {
    key: 'platform',
    label: 'Platform',
    type: 'text',
    required: false,
    placeholder: 'e.g., Udemy, Coursera, Self-hosted',
  },
  {
    key: 'courseDuration',
    label: 'Course Duration',
    type: 'select',
    required: true,
    options: COURSE_DURATION_OPTIONS,
  },
  {
    key: 'experienceLevel',
    label: 'Experience Level',
    type: 'select',
    required: true,
    options: EXPERIENCE_LEVEL_OPTIONS,
  },
  {
    key: 'certification',
    label: 'Certification',
    type: 'select',
    required: false,
    options: CERTIFICATION_OPTIONS,
  },
  {
    key: 'teachingMode',
    label: 'Teaching Mode',
    type: 'select',
    required: true,
    options: TEACHING_MODE_OPTIONS,
  },
  {
    key: 'lessonsCount',
    label: 'Number of Lessons',
    type: 'number',
    required: false,
    placeholder: 'e.g., 24',
  },
  {
    key: 'hasLiveSessions',
    label: 'Has Live Sessions',
    type: 'toggle',
    required: false,
  },
  {
    key: 'hasAssignments',
    label: 'Has Assignments',
    type: 'toggle',
    required: false,
  },
];

const TUTORING_SERVICES_FIELDS: BooksEducationSpecField[] = [
  {
    key: 'tutorName',
    label: 'Tutor Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Fatima Ahmadi',
  },
  {
    key: 'qualification',
    label: 'Qualification',
    type: 'text',
    required: true,
    placeholder: "e.g., Master's in Mathematics",
  },
  {
    key: 'experienceYears',
    label: 'Years of Experience',
    type: 'number',
    required: true,
    placeholder: 'e.g., 5',
  },
  {
    key: 'teachingMode',
    label: 'Teaching Mode',
    type: 'select',
    required: true,
    options: TEACHING_MODE_OPTIONS,
  },
  {
    key: 'experienceLevel',
    label: 'Student Level',
    type: 'select',
    required: true,
    options: EXPERIENCE_LEVEL_OPTIONS,
  },
  {
    key: 'sessionDuration',
    label: 'Session Duration',
    type: 'text',
    required: false,
    placeholder: 'e.g., 60 minutes',
  },
  {
    key: 'availableDays',
    label: 'Available Days',
    type: 'text',
    required: false,
    placeholder: 'e.g., Mon, Wed, Fri',
  },
  {
    key: 'groupTutoring',
    label: 'Group Tutoring Available',
    type: 'toggle',
    required: false,
  },
  {
    key: 'freeTrial',
    label: 'Free Trial Lesson',
    type: 'toggle',
    required: false,
  },
];

const EDUCATIONAL_SUPPLIES_FIELDS: BooksEducationSpecField[] = [
  {
    key: 'supplyType',
    label: 'Supply Type',
    type: 'select',
    required: true,
    options: SUPPLY_TYPE_OPTIONS,
  },
  {
    key: 'brand',
    label: 'Brand',
    type: 'text',
    required: false,
    placeholder: 'e.g., Faber-Castell, Staedtler',
  },
  {
    key: 'quantity',
    label: 'Quantity',
    type: 'number',
    required: true,
    placeholder: 'e.g., 10',
  },
  {
    key: 'itemCondition',
    label: 'Condition',
    type: 'select',
    required: true,
    options: ['New', 'Like New', 'Good', 'Fair', 'Refurbished'],
  },
  {
    key: 'ageRange',
    label: 'Age Range',
    type: 'text',
    required: false,
    placeholder: 'e.g., 6-12 years',
  },
  {
    key: 'color',
    label: 'Color',
    type: 'text',
    required: false,
    placeholder: 'e.g., Assorted, Blue',
  },
];

// ─── Spec config: common fields + subcategory-specific fields ──────────────────

export const BOOKS_EDUCATION_SPEC_CONFIG: Record<BooksEducationSubcategory, BooksEducationSpecField[]> = {
  'physical-books': [...BOOKS_EDUCATION_COMMON_FIELDS, ...PHYSICAL_BOOKS_FIELDS],
  'e-books': [...BOOKS_EDUCATION_COMMON_FIELDS, ...EBOOKS_FIELDS],
  'online-courses': [...BOOKS_EDUCATION_COMMON_FIELDS, ...ONLINE_COURSES_FIELDS],
  'tutoring-services': [...BOOKS_EDUCATION_COMMON_FIELDS, ...TUTORING_SERVICES_FIELDS],
  'educational-supplies': [...BOOKS_EDUCATION_COMMON_FIELDS, ...EDUCATIONAL_SUPPLIES_FIELDS],
};

// Helper function to get spec config for a subcategory
export function getBooksEducationSpecsConfig(subcategory: BooksEducationSubcategory): BooksEducationSpecField[] {
  return BOOKS_EDUCATION_SPEC_CONFIG[subcategory] || BOOKS_EDUCATION_COMMON_FIELDS;
}

// Helper function to get translation key for a field
export function getBooksEducationFieldTranslationKey(fieldKey: string): string {
  return `fields.${fieldKey}`;
}

// Helper function to get translation key for an option
export function getBooksEducationOptionTranslationKey(option: string): string {
  return `optionLabels.${option}`;
}
