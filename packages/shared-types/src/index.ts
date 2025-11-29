export enum ProductCategory {
  BANKING = 'Banking',
  INSURANCE = 'Insurance',
  TAX_TOOLS = 'Tax Tools',
  INVESTMENT = 'Investment',
}

export type Locale = 'en-US' | 'pt-BR';
export type ContentLocale = 'en-US' | 'pt-BR' | 'Both';

export type InsuranceType = 'General' | 'Professional' | 'Health' | 'Vehicle';
export type InsuranceSubcategory =
  | 'UberDriver' | 'Driver99' | 'HourlyDriver' | 'EconomicVehicle' | 'AppAccident'
  | 'MotorcycleDelivery' | 'BikeDelivery' | 'IncomeProtection' | 'DeliveryAccident'
  | 'IncomeInsurance' | 'EquipmentInsurance' | 'ProfessionalLiability' | 'HealthFreelancer'
  | 'InternationalHealth' | 'LongStayTravel' | 'CreatorEquipment' | 'RemoteWorker';

export type Country = 'BR' | 'US' | 'UK' | 'CA' | 'AU' | 'DE' | 'FR' | 'ES' | 'PT' | 'MX' | 'AR' | 'CL' | 'CO' | 'Other';

export interface FinancialProduct {
  id: string;
  name: string;
  slug?: string;
  slugEn?: string;
  slugPt?: string;
  category: ProductCategory;
  insuranceType?: InsuranceType; // Only for Insurance category
  insuranceSubcategory?: InsuranceSubcategory; // More specific subcategory
  country?: Country; // Country where product/company operates
  rating: number; // 0 to 5
  reviewsCount: number;
  description: string;
  pros: string[];
  cons: string[];
  fees: string;
  features: string[];
  affiliateLink: string;
  safetyScore: number; // 0 to 100
  logoUrl: string;
  logoAlt?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  partnerTag: string; // e.g. "Partner: Hiscox"
  imageUrl: string;
  date: string;
  relatedProductIds?: string[]; // IDs for the comparison table
  locale: ContentLocale;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// API Types
export interface InsuranceQuote {
  id: string;
  userId: string;
  productId: string;
  coverage: Coverage;
  premium: number;
  createdAt: string;
  expiresAt: string;
}

export interface Coverage {
  type: 'basic' | 'standard' | 'premium';
  amount: number;
  deductible: number;
  features: string[];
}

export interface Lead {
  id: string;
  email: string;
  name: string;
  phone?: string;
  productInterest: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'converted' | 'rejected';
}

