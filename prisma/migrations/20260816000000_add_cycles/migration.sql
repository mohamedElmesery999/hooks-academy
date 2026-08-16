-- CreateEnum
CREATE TYPE "CycleStatus" AS ENUM ('open', 'closed');

-- CreateTable
CREATE TABLE "cycles" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "status" "CycleStatus" NOT NULL DEFAULT 'open',
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cycles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cycles_number_key" ON "cycles"("number");

-- Seed first cycle and attach existing students
INSERT INTO "cycles" ("id", "number", "name", "status", "openedAt", "createdAt", "updatedAt")
VALUES ('00000000-0000-4000-8000-000000000001', 1, 'الدورة 1', 'open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- AlterTable
ALTER TABLE "students" ADD COLUMN "cycleId" TEXT;

UPDATE "students"
SET "cycleId" = (SELECT "id" FROM "cycles" WHERE "number" = 1 LIMIT 1);

ALTER TABLE "students" ALTER COLUMN "cycleId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "cycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
