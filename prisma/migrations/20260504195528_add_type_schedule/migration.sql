/*
  Warnings:

  - Added the required column `type` to the `ReminderSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReminderSchedule" ADD COLUMN     "type" "ReminderType" NOT NULL;
