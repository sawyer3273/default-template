-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_token_type_key" ON "Room"("token", "type");
