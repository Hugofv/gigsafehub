-- CreateEnum
CREATE TYPE "Country" AS ENUM ('BR', 'US', 'UK', 'CA', 'AU', 'DE', 'FR', 'ES', 'PT', 'MX', 'AR', 'CL', 'CO', 'Other');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "CoverageType" AS ENUM ('basic', 'standard', 'premium');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('new', 'contacted', 'converted', 'rejected');

-- CreateEnum
CREATE TYPE "ContentLocale" AS ENUM ('en_US', 'pt_BR', 'Both');

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "namePt" TEXT,
    "slug" TEXT NOT NULL,
    "slugEn" TEXT,
    "slugPt" TEXT,
    "description" TEXT,
    "descriptionEn" TEXT,
    "descriptionPt" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT,
    "country" "Country",
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "icon" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "slugEn" TEXT,
    "slugPt" TEXT,
    "categoryId" TEXT NOT NULL,
    "country" "Country",
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewsCount" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "fees" TEXT NOT NULL,
    "affiliateLink" TEXT NOT NULL,
    "safetyScore" INTEGER NOT NULL DEFAULT 0,
    "logoUrl" TEXT NOT NULL,
    "logoAlt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "canonicalUrl" TEXT,
    "structuredData" TEXT,
    "lastModified" TIMESTAMP(3),
    "sitemapPriority" DOUBLE PRECISION DEFAULT 0.8,
    "sitemapChangefreq" TEXT DEFAULT 'weekly',
    "robotsIndex" BOOLEAN NOT NULL DEFAULT true,
    "robotsFollow" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "financial_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_pros" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "product_pros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_cons" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "product_cons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_features" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "product_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "slugEn" TEXT,
    "slugPt" TEXT,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "partnerTag" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageAlt" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "locale" "ContentLocale" NOT NULL,
    "articleType" TEXT NOT NULL DEFAULT 'blog',
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "canonicalUrl" TEXT,
    "structuredData" TEXT,
    "lastModified" TIMESTAMP(3),
    "sitemapPriority" DOUBLE PRECISION DEFAULT 0.9,
    "sitemapChangefreq" TEXT DEFAULT 'monthly',
    "robotsIndex" BOOLEAN NOT NULL DEFAULT true,
    "robotsFollow" BOOLEAN NOT NULL DEFAULT true,
    "readingTime" INTEGER,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_products" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "article_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_quotes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "coverageType" "CoverageType" NOT NULL,
    "coverageAmount" DOUBLE PRECISION NOT NULL,
    "deductible" DOUBLE PRECISION NOT NULL,
    "premium" DOUBLE PRECISION NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insurance_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_features" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "quote_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "productInterest" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparison_pages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "slugEn" TEXT,
    "slugPt" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "locale" "ContentLocale" NOT NULL,
    "productIds" TEXT[],
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "canonicalUrl" TEXT,
    "structuredData" TEXT,
    "lastModified" TIMESTAMP(3),
    "sitemapPriority" DOUBLE PRECISION DEFAULT 0.8,
    "sitemapChangefreq" TEXT DEFAULT 'monthly',
    "robotsIndex" BOOLEAN NOT NULL DEFAULT true,
    "robotsFollow" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comparison_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guide_pages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "slugEn" TEXT,
    "slugPt" TEXT,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "locale" "ContentLocale" NOT NULL,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "canonicalUrl" TEXT,
    "structuredData" TEXT,
    "lastModified" TIMESTAMP(3),
    "sitemapPriority" DOUBLE PRECISION DEFAULT 0.9,
    "sitemapChangefreq" TEXT DEFAULT 'monthly',
    "robotsIndex" BOOLEAN NOT NULL DEFAULT true,
    "robotsFollow" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guide_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "locale" "ContentLocale" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slugEn_key" ON "categories"("slugEn");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slugPt_key" ON "categories"("slugPt");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_slugEn_idx" ON "categories"("slugEn");

-- CreateIndex
CREATE INDEX "categories_slugPt_idx" ON "categories"("slugPt");

-- CreateIndex
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");

-- CreateIndex
CREATE INDEX "categories_level_idx" ON "categories"("level");

-- CreateIndex
CREATE INDEX "categories_country_idx" ON "categories"("country");

-- CreateIndex
CREATE INDEX "categories_isActive_idx" ON "categories"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "financial_products_slug_key" ON "financial_products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "financial_products_slugEn_key" ON "financial_products"("slugEn");

-- CreateIndex
CREATE UNIQUE INDEX "financial_products_slugPt_key" ON "financial_products"("slugPt");

