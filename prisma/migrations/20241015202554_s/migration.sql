-- CreateTable
CREATE TABLE "Slides" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Slides_pkey" PRIMARY KEY ("id")
);
