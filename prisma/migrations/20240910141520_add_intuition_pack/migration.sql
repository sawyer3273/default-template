-- CreateTable
CREATE TABLE "IntuitionPack" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntuitionPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntuitionPackContent" (
    "id" SERIAL NOT NULL,
    "avatar" TEXT,
    "actror_id" INTEGER NOT NULL,
    "pack_id" INTEGER NOT NULL,

    CONSTRAINT "IntuitionPackContent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IntuitionPack" ADD CONSTRAINT "IntuitionPack_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntuitionPackContent" ADD CONSTRAINT "IntuitionPackContent_actror_id_fkey" FOREIGN KEY ("actror_id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntuitionPackContent" ADD CONSTRAINT "IntuitionPackContent_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "IntuitionPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
