-- CreateTable
CREATE TABLE "QuizPackAnswer" (
    "id" SERIAL NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "textAnswer" TEXT,
    "user_id" INTEGER NOT NULL,
    "answer_id" INTEGER,
    "pack_id" INTEGER NOT NULL,

    CONSTRAINT "QuizPackAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizPackAnswer" ADD CONSTRAINT "QuizPackAnswer_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "Library"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizPackAnswer" ADD CONSTRAINT "QuizPackAnswer_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "QuizPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizPackAnswer" ADD CONSTRAINT "QuizPackAnswer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
