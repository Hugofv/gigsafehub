-- Update default value for isApproved to true
ALTER TABLE "comments" ALTER COLUMN "isApproved" SET DEFAULT true;

-- Update all existing comments to be approved
UPDATE "comments" SET "isApproved" = true WHERE "isApproved" = false;

