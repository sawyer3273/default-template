/*
  Warnings:

  - You are about to drop the column `library_id` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `library_id` on the `Person` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_library_id_fkey";

-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_library_id_fkey";

-- DropIndex
DROP INDEX "Movie_library_id_key";

-- DropIndex
DROP INDEX "Person_library_id_key";

-- AlterTable
ALTER TABLE "Library" ADD COLUMN     "movie_id" INTEGER,
ADD COLUMN     "person_id" INTEGER;

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "library_id";

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "library_id";

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
