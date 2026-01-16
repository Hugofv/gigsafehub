-- CreateTable
CREATE TABLE "job_opportunities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "salaryInfo" TEXT,
    "description" TEXT,
    "companyRating" DOUBLE PRECISION,
    "benefits" JSONB,
    "sourceUrl" TEXT,
    "sourceId" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'simplyhired',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "searchQuery" TEXT NOT NULL,
    "searchLocation" TEXT,
    "country" "Country" NOT NULL DEFAULT 'US',
    "locale" "ContentLocale" NOT NULL DEFAULT 'en_US',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "job_opportunities_sourceId_source_key" ON "job_opportunities"("sourceId", "source");

-- CreateIndex
CREATE INDEX "job_opportunities_source_idx" ON "job_opportunities"("source");

-- CreateIndex
CREATE INDEX "job_opportunities_sourceId_idx" ON "job_opportunities"("sourceId");

-- CreateIndex
CREATE INDEX "job_opportunities_isActive_idx" ON "job_opportunities"("isActive");

-- CreateIndex
CREATE INDEX "job_opportunities_country_idx" ON "job_opportunities"("country");

-- CreateIndex
CREATE INDEX "job_opportunities_locale_idx" ON "job_opportunities"("locale");

-- CreateIndex
CREATE INDEX "job_opportunities_searchQuery_idx" ON "job_opportunities"("searchQuery");

-- CreateIndex
CREATE INDEX "job_opportunities_createdAt_idx" ON "job_opportunities"("createdAt");

-- CreateIndex
CREATE INDEX "job_opportunities_lastSeenAt_idx" ON "job_opportunities"("lastSeenAt");
