/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `Printer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Printer" ADD COLUMN     "serialNumber" TEXT;

-- CreateTable
CREATE TABLE "PrinterStatus" (
    "id" SERIAL NOT NULL,
    "tonerBlackLevel" INTEGER NOT NULL,
    "tonerCyanLevel" INTEGER,
    "tonerMagentaLevel" INTEGER,
    "tonerYellowLevel" INTEGER,
    "counter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "printerId" INTEGER NOT NULL,

    CONSTRAINT "PrinterStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Printer_serialNumber_key" ON "Printer"("serialNumber");

-- AddForeignKey
ALTER TABLE "PrinterStatus" ADD CONSTRAINT "PrinterStatus_printerId_fkey" FOREIGN KEY ("printerId") REFERENCES "Printer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
