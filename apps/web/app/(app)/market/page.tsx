"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WifiOff } from "lucide-react";
import { CandlestickData, Time } from "lightweight-charts";
import { useMarketPrice } from "@/hooks/useMarketPrice";
import { useSocket } from "@/hooks/useSocket";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_MARKET_SERVICE_URL}/api/market/history?symbol=${selectedSymbol}&interval=1day&outputsize=90`,
        );
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const json = await res.json();
        const values = json?.data?.values;
        if (!Array.isArray(values)) throw new Error("No data returned");

        const bars: CandlestickData<Time>[] = values
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
        setChartData([]);
        setError(
          "We couldn't load the chart right now. Please check your connection and try again in a moment.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandles();
  }, [selectedSymbol]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Market</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Live prices and candlestick charts for your watchlist.
          </p>
        </div>
        <Badge
          className={`border ${
            isConnected
              ? "bg-success-soft text-success border-success"
              : "bg-danger-soft text-danger border-danger"
          }`}
        >
          {isConnected ? "● Live" : "● Disconnected"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
      ) : chartData.length === 0 ? (
        <Card className="h-120 items-center justify-center text-center">
          <CardContent className="flex flex-col items-center gap-2">
            <WifiOff className="size-7 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              No chart data for {selectedSymbol}
            </p>
            <p className="max-w-sm text-xs text-muted-foreground">
              {error ??
                "There's no price history to show for this symbol right now."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <CandlestickChart data={chartData} symbol={selectedSymbol} />
      )}
    </div>
  );
}
