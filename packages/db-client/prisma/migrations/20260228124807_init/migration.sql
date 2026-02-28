-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'paused', 'archived');

-- CreateEnum
CREATE TYPE "BacktestResultStatus" AS ENUM ('pending', 'running', 'completed', 'failed');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "full_name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Strategy" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "asset_symbol" TEXT NOT NULL,
    "timeframe" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'active',
    "version" INTEGER NOT NULL DEFAULT 1,
    "user_id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Strategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BacktestResult" (
    "id" UUID NOT NULL,
    "job_id" TEXT NOT NULL,
    "strategy_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "BacktestResultStatus" NOT NULL DEFAULT 'pending',
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "initial_capital" DECIMAL(15,2) NOT NULL,
    "final_capital" DECIMAL(15,2),
    "total_return_pct" DECIMAL(10,4),
    "max_drawdown_pct" DECIMAL(10,4),
    "win_rate" DECIMAL(5,2),
    "sharpe_ratio" DECIMAL(8,4),
    "total_trades" INTEGER,
    "ai_analysis" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BacktestResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Strategy" ADD CONSTRAINT "Strategy_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BacktestResult" ADD CONSTRAINT "BacktestResult_strategy_id_fkey" FOREIGN KEY ("strategy_id") REFERENCES "Strategy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BacktestResult" ADD CONSTRAINT "BacktestResult_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
