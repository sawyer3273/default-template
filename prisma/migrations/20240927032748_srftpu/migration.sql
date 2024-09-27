/*
  Warnings:

  - You are about to drop the column `movie_id` on the `CastPack` table. All the data in the column will be lost.
  - Added the required column `movie_id` to the `CastPackContent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CastPack" DROP CONSTRAINT "CastPack_movie_id_fkey";

-- AlterTable
ALTER TABLE "CastPack" DROP COLUMN "movie_id",
ADD COLUMN     "movieId" INTEGER;

-- AlterTable
ALTER TABLE "CastPackContent" ADD COLUMN     "movie_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "CastPack" ADD CONSTRAINT "CastPack_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CastPackContent" ADD CONSTRAINT "CastPackContent_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
