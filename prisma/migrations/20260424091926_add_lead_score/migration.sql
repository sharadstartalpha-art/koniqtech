-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "isContactable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "score" INTEGER DEFAULT 0;
