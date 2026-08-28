/*
  Warnings:

  - You are about to drop the column `time` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstTime` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondTime` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thirdTime` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "part" TEXT NOT NULL,
    "firstTime" TEXT NOT NULL,
    "secondTime" TEXT NOT NULL,
    "thirdTime" TEXT NOT NULL
);
INSERT INTO "new_User" ("id", "part") SELECT "id", "part" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
