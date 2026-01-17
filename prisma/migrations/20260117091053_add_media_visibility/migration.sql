-- AlterTable
ALTER TABLE "MemoryMedia" ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "MemoryMedia_isVisible_idx" ON "MemoryMedia"("isVisible");
