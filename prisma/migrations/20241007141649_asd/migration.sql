/*
  Warnings:

  - You are about to drop the column `timeStarted` on the `QuizPackRound` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuizPackRound" DROP COLUMN "timeStarted";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "timeStarted" INTEGER;
