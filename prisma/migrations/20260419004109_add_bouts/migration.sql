-- CreateTable
CREATE TABLE "Bout" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "fighter1Id" TEXT NOT NULL,
    "fighter2Id" TEXT NOT NULL,
    "categoryId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isMainEvent" BOOLEAN NOT NULL DEFAULT false,
    "scheduledRounds" INTEGER NOT NULL DEFAULT 3,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Bout_eventId_idx" ON "Bout"("eventId");

-- CreateIndex
CREATE INDEX "Bout_fighter1Id_idx" ON "Bout"("fighter1Id");

-- CreateIndex
CREATE INDEX "Bout_fighter2Id_idx" ON "Bout"("fighter2Id");

-- AddForeignKey
ALTER TABLE "Bout" ADD CONSTRAINT "Bout_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bout" ADD CONSTRAINT "Bout_fighter1Id_fkey" FOREIGN KEY ("fighter1Id") REFERENCES "Fighter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bout" ADD CONSTRAINT "Bout_fighter2Id_fkey" FOREIGN KEY ("fighter2Id") REFERENCES "Fighter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bout" ADD CONSTRAINT "Bout_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
