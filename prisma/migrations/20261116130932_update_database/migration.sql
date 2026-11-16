-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dinner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stayId" INTEGER NOT NULL,
    "courseType" TEXT,
    "dinnerSlotId" INTEGER,
    "isComfirmed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Dinner_stayId_fkey" FOREIGN KEY ("stayId") REFERENCES "Stay" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Dinner_dinnerSlotId_fkey" FOREIGN KEY ("dinnerSlotId") REFERENCES "DinnerSlot" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Dinner" ("courseType", "dinnerSlotId", "id", "stayId") SELECT "courseType", "dinnerSlotId", "id", "stayId" FROM "Dinner";
DROP TABLE "Dinner";
ALTER TABLE "new_Dinner" RENAME TO "Dinner";
CREATE UNIQUE INDEX "Dinner_stayId_key" ON "Dinner"("stayId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