-- CreateIndex
CREATE INDEX "financial_products_slug_idx" ON "financial_products"("slug");

-- CreateIndex
CREATE INDEX "financial_products_slugEn_idx" ON "financial_products"("slugEn");

-- CreateIndex
CREATE INDEX "financial_products_slugPt_idx" ON "financial_products"("slugPt");

-- CreateIndex
CREATE INDEX "financial_products_categoryId_idx" ON "financial_products"("categoryId");

-- CreateIndex
CREATE INDEX "financial_products_country_idx" ON "financial_products"("country");

-- CreateIndex
CREATE INDEX "financial_products_lastModified_idx" ON "financial_products"("lastModified");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slugEn_key" ON "articles"("slugEn");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slugPt_key" ON "articles"("slugPt");

-- CreateIndex
CREATE INDEX "articles_slug_idx" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_slugEn_idx" ON "articles"("slugEn");

-- CreateIndex
CREATE INDEX "articles_slugPt_idx" ON "articles"("slugPt");

-- CreateIndex
CREATE INDEX "articles_locale_idx" ON "articles"("locale");

-- CreateIndex
CREATE INDEX "articles_articleType_idx" ON "articles"("articleType");

-- CreateIndex
CREATE INDEX "articles_categoryId_idx" ON "articles"("categoryId");

-- CreateIndex
CREATE INDEX "articles_date_idx" ON "articles"("date");

-- CreateIndex
CREATE INDEX "articles_lastModified_idx" ON "articles"("lastModified");

-- CreateIndex
CREATE UNIQUE INDEX "article_products_articleId_productId_key" ON "article_products"("articleId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "comparison_pages_slug_key" ON "comparison_pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "comparison_pages_slugEn_key" ON "comparison_pages"("slugEn");

-- CreateIndex
CREATE UNIQUE INDEX "comparison_pages_slugPt_key" ON "comparison_pages"("slugPt");

-- CreateIndex
CREATE INDEX "comparison_pages_slug_idx" ON "comparison_pages"("slug");

-- CreateIndex
CREATE INDEX "comparison_pages_slugEn_idx" ON "comparison_pages"("slugEn");

-- CreateIndex
CREATE INDEX "comparison_pages_slugPt_idx" ON "comparison_pages"("slugPt");

-- CreateIndex
CREATE INDEX "comparison_pages_categoryId_idx" ON "comparison_pages"("categoryId");

-- CreateIndex
CREATE INDEX "comparison_pages_locale_idx" ON "comparison_pages"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "guide_pages_slug_key" ON "guide_pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "guide_pages_slugEn_key" ON "guide_pages"("slugEn");

-- CreateIndex
CREATE UNIQUE INDEX "guide_pages_slugPt_key" ON "guide_pages"("slugPt");

-- CreateIndex
CREATE INDEX "guide_pages_slug_idx" ON "guide_pages"("slug");

-- CreateIndex
CREATE INDEX "guide_pages_slugEn_idx" ON "guide_pages"("slugEn");

-- CreateIndex
CREATE INDEX "guide_pages_slugPt_idx" ON "guide_pages"("slugPt");

-- CreateIndex
CREATE INDEX "guide_pages_categoryId_idx" ON "guide_pages"("categoryId");

-- CreateIndex
CREATE INDEX "guide_pages_locale_idx" ON "guide_pages"("locale");

-- CreateIndex
CREATE INDEX "faqs_category_idx" ON "faqs"("category");

-- CreateIndex
CREATE INDEX "faqs_locale_idx" ON "faqs"("locale");

-- CreateIndex
CREATE INDEX "faqs_isPublished_idx" ON "faqs"("isPublished");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_products" ADD CONSTRAINT "financial_products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_pros" ADD CONSTRAINT "product_pros_productId_fkey" FOREIGN KEY ("productId") REFERENCES "financial_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_cons" ADD CONSTRAINT "product_cons_productId_fkey" FOREIGN KEY ("productId") REFERENCES "financial_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_features" ADD CONSTRAINT "product_features_productId_fkey" FOREIGN KEY ("productId") REFERENCES "financial_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_products" ADD CONSTRAINT "article_products_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_products" ADD CONSTRAINT "article_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "financial_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurance_quotes" ADD CONSTRAINT "insurance_quotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurance_quotes" ADD CONSTRAINT "insurance_quotes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "financial_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_features" ADD CONSTRAINT "quote_features_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "insurance_quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparison_pages" ADD CONSTRAINT "comparison_pages_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guide_pages" ADD CONSTRAINT "guide_pages_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
