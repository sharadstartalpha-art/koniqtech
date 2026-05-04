/* =========================
   CREATE ENUMS
========================= */
CREATE TYPE "ReminderMode" AS ENUM ('manual', 'auto');
CREATE TYPE "ReminderType" AS ENUM ('friendly', 'firm', 'final');


/* =========================
   ADD NEW COLUMNS (SAFE)
========================= */
ALTER TABLE "Reminder"
ADD COLUMN "mode" "ReminderMode" NOT NULL DEFAULT 'manual',
ADD COLUMN "scheduleId" TEXT,
ADD COLUMN "templateId" TEXT,
ADD COLUMN "userId" TEXT NOT NULL DEFAULT 'unknown';


/* =========================
   SAFE TYPE MIGRATION
========================= */

-- 1. Add temp column
ALTER TABLE "Reminder"
ADD COLUMN "type_new" "ReminderType";

-- 2. Copy existing data safely
UPDATE "Reminder"
SET "type_new" = LOWER("type")::"ReminderType";

-- 3. Remove old column
ALTER TABLE "Reminder"
DROP COLUMN "type";

-- 4. Rename new column
ALTER TABLE "Reminder"
RENAME COLUMN "type_new" TO "type";

-- 5. Make required
ALTER TABLE "Reminder"
ALTER COLUMN "type" SET NOT NULL;


/* =========================
   CREATE TEMPLATE TABLE
========================= */
CREATE TABLE "ReminderTemplate" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "html" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ReminderTemplate_pkey" PRIMARY KEY ("id")
);


/* =========================
   CREATE SCHEDULE TABLE
========================= */
CREATE TABLE "ReminderSchedule" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "daysAfter" INTEGER NOT NULL,
  "templateId" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ReminderSchedule_pkey" PRIMARY KEY ("id")
);