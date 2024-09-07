/*
  Warnings:

  - You are about to drop the `CastData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Movies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Persons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Words` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CastData" DROP CONSTRAINT "CastData_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "CastData" DROP CONSTRAINT "CastData_person_id_fkey";

-- DropForeignKey
ALTER TABLE "Words" DROP CONSTRAINT "Words_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "Words" DROP CONSTRAINT "Words_person_id_fkey";

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "country" TEXT;

-- DropTable
DROP TABLE "CastData";

-- DropTable
DROP TABLE "Movies";

-- DropTable
DROP TABLE "Persons";

-- DropTable
DROP TABLE "Words";
