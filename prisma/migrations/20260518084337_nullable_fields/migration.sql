-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "part" TEXT,
    "firstTime" TEXT,
    "secondTime" TEXT,
    "thirdTime" TEXT
);
INSERT INTO "new_User" ("firstTime", "id", "part", "secondTime", "thirdTime") SELECT "firstTime", "id", "part", "secondTime", "thirdTime" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
