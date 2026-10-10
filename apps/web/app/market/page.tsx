"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CandlestickData, Time } from "lightweight-charts";
import { useMarketPrice } from "@/hooks/useMarketPrice";
import { useSocket } from "@/hooks/useSocket";
import { ThemeToggle } from "@/components/theme-toggle";

const CandlestickChart = dynamic(
  () =>
    import("@/components/CandlestickChart").then(
      (mod) => mod.CandlestickChart,
    ),
  { ssr: false },
);

const WATCHLIST = ["AAPL", "MSFT", "GOOGL", "BTC/USD"];

export default function MarketPage() {
  const { isConnected } = useSocket();
  const { prices } = useMarketPrice(WATCHLIST);
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [chartData, setChartData] = useState<CandlestickData<Time>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCandles = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_MARKET_SERVICE_URL}/api/market/history?symbol=${selectedSymbol}&interval=1day&outputsize=90`,
        );
        const json = await res.json();

        const bars: CandlestickData<Time>[] = json.data.values
          .map((c: any) => ({
            time: Math.floor(new Date(c.datetime).getTime() / 1000) as Time,
            open: parseFloat(c.open),
            high: parseFloat(c.high),
            low: parseFloat(c.low),
            close: parseFloat(c.close),
          }))
          .reverse();

        setChartData(bars);
      } catch (err) {
        console.error("Failed to fetch candles:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandles();
  }, [selectedSymbol]);

  return (
    <main className="min-h-screen p-6 bg-background">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">TradeVision</h1>
        <div className="flex items-center gap-3">
          <Badge
            className={`border ${
              isConnected
                ? "bg-success-soft text-success border-success"
                : "bg-danger-soft text-danger border-danger"
            }`}
          >
            {isConnected ? "● Live" : "● Disconnected"}
          </Badge>
          <ThemeToggle />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {WATCHLIST.map((sym) => {
          const p = prices[sym];
          const isUp = p ? p.change >= 0 : true;
          const isSelected = selectedSymbol === sym;

          return (
            <Card
              key={sym}
              onClick={() => setSelectedSymbol(sym)}
              className={`cursor-pointer transition-all border ${
                isSelected
                  ? "bg-brand-soft border-brand"
                  : "bg-card border-border"
              }`}
            >
              <CardContent className="p-4">
                <p className="text-xs font-medium mb-1 text-muted-foreground">{sym}</p>
                <p className="text-xl font-semibold text-foreground">
                  {p ? `$${p.price.toFixed(2)}` : "---"}
                </p>
                <p
                  className={`text-xs mt-1 ${isUp ? "text-success" : "text-danger"}`}
                >
                  {p
                    ? `${isUp ? "▲" : "▼"} ${Math.abs(p.changePercent).toFixed(2)}%`
                    : ""}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isLoading ? (
        <Skeleton className="w-full h-120 rounded-xl bg-card" />
      ) : (
        <CandlestickChart data={chartData} symbol={selectedSymbol} />
      )}
    </main>
  );
}
