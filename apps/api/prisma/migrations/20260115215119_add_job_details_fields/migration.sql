-- AlterTable - Add columns that don't exist
DO $$
BEGIN
    -- City
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_opportunities' AND column_name='city') THEN
        ALTER TABLE "job_opportunities" ADD COLUMN "city" TEXT;
    END IF;

    -- State
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_opportunities' AND column_name='state') THEN
        ALTER TABLE "job_opportunities" ADD COLUMN "state" TEXT;
    END IF;

    -- Latitude
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_opportunities' AND column_name='latitude') THEN
        ALTER TABLE "job_opportunities" ADD COLUMN "latitude" DOUBLE PRECISION;
    END IF;

    -- Longitude
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_opportunities' AND column_name='longitude') THEN
        ALTER TABLE "job_opportunities" ADD COLUMN "longitude" DOUBLE PRECISION;
    END IF;

    -- Compensation
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_opportunities' AND column_name='compensation') THEN
        ALTER TABLE "job_opportunities" ADD COLUMN "compensation" TEXT;
    END IF;

    -- Raw Description HTML
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_opportunities' AND column_name='rawDescriptionHtml') THEN
        ALTER TABLE "job_opportunities" ADD COLUMN "rawDescriptionHtml" TEXT;
    END IF;

    -- Employer Name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_opportunities' AND column_name='employerName') THEN
        ALTER TABLE "job_opportunities" ADD COLUMN "employerName" TEXT;
    END IF;

    -- Employer Company Page URL
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_opportunities' AND column_name='employerCompanyPageUrl') THEN
        ALTER TABLE "job_opportunities" ADD COLUMN "employerCompanyPageUrl" TEXT;
    END IF;

    -- Job Types
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_opportunities' AND column_name='jobTypes') THEN
        ALTER TABLE "job_opportunities" ADD COLUMN "jobTypes" JSONB;
    END IF;

    -- Qualifications
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_opportunities' AND column_name='qualifications') THEN
        ALTER TABLE "job_opportunities" ADD COLUMN "qualifications" JSONB;
    END IF;

    -- Requirements
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_opportunities' AND column_name='requirements') THEN
        ALTER TABLE "job_opportunities" ADD COLUMN "requirements" JSONB;
    END IF;

    -- Date Published
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_opportunities' AND column_name='datePublished') THEN
        ALTER TABLE "job_opportunities" ADD COLUMN "datePublished" TIMESTAMP(3);
    END IF;

    -- Date On Indeed
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_opportunities' AND column_name='dateOnIndeed') THEN
        ALTER TABLE "job_opportunities" ADD COLUMN "dateOnIndeed" TIMESTAMP(3);
    END IF;

    -- Is Expired
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_opportunities' AND column_name='isExpired') THEN
        ALTER TABLE "job_opportunities" ADD COLUMN "isExpired" BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

-- CreateIndex - Only if they don't exist
CREATE INDEX IF NOT EXISTS "job_opportunities_isExpired_idx" ON "job_opportunities"("isExpired");
CREATE INDEX IF NOT EXISTS "job_opportunities_datePublished_idx" ON "job_opportunities"("datePublished");
CREATE INDEX IF NOT EXISTS "job_opportunities_city_idx" ON "job_opportunities"("city");
CREATE INDEX IF NOT EXISTS "job_opportunities_state_idx" ON "job_opportunities"("state");
