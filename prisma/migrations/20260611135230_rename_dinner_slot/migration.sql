/*
  Warnings:

  - You are about to drop the `dinnerSlot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "dinnerSlot";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "DinnerSlot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startAt" DATETIME NOT NULL
);
