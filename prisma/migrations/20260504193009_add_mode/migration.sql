-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "mode" TEXT NOT NULL DEFAULT 'manual';

-- AlterTable
ALTER TABLE "Reminder" ALTER COLUMN "mode" DROP DEFAULT,
ALTER COLUMN "userId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "ReminderSchedule" ADD CONSTRAINT "ReminderSchedule_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ReminderTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
