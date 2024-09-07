/*
  Warnings:

  - You are about to drop the column `lang` on the `Library` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Library" DROP COLUMN "lang",
ADD COLUMN     "additionalData" TEXT,
ADD COLUMN     "translation" TEXT;
