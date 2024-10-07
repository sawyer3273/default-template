/*
  Warnings:

  - You are about to drop the column `answer` on the `QuizResult` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `QuizResult` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `QuizResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuizResult" DROP COLUMN "answer",
DROP COLUMN "question",
DROP COLUMN "type";
