/*
  Warnings:

  - Added the required column `socket_id` to the `RoomUsers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RoomUsers" ADD COLUMN     "socket_id" INTEGER NOT NULL;
