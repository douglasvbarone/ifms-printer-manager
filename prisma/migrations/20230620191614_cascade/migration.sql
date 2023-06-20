-- DropForeignKey
ALTER TABLE "PrinterStatus" DROP CONSTRAINT "PrinterStatus_printerId_fkey";

-- AddForeignKey
ALTER TABLE "PrinterStatus" ADD CONSTRAINT "PrinterStatus_printerId_fkey" FOREIGN KEY ("printerId") REFERENCES "Printer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
