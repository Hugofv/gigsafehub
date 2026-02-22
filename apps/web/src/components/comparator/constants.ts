import { Country } from './types';

export const PLATFORMS: Record<Country, { value: string; label: string }[]> = {
  US: [
    { value: 'uber', label: 'Uber' },
    { value: 'lyft', label: 'Lyft' },
    { value: 'doordash', label: 'DoorDash' },
    { value: 'instacart', label: 'Instacart' },
    { value: 'grubhub', label: 'Grubhub' },
    { value: 'amazon_flex', label: 'Amazon Flex' },
  ],
  BR: [
    { value: '99', label: '99' },
    { value: 'uber', label: 'Uber' },
    { value: 'ifood', label: 'iFood' },
    { value: 'rappi', label: 'Rappi' },
    { value: 'lalamove', label: 'Lalamove' },
    { value: 'loggi', label: 'Loggi' },
  ],
};

export const VEHICLE_YEARS = Array.from({ length: 25 }, (_, i) => {
  const year = new Date().getFullYear() + 1 - i;
  return { value: String(year), label: String(year) };
});

export const OWNERSHIP_OPTIONS = {
  US: [
    { value: 'owned', label: 'Owned' },
    { value: 'financed', label: 'Financed' },
    { value: 'leased', label: 'Leased' },
  ],
  BR: [
    { value: 'owned', label: 'Próprio' },
    { value: 'financed', label: 'Financiado' },
    { value: 'leased', label: 'Alugado' },
  ],
};

export const PRIMARY_USE_OPTIONS = {
  US: [
    { value: 'personal', label: 'Personal' },
    { value: 'rideshare', label: 'Rideshare' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'mixed', label: 'Mixed' },
  ],
  BR: [
    { value: 'personal', label: 'Pessoal' },
    { value: 'rideshare', label: 'Transporte de passageiros' },
    { value: 'delivery', label: 'Entregas' },
    { value: 'mixed', label: 'Misto' },
  ],
};

export const MILEAGE_PRESETS: Record<Country, { value: string; label: string }[]> = {
  US: [
    { value: '10000', label: '10k mi' },
    { value: '15000', label: '15k mi' },
    { value: '20000', label: '20k mi' },
    { value: '30000', label: '30k+ mi' },
  ],
  BR: [
    { value: '15000', label: '15k km' },
    { value: '25000', label: '25k km' },
    { value: '40000', label: '40k km' },
    { value: '60000', label: '60k+ km' },
  ],
};

export const GARAGE_OPTIONS = {
  US: [
    { value: 'garage', label: 'Garage' },
    { value: 'carport', label: 'Carport' },
    { value: 'driveway', label: 'Driveway' },
    { value: 'street', label: 'Street' },
  ],
  BR: [
    { value: 'garage', label: 'Garagem' },
    { value: 'carport', label: 'Cobertura' },
    { value: 'street', label: 'Rua' },
    { value: 'parking', label: 'Estacionamento' },
  ],
};

export const CREDIT_TIERS = [
  { value: 'excellent', label: 'Excellent (750+)' },
  { value: 'good', label: 'Good (700-749)' },
  { value: 'fair', label: 'Fair (650-699)' },
  { value: 'poor', label: 'Poor (<650)' },
];

export const MARITAL_OPTIONS = {
  US: [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
  ],
  BR: [
    { value: 'single', label: 'Solteiro(a)' },
    { value: 'married', label: 'Casado(a)' },
    { value: 'divorced', label: 'Divorciado(a)' },
    { value: 'widowed', label: 'Viúvo(a)' },
  ],
};

export const LIABILITY_OPTIONS: Record<Country, { value: string; label: string }[]> = {
  US: [
    { value: '25/50', label: '$25k/$50k (State Minimum)' },
    { value: '50/100', label: '$50k/$100k' },
    { value: '100/300', label: '$100k/$300k (Recommended)' },
    { value: '250/500', label: '$250k/$500k' },
  ],
  BR: [
    { value: '50k', label: 'R$ 50.000' },
    { value: '100k', label: 'R$ 100.000' },
    { value: '200k', label: 'R$ 200.000 (Recomendado)' },
    { value: '300k', label: 'R$ 300.000' },
  ],
};

export const DEDUCTIBLE_OPTIONS: Record<Country, { value: string; label: string }[]> = {
  US: [
    { value: '250', label: '$250' },
    { value: '500', label: '$500' },
    { value: '1000', label: '$1,000' },
    { value: '2000', label: '$2,000' },
  ],
  BR: [
    { value: '500', label: 'R$ 500' },
    { value: '1000', label: 'R$ 1.000' },
    { value: '2000', label: 'R$ 2.000' },
    { value: '3000', label: 'R$ 3.000' },
  ],
};

export const US_STATES = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' },
];

export const BR_STATES = [
  { value: 'AC', label: 'Acre' }, { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' }, { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' }, { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' }, { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' }, { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' }, { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' }, { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' }, { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' }, { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' }, { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' }, { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' }, { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' }, { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];
