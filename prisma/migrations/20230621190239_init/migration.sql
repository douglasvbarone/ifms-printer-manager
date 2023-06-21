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
    "campus" TEXT,
    "roles" "Role"[] DEFAULT ARRAY['USER']::"Role"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Printer" (
    "id" SERIAL NOT NULL,
    "friendlyName" TEXT,
    "location" TEXT,
    "serialNumber" TEXT,
    "ip" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "blackTonerModel" TEXT,
    "cyanTonerModel" TEXT,
    "magentaTonerModel" TEXT,
    "yellowTonerModel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "networkId" INTEGER NOT NULL,

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
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "printerId" INTEGER NOT NULL,

    CONSTRAINT "PrinterStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Network" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "cidr" TEXT NOT NULL,

    CONSTRAINT "Network_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Printer_serialNumber_key" ON "Printer"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Printer_ip_key" ON "Printer"("ip");

-- CreateIndex
CREATE INDEX "PrinterStatus_timestamp_idx" ON "PrinterStatus"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Network_name_key" ON "Network"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Network_shortName_key" ON "Network"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "Network_cidr_key" ON "Network"("cidr");

-- CreateIndex
CREATE INDEX "Network_id_idx" ON "Network"("id");

-- AddForeignKey
ALTER TABLE "Printer" ADD CONSTRAINT "Printer_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrinterStatus" ADD CONSTRAINT "PrinterStatus_printerId_fkey" FOREIGN KEY ("printerId") REFERENCES "Printer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
