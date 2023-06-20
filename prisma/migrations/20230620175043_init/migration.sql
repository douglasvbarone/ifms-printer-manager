-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'INSPECTOR', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "mail" TEXT,
    "displayName" TEXT,
    "thumbnailPhoto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roles" "Role"[] DEFAULT ARRAY['USER']::"Role"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Printer" (
    "id" SERIAL NOT NULL,
    "friendlyName" TEXT,
    "location" TEXT,
    "serialNumber" TEXT,
    "hostname" TEXT,
    "ip" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "blackTonerModel" TEXT,
    "cyanTonerModel" TEXT,
    "magentaTonerModel" TEXT,
    "yellowTonerModel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Printer_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Printer_serialNumber_key" ON "Printer"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Printer_ip_key" ON "Printer"("ip");

-- AddForeignKey
ALTER TABLE "PrinterStatus" ADD CONSTRAINT "PrinterStatus_printerId_fkey" FOREIGN KEY ("printerId") REFERENCES "Printer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
