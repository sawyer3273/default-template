/*
  Warnings:

  - You are about to drop the column `log` on the `QuizResult` table. All the data in the column will be lost.
  - You are about to drop the column `pack_id` on the `QuizResult` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `QuizResult` table. All the data in the column will be lost.
  - You are about to drop the column `room_id` on the `QuizResult` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `QuizResult` table. All the data in the column will be lost.
  - Added the required column `data_id` to the `QuizResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastNegative` to the `QuizResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastPositive` to the `QuizResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `negative` to the `QuizResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positive` to the `QuizResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `QuizResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuizResult" DROP CONSTRAINT "QuizResult_pack_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizResult" DROP CONSTRAINT "QuizResult_room_id_fkey";

-- AlterTable
ALTER TABLE "QuizResult" DROP COLUMN "log",
DROP COLUMN "pack_id",
DROP COLUMN "points",
DROP COLUMN "room_id",
DROP COLUMN "time",
ADD COLUMN     "data_id" INTEGER NOT NULL,
ADD COLUMN     "lastNegative" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lastPositive" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "negative" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "positive" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_data_id_fkey" FOREIGN KEY ("data_id") REFERENCES "Library"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
