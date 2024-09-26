-- AlterTable
ALTER TABLE "IntuitionPackContent" ADD COLUMN     "movie" TEXT;

-- CreateTable
CREATE TABLE "IntuitionResult" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "pack_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntuitionResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IntuitionResult" ADD CONSTRAINT "IntuitionResult_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntuitionResult" ADD CONSTRAINT "IntuitionResult_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "IntuitionPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
