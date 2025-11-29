import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (optional - be careful in production)
  // await prisma.category.deleteMany({});

  // ============================================
  // CREATE CATEGORIES HIERARCHY
  // ============================================

  // Level 0: Root Categories
  const insuranceRoot = await prisma.category.upsert({
    where: { slug: 'insurance' },
    update: {},
    create: {
      name: 'Insurance',
      nameEn: 'Insurance',
      namePt: 'Seguros',
      slug: 'insurance',
      slugEn: 'insurance',
      slugPt: 'seguros',
      description: 'Insurance products for gig economy workers',
      descriptionEn: 'Insurance products for gig economy workers',
      descriptionPt: 'Produtos de seguro para trabalhadores da economia gig',
      level: 0,
      parentId: null,
      order: 1,
      isActive: true,
      metaTitle: 'Insurance for Gig Workers | GigSafeHub',
      metaDescription: 'Find the best insurance products for drivers, delivery workers, freelancers, and digital nomads.',
    },
  });

  const bankingRoot = await prisma.category.upsert({
    where: { slug: 'banking' },
    update: {},
    create: {
      name: 'Banking',
      nameEn: 'Banking',
      namePt: 'Banco',
      slug: 'banking',
      slugEn: 'banking',
      slugPt: 'banco',
      description: 'Banking solutions for freelancers',
      descriptionEn: 'Banking solutions for freelancers',
      descriptionPt: 'Soluções bancárias para freelancers',
      level: 0,
      parentId: null,
      order: 2,
      isActive: true,
    },
  });

  const comparisonRoot = await prisma.category.upsert({
    where: { slug: 'comparisons' },
    update: {},
    create: {
      name: 'Comparisons',
      nameEn: 'Comparisons',
      namePt: 'Comparador',
      slug: 'comparisons',
      slugEn: 'comparisons',
      slugPt: 'comparador',
      description: 'Compare insurance products',
      descriptionEn: 'Compare insurance products',
      descriptionPt: 'Compare produtos de seguro',
      level: 0,
      parentId: null,
      order: 3,
      isActive: true,
    },
  });

  const guidesRoot = await prisma.category.upsert({
    where: { slug: 'guides' },
    update: {},
    create: {
      name: 'Guides',
      nameEn: 'Guides',
      namePt: 'Guias',
      slug: 'guides',
      slugEn: 'guides',
      slugPt: 'guias',
      description: 'Educational guides about insurance',
      descriptionEn: 'Educational guides about insurance',
      descriptionPt: 'Guias educacionais sobre seguros',
      level: 0,
      parentId: null,
      order: 4,
      isActive: true,
    },
  });

  const blogRoot = await prisma.category.upsert({
    where: { slug: 'blog' },
    update: {},
    create: {
      name: 'Blog',
      nameEn: 'Blog',
      namePt: 'Blog',
      slug: 'blog',
      slugEn: 'blog',
      slugPt: 'blog',
      description: 'Latest news and insights',
      descriptionEn: 'Latest news and insights',
      descriptionPt: 'Últimas notícias e insights',
      level: 0,
      parentId: null,
      order: 5,
      isActive: true,
    },
  });

  // ============================================
  // Level 1: Insurance Subcategories
  // ============================================

  // Insurance for Drivers
  const insuranceDrivers = await prisma.category.upsert({
    where: { slug: 'insurance-for-drivers' },
    update: {},
    create: {
      name: 'Insurance for Drivers',
      nameEn: 'Insurance for Drivers',
      namePt: 'Seguros para Motoristas',
      slug: 'insurance-for-drivers',
      slugEn: 'insurance-for-drivers',
      slugPt: 'seguros-para-motoristas',
      description: 'Insurance products for rideshare and delivery drivers',
      descriptionEn: 'Insurance products for rideshare and delivery drivers',
      descriptionPt: 'Produtos de seguro para motoristas de aplicativo e entregadores',
      level: 1,
      parentId: insuranceRoot.id,
      order: 1,
      isActive: true,
    },
  });

  // Insurance for Delivery Workers
  const insuranceDelivery = await prisma.category.upsert({
    where: { slug: 'insurance-for-delivery' },
    update: {},
    create: {
      name: 'Insurance for Delivery Workers',
      nameEn: 'Insurance for Delivery Workers',
      namePt: 'Seguros para Entregadores',
      slug: 'insurance-for-delivery',
      slugEn: 'insurance-for-delivery',
      slugPt: 'seguros-para-entregadores',
      description: 'Insurance products for delivery workers',
      descriptionEn: 'Insurance products for delivery workers',
      descriptionPt: 'Produtos de seguro para entregadores',
      level: 1,
      parentId: insuranceRoot.id,
      order: 2,
      isActive: true,
    },
  });

  // Insurance for Freelancers
  const insuranceFreelancers = await prisma.category.upsert({
    where: { slug: 'insurance-for-freelancers' },
    update: {},
    create: {
      name: 'Insurance for Freelancers',
      nameEn: 'Insurance for Freelancers',
      namePt: 'Seguros para Freelancers',
      slug: 'insurance-for-freelancers',
      slugEn: 'insurance-for-freelancers',
      slugPt: 'seguros-para-freelancers',
      description: 'Insurance products for freelancers and independent contractors',
      descriptionEn: 'Insurance products for freelancers and independent contractors',
      descriptionPt: 'Produtos de seguro para freelancers e trabalhadores autônomos',
      level: 1,
      parentId: insuranceRoot.id,
      order: 3,
      isActive: true,
    },
  });

  // Insurance for Digital Nomads
  const insuranceNomads = await prisma.category.upsert({
    where: { slug: 'insurance-for-digital-nomads' },
    update: {},
    create: {
      name: 'Insurance for Digital Nomads',
      nameEn: 'Insurance for Digital Nomads',
      namePt: 'Seguros para Nômades Digitais',
      slug: 'insurance-for-digital-nomads',
      slugEn: 'insurance-for-digital-nomads',
      slugPt: 'seguros-para-nomades-digitais',
      description: 'Insurance products for digital nomads and remote workers',
      descriptionEn: 'Insurance products for digital nomads and remote workers',
      descriptionPt: 'Produtos de seguro para nômades digitais e trabalhadores remotos',
      level: 1,
      parentId: insuranceRoot.id,
      order: 4,
      isActive: true,
    },
  });

  // ============================================
  // Level 2: Specific Insurance Types (Drivers)
  // ============================================

  const uberInsurance = await prisma.category.upsert({
    where: { slug: 'uber-insurance' },
    update: {},
    create: {
      name: 'Uber Insurance',
      nameEn: 'Uber Insurance',
      namePt: 'Seguro para Uber',
      slug: 'uber-insurance',
      slugEn: 'uber-insurance',
      slugPt: 'seguro-para-uber',
      description: 'Insurance products for Uber drivers',
      descriptionEn: 'Insurance products for Uber drivers',
      descriptionPt: 'Produtos de seguro para motoristas Uber',
      level: 2,
      parentId: insuranceDrivers.id,
      order: 1,
      isActive: true,
    },
  });

  const driver99Insurance = await prisma.category.upsert({
    where: { slug: '99-insurance' },
    update: {},
    create: {
      name: '99 Insurance',
      nameEn: '99 Insurance',
      namePt: 'Seguro para 99',
      slug: '99-insurance',
      slugEn: '99-insurance',
      slugPt: 'seguro-para-99',
      description: 'Insurance products for 99 drivers',
      descriptionEn: 'Insurance products for 99 drivers',
      descriptionPt: 'Produtos de seguro para motoristas 99',
      level: 2,
      parentId: insuranceDrivers.id,
      order: 2,
      isActive: true,
    },
  });

  const hourlyInsurance = await prisma.category.upsert({
    where: { slug: 'hourly-insurance' },
    update: {},
    create: {
      name: 'Hourly Insurance',
      nameEn: 'Hourly Insurance',
      namePt: 'Seguro por Hora',
      slug: 'hourly-insurance',
      slugEn: 'hourly-insurance',
      slugPt: 'seguro-por-hora',
      description: 'Pay-per-hour insurance for drivers',
      descriptionEn: 'Pay-per-hour insurance for drivers',
      descriptionPt: 'Seguro por hora para motoristas',
      level: 2,
      parentId: insuranceDrivers.id,
      order: 3,
      isActive: true,
    },
  });

  const economicVehicleInsurance = await prisma.category.upsert({
    where: { slug: 'economic-vehicle-insurance' },
    update: {},
    create: {
      name: 'Economic Vehicle Insurance',
      nameEn: 'Economic Vehicle Insurance',
      namePt: 'Seguro Veicular Econômico',
      slug: 'economic-vehicle-insurance',
      slugEn: 'economic-vehicle-insurance',
      slugPt: 'seguro-veicular-economico',
      description: 'Affordable vehicle insurance options',
      descriptionEn: 'Affordable vehicle insurance options',
      descriptionPt: 'Opções de seguro veicular econômicas',
      level: 2,
      parentId: insuranceDrivers.id,
      order: 4,
      isActive: true,
    },
  });

  const appAccidentInsurance = await prisma.category.upsert({
    where: { slug: 'app-accident-insurance' },
    update: {},
    create: {
      name: 'App Accident Insurance',
      nameEn: 'App Accident Insurance',
      namePt: 'Seguro de Acidentes no App',
      slug: 'app-accident-insurance',
      slugEn: 'app-accident-insurance',
      slugPt: 'seguro-de-acidentes-no-app',
      description: 'Accident insurance for app-based workers',
      descriptionEn: 'Accident insurance for app-based workers',
      descriptionPt: 'Seguro de acidentes para trabalhadores de aplicativo',
      level: 2,
      parentId: insuranceDrivers.id,
      order: 5,
      isActive: true,
    },
  });

  // ============================================
  // Level 2: Specific Insurance Types (Delivery)
  // ============================================

  const motorcycleInsurance = await prisma.category.upsert({
    where: { slug: 'motorcycle-insurance' },
    update: {},
    create: {
      name: 'Motorcycle Insurance',
      nameEn: 'Motorcycle Insurance',
      namePt: 'Seguro para Moto',
      slug: 'motorcycle-insurance',
      slugEn: 'motorcycle-insurance',
      slugPt: 'seguro-para-moto',
      description: 'Insurance for motorcycle delivery workers',
      descriptionEn: 'Insurance for motorcycle delivery workers',
      descriptionPt: 'Seguro para entregadores de moto',
      level: 2,
      parentId: insuranceDelivery.id,
      order: 1,
      isActive: true,
    },
  });

  const bikeInsurance = await prisma.category.upsert({
    where: { slug: 'bike-insurance' },
    update: {},
    create: {
      name: 'Bike Insurance',
      nameEn: 'Bike Insurance',
      namePt: 'Seguro para Bike',
      slug: 'bike-insurance',
      slugEn: 'bike-insurance',
      slugPt: 'seguro-para-bike',
      description: 'Insurance for bike delivery workers',
      descriptionEn: 'Insurance for bike delivery workers',
      descriptionPt: 'Seguro para entregadores de bike',
      level: 2,
      parentId: insuranceDelivery.id,
      order: 2,
      isActive: true,
    },
  });

  const incomeProtectionInsurance = await prisma.category.upsert({
    where: { slug: 'income-protection-insurance' },
    update: {},
    create: {
      name: 'Income Protection Insurance',
      nameEn: 'Income Protection Insurance',
      namePt: 'Seguro Renda Protegida',
      slug: 'income-protection-insurance',
      slugEn: 'income-protection-insurance',
      slugPt: 'seguro-renda-protegida',
      description: 'Income protection for delivery workers',
      descriptionEn: 'Income protection for delivery workers',
      descriptionPt: 'Proteção de renda para entregadores',
      level: 2,
      parentId: insuranceDelivery.id,
      order: 3,
      isActive: true,
    },
  });

  const deliveryAccidentInsurance = await prisma.category.upsert({
    where: { slug: 'delivery-accident-insurance' },
    update: {},
    create: {
      name: 'Delivery Accident Insurance',
      nameEn: 'Delivery Accident Insurance',
      namePt: 'Seguro Acidentes de Entrega',
      slug: 'delivery-accident-insurance',
      slugEn: 'delivery-accident-insurance',
      slugPt: 'seguro-acidentes-de-entrega',
      description: 'Accident insurance for delivery workers',
      descriptionEn: 'Accident insurance for delivery workers',
      descriptionPt: 'Seguro de acidentes para entregadores',
      level: 2,
      parentId: insuranceDelivery.id,
      order: 4,
      isActive: true,
    },
  });

  // ============================================
  // Level 2: Specific Insurance Types (Freelancers)
  // ============================================

  const incomeInsurance = await prisma.category.upsert({
    where: { slug: 'income-insurance' },
    update: {},
    create: {
      name: 'Income Insurance',
      nameEn: 'Income Insurance',
      namePt: 'Seguro de Renda',
      slug: 'income-insurance',
      slugEn: 'income-insurance',
      slugPt: 'seguro-de-renda',
      description: 'Income insurance for freelancers',
      descriptionEn: 'Income insurance for freelancers',
      descriptionPt: 'Seguro de renda para freelancers',
      level: 2,
      parentId: insuranceFreelancers.id,
      order: 1,
      isActive: true,
    },
  });

  const equipmentInsurance = await prisma.category.upsert({
    where: { slug: 'equipment-insurance' },
    update: {},
    create: {
      name: 'Equipment Insurance',
      nameEn: 'Equipment Insurance',
      namePt: 'Seguro de Equipamentos',
      slug: 'equipment-insurance',
      slugEn: 'equipment-insurance',
      slugPt: 'seguro-de-equipamentos',
      description: 'Insurance for equipment (notebook, camera, etc.)',
      descriptionEn: 'Insurance for equipment (notebook, camera, etc.)',
      descriptionPt: 'Seguro para equipamentos (notebook, câmera, etc.)',
      level: 2,
      parentId: insuranceFreelancers.id,
      order: 2,
      isActive: true,
    },
  });

  const professionalLiabilityInsurance = await prisma.category.upsert({
    where: { slug: 'professional-liability-insurance' },
    update: {},
    create: {
      name: 'Professional Liability Insurance',
      nameEn: 'Professional Liability Insurance',
      namePt: 'Seguro Profissional',
      slug: 'professional-liability-insurance',
      slugEn: 'professional-liability-insurance',
      slugPt: 'seguro-profissional',
      description: 'Professional liability insurance (E&O)',
      descriptionEn: 'Professional liability insurance (E&O)',
      descriptionPt: 'Seguro de responsabilidade profissional',
      level: 2,
      parentId: insuranceFreelancers.id,
      order: 3,
      isActive: true,
    },
  });

  const healthFreelancerInsurance = await prisma.category.upsert({
    where: { slug: 'health-freelancer-insurance' },
    update: {},
    create: {
      name: 'Health Insurance for Freelancers',
      nameEn: 'Health Insurance for Freelancers',
      namePt: 'Seguro Saúde para Autônomos',
      slug: 'health-freelancer-insurance',
      slugEn: 'health-freelancer-insurance',
      slugPt: 'seguro-saude-para-autonomos',
      description: 'Health insurance for freelancers and independent contractors',
      descriptionEn: 'Health insurance for freelancers and independent contractors',
      descriptionPt: 'Seguro saúde para freelancers e trabalhadores autônomos',
      level: 2,
      parentId: insuranceFreelancers.id,
      order: 4,
      isActive: true,
    },
  });

  // ============================================
  // Level 2: Specific Insurance Types (Digital Nomads)
  // ============================================

  const internationalHealthInsurance = await prisma.category.upsert({
    where: { slug: 'international-health-insurance' },
    update: {},
    create: {
      name: 'International Health Insurance',
      nameEn: 'International Health Insurance',
      namePt: 'Seguro de Saúde Internacional',
      slug: 'international-health-insurance',
      slugEn: 'international-health-insurance',
      slugPt: 'seguro-de-saude-internacional',
      description: 'International health insurance for digital nomads',
      descriptionEn: 'International health insurance for digital nomads',
      descriptionPt: 'Seguro de saúde internacional para nômades digitais',
      level: 2,
      parentId: insuranceNomads.id,
      order: 1,
      isActive: true,
    },
  });

  const longStayTravelInsurance = await prisma.category.upsert({
    where: { slug: 'long-stay-travel-insurance' },
    update: {},
    create: {
      name: 'Long-Stay Travel Insurance',
      nameEn: 'Long-Stay Travel Insurance',
      namePt: 'Seguro Viagem Long-Stay',
      slug: 'long-stay-travel-insurance',
      slugEn: 'long-stay-travel-insurance',
      slugPt: 'seguro-viagem-long-stay',
      description: 'Long-stay travel insurance for digital nomads',
      descriptionEn: 'Long-stay travel insurance for digital nomads',
      descriptionPt: 'Seguro viagem longa permanência para nômades digitais',
      level: 2,
      parentId: insuranceNomads.id,
      order: 2,
      isActive: true,
    },
  });

  const creatorEquipmentInsurance = await prisma.category.upsert({
    where: { slug: 'creator-equipment-insurance' },
    update: {},
    create: {
      name: 'Creator Equipment Insurance',
      nameEn: 'Creator Equipment Insurance',
      namePt: 'Seguro de Equipamentos para Criadores',
      slug: 'creator-equipment-insurance',
      slugEn: 'creator-equipment-insurance',
      slugPt: 'seguro-de-equipamentos-para-criadores',
      description: 'Equipment insurance for content creators',
      descriptionEn: 'Equipment insurance for content creators',
      descriptionPt: 'Seguro de equipamentos para criadores de conteúdo',
      level: 2,
      parentId: insuranceNomads.id,
      order: 3,
      isActive: true,
    },
  });

  const remoteWorkerInsurance = await prisma.category.upsert({
    where: { slug: 'remote-worker-insurance' },
    update: {},
    create: {
      name: 'Remote Worker Insurance',
      nameEn: 'Remote Worker Insurance',
      namePt: 'Seguro Remote Worker',
      slug: 'remote-worker-insurance',
      slugEn: 'remote-worker-insurance',
      slugPt: 'seguro-remote-worker',
      description: 'Insurance for remote workers',
      descriptionEn: 'Insurance for remote workers',
      descriptionPt: 'Seguro para trabalhadores remotos',
      level: 2,
      parentId: insuranceNomads.id,
      order: 4,
      isActive: true,
    },
  });

  // ============================================
  // Level 1: Comparison Categories
  // ============================================

  const compareDrivers = await prisma.category.upsert({
    where: { slug: 'compare-insurance-drivers' },
    update: {},
    create: {
      name: 'Compare Insurance for Drivers',
      nameEn: 'Compare Insurance for Drivers',
      namePt: 'Comparar Seguros para Motoristas',
      slug: 'compare-insurance-drivers',
      slugEn: 'compare-insurance-drivers',
      slugPt: 'comparar-seguros-para-motoristas',
      description: 'Compare insurance products for drivers',
      descriptionEn: 'Compare insurance products for drivers',
      descriptionPt: 'Compare produtos de seguro para motoristas',
      level: 1,
      parentId: comparisonRoot.id,
      order: 1,
      isActive: true,
    },
  });

  const compareDelivery = await prisma.category.upsert({
    where: { slug: 'compare-insurance-delivery' },
    update: {},
    create: {
      name: 'Compare Insurance for Delivery Workers',
      nameEn: 'Compare Insurance for Delivery Workers',
      namePt: 'Comparar Seguros para Entregadores',
      slug: 'compare-insurance-delivery',
      slugEn: 'compare-insurance-delivery',
      slugPt: 'comparar-seguros-para-entregadores',
      description: 'Compare insurance products for delivery workers',
      descriptionEn: 'Compare insurance products for delivery workers',
      descriptionPt: 'Compare produtos de seguro para entregadores',
      level: 1,
      parentId: comparisonRoot.id,
      order: 2,
      isActive: true,
    },
  });

  const compareFreelancers = await prisma.category.upsert({
    where: { slug: 'compare-insurance-freelancers' },
    update: {},
    create: {
      name: 'Compare Insurance for Freelancers',
      nameEn: 'Compare Insurance for Freelancers',
      namePt: 'Comparar Seguros para Freelancers',
      slug: 'compare-insurance-freelancers',
      slugEn: 'compare-insurance-freelancers',
      slugPt: 'comparar-seguros-para-freelancers',
      description: 'Compare insurance products for freelancers',
      descriptionEn: 'Compare insurance products for freelancers',
      descriptionPt: 'Compare produtos de seguro para freelancers',
      level: 1,
      parentId: comparisonRoot.id,
      order: 3,
      isActive: true,
    },
  });

  const compareInternational = await prisma.category.upsert({
    where: { slug: 'compare-international-insurance' },
    update: {},
    create: {
      name: 'Compare International Insurance',
      nameEn: 'Compare International Insurance',
      namePt: 'Comparar Seguros Internacionais',
      slug: 'compare-international-insurance',
      slugEn: 'compare-international-insurance',
      slugPt: 'comparar-seguros-internacionais',
      description: 'Compare international insurance products',
      descriptionEn: 'Compare international insurance products',
      descriptionPt: 'Compare produtos de seguro internacionais',
      level: 1,
      parentId: comparisonRoot.id,
      order: 4,
      isActive: true,
    },
  });

  const compareIncome = await prisma.category.upsert({
    where: { slug: 'compare-income-insurance' },
    update: {},
    create: {
      name: 'Compare Income Insurance',
      nameEn: 'Compare Income Insurance',
      namePt: 'Comparar Seguros de Renda',
      slug: 'compare-income-insurance',
      slugEn: 'compare-income-insurance',
      slugPt: 'comparar-seguros-de-renda',
      description: 'Compare income insurance products',
      descriptionEn: 'Compare income insurance products',
      descriptionPt: 'Compare produtos de seguro de renda',
      level: 1,
      parentId: comparisonRoot.id,
      order: 5,
      isActive: true,
    },
  });

  // ============================================
  // Level 1: Guide Categories
  // ============================================

  const guideWhatIs = await prisma.category.upsert({
    where: { slug: 'what-is-gig-economy-insurance' },
    update: {},
    create: {
      name: 'What is Gig Economy Insurance?',
      nameEn: 'What is Gig Economy Insurance?',
      namePt: 'O que é Gig Economy Insurance?',
      slug: 'what-is-gig-economy-insurance',
      slugEn: 'what-is-gig-economy-insurance',
      slugPt: 'o-que-e-gig-economy-insurance',
      description: 'Learn about insurance for gig economy workers',
      descriptionEn: 'Learn about insurance for gig economy workers',
      descriptionPt: 'Aprenda sobre seguro para trabalhadores da economia gig',
      level: 1,
      parentId: guidesRoot.id,
      order: 1,
      isActive: true,
    },
  });

  const guideCosts = await prisma.category.upsert({
    where: { slug: 'insurance-costs' },
    update: {},
    create: {
      name: 'Insurance Costs by Type',
      nameEn: 'Insurance Costs by Type',
      namePt: 'Quanto custa cada tipo de seguro',
      slug: 'insurance-costs',
      slugEn: 'insurance-costs',
      slugPt: 'quanto-custa-cada-tipo-de-seguro',
      description: 'Understand insurance costs for different types',
      descriptionEn: 'Understand insurance costs for different types',
      descriptionPt: 'Entenda os custos de seguro para diferentes tipos',
      level: 1,
      parentId: guidesRoot.id,
      order: 2,
      isActive: true,
    },
  });

  const guideDifferences = await prisma.category.upsert({
    where: { slug: 'insurance-differences' },
    update: {},
    create: {
      name: 'Differences Between Insurers',
      nameEn: 'Differences Between Insurers',
      namePt: 'Diferenças entre seguradoras',
      slug: 'insurance-differences',
      slugEn: 'insurance-differences',
      slugPt: 'diferencas-entre-seguradoras',
      description: 'Learn the differences between insurance companies',
      descriptionEn: 'Learn the differences between insurance companies',
      descriptionPt: 'Aprenda as diferenças entre seguradoras',
      level: 1,
      parentId: guidesRoot.id,
      order: 3,
      isActive: true,
    },
  });

  const guideChoosing = await prisma.category.upsert({
    where: { slug: 'choosing-insurance-plan' },
    update: {},
    create: {
      name: 'How to Choose the Right Plan',
      nameEn: 'How to Choose the Right Plan',
      namePt: 'Como escolher o plano ideal',
      slug: 'choosing-insurance-plan',
      slugEn: 'choosing-insurance-plan',
      slugPt: 'como-escolher-o-plano-ideal',
      description: 'Guide to choosing the right insurance plan',
      descriptionEn: 'Guide to choosing the right insurance plan',
      descriptionPt: 'Guia para escolher o plano de seguro ideal',
      level: 1,
      parentId: guidesRoot.id,
      order: 4,
      isActive: true,
    },
  });

  const guideLegislation = await prisma.category.upsert({
    where: { slug: 'gig-worker-legislation' },
    update: {},
    create: {
      name: 'Legislation & Gig Worker Rights',
      nameEn: 'Legislation & Gig Worker Rights',
      namePt: 'Legislação & direitos do gig worker',
      slug: 'gig-worker-legislation',
      slugEn: 'gig-worker-legislation',
      slugPt: 'legislacao-e-direitos-do-gig-worker',
      description: 'Learn about legislation and rights for gig workers',
      descriptionEn: 'Learn about legislation and rights for gig workers',
      descriptionPt: 'Aprenda sobre legislação e direitos para trabalhadores gig',
      level: 1,
      parentId: guidesRoot.id,
      order: 5,
      isActive: true,
    },
  });

  const guideGlossary = await prisma.category.upsert({
    where: { slug: 'insurance-glossary' },
    update: {},
    create: {
      name: 'Insurance Glossary',
      nameEn: 'Insurance Glossary',
      namePt: 'Glossário de Seguros',
      slug: 'insurance-glossary',
      slugEn: 'insurance-glossary',
      slugPt: 'glossario-de-seguros',
      description: 'Complete glossary of insurance terms',
      descriptionEn: 'Complete glossary of insurance terms',
      descriptionPt: 'Glossário completo de termos de seguro',
      level: 1,
      parentId: guidesRoot.id,
      order: 6,
      isActive: true,
    },
  });

  const guideRisks = await prisma.category.upsert({
    where: { slug: 'gig-economy-risks' },
    update: {},
    create: {
      name: 'Gig Economy Risks',
      nameEn: 'Gig Economy Risks',
      namePt: 'Riscos da Gig Economy',
      slug: 'gig-economy-risks',
      slugEn: 'gig-economy-risks',
      slugPt: 'riscos-da-gig-economy',
      description: 'Understand the risks in the gig economy',
      descriptionEn: 'Understand the risks in the gig economy',
      descriptionPt: 'Entenda os riscos da economia gig',
      level: 1,
      parentId: guidesRoot.id,
      order: 7,
      isActive: true,
    },
  });

  // ============================================
  // Level 1: Blog Categories
  // ============================================

  const blogTips = await prisma.category.upsert({
    where: { slug: 'tips-and-safety' },
    update: {},
    create: {
      name: 'Tips and Safety',
      nameEn: 'Tips and Safety',
      namePt: 'Dicas e Segurança',
      slug: 'tips-and-safety',
      slugEn: 'tips-and-safety',
      slugPt: 'dicas-e-seguranca',
      description: 'Tips and safety advice for gig workers',
      descriptionEn: 'Tips and safety advice for gig workers',
      descriptionPt: 'Dicas e conselhos de segurança para trabalhadores gig',
      level: 1,
      parentId: blogRoot.id,
      order: 1,
      isActive: true,
    },
  });

  const blogComparisons = await prisma.category.upsert({
    where: { slug: 'comparisons' },
    update: {},
    create: {
      name: 'Comparisons',
      nameEn: 'Comparisons',
      namePt: 'Comparativos',
      slug: 'comparisons',
      slugEn: 'comparisons',
      slugPt: 'comparativos',
      description: 'Product comparison articles',
      descriptionEn: 'Product comparison articles',
      descriptionPt: 'Artigos de comparação de produtos',
      level: 1,
      parentId: blogRoot.id,
      order: 2,
      isActive: true,
    },
  });

  const blogTrends = await prisma.category.upsert({
    where: { slug: 'gig-economy-trends' },
    update: {},
    create: {
      name: 'Gig Economy Trends',
      nameEn: 'Gig Economy Trends',
      namePt: 'Tendências da Economia Gig',
      slug: 'gig-economy-trends',
      slugEn: 'gig-economy-trends',
      slugPt: 'tendencias-da-economia-gig',
      description: 'Latest trends in the gig economy',
      descriptionEn: 'Latest trends in the gig economy',
      descriptionPt: 'Últimas tendências da economia gig',
      level: 1,
      parentId: blogRoot.id,
      order: 3,
      isActive: true,
    },
  });

  const blogCases = await prisma.category.upsert({
    where: { slug: 'driver-delivery-cases' },
    update: {},
    create: {
      name: 'Driver/Delivery Cases',
      nameEn: 'Driver/Delivery Cases',
      namePt: 'Cases de motoristas/entregadores',
      slug: 'driver-delivery-cases',
      slugEn: 'driver-delivery-cases',
      slugPt: 'cases-de-motoristas-entregadores',
      description: 'Real cases from drivers and delivery workers',
      descriptionEn: 'Real cases from drivers and delivery workers',
      descriptionPt: 'Cases reais de motoristas e entregadores',
      level: 1,
      parentId: blogRoot.id,
      order: 4,
      isActive: true,
    },
  });

  const blogTechnology = await prisma.category.upsert({
    where: { slug: 'technology-marketplaces' },
    update: {},
    create: {
      name: 'Technology & Marketplaces',
      nameEn: 'Technology & Marketplaces',
      namePt: 'Tecnologia & Marketplaces',
      slug: 'technology-marketplaces',
      slugEn: 'technology-marketplaces',
      slugPt: 'tecnologia-e-marketplaces',
      description: 'Technology and marketplace news',
      descriptionEn: 'Technology and marketplace news',
      descriptionPt: 'Notícias sobre tecnologia e marketplaces',
      level: 1,
      parentId: blogRoot.id,
      order: 5,
      isActive: true,
    },
  });

  const blogFinances = await prisma.category.upsert({
    where: { slug: 'gig-worker-finances' },
    update: {},
    create: {
      name: 'Gig Worker Finances',
      nameEn: 'Gig Worker Finances',
      namePt: 'Finanças do trabalhador gig',
      slug: 'gig-worker-finances',
      slugEn: 'gig-worker-finances',
      slugPt: 'financas-do-trabalhador-gig',
      description: 'Financial advice for gig workers',
      descriptionEn: 'Financial advice for gig workers',
      descriptionPt: 'Conselhos financeiros para trabalhadores gig',
      level: 1,
      parentId: blogRoot.id,
      order: 6,
      isActive: true,
    },
  });

  console.log('✅ Categories seeded successfully!');
  console.log(`   - Created ${await prisma.category.count()} categories`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
