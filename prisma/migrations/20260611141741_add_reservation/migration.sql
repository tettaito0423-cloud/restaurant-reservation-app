-- CreateTable
CREATE TABLE "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roomNumber" INTEGER NOT NULL,
    "guestCount" INTEGER NOT NULL,
    "dinnerSlotId" INTEGER NOT NULL,
    CONSTRAINT "Reservation_dinnerSlotId_fkey" FOREIGN KEY ("dinnerSlotId") REFERENCES "DinnerSlot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
