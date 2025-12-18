"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
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
    console.log('✅ Categories seeded successfully!');
    console.log(`   - Created ${await prisma.category.count()} categories`);
    // ============================================
    // CREATE ADMIN USER
    // ============================================
    const adminEmail = 'admin@example.com';
    const adminPassword = 'password123';
    const hashedPassword = await bcrypt_1.default.hash(adminPassword, 10);
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
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map
