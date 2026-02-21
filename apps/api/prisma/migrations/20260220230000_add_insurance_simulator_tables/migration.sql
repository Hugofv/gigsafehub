-- AlterTable
ALTER TABLE "leads" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "productInterest",
ADD COLUMN     "country" VARCHAR(2) NOT NULL,
ADD COLUMN     "estimatedPremiumMax" DOUBLE PRECISION,
ADD COLUMN     "estimatedPremiumMin" DOUBLE PRECISION,
ADD COLUMN     "language" VARCHAR(5) NOT NULL,
ADD COLUMN     "leadQualityScore" INTEGER,
ADD COLUMN     "meta" JSONB,
ADD COLUMN     "productType" VARCHAR(50) NOT NULL,
ADD COLUMN     "riskScore" DOUBLE PRECISION,
DROP COLUMN "status",
ADD COLUMN     "status" VARCHAR(50) NOT NULL DEFAULT 'created';

-- DropEnum
DROP TYPE "LeadStatus";

-- CreateTable
CREATE TABLE "lead_persons" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_addresses" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "street" TEXT,
    "number" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" VARCHAR(2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "trim" TEXT,
    "ownership" VARCHAR(50),
    "primaryUse" VARCHAR(50),
    "annualMileage" INTEGER,
    "garageType" TEXT,
    "hasAntiTheft" BOOLEAN NOT NULL DEFAULT false,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "yearsLicensed" INTEGER,
    "licenseState" TEXT,
    "maritalStatus" TEXT,
    "homeOwner" BOOLEAN,
    "creditTier" TEXT,
    "accidentsLast5Years" INTEGER NOT NULL DEFAULT 0,
    "violationsLast5Years" INTEGER NOT NULL DEFAULT 0,
    "sr22Required" BOOLEAN NOT NULL DEFAULT false,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gig_profiles" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "gigType" VARCHAR(50) NOT NULL,
    "hoursPerWeek" INTEGER,
    "incomeDependency" VARCHAR(50),
    "fullTime" BOOLEAN,
    "platforms" TEXT[],
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gig_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coverage_requests" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "currentInsured" BOOLEAN,
    "currentProvider" TEXT,
    "liabilityLimit" TEXT,
    "deductiblePreference" INTEGER,
    "wantsFullCoverage" BOOLEAN,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coverage_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country_extensions" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "ssnLast4" TEXT,
    "militaryStatus" BOOLEAN,
    "cpf" TEXT,
    "cnhNumber" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "country_extensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_trackings" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "referrer" TEXT,
    "landingPage" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_trackings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_consents" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "termsAccepted" BOOLEAN NOT NULL,
    "privacyAccepted" BOOLEAN NOT NULL,
    "marketingOptIn" BOOLEAN,
    "consentIp" TEXT,
    "consentTimestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" VARCHAR(2) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "apiEndpoint" TEXT,
    "apiKey" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_dispatches" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "requestPayload" JSONB,
    "responsePayload" JSONB,
    "responseCode" INTEGER,
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_dispatches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_payload_snapshots" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_payload_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lead_persons_leadId_key" ON "lead_persons"("leadId");

-- CreateIndex
CREATE INDEX "lead_persons_email_idx" ON "lead_persons"("email");

-- CreateIndex
CREATE UNIQUE INDEX "lead_addresses_leadId_key" ON "lead_addresses"("leadId");

-- CreateIndex
CREATE INDEX "lead_addresses_zipCode_idx" ON "lead_addresses"("zipCode");

-- CreateIndex
CREATE INDEX "lead_addresses_state_idx" ON "lead_addresses"("state");

-- CreateIndex
CREATE INDEX "vehicles_leadId_idx" ON "vehicles"("leadId");

-- CreateIndex
CREATE INDEX "vehicles_primaryUse_idx" ON "vehicles"("primaryUse");

-- CreateIndex
CREATE INDEX "drivers_leadId_idx" ON "drivers"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "gig_profiles_leadId_key" ON "gig_profiles"("leadId");

-- CreateIndex
CREATE INDEX "gig_profiles_gigType_idx" ON "gig_profiles"("gigType");

-- CreateIndex
CREATE UNIQUE INDEX "coverage_requests_leadId_key" ON "coverage_requests"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "country_extensions_leadId_key" ON "country_extensions"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "lead_trackings_leadId_key" ON "lead_trackings"("leadId");

-- CreateIndex
CREATE INDEX "lead_trackings_utmSource_utmCampaign_idx" ON "lead_trackings"("utmSource", "utmCampaign");

-- CreateIndex
CREATE UNIQUE INDEX "lead_consents_leadId_key" ON "lead_consents"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "partners_name_key" ON "partners"("name");

-- CreateIndex
CREATE INDEX "partners_country_idx" ON "partners"("country");

-- CreateIndex
CREATE INDEX "partners_active_idx" ON "partners"("active");

-- CreateIndex
CREATE INDEX "partner_dispatches_status_idx" ON "partner_dispatches"("status");

-- CreateIndex
CREATE INDEX "partner_dispatches_partnerId_idx" ON "partner_dispatches"("partnerId");

-- CreateIndex
CREATE INDEX "lead_payload_snapshots_leadId_idx" ON "lead_payload_snapshots"("leadId");

-- CreateIndex
CREATE INDEX "lead_payload_snapshots_createdAt_idx" ON "lead_payload_snapshots"("createdAt");

-- CreateIndex
CREATE INDEX "leads_userId_idx" ON "leads"("userId");

-- CreateIndex
CREATE INDEX "leads_country_idx" ON "leads"("country");

-- CreateIndex
CREATE INDEX "leads_productType_idx" ON "leads"("productType");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_createdAt_idx" ON "leads"("createdAt");

-- AddForeignKey
ALTER TABLE "lead_persons" ADD CONSTRAINT "lead_persons_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_addresses" ADD CONSTRAINT "lead_addresses_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gig_profiles" ADD CONSTRAINT "gig_profiles_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coverage_requests" ADD CONSTRAINT "coverage_requests_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "country_extensions" ADD CONSTRAINT "country_extensions_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_trackings" ADD CONSTRAINT "lead_trackings_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_consents" ADD CONSTRAINT "lead_consents_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_dispatches" ADD CONSTRAINT "partner_dispatches_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_dispatches" ADD CONSTRAINT "partner_dispatches_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_payload_snapshots" ADD CONSTRAINT "lead_payload_snapshots_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
