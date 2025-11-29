import { FinancialProduct, Article, ProductCategory } from '@gigsafehub/types';

export const INITIAL_PRODUCTS: FinancialProduct[] = [
  {
    id: '1',
    name: 'GigBank Pro',
    category: ProductCategory.BANKING,
    rating: 4.8,
    reviewsCount: 1240,
    description: 'A mobile-first banking solution designed specifically for freelancers with automated tax savings buckets.',
    pros: ['No monthly fees', 'Automated tax withholding', 'Early direct deposit'],
    cons: ['No physical branches', 'Limited cash deposit network'],
    fees: '$0/mo',
    features: ['Tax Buckets', 'Invoicing Tool', 'Expense Tracking'],
    affiliateLink: 'https://gigbank.demo/signup',
    safetyScore: 98,
    logoUrl: 'https://picsum.photos/64/64?random=1'
  },
  {
    id: '2',
    name: 'SafeRide Insure',
    category: ProductCategory.INSURANCE,
    rating: 4.5,
    reviewsCount: 850,
    description: 'On-demand vehicle insurance for rideshare drivers. Pay only when the app is on.',
    pros: ['Pay-per-mile', 'Gap coverage included', 'Fast claims process'],
    cons: ['State availability limited', 'Higher deductible options'],
    fees: 'Base $20/mo + mileage',
    features: ['Rideshare Endorsement', 'Deductible Fund', '24/7 Support'],
    affiliateLink: 'https://saferide.demo/quote',
    safetyScore: 95,
    logoUrl: 'https://picsum.photos/64/64?random=2'
  },
  {
    id: '3',
    name: 'TurboTax Gig',
    category: ProductCategory.TAX_TOOLS,
    rating: 4.2,
    reviewsCount: 5600,
    description: 'Tax filing software optimized for Schedule C filers and independent contractors.',
    pros: ['Import expenses from bank', 'Audit defense', 'Live CPA help'],
    cons: ['Expensive for simple returns', 'Upsell heavy'],
    fees: '$89/state',
    features: ['Mileage Tracker', 'Expense Scanner', 'QBI Deduction Calculator'],
    affiliateLink: 'https://turbotax.demo/gig',
    safetyScore: 99,
    logoUrl: 'https://picsum.photos/64/64?random=3'
  },
  {
    id: '4',
    name: 'StashInvest',
    category: ProductCategory.INVESTMENT,
    rating: 4.0,
    reviewsCount: 320,
    description: 'Micro-investing for inconsistent income streams. Round up your purchases to buy fractional shares.',
    pros: ['Low barrier to entry', 'Educational content', 'Auto-stash feature'],
    cons: ['Monthly subscription fee', 'Limited trading window'],
    fees: '$3/mo',
    features: ['Fractional Shares', 'Retirement Accounts', 'Stock-Back Card'],
    affiliateLink: 'https://stash.demo/start',
    safetyScore: 92,
    logoUrl: 'https://picsum.photos/64/64?random=4'
  },
  {
    id: '5',
    name: 'Hiscox',
    category: ProductCategory.INSURANCE,
    rating: 4.6,
    reviewsCount: 3400,
    description: 'Specialized small business insurance with tailored policies for freelancers and consultants.',
    pros: ['Instant coverage', 'Tailored to specific professions', 'High policy limits'],
    cons: ['Can be pricier for low risk', 'Strict underwriting'],
    fees: 'From $30/mo',
    features: ['Professional Liability', 'General Liability', 'Cyber Security'],
    affiliateLink: 'https://hiscox.demo/quote',
    safetyScore: 97,
    logoUrl: 'https://picsum.photos/64/64?random=5'
  },
  {
    id: '6',
    name: 'Next Insurance',
    category: ProductCategory.INSURANCE,
    rating: 4.7,
    reviewsCount: 2900,
    description: '100% online insurance designed for speed and simplicity. Get a certificate of insurance in minutes.',
    pros: ['Fast mobile app', 'Bundling discounts', 'Live Certificates'],
    cons: ['Limited human agent access', 'Not all risks covered'],
    fees: 'From $25/mo',
    features: ['General Liability', 'Workers Comp', 'Tools & Equipment'],
    affiliateLink: 'https://next.demo/quote',
    safetyScore: 96,
    logoUrl: 'https://picsum.photos/64/64?random=6'
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: '101',
    slug: 'hiscox-vs-next-insurance',
    title: 'Hiscox vs. Next Insurance: The Ultimate Showdown for Gig Workers',
    excerpt: 'Deciding between Hiscox and Next? We break down the coverage, costs, and claims process to help you pick the right shield.',
    partnerTag: 'Partner: Hiscox',
    date: 'Oct 12, 2024',
    imageUrl: 'https://picsum.photos/800/400?random=10',
    relatedProductIds: ['5', '6'],
    locale: 'en-US',
    content: `
      <p>As a gig worker, your liability is on the line every day. Whether you are a freelance consultant, a handyman, or a digital marketer, one lawsuit could wipe out your savings. That is why General Liability insurance is not just a nice-to-have; it is your shield.</p>

      <h3 class="text-xl font-bold mt-6 mb-3">Why You Need Liability Coverage</h3>
      <p>Clients are increasingly requiring proof of insurance before signing contracts. Both Hiscox and Next Insurance specialize in serving micro-businesses and sole proprietors, but they take different approaches.</p>
    `
  },
  {
    id: '102',
    slug: 'tax-write-offs-2024',
    title: 'Top 10 Tax Write-Offs Every Freelancer Misses',
    excerpt: 'Stop leaving money on the table. From home office deductions to software subscriptions, here is what you can claim this year.',
    partnerTag: 'Tax Tips',
    date: 'Nov 01, 2024',
    imageUrl: 'https://picsum.photos/800/400?random=11',
    locale: 'en-US',
    content: '<p>Content coming soon...</p>'
  },
  {
    id: '103',
    slug: 'banking-for-freelancers',
    title: 'Why You Should Never Mix Personal and Business Banking',
    excerpt: 'The "Corporate Veil" is real. Learn why separating your finances is the first step to protecting your personal assets.',
    partnerTag: 'GigBank',
    date: 'Sep 24, 2024',
    imageUrl: 'https://picsum.photos/800/400?random=12',
    locale: 'Both',
    content: '<p>Content coming soon...</p>'
  },
  {
    id: '104',
    slug: 'ipva-motoristas-app',
    title: 'IPVA para Motoristas de Aplicativo no Brasil: Guia 2024',
    excerpt: 'Entenda como funcionam as isenções e descontos de IPVA para motoristas Uber e 99 em diferentes estados brasileiros.',
    partnerTag: 'Impostos BR',
    date: 'Nov 05, 2024',
    imageUrl: 'https://picsum.photos/800/400?random=13',
    locale: 'pt-BR',
    content: '<p>O Imposto sobre a Propriedade de Veículos Automotores (IPVA) é uma das maiores despesas anuais para motoristas de aplicativo no Brasil. Neste guia, exploramos as regras de isenção no Rio de Janeiro, São Paulo e outros estados.</p>'
  }
];

