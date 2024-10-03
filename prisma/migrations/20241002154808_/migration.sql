/*
  Warnings:

  - You are about to drop the column `active` on the `RoomUsers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RoomUsers" DROP COLUMN "active",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
