-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roomNumber" INTEGER NOT NULL,
    "guestCount" INTEGER NOT NULL,
    "dinnerSlotId" INTEGER NOT NULL,
    "arrivalStatus" TEXT NOT NULL DEFAULT 'WAITING',
    CONSTRAINT "Reservation_dinnerSlotId_fkey" FOREIGN KEY ("dinnerSlotId") REFERENCES "DinnerSlot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reservation" ("dinnerSlotId", "guestCount", "id", "roomNumber") SELECT "dinnerSlotId", "guestCount", "id", "roomNumber" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
