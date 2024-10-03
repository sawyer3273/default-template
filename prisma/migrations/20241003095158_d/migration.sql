-- AlterTable
ALTER TABLE "QuizPackRound" ADD COLUMN     "libraryType" TEXT NOT NULL DEFAULT 'movie',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'text';
