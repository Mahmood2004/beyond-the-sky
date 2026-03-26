/*
  Warnings:

  - You are about to drop the column `references` on the `News` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "News" DROP COLUMN "references",
ADD COLUMN     "referenceURLs" TEXT[];
