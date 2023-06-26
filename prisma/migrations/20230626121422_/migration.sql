/*
  Warnings:

  - Made the column `serialNumber` on table `Printer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Printer" ALTER COLUMN "serialNumber" SET NOT NULL;
