/*
  Warnings:

  - You are about to drop the column `actror_id` on the `IntuitionPackContent` table. All the data in the column will be lost.
  - Added the required column `actor_id` to the `IntuitionPackContent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IntuitionPackContent" DROP CONSTRAINT "IntuitionPackContent_actror_id_fkey";

-- AlterTable
ALTER TABLE "IntuitionPackContent" DROP COLUMN "actror_id",
ADD COLUMN     "actorName" TEXT,
ADD COLUMN     "actor_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "IntuitionPackContent" ADD CONSTRAINT "IntuitionPackContent_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
