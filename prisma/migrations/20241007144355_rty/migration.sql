/*
  Warnings:

  - Added the required column `room_id` to the `QuizPackAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuizPackAnswer" ADD COLUMN     "room_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "QuizPackAnswer" ADD CONSTRAINT "QuizPackAnswer_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
