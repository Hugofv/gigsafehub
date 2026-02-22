export type Country = 'US' | 'BR';
export type GigType = 'rideshare' | 'delivery' | 'both';

export interface VehicleData {
  year: string;
  make: string;
  model: string;
  trim: string;
  ownership: string;
  primaryUse: string;
  annualMileage: string;
  garageType: string;
  hasAntiTheft: boolean;
}

export interface ComparatorFormData {
  // Step 1
  country: Country;
  gigType: GigType;
  platforms: string[];

  // Step 2
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  zipCode: string;
  city: string;
  state: string;

  // Step 3
  vehicles: VehicleData[];

  // Step 4
  yearsLicensed: string;
  accidentsLast5Years: number;
  violationsLast5Years: number;
  sr22Required: boolean;
  hoursPerWeek: string;
  fullTime: boolean;
  creditTier: string;
  maritalStatus: string;
  homeOwner: boolean;

  // Step 5
  currentInsured: boolean;
  currentProvider: string;
  liabilityLimit: string;
  deductiblePreference: string;
  wantsFullCoverage: boolean;
  ssnLast4: string;
  militaryStatus: boolean;
  cpf: string;
  cnhNumber: string;

  // Step 6
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingOptIn: boolean;
}

export interface QuoteData {
  monthlyPremium: number;
  annualPremium: number;
  coverageSummary: {
    liability: string;
    collision: boolean;
    comprehensive: boolean;
    deductible: number;
    gap: boolean;
    roadside: boolean;
  };
  highlights: string[];
  providerUrl: string;
}

export interface DispatchStatus {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerLogo: string;
  status: 'queued' | 'pending' | 'success' | 'failed' | 'timeout';
  quote: QuoteData | null;
  errorMessage: string | null;
}

export interface LeadSubmitResponse {
  id: string;
  dispatches: DispatchStatus[];
}

export interface QuotePollResponse {
  leadId: string;
  dispatches: DispatchStatus[];
  allResolved: boolean;
}

export type SortOption = 'price-asc' | 'price-desc' | 'coverage' | 'rating';

export const STEPS = [
  'getStarted',
  'personalInfo',
  'vehicle',
  'drivingProfile',
  'coverage',
  'review',
] as const;

export type StepId = (typeof STEPS)[number];

export const DEFAULT_VEHICLE: VehicleData = {
  year: '',
  make: '',
  model: '',
  trim: '',
  ownership: '',
  primaryUse: '',
  annualMileage: '',
  garageType: '',
  hasAntiTheft: false,
};

export const DEFAULT_FORM_DATA: ComparatorFormData = {
  country: 'US',
  gigType: 'rideshare',
  platforms: [],
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  zipCode: '',
  city: '',
  state: '',
  vehicles: [{ ...DEFAULT_VEHICLE }],
  yearsLicensed: '',
  accidentsLast5Years: 0,
  violationsLast5Years: 0,
  sr22Required: false,
  hoursPerWeek: '',
  fullTime: false,
  creditTier: '',
  maritalStatus: '',
  homeOwner: false,
  currentInsured: false,
  currentProvider: '',
  liabilityLimit: '',
  deductiblePreference: '',
  wantsFullCoverage: false,
  ssnLast4: '',
  militaryStatus: false,
  cpf: '',
  cnhNumber: '',
  termsAccepted: false,
  privacyAccepted: false,
  marketingOptIn: false,
};
