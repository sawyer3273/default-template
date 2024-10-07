/*
  Warnings:

  - You are about to drop the column `answerType` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "answerType";

-- AlterTable
ALTER TABLE "RoomUsers" ADD COLUMN     "answerType" INTEGER NOT NULL DEFAULT 0;
