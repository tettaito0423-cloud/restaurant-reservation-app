/*
  Warnings:

  - You are about to drop the column `startAt` on the `DinnerSlot` table. All the data in the column will be lost.
  - You are about to drop the column `arrivalStatus` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `dinnerSlotId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `guestCount` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `dinnerStartAt` to the `DinnerSlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkin` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkout` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "BreakfastSlot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "breakfastStartAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Stay" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reservationId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    CONSTRAINT "Stay_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dinner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stayId" INTEGER NOT NULL,
    "courseType" TEXT,
    "dinnerSlotId" INTEGER,
    CONSTRAINT "Dinner_stayId_fkey" FOREIGN KEY ("stayId") REFERENCES "Stay" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Dinner_dinnerSlotId_fkey" FOREIGN KEY ("dinnerSlotId") REFERENCES "DinnerSlot" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Breakfast" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stayId" INTEGER NOT NULL,
    "breakfastSlotId" INTEGER NOT NULL,
    CONSTRAINT "Breakfast_stayId_fkey" FOREIGN KEY ("stayId") REFERENCES "Stay" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Breakfast_breakfastSlotId_fkey" FOREIGN KEY ("breakfastSlotId") REFERENCES "BreakfastSlot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DinnerSlot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dinnerStartAt" DATETIME NOT NULL
);
INSERT INTO "new_DinnerSlot" ("id") SELECT "id" FROM "DinnerSlot";
DROP TABLE "DinnerSlot";
ALTER TABLE "new_DinnerSlot" RENAME TO "DinnerSlot";
CREATE TABLE "new_Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roomNumber" TEXT NOT NULL,
    "adultCount" INTEGER NOT NULL DEFAULT 0,
    "childMealCount" INTEGER DEFAULT 0,
    "childNoMealCount" INTEGER DEFAULT 0,
    "checkin" DATETIME NOT NULL,
    "checkout" DATETIME NOT NULL,
    "dietaryRestrictions" TEXT,
    "comment" TEXT
);
INSERT INTO "new_Reservation" ("id", "roomNumber") SELECT "id", "roomNumber" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Dinner_stayId_key" ON "Dinner"("stayId");

-- CreateIndex
CREATE UNIQUE INDEX "Breakfast_stayId_key" ON "Breakfast"("stayId");
