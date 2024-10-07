/*
  Warnings:

  - Added the required column `number` to the `QuizPackAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuizPackAnswer" ADD COLUMN     "number" INTEGER NOT NULL,
ALTER COLUMN "score" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "QuizPackRound" ALTER COLUMN "score" SET DATA TYPE DOUBLE PRECISION;
