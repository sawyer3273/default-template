/*
  Warnings:

  - You are about to drop the column `comparisonType` on the `QuizPackRound` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuizPackRound" DROP COLUMN "comparisonType",
ADD COLUMN     "isComparisonImage" BOOLEAN;
