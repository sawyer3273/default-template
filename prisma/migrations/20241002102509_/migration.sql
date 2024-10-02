/*
  Warnings:

  - A unique constraint covering the columns `[entity_id,type]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entity_id` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Room_token_type_key";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "entity_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_entity_id_type_key" ON "Room"("entity_id", "type");
