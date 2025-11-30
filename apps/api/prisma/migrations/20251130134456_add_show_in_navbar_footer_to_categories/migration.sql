-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "showInFooter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showInNavbar" BOOLEAN NOT NULL DEFAULT false;
