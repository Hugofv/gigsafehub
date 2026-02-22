export interface QuoteResponse {
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

export interface LeadPayload {
  leadId: string;
  country: string;
  gigType: string;
  platforms: string[];
  person: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
  };
  address: {
    city: string;
    state: string;
    zipCode: string;
  };
  vehicles: {
    year: number;
    make: string;
    model: string;
    ownership: string;
    primaryUse: string;
    annualMileage: number | null;
  }[];
  driver: {
    yearsLicensed: number | null;
    accidentsLast5Years: number;
    violationsLast5Years: number;
    sr22Required: boolean;
    creditTier: string | null;
  };
  coverage: {
    liabilityLimit: string;
    deductiblePreference: number | null;
    wantsFullCoverage: boolean;
  };
}

export interface ProviderAdapter {
  readonly name: string;
  readonly timeout: number;
  readonly maxRetries: number;
  fetchQuote(payload: LeadPayload): Promise<QuoteResponse>;
}
