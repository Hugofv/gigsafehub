import { PrismaClient, ProductCategory, ContentLocale } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample products
  const gigBank = await prisma.financialProduct.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      name: 'GigBank Pro',
      category: ProductCategory.Banking,
      rating: 4.8,
      reviewsCount: 1240,
      description: 'A mobile-first banking solution designed specifically for freelancers with automated tax savings buckets.',
      fees: '$0/mo',
      affiliateLink: 'https://gigbank.demo/signup',
      safetyScore: 98,
      logoUrl: 'https://picsum.photos/64/64?random=1',
      pros: {
        create: [
          { text: 'No monthly fees' },
          { text: 'Automated tax withholding' },
          { text: 'Early direct deposit' },
        ],
      },
      cons: {
        create: [
          { text: 'No physical branches' },
          { text: 'Limited cash deposit network' },
        ],
      },
      features: {
        create: [
          { text: 'Tax Buckets' },
          { text: 'Invoicing Tool' },
          { text: 'Expense Tracking' },
        ],
      },
    },
  });

  const safeRide = await prisma.financialProduct.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      name: 'SafeRide Insure',
      category: ProductCategory.Insurance,
      rating: 4.5,
      reviewsCount: 850,
      description: 'On-demand vehicle insurance for rideshare drivers. Pay only when the app is on.',
      fees: 'Base $20/mo + mileage',
      affiliateLink: 'https://saferide.demo/quote',
      safetyScore: 95,
      logoUrl: 'https://picsum.photos/64/64?random=2',
      pros: {
        create: [
          { text: 'Pay-per-mile' },
          { text: 'Gap coverage included' },
          { text: 'Fast claims process' },
        ],
      },
      cons: {
        create: [
          { text: 'State availability limited' },
          { text: 'Higher deductible options' },
        ],
      },
      features: {
        create: [
          { text: 'Rideshare Endorsement' },
          { text: 'Deductible Fund' },
          { text: '24/7 Support' },
        ],
      },
    },
  });

  const hiscox = await prisma.financialProduct.upsert({
    where: { id: '5' },
    update: {},
    create: {
      id: '5',
      name: 'Hiscox',
      category: ProductCategory.Insurance,
      rating: 4.6,
      reviewsCount: 3400,
      description: 'Specialized small business insurance with tailored policies for freelancers and consultants.',
      fees: 'From $30/mo',
      affiliateLink: 'https://hiscox.demo/quote',
      safetyScore: 97,
      logoUrl: 'https://picsum.photos/64/64?random=5',
      pros: {
        create: [
          { text: 'Instant coverage' },
          { text: 'Tailored to specific professions' },
          { text: 'High policy limits' },
        ],
      },
      cons: {
        create: [
          { text: 'Can be pricier for low risk' },
          { text: 'Strict underwriting' },
        ],
      },
      features: {
        create: [
          { text: 'Professional Liability' },
          { text: 'General Liability' },
          { text: 'Cyber Security' },
        ],
      },
    },
  });

  const nextInsurance = await prisma.financialProduct.upsert({
    where: { id: '6' },
    update: {},
    create: {
      id: '6',
      name: 'Next Insurance',
      category: ProductCategory.Insurance,
      rating: 4.7,
      reviewsCount: 2900,
      description: '100% online insurance designed for speed and simplicity. Get a certificate of insurance in minutes.',
      fees: 'From $25/mo',
      affiliateLink: 'https://next.demo/quote',
      safetyScore: 96,
      logoUrl: 'https://picsum.photos/64/64?random=6',
      pros: {
        create: [
          { text: 'Fast mobile app' },
          { text: 'Bundling discounts' },
          { text: 'Live Certificates' },
        ],
      },
      cons: {
        create: [
          { text: 'Limited human agent access' },
          { text: 'Not all risks covered' },
        ],
      },
      features: {
        create: [
          { text: 'General Liability' },
          { text: 'Workers Comp' },
          { text: 'Tools & Equipment' },
        ],
      },
    },
  });

  // Create sample article
  const article = await prisma.article.upsert({
    where: { slug: 'hiscox-vs-next-insurance' },
    update: {},
    create: {
      slug: 'hiscox-vs-next-insurance',
      title: 'Hiscox vs. Next Insurance: The Ultimate Showdown for Gig Workers',
      excerpt: 'Deciding between Hiscox and Next? We break down the coverage, costs, and claims process to help you pick the right shield.',
      content: '<p>As a gig worker, your liability is on the line every day. Whether you are a freelance consultant, a handyman, or a digital marketer, one lawsuit could wipe out your savings. That is why General Liability insurance is not just a nice-to-have; it is your shield.</p><h3 class="text-xl font-bold mt-6 mb-3">Why You Need Liability Coverage</h3><p>Clients are increasingly requiring proof of insurance before signing contracts. Both Hiscox and Next Insurance specialize in serving micro-businesses and sole proprietors, but they take different approaches.</p>',
      partnerTag: 'Partner: Hiscox',
      imageUrl: 'https://picsum.photos/800/400?random=10',
      date: new Date('2024-10-12'),
      locale: ContentLocale.en_US,
      relatedProducts: {
        create: [
          { productId: hiscox.id },
          { productId: nextInsurance.id },
        ],
      },
    },
  });

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gigsafehub.com' },
    update: {},
    create: {
      email: 'admin@gigsafehub.com',
      name: 'Super Admin',
      role: 'admin',
    },
  });

  console.log('✅ Seeding completed!');
  console.log(`   - Created ${await prisma.financialProduct.count()} products`);
  console.log(`   - Created ${await prisma.article.count()} articles`);
  console.log(`   - Created ${await prisma.user.count()} users`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
