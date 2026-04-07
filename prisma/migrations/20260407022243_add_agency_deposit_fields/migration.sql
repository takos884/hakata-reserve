-- AlterTable
ALTER TABLE "AgencyInquiry" ADD COLUMN     "depositAmount" INTEGER,
ADD COLUMN     "depositPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripePaymentIntentId" TEXT;
