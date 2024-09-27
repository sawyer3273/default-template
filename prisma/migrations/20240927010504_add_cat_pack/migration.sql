-- CreateTable
CREATE TABLE "CastPack" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "enable" BOOLEAN DEFAULT true,
    "user_id" INTEGER NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CastPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CastPackContent" (
    "id" SERIAL NOT NULL,
    "actor1" TEXT,
    "actor2" TEXT,
    "actor3" TEXT,
    "actor4" TEXT,
    "actor5" TEXT,
    "actor6" TEXT,
    "actor7" TEXT,
    "actor8" TEXT,
    "pack_id" INTEGER NOT NULL,

    CONSTRAINT "CastPackContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CastResult" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "log" TEXT,
    "time" INTEGER,
    "user_id" INTEGER NOT NULL,
    "pack_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CastResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CastPack" ADD CONSTRAINT "CastPack_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CastPack" ADD CONSTRAINT "CastPack_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CastPackContent" ADD CONSTRAINT "CastPackContent_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "CastPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CastResult" ADD CONSTRAINT "CastResult_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CastResult" ADD CONSTRAINT "CastResult_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "CastPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
