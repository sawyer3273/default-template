/*
  Warnings:

  - Added the required column `name` to the `Slides` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Slides" ADD COLUMN     "name" TEXT NOT NULL;
