/*
  Warnings:

  - You are about to drop the column `value` on the `QuizResult` table. All the data in the column will be lost.
  - Added the required column `points` to the `QuizResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question` to the `QuizResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuizResult" DROP COLUMN "value",
ADD COLUMN     "answer" TEXT,
ADD COLUMN     "points" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "question" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'question';

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pack_id" INTEGER,
ADD COLUMN     "question" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "time" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "QuizPack"("id") ON DELETE SET NULL ON UPDATE CASCADE;
