-- CreateTable
CREATE TABLE "QuizPack" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "enable" BOOLEAN DEFAULT true,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizPackRound" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "text" TEXT,
    "image" TEXT,
    "audio" TEXT,
    "video" TEXT,
    "answer_id" INTEGER,
    "pack_id" INTEGER NOT NULL,

    CONSTRAINT "QuizPackRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizResult" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "log" TEXT,
    "time" INTEGER,
    "user_id" INTEGER NOT NULL,
    "pack_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizPack" ADD CONSTRAINT "QuizPack_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizPackRound" ADD CONSTRAINT "QuizPackRound_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "Library"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizPackRound" ADD CONSTRAINT "QuizPackRound_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "QuizPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "QuizPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
