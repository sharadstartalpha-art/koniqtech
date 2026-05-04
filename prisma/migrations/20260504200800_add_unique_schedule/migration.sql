/*
  Warnings:

  - A unique constraint covering the columns `[userId,type]` on the table `ReminderSchedule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ReminderSchedule_userId_type_key" ON "ReminderSchedule"("userId", "type");
