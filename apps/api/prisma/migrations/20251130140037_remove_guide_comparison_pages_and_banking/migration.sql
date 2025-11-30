/*
  Warnings:

  - You are about to drop the `comparison_pages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `guide_pages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "comparison_pages" DROP CONSTRAINT "comparison_pages_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "guide_pages" DROP CONSTRAINT "guide_pages_categoryId_fkey";

-- DropTable
DROP TABLE "comparison_pages";

-- DropTable
DROP TABLE "guide_pages";
