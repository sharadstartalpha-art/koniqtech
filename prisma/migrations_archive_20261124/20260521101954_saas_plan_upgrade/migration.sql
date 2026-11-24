-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'super_admin';

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL DEFAULT 199,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "interval" TEXT NOT NULL DEFAULT 'month';
