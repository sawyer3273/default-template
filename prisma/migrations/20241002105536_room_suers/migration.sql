/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "RoomUsers" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "RoomUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_token_key" ON "Room"("token");

-- AddForeignKey
ALTER TABLE "RoomUsers" ADD CONSTRAINT "RoomUsers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
