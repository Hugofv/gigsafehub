import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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

  // ============================================
  // CREATE ADMIN USER
  // ============================================

  const adminEmail = 'admin@example.com';
  const adminPassword = 'password123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword, // Update password in case it changed
    },
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('✅ Admin user created successfully!');
  console.log(`   - Email: ${adminEmail}`);
  console.log(`   - Password: ${adminPassword}`);
  console.log(`   - Role: ${adminUser.role}`);

  // ============================================
  // CREATE ARTICLES (Blog Posts)
  // ============================================

  const article1 = await prisma.article.upsert({
    where: { slug: 'essential-insurance-tips-for-uber-drivers' },
    update: {},
    create: {
      slug: 'essential-insurance-tips-for-uber-drivers',
      slugEn: 'essential-insurance-tips-for-uber-drivers',
      slugPt: 'dicas-essenciais-de-seguro-para-motoristas-uber',
      title: 'Essential Insurance Tips for Uber Drivers',
      excerpt: 'Learn the most important insurance tips every Uber driver should know to protect themselves and their vehicle.',
      content: `
# Essential Insurance Tips for Uber Drivers

As an Uber driver, having the right insurance coverage is crucial for protecting yourself, your passengers, and your vehicle. Here are the essential tips you need to know:

## 1. Understand Uber's Insurance Coverage

Uber provides insurance coverage in three periods:
- **Period 1**: App is off - Your personal insurance applies
- **Period 2**: App is on, no ride accepted - Uber provides liability coverage
- **Period 3**: Ride accepted or in progress - Uber provides comprehensive coverage

## 2. Get Commercial Insurance

Personal auto insurance typically doesn't cover commercial activities. Consider getting:
- Commercial auto insurance
- Rideshare insurance endorsement
- Gap insurance for your vehicle

## 3. Review Your Coverage Regularly

Your insurance needs may change as you drive more or less. Review your policy:
- Quarterly
- After major life changes
- When your driving patterns change

## 4. Document Everything

Keep records of:
- All insurance policies
- Claims and incidents
- Maintenance records
- Mileage logs

## Conclusion

Protecting yourself with proper insurance is not optional for rideshare drivers. Take the time to understand your coverage and ensure you're adequately protected.
      `,
      partnerTag: 'GigSafeHub',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      imageAlt: 'Uber driver with insurance documents',
      date: new Date('2024-01-15'),
      locale: 'Both',
      articleType: 'blog',
      categoryId: blogTips.id,
      metaTitle: 'Essential Insurance Tips for Uber Drivers | GigSafeHub',
      metaDescription: 'Learn the most important insurance tips every Uber driver should know to protect themselves and their vehicle.',
      metaKeywords: 'uber insurance, rideshare insurance, driver insurance tips',
      ogTitle: 'Essential Insurance Tips for Uber Drivers',
      ogDescription: 'Learn the most important insurance tips every Uber driver should know.',
      ogImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
      readingTime: 5,
    },
  });

  const article2 = await prisma.article.upsert({
    where: { slug: 'comparing-top-5-delivery-insurance-plans' },
    update: {},
    create: {
      slug: 'comparing-top-5-delivery-insurance-plans',
      slugEn: 'comparing-top-5-delivery-insurance-plans',
      slugPt: 'comparando-os-5-melhores-planos-de-seguro-para-entregadores',
      title: 'Comparing Top 5 Delivery Insurance Plans',
      excerpt: 'A comprehensive comparison of the best insurance plans available for delivery workers in 2024.',
      content: `
# Comparing Top 5 Delivery Insurance Plans

Finding the right insurance for delivery work can be challenging. We've compared the top 5 plans to help you make an informed decision.

## Plan Comparison

### 1. Plan A - Comprehensive Coverage
- **Coverage**: Full protection including equipment
- **Price**: $89/month
- **Best for**: Full-time delivery workers

### 2. Plan B - Basic Protection
- **Coverage**: Essential liability coverage
- **Price**: $49/month
- **Best for**: Part-time workers

### 3. Plan C - Premium Package
- **Coverage**: Full coverage + income protection
- **Price**: $129/month
- **Best for**: High-volume workers

### 4. Plan D - Equipment Focus
- **Coverage**: Equipment and vehicle protection
- **Price**: $69/month
- **Best for**: Bike/motorcycle delivery

### 5. Plan E - Budget Option
- **Coverage**: Basic liability
- **Price**: $29/month
- **Best for**: Occasional workers

## Conclusion

Choose the plan that best fits your delivery work volume and risk tolerance.
      `,
      partnerTag: 'GigSafeHub',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      imageAlt: 'Delivery insurance comparison',
      date: new Date('2024-02-01'),
      locale: 'Both',
      articleType: 'blog',
      categoryId: blogComparisons.id,
      metaTitle: 'Comparing Top 5 Delivery Insurance Plans | GigSafeHub',
      metaDescription: 'A comprehensive comparison of the best insurance plans available for delivery workers in 2024.',
      metaKeywords: 'delivery insurance, insurance comparison, delivery worker insurance',
      readingTime: 7,
    },
  });

  const article3 = await prisma.article.upsert({
    where: { slug: 'gig-economy-trends-2024' },
    update: {},
    create: {
      slug: 'gig-economy-trends-2024',
      slugEn: 'gig-economy-trends-2024',
      slugPt: 'tendencias-da-economia-gig-2024',
      title: 'Gig Economy Trends in 2024',
      excerpt: 'Discover the latest trends shaping the gig economy and how they affect insurance needs for workers.',
      content: `
# Gig Economy Trends in 2024

The gig economy continues to evolve rapidly. Here are the key trends shaping 2024:

## 1. Increased Regulation

Governments worldwide are implementing new regulations to protect gig workers, including mandatory insurance requirements.

## 2. Technology Integration

New platforms are making it easier for workers to manage their insurance and benefits.

## 3. Worker Classification

The debate over worker classification continues, affecting insurance and benefits eligibility.

## 4. Specialized Insurance Products

Insurance companies are developing products specifically designed for gig workers.

## Conclusion

Stay informed about these trends to ensure you have the right protection.
      `,
      partnerTag: 'GigSafeHub',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      imageAlt: 'Gig economy trends',
      date: new Date('2024-03-10'),
      locale: 'Both',
      articleType: 'blog',
      categoryId: blogTrends.id,
      metaTitle: 'Gig Economy Trends in 2024 | GigSafeHub',
      metaDescription: 'Discover the latest trends shaping the gig economy and how they affect insurance needs.',
      readingTime: 6,
    },
  });

  console.log('✅ Articles seeded successfully!');
  console.log(`   - Created ${await prisma.article.count()} articles`);

  // ============================================
  // CREATE GUIDE PAGES
  // ============================================

  const guide1 = await prisma.guidePage.upsert({
    where: { slug: 'what-is-gig-economy-insurance' },
    update: {},
    create: {
      slug: 'what-is-gig-economy-insurance',
      slugEn: 'what-is-gig-economy-insurance',
      slugPt: 'o-que-e-seguro-para-economia-gig',
      title: 'What is Gig Economy Insurance?',
      excerpt: 'A comprehensive guide explaining what gig economy insurance is and why it matters for independent workers.',
      content: `
# What is Gig Economy Insurance?

Gig economy insurance is specialized insurance coverage designed for independent workers who earn income through platforms like Uber, DoorDash, or freelance marketplaces.

## Why Do You Need It?

Traditional insurance policies often exclude commercial activities. Gig economy insurance fills this gap by providing coverage for:
- Work-related accidents
- Equipment damage or theft
- Liability protection
- Income protection

## Types of Coverage

### 1. Liability Insurance
Protects you if you're found responsible for damages or injuries.

### 2. Equipment Insurance
Covers your work equipment (laptop, camera, vehicle, etc.).

### 3. Income Protection
Provides financial support if you're unable to work due to injury or illness.

### 4. Health Insurance
Specialized health plans for independent workers.

## How to Choose

Consider:
- Your work type and volume
- Your risk tolerance
- Your budget
- Platform requirements

## Conclusion

Gig economy insurance is essential for protecting your livelihood as an independent worker.
      `,
      categoryId: guideWhatIs.id,
      locale: 'Both',
      imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
      imageAlt: 'Gig economy insurance guide',
      metaTitle: 'What is Gig Economy Insurance? | Complete Guide',
      metaDescription: 'A comprehensive guide explaining what gig economy insurance is and why it matters for independent workers.',
      metaKeywords: 'gig economy insurance, independent worker insurance, freelancer insurance',
    },
  });

  const guide2 = await prisma.guidePage.upsert({
    where: { slug: 'insurance-costs-by-type' },
    update: {},
    create: {
      slug: 'insurance-costs-by-type',
      slugEn: 'insurance-costs-by-type',
      slugPt: 'custos-de-seguro-por-tipo',
      title: 'Insurance Costs by Type',
      excerpt: 'Understand the typical costs for different types of insurance coverage for gig workers.',
      content: `
# Insurance Costs by Type

Understanding insurance costs helps you budget effectively. Here's a breakdown by type:

## Liability Insurance
- **Average Cost**: $30-80/month
- **Factors**: Coverage amount, work type, location

## Equipment Insurance
- **Average Cost**: $15-50/month
- **Factors**: Equipment value, deductible

## Income Protection
- **Average Cost**: $40-120/month
- **Factors**: Income level, waiting period

## Health Insurance
- **Average Cost**: $200-500/month
- **Factors**: Age, location, coverage level

## Tips to Save

1. Bundle policies when possible
2. Increase deductibles
3. Shop around annually
4. Take advantage of discounts

## Conclusion

Plan your budget based on your specific needs and risk profile.
      `,
      categoryId: guideCosts.id,
      locale: 'Both',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
      imageAlt: 'Insurance costs breakdown',
      metaTitle: 'Insurance Costs by Type | Pricing Guide',
      metaDescription: 'Understand the typical costs for different types of insurance coverage for gig workers.',
    },
  });

  const guide3 = await prisma.guidePage.upsert({
    where: { slug: 'how-to-choose-right-insurance-plan' },
    update: {},
    create: {
      slug: 'how-to-choose-right-insurance-plan',
      slugEn: 'how-to-choose-right-insurance-plan',
      slugPt: 'como-escolher-o-plano-de-seguro-ideal',
      title: 'How to Choose the Right Insurance Plan',
      excerpt: 'Step-by-step guide to selecting the insurance plan that best fits your needs as a gig worker.',
      content: `
# How to Choose the Right Insurance Plan

Choosing the right insurance plan requires careful consideration. Follow these steps:

## Step 1: Assess Your Needs

Evaluate:
- Your work type and frequency
- Your risk exposure
- Your financial situation
- Platform requirements

## Step 2: Research Options

- Compare multiple providers
- Read reviews and ratings
- Check coverage details
- Understand exclusions

## Step 3: Calculate Costs

Consider:
- Monthly premiums
- Deductibles
- Out-of-pocket maximums
- Long-term affordability

## Step 4: Review Coverage

Ensure coverage includes:
- Your specific work activities
- Equipment protection
- Liability limits
- Income protection if needed

## Step 5: Make a Decision

Choose the plan that offers:
- Adequate coverage
- Reasonable cost
- Good customer service
- Flexibility for changes

## Conclusion

Take your time to make an informed decision that protects you without breaking your budget.
      `,
      categoryId: guideChoosing.id,
      locale: 'Both',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      imageAlt: 'Choosing insurance plan',
      metaTitle: 'How to Choose the Right Insurance Plan | Guide',
      metaDescription: 'Step-by-step guide to selecting the insurance plan that best fits your needs as a gig worker.',
    },
  });

  console.log('✅ Guide pages seeded successfully!');
  console.log(`   - Created ${await prisma.guidePage.count()} guide pages`);

  // ============================================
  // CREATE COMPARISON PAGES
  // ============================================

  // Note: These will need product IDs once products are created
  // For now, we'll create them with empty productIds arrays

  const comparison1 = await prisma.comparisonPage.upsert({
    where: { slug: 'compare-insurance-for-drivers' },
    update: {},
    create: {
      slug: 'compare-insurance-for-drivers',
      slugEn: 'compare-insurance-for-drivers',
      slugPt: 'comparar-seguros-para-motoristas',
      title: 'Compare Insurance for Drivers',
      description: 'Side-by-side comparison of the best insurance options for rideshare and delivery drivers.',
      categoryId: compareDrivers.id,
      locale: 'Both',
      productIds: [], // Will be populated when products are created
      metaTitle: 'Compare Insurance for Drivers | Side-by-Side Comparison',
      metaDescription: 'Compare the best insurance options for rideshare and delivery drivers.',
      metaKeywords: 'driver insurance comparison, rideshare insurance compare',
    },
  });

  const comparison2 = await prisma.comparisonPage.upsert({
    where: { slug: 'compare-insurance-for-delivery-workers' },
    update: {},
    create: {
      slug: 'compare-insurance-for-delivery-workers',
      slugEn: 'compare-insurance-for-delivery-workers',
      slugPt: 'comparar-seguros-para-entregadores',
      title: 'Compare Insurance for Delivery Workers',
      description: 'Compare insurance plans specifically designed for delivery workers.',
      categoryId: compareDelivery.id,
      locale: 'Both',
      productIds: [],
      metaTitle: 'Compare Insurance for Delivery Workers | Comparison',
      metaDescription: 'Compare insurance plans specifically designed for delivery workers.',
    },
  });

  const comparison3 = await prisma.comparisonPage.upsert({
    where: { slug: 'compare-income-insurance' },
    update: {},
    create: {
      slug: 'compare-income-insurance',
      slugEn: 'compare-income-insurance',
      slugPt: 'comparar-seguros-de-renda',
      title: 'Compare Income Insurance',
      description: 'Compare income protection insurance plans for gig workers.',
      categoryId: compareIncome.id,
      locale: 'Both',
      productIds: [],
      metaTitle: 'Compare Income Insurance | Gig Worker Protection',
      metaDescription: 'Compare income protection insurance plans for gig workers.',
    },
  });

  console.log('✅ Comparison pages seeded successfully!');
  console.log(`   - Created ${await prisma.comparisonPage.count()} comparison pages`);

  console.log('\n🎉 All content pages seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
