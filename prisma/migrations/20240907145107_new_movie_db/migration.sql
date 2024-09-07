-- CreateTable
CREATE TABLE "Movies" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "director" TEXT NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Persons" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CastData" (
    "id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "movie_id" INTEGER NOT NULL,

    CONSTRAINT "CastData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Words" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "translation" TEXT,
    "additionalData" TEXT,
    "person_id" INTEGER,
    "movie_id" INTEGER,

    CONSTRAINT "Words_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CastData" ADD CONSTRAINT "CastData_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CastData" ADD CONSTRAINT "CastData_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Words" ADD CONSTRAINT "Words_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Words" ADD CONSTRAINT "Words_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
