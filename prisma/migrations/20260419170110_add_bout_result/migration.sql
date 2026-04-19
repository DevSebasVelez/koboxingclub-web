-- CreateEnum
CREATE TYPE "BoutResult" AS ENUM ('PENDING', 'COMPLETED', 'NO_CONTEST', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EndMethod" AS ENUM ('KO', 'TKO', 'DECISION', 'SPLIT_DECISION', 'DRAW', 'DQ', 'NO_CONTEST');

-- AlterTable
ALTER TABLE "Bout" ADD COLUMN     "endMethod" "EndMethod",
ADD COLUMN     "endRound" INTEGER,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "resultStatus" "BoutResult" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "winnerFighterId" TEXT;
