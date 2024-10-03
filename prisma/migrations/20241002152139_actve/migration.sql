-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "RoomUsers" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false;
