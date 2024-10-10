-- CreateTable
CREATE TABLE "MovieImage" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "movie_id" INTEGER NOT NULL,

    CONSTRAINT "MovieImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MovieImage" ADD CONSTRAINT "MovieImage_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
