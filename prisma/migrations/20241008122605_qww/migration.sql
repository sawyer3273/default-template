-- AlterTable
ALTER TABLE "RoomUsers" ADD COLUMN     "pack_id" INTEGER;

-- AddForeignKey
ALTER TABLE "RoomUsers" ADD CONSTRAINT "RoomUsers_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "QuizPack"("id") ON DELETE SET NULL ON UPDATE CASCADE;
