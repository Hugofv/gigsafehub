import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

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
      showInNavbar: true,
      showInFooter: true,
      metaTitle: 'Insurance for Gig Workers | GigSafeHub',
      metaDescription: 'Find the best insurance products for drivers, delivery workers, freelancers, and digital nomads.',
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
      order: 2,
      isActive: true,
      showInNavbar: true,
      showInFooter: false,
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
      order: 3,
      isActive: true,
      showInNavbar: true,
      showInFooter: false,
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
      order: 4,
      isActive: true,
      showInNavbar: true,
      showInFooter: false,
    },
  });

  const toolsRoot = await prisma.category.upsert({
    where: { slug: 'tools' },
    update: {},
    create: {
      name: 'Tools',
      nameEn: 'Tools',
      namePt: 'Ferramentas',
      slug: 'tools',
      slugEn: 'tools',
      slugPt: 'ferramentas',
      description: 'Free tools and calculators for gig economy workers',
      descriptionEn: 'Free tools and calculators for gig economy workers',
      descriptionPt: 'Ferramentas e calculadoras gratuitas para autônomos e freelancers',
      level: 0,
      parentId: null,
      order: 5,
      isActive: true,
      showInNavbar: true,
      showInFooter: true,
      icon: 'calculator',
      metaTitle: 'Free Tools for Gig Workers | GigSafeHub',
      metaDescription: 'Free calculators and tools to help gig workers manage their finances, estimate income loss, and make smarter decisions.',
    },
  });

  const jobsRoot = await prisma.category.upsert({
    where: { slug: 'jobs' },
    update: {},
    create: {
      name: 'Jobs',
      nameEn: 'Jobs',
      namePt: 'Vagas',
      slug: 'jobs',
      slugEn: 'jobs',
      slugPt: 'vagas',
      description: 'Job opportunities and resources for gig economy workers',
      descriptionEn: 'Job opportunities and resources for gig economy workers',
      descriptionPt: 'Vagas e oportunidades para trabalhadores da gig economy',
      level: 0,
      parentId: null,
      order: 6,
      isActive: true,
      showInNavbar: true,
      showInFooter: false,
      icon: 'briefcase',
      metaTitle: 'Jobs for Gig Workers | GigSafeHub',
      metaDescription: 'Find opportunities and resources for app drivers and delivery workers.',
    },
  });

  // ============================================
  // Level 1: Main Subcategories (Insurance)
  // ============================================

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
      showInNavbar: true,
      showInFooter: true,
    },
  });

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
      showInNavbar: true,
      showInFooter: true,
    },
  });

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
      description: 'Insurance products for freelancers',
      descriptionEn: 'Insurance products for freelancers',
      descriptionPt: 'Produtos de seguro para freelancers',
      level: 1,
      parentId: insuranceRoot.id,
      order: 3,
      isActive: true,
      showInNavbar: true,
      showInFooter: true,
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

  // ============================================
  // Level 1: Comparison Subcategories
  // ============================================

  const compareDrivers = await prisma.category.upsert({
    where: { slug: 'compare-insurance-for-drivers' },
    update: {},
    create: {
      name: 'Compare Insurance for Drivers',
      nameEn: 'Compare Insurance for Drivers',
      namePt: 'Comparar Seguros para Motoristas',
      slug: 'compare-insurance-for-drivers',
      slugEn: 'compare-insurance-for-drivers',
      slugPt: 'comparar-seguros-para-motoristas',
      description: 'Compare insurance plans for drivers',
      descriptionEn: 'Compare insurance plans for drivers',
      descriptionPt: 'Compare planos de seguro para motoristas',
      level: 1,
      parentId: comparisonRoot.id,
      order: 1,
      isActive: true,
    },
  });

  const compareDelivery = await prisma.category.upsert({
    where: { slug: 'compare-insurance-for-delivery' },
    update: {},
    create: {
      name: 'Compare Insurance for Delivery Workers',
      nameEn: 'Compare Insurance for Delivery Workers',
      namePt: 'Comparar Seguros para Entregadores',
      slug: 'compare-insurance-for-delivery',
      slugEn: 'compare-insurance-for-delivery',
      slugPt: 'comparar-seguros-para-entregadores',
      description: 'Compare insurance plans for delivery workers',
      descriptionEn: 'Compare insurance plans for delivery workers',
      descriptionPt: 'Compare planos de seguro para entregadores',
      level: 1,
      parentId: comparisonRoot.id,
      order: 2,
      isActive: true,
    },
  });

  // ============================================
  // Level 1: Guide Subcategories
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
      description: 'Learn about gig economy insurance',
      descriptionEn: 'Learn about gig economy insurance',
      descriptionPt: 'Aprenda sobre seguro para economia gig',
      level: 1,
      parentId: guidesRoot.id,
      order: 1,
      isActive: true,
    },
  });

  // ============================================
  // Level 1: Blog Subcategories
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
      description: 'Tips and safety articles',
      descriptionEn: 'Tips and safety articles',
      descriptionPt: 'Artigos sobre dicas e segurança',
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
      description: 'Comparison articles',
      descriptionEn: 'Comparison articles',
      descriptionPt: 'Artigos comparativos',
      level: 1,
      parentId: blogRoot.id,
      order: 2,
      isActive: true,
    },
  });

  // ============================================
  // Level 1: Jobs Subcategories
  // ============================================

  const jobsAppDriver = await prisma.category.upsert({
    where: { slug: 'app-driver' },
    update: {},
    create: {
      name: 'App Driver',
      nameEn: 'App Driver',
      namePt: 'Motorista de Aplicativo',
      slug: 'app-driver',
      slugEn: 'app-driver',
      slugPt: 'motorista-de-aplicativo',
      description: 'Opportunities and resources for app drivers',
      descriptionEn: 'Opportunities and resources for app drivers',
      descriptionPt: 'Vagas e recursos para motoristas de aplicativo',
      level: 1,
      parentId: jobsRoot.id,
      order: 1,
      isActive: true,
      showInNavbar: true,
      showInFooter: false,
    },
  });

  const jobsDeliveryDriver = await prisma.category.upsert({
    where: { slug: 'delivery-driver' },
    update: {},
    create: {
      name: 'Delivery Driver',
      nameEn: 'Delivery Driver',
      namePt: 'Entregador de Aplicativo',
      slug: 'delivery-driver',
      slugEn: 'delivery-driver',
      slugPt: 'entregador-de-aplicativo',
      description: 'Opportunities and resources for delivery workers',
      descriptionEn: 'Opportunities and resources for delivery workers',
      descriptionPt: 'Vagas e recursos para entregadores de aplicativo',
      level: 1,
      parentId: jobsRoot.id,
      order: 2,
      isActive: true,
      showInNavbar: true,
      showInFooter: false,
    },
  });


  // ============================================
  // Level 1: Tools Subcategories
  // ============================================

  const lossIncomeSimulator = await prisma.category.upsert({
    where: { slug: 'loss-income-simulator' },
    update: {},
    create: {
      name: 'Loss Income Simulator',
      nameEn: 'Loss Income Simulator',
      namePt: 'Simulador de Perda de Renda',
      slug: 'loss-income-simulator',
      slugEn: 'loss-income-simulator',
      slugPt: 'simulador-perda-renda',
      description: 'Calculate how much income you could lose without proper insurance coverage',
      descriptionEn: 'Calculate how much income you could lose without proper insurance coverage',
      descriptionPt: 'Calcule quanto de renda você poderia perder sem uma cobertura de seguro adequada',
      level: 1,
      parentId: toolsRoot.id,
      order: 1,
      isActive: true,
      showInNavbar: true,
      showInFooter: true,
      icon: 'calculator',
      metaTitle: 'Loss Income Simulator | Calculate Your Risk | GigSafeHub',
      metaDescription: 'Free calculator to estimate how much income you could lose if you\'re unable to work. Plan ahead and protect your earnings.',
    },
  });

  const dailyProfitCalculator = await prisma.category.upsert({
    where: { slug: 'daily-profit-calculator' },
    update: {},
    create: {
      name: 'Daily Profit Calculator',
      nameEn: 'Daily Real Profit Calculator',
      namePt: 'Calculadora de Lucro Real Diário',
      slug: 'daily-profit-calculator',
      slugEn: 'daily-profit-calculator',
      slugPt: 'calculadora-lucro-diario',
      description: 'Discover your real earnings after deducting all expenses',
      descriptionEn: 'Discover your real hourly earnings after deducting fuel, maintenance, fees, and other costs',
      descriptionPt: 'Descubra seus ganhos reais por hora após descontar combustível, manutenção, taxas e outros custos',
      level: 1,
      parentId: toolsRoot.id,
      order: 2,
      isActive: true,
      showInNavbar: true,
      showInFooter: true,
      icon: 'currency',
      metaTitle: 'Daily Real Profit Calculator | GigSafeHub',
      metaDescription: 'Free calculator for gig workers to discover real hourly profit after all expenses. Track your true earnings as a rideshare driver or delivery worker.',
    },
  });

  const monthlyGoalSimulator = await prisma.category.upsert({
    where: { slug: 'monthly-goal-simulator' },
    update: {},
    create: {
      name: 'Monthly Goal Simulator',
      nameEn: 'Monthly Goal Simulator',
      namePt: 'Simulador de Meta Mensal',
      slug: 'monthly-goal-simulator',
      slugEn: 'monthly-goal-simulator',
      slugPt: 'simulador-meta-mensal',
      description: 'Plan how to reach your monthly income goals',
      descriptionEn: 'Set your monthly income target and discover exactly how many hours, days, and trips you need to reach it',
      descriptionPt: 'Defina sua meta de renda mensal e descubra exatamente quantas horas, dias e corridas você precisa para alcançá-la',
      level: 1,
      parentId: toolsRoot.id,
      order: 3,
      isActive: true,
      showInNavbar: true,
      showInFooter: true,
      icon: 'chart',
      metaTitle: 'Monthly Goal Simulator | Plan Your Earnings | GigSafeHub',
      metaDescription: 'Free calculator to plan your monthly income goal. Discover how many hours and trips you need to reach your financial objectives.',
    },
  });

  const hiddenCostsCalculator = await prisma.category.upsert({
    where: { slug: 'hidden-costs-calculator' },
    update: {},
    create: {
      name: 'Hidden Costs Calculator',
      nameEn: 'Hidden Costs Calculator',
      namePt: 'Calculadora de Custos Invisíveis',
      slug: 'hidden-costs-calculator',
      slugEn: 'hidden-costs-calculator',
      slugPt: 'calculadora-custos-ocultos',
      description: 'Discover costs you might be overlooking',
      descriptionEn: 'Most gig workers forget about depreciation, insurance, phone bills, and other hidden costs. Find out your true operating expenses.',
      descriptionPt: 'A maioria dos autônomos esquece da depreciação, seguro, conta de celular e outros custos ocultos. Descubra suas verdadeiras despesas operacionais.',
      level: 1,
      parentId: toolsRoot.id,
      order: 4,
      isActive: true,
      showInNavbar: true,
      showInFooter: true,
      icon: 'search',
      metaTitle: 'Hidden Costs Calculator | Discover Overlooked Expenses | GigSafeHub',
      metaDescription: 'Free calculator to discover hidden costs like depreciation, maintenance, and vehicle wear. Understand your true expenses as a gig worker.',
    },
  });

  const costPerTripCalculator = await prisma.category.upsert({
    where: { slug: 'cost-per-trip-calculator' },
    update: {},
    create: {
      name: 'Cost per Trip Calculator',
      nameEn: 'Cost per Trip Calculator',
      namePt: 'Calculadora de Custo por Corrida',
      slug: 'cost-per-trip-calculator',
      slugEn: 'cost-per-trip-calculator',
      slugPt: 'calculadora-custo-corrida',
      description: 'Calculate how much each trip costs and if it is worth accepting',
      descriptionEn: 'Find out how much each trip costs and if it\'s worth accepting. Calculate fuel, wear, platform fees and discover your real profit per trip.',
      descriptionPt: 'Descubra quanto custa cada corrida e se vale a pena aceitar. Calcule combustível, desgaste, taxa da plataforma e descubra seu lucro real por viagem.',
      level: 1,
      parentId: toolsRoot.id,
      order: 5,
      isActive: true,
      showInNavbar: true,
      showInFooter: true,
      icon: 'calculator',
      metaTitle: 'Cost per Trip Calculator | Worth Accepting? | GigSafeHub',
      metaDescription: 'Free calculator to find out how much each trip costs. Calculate if trips are worth accepting based on fuel, wear and platform fees.',
    },
  });

  const fuelCalculator = await prisma.category.upsert({
    where: { slug: 'fuel-calculator' },
    update: {},
    create: {
      name: 'Fuel Calculator',
      nameEn: 'Fuel Calculator',
      namePt: 'Calculadora de Combustível',
      slug: 'fuel-calculator',
      slugEn: 'fuel-calculator',
      slugPt: 'calculadora-combustivel',
      description: 'Calculate fuel expenses and compare gas vs ethanol',
      descriptionEn: 'Calculate your monthly fuel expenses and find out if gasoline or ethanol is better for you. Compare prices and save money.',
      descriptionPt: 'Calcule seus gastos mensais com combustível e descubra se vale mais a pena usar gasolina ou etanol. Compare preços e economize.',
      level: 1,
      parentId: toolsRoot.id,
      order: 6,
      isActive: true,
      showInNavbar: true,
      showInFooter: true,
      icon: 'flame',
      metaTitle: 'Fuel Calculator | Gas vs Ethanol | GigSafeHub',
      metaDescription: 'Free fuel calculator. Compare gasoline vs ethanol, calculate monthly fuel costs and discover which is more economical for you.',
    },
  });

  const breakEvenCalculator = await prisma.category.upsert({
    where: { slug: 'break-even-calculator' },
    update: {},
    create: {
      name: 'Break-Even Calculator',
      nameEn: 'Break-Even Calculator',
      namePt: 'Calculadora de Ponto de Equilíbrio',
      slug: 'break-even-calculator',
      slugEn: 'break-even-calculator',
      slugPt: 'calculadora-ponto-equilibrio',
      description: 'Find out how much revenue you need to cover all costs',
      descriptionEn: 'Find out how much revenue you need to cover all your costs. Calculate your break-even point and know when you start making real profit.',
      descriptionPt: 'Descubra quanto você precisa faturar para cobrir todos os seus custos. Calcule seu ponto de equilíbrio e saiba quando começa a lucrar.',
      level: 1,
      parentId: toolsRoot.id,
      order: 7,
      isActive: true,
      showInNavbar: true,
      showInFooter: true,
      icon: 'chart',
      metaTitle: 'Break-Even Calculator | When Do You Start Profiting? | GigSafeHub',
      metaDescription: 'Free break-even calculator for gig workers. Discover how much revenue you need to cover all costs and start making real profit.',
    },
  });

  const driverBudgetSimulator = await prisma.category.upsert({
    where: { slug: 'driver-budget-simulator' },
    update: {},
    create: {
      name: 'Driver Budget Simulator',
      nameEn: 'Driver Budget Simulator',
      namePt: 'Simulador de Orçamento do Motorista',
      slug: 'driver-budget-simulator',
      slugEn: 'driver-budget-simulator',
      slugPt: 'simulador-orcamento',
      description: 'Build your complete budget and find out how much you need to earn',
      descriptionEn: 'Build your complete budget as a rideshare driver. Include all fixed, variable and personal costs and find out how much you need to earn to survive.',
      descriptionPt: 'Monte seu orçamento completo como motorista de app. Inclua todos os custos fixos, variáveis e pessoais e descubra quanto precisa faturar para sobreviver.',
      level: 1,
      parentId: toolsRoot.id,
      order: 8,
      isActive: true,
      showInNavbar: true,
      showInFooter: true,
      icon: 'calculator',
      metaTitle: 'Driver Budget Simulator | Complete Financial Planning | GigSafeHub',
      metaDescription: 'Free budget simulator for rideshare drivers. Plan your complete budget including vehicle, personal and work costs.',
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

  console.log('✅ Articles seeded successfully!');
  console.log(`   - Created ${await prisma.article.count()} articles`);

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