export const MOCK_ADMIN_USER = {
  id: 'admin-1',
  email: 'admin@gigsafehub.com',
  name: 'Super Admin',
  role: 'admin' as const
};

export const TRANSLATIONS = {
  'en-US': {
    nav: {
      home: 'Home',
      insurance: 'Insurance',
      insuranceGeneral: 'General Liability',
      insuranceProfessional: 'Professional Liability',
      insuranceHealth: 'Health Insurance',
      insuranceVehicle: 'Vehicle Insurance',
      compare: 'Compare',
      guides: 'Guides',
      blog: 'Blog',
      about: 'About Us',
      getQuote: 'Get Quote',
      admin: 'Admin'
    },
    home: {
      title: 'Find Your Gig',
      titleHighlight: 'Insurance Shield',
      subtitle: 'Unbiased reviews, safety scores, and comparisons of banking, insurance, and tax tools designed for freelancers.',
      cta: 'Start My Free Quote',
      readGuides: 'Read Guides',
      topRated: 'Top Rated Gig Tools',
      curated: 'Curated selections with the highest safety scores.',
      viewAll: 'View All'
    },
    articles: {
      title: 'Financial Guides & Insights',
      subtitle: 'Expert advice on managing risk, taxes, and income in the gig economy.',
      loading: 'Loading articles...',
      readMore: 'Read Article',
      noArticles: 'No articles found for this region.'
    },
    common: {
      loading: 'Loading...'
    }
  },
  'pt-BR': {
    nav: {
      home: 'Início',
      insurance: 'Seguros',
      insuranceGeneral: 'Responsabilidade Civil',
      insuranceProfessional: 'Responsabilidade Profissional',
      insuranceHealth: 'Seguro Saúde',
      insuranceVehicle: 'Seguro Veículo',
      compare: 'Comparador',
      guides: 'Guias',
      blog: 'Blog',
      about: 'Sobre Nós',
      getQuote: 'Cotação',
      admin: 'Admin',
      faq: 'FAQ'
    },
    home: {
      title: 'Encontre sua',
      titleHighlight: 'Proteção Gig',
      subtitle: 'Análises imparciais, pontuações de segurança e comparações de ferramentas bancárias e seguros para freelancers.',
      cta: 'Iniciar Cotação Grátis',
      readGuides: 'Ler Guias',
      topRated: 'Ferramentas Mais Bem Avaliadas',
      curated: 'Seleções curadas com as maiores pontuações de segurança.',
      viewAll: 'Ver Todas'
    },
    articles: {
      title: 'Guias Financeiros e Insights',
      subtitle: 'Conselhos de especialistas sobre gestão de riscos, impostos e renda na economia gig.',
      loading: 'Carregando artigos...',
      readMore: 'Ler Artigo',
      noArticles: 'Nenhum artigo encontrado para esta região.'
    },
    common: {
      loading: 'Carregando...'
    }
  }
};

