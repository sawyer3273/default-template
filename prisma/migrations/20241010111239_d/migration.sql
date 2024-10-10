-- CreateTable
CREATE TABLE "PersonImage" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "person_id" INTEGER NOT NULL,

    CONSTRAINT "PersonImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PersonImage" ADD CONSTRAINT "PersonImage_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
