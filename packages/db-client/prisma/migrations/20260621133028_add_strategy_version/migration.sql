-- CreateTable
CREATE TABLE "StrategyVersion" (
    "id" UUID NOT NULL,
    "strategyId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StrategyVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ohlcv" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMPTZ(3) NOT NULL,
    "symbol" TEXT NOT NULL,
    "timeframe" TEXT NOT NULL,
    "open" DOUBLE PRECISION NOT NULL,
    "high" DOUBLE PRECISION NOT NULL,
    "low" DOUBLE PRECISION NOT NULL,
    "close" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION,

    CONSTRAINT "Ohlcv_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Ohlcv_symbol_timeframe_time_idx" ON "Ohlcv"("symbol", "timeframe", "time");

-- AddForeignKey
ALTER TABLE "StrategyVersion" ADD CONSTRAINT "StrategyVersion_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
