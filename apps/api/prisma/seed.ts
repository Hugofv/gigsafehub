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
      description: 'Trends in the gig economy',
      descriptionEn: 'Trends in the gig economy',
      descriptionPt: 'Tendências na economia gig',
      level: 1,
      parentId: blogRoot.id,
      order: 3,
      isActive: true,
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
