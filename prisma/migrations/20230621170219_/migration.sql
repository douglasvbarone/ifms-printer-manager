/*
  Warnings:

  - You are about to drop the column `hostname` on the `Printer` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `PrinterStatus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Printer" DROP COLUMN "hostname";

-- AlterTable
ALTER TABLE "PrinterStatus" DROP COLUMN "createdAt",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Network" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "cidr" TEXT NOT NULL,

    CONSTRAINT "Network_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Network_name_key" ON "Network"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Network_shortName_key" ON "Network"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "Network_cidr_key" ON "Network"("cidr");

-- CreateIndex
CREATE INDEX "Network_id_idx" ON "Network"("id");

-- CreateIndex
CREATE INDEX "PrinterStatus_timestamp_idx" ON "PrinterStatus"("timestamp");
