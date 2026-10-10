"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "../../components/ui/searchbar";
import StrategyFilter from "@/components/strategy/StrategyFilter";
import { Badge } from "@/components/ui/badge";
import { ArchiveRestore, Copy, Pen, RotateCcw } from "lucide-react";
import { useState } from "react";
import { StrategyForm, type StrategyInput } from "@/components/strategy/StrategyForm";
import { createStrategy } from "@/services/strategy.service";
import { ThemeToggle } from "@/components/theme-toggle";

const MOCK_STRATEGIES = [
  {
    id: "1",
    name: "MA Crossover",
    asset: "AAPL",
    timeframe: "1h",
    status: "active",
    version: "v3",
    updatedAt: "2 hours ago",
    description:
      "Buy when fast SMA crosses above slow SMA, sell on cross below.",
  },
  {
    id: "2",
    name: "RSI Overbought/Oversold",
    asset: "BTC/USD",
    timeframe: "1h",
    status: "active",
    version: "v5",
    updatedAt: "Yesterday",
    description:
      "Buy when RSI drops below 30 (oversold), sell when it rises above 70.",
  },
  {
    id: "3",
    name: "Bollinger Band Bounce",
    asset: "AAPL",
    timeframe: "1h",
    status: "active",
    version: "v1",
    updatedAt: "Just now",
    description: "Buy at lower band (mean reversion), sell at upper band.",
  },
  {
    id: "4",
    name: "MACD Signal Cross",
    asset: "ETH/USD",
    timeframe: "4h",
    status: "paused",
    version: "v2",
    updatedAt: "4 days ago",
    description:
      "Buy on MACD line crossing above signal line, sell on cross below.",
  },
  {
    id: "5",
    name: "MA Crossover",
    asset: "MSFT",
    timeframe: "1D",
    status: "paused",
    version: "v4",
    updatedAt: "1 week ago",
    description: "Cloned from the AAPL crossover, retuned for daily candles.",
  },
  {
    id: "6",
    name: "RSI Overbought/Oversold",
    asset: "GOOGL",
    timeframe: "15m",
    status: "archived",
    version: "v1",
    updatedAt: "Just Now",
    description:
      "Buy when RSI drops below 30 (oversold), sell when it rises above 70.",
  },
];

const Strategy = () => {
  const [displayAddNewstrategy, setDisplayAddNewstrategy] =
    useState<boolean>(false);

  const handleCreateStrategy = async () => {
    try {
      const a: number = 10;
    } catch {
      console.log("");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-background space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Strategies</h1>
        <div className="flex flex-row items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer border border-dashed border-border text-muted-foreground/70 hover:text-muted-foreground"
          >
            preview: empty state
          </Button>
          <Button
            variant="default"
            size="lg"
            className="cursor-pointer"
            onClick={() => setDisplayAddNewstrategy((prev) => !prev)}
          >
            + New strategy
          </Button>
          <ThemeToggle />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="cursor-pointer transition-all border bg-card border-border">
          <CardContent>
            <p className="text-xs font-medium mb-1 text-muted-foreground">Total</p>
            <p className="text-xl font-semibold text-foreground">6</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-all border bg-card border-border">
          <CardContent>
            <p className="text-xs font-medium mb-1 text-muted-foreground">Active</p>
            <p className="text-xl font-semibold text-success">3</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-all border bg-card border-border">
          <CardContent>
            <p className="text-xs font-medium mb-1 text-muted-foreground">Paused</p>
            <p className="text-xl font-semibold text-warning">2</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-all border bg-card border-border">
          <CardContent>
            <p className="text-xs font-medium mb-1 text-muted-foreground">Archived</p>
            <p className="text-xl font-semibold text-muted-foreground">1</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-row w-full items-center justify-between gap-4">
        <SearchBar />
        <StrategyFilter />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {MOCK_STRATEGIES.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer transition-all border bg-card border-border min-h-64"
          >
            <CardContent className="flex flex-col h-full  justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center justify-between">
                  <section>
                    <p className="text-md font-semibold text-foreground">
                      {item.name}
                    </p>
                  </section>
                  <section
                    className={`border text-xs font-medium mb-1 px-1.5 py-1 ${
                      item.status === "active"
                        ? "text-success bg-success-soft border-success-border"
                        : item.status === "paused"
                          ? "text-warning bg-warning-soft border-warning-border"
                          : "text-muted-foreground bg-muted border-border"
                    }`}
                  >
                    {item.status}
                  </section>
                </div>
                <section className="flex flex-row gap-2">
                  <Badge
                    variant="outline"
                    className="border border-border bg-muted text-xs font-medium mb-1 text-muted-foreground px-1.5 py-1"
                  >
                    {item.asset}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border border-border bg-muted text-xs font-medium mb-1 text-muted-foreground px-1.5 py-1"
                  >
                    {item.timeframe}
                  </Badge>
                </section>
              </div>

              <span className="text-xs font-medium text-muted-foreground">
                {item.description}
              </span>
              <section className="flex flex-row  text-xs font-medium text-muted-foreground items-center justify-between w-full">
                <section className="flex flex-row items-center justify-center gap-2">
                  <p>{item.version}</p>
                  <p className="text-muted-foreground/60">{item.updatedAt}</p>
                </section>
                <section className="flex flex-row items-center justify-center gap-2 cursor-pointer">
                  <Pen size={16} />
                  <Copy size={16} />
                  <RotateCcw size={16} />
                  <ArchiveRestore size={16} />
                </section>
              </section>
            </CardContent>
          </Card>
        ))}
      </div>
      {displayAddNewstrategy && (
        <StrategyForm
          onSubmit={handleCreateStrategy}
          submitLabel="Create Strategy"
        />
      )}
    </div>
  );
};

export default Strategy;
