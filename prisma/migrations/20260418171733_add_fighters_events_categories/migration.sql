-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fighter" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "photoKey" TEXT,
    "photoUrl" TEXT,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "winsKo" INTEGER NOT NULL DEFAULT 0,
    "lossesKo" INTEGER NOT NULL DEFAULT 0,
    "rounds" INTEGER NOT NULL DEFAULT 0,
    "debut" TIMESTAMP(3),
    "birthDate" TIMESTAMP(3),
    "cedula" TEXT,
    "nationality" TEXT,
    "residence" TEXT,
    "club" TEXT,
    "categoryId" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fighter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "venue" TEXT,
    "city" TEXT,
    "country" TEXT DEFAULT 'Colombia',
    "posterKey" TEXT,
    "posterUrl" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventFighter" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "fighterId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventFighter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Fighter_slug_key" ON "Fighter"("slug");

-- CreateIndex
CREATE INDEX "Fighter_categoryId_idx" ON "Fighter"("categoryId");

-- CreateIndex
CREATE INDEX "Fighter_status_idx" ON "Fighter"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Event_date_idx" ON "Event"("date");

-- CreateIndex
CREATE INDEX "EventFighter_eventId_idx" ON "EventFighter"("eventId");

-- CreateIndex
CREATE INDEX "EventFighter_fighterId_idx" ON "EventFighter"("fighterId");

-- CreateIndex
CREATE UNIQUE INDEX "EventFighter_eventId_fighterId_key" ON "EventFighter"("eventId", "fighterId");

-- AddForeignKey
ALTER TABLE "Fighter" ADD CONSTRAINT "Fighter_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventFighter" ADD CONSTRAINT "EventFighter_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventFighter" ADD CONSTRAINT "EventFighter_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "Fighter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
