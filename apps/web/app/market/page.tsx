"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CandlestickData, Time } from "lightweight-charts";
import { useMarketPrice } from "../hooks/useMarketPrice";
import { useSocket } from "../hooks/useSocket";

const CandlestickChart = dynamic(
  () =>
    import("../components/CandlestickChart").then(
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
    <main className="min-h-screen p-6" style={{ backgroundColor: "#0D1117" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "#E6EDF3" }}>
          TradeVision
        </h1>
        <Badge
          style={{
            backgroundColor: isConnected ? "#0D2818" : "#2D0A0A",
            color: isConnected ? "#10B981" : "#EF4444",
            border: `1px solid ${isConnected ? "#10B981" : "#EF4444"}`,
          }}
        >
          {isConnected ? "● Live" : "● Disconnected"}
        </Badge>
      </div>

      {/* Watchlist */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {WATCHLIST.map((sym) => {
          const p = prices[sym];
          const isUp = p ? p.change >= 0 : true;
          const isSelected = selectedSymbol === sym;

          return (
            <Card
              key={sym}
              onClick={() => setSelectedSymbol(sym)}
              className="cursor-pointer transition-all"
              style={{
                backgroundColor: isSelected ? "#2D1B69" : "#161B22",
                border: `1px solid ${isSelected ? "#7C3AED" : "#30363D"}`,
              }}
            >
              <CardContent className="p-4">
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: "#8B949E" }}
                >
                  {sym}
                </p>
                <p
                  className="text-xl font-semibold"
                  style={{ color: "#E6EDF3" }}
                >
                  {p ? `$${p.price.toFixed(2)}` : "---"}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: isUp ? "#10B981" : "#EF4444" }}
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

      {/* Chart */}
      {isLoading ? (
        <Skeleton
          className="w-full h-120 rounded-xl"
          style={{ backgroundColor: "#161B22" }}
        />
      ) : (
        <CandlestickChart data={chartData} symbol={selectedSymbol} />
      )}
    </main>
  );
}
