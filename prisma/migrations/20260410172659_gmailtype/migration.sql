-- AlterTable
ALTER TABLE "User" ADD COLUMN     "unsubscribed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "EmailThread" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailMessage" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EmailMessage" ADD CONSTRAINT "EmailMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "EmailThread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
