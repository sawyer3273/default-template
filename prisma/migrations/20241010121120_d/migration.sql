/*
  Warnings:

  - You are about to drop the `MovieImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MovieImage" DROP CONSTRAINT "MovieImage_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "PersonImage" DROP CONSTRAINT "PersonImage_person_id_fkey";

-- DropTable
DROP TABLE "MovieImage";

-- DropTable
DROP TABLE "PersonImage";

-- CreateTable
CREATE TABLE "LibraryImage" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "library_id" INTEGER NOT NULL,

    CONSTRAINT "LibraryImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LibraryImage" ADD CONSTRAINT "LibraryImage_library_id_fkey" FOREIGN KEY ("library_id") REFERENCES "Library"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
