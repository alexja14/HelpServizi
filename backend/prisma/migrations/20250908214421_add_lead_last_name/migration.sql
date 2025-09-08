-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lead" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "cafFlag" BOOLEAN NOT NULL,
    "unemployed" BOOLEAN NOT NULL,
    "consent" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Lead" ("cafFlag", "consent", "createdAt", "email", "id", "name", "phone", "unemployed") SELECT "cafFlag", "consent", "createdAt", "email", "id", "name", "phone", "unemployed" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
