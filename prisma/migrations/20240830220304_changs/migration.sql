/*
  Warnings:

  - You are about to drop the column `accessToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'SUBUSER';
ALTER TYPE "Role" ADD VALUE 'MASTER';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accessToken",
DROP COLUMN "refreshToken";

-- CreateTable
CREATE TABLE "userAuthTokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "ua" TEXT,
    "fingerprint" TEXT,
    "ip" TEXT,
    "expiresIn" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userAuthTokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userAuthTokens" ADD CONSTRAINT "userAuthTokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
