"use client";

import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  CandlestickSeries,
  Time,
} from "lightweight-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface Props {
  data: CandlestickData<Time>[];
  symbol: string;
}

const CHART_THEME = {
  dark: {
    background: "#161B22",
    textColor: "#8B949E",
    grid: "#21262D",
    crosshair: "#7C3AED",
    border: "#30363D",
    up: "#10B981",
    down: "#EF4444",
  },
  light: {
    background: "#FFFFFF",
    textColor: "#6E7178",
    grid: "#F0F0F3",
    crosshair: "#7C3AED",
    border: "#E4E4E9",
    up: "#16A34A",
    down: "#DC2626",
  },
};

export const CandlestickChart = ({ data, symbol }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const colors = CHART_THEME[resolvedTheme === "light" ? "light" : "dark"];

    chartRef.current = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 420,
      layout: {
        background: { color: colors.background },
        textColor: colors.textColor,
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      crosshair: {
        vertLine: { color: colors.crosshair },
        horzLine: { color: colors.crosshair },
      },
      timeScale: {
        borderColor: colors.border,
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: colors.border,
      },
    });

    seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
      upColor: colors.up,
      downColor: colors.down,
      borderVisible: false,
      wickUpColor: colors.up,
      wickDownColor: colors.down,
    });

    seriesRef.current.setData(data);
    chartRef.current.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data);
      chartRef.current?.timeScale().fitContent();
    }
  }, [data]);

  useEffect(() => {
    if (!chartRef.current || !seriesRef.current) return;
    const colors = CHART_THEME[resolvedTheme === "light" ? "light" : "dark"];

    chartRef.current.applyOptions({
      layout: {
        background: { color: colors.background },
        textColor: colors.textColor,
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      crosshair: {
        vertLine: { color: colors.crosshair },
        horzLine: { color: colors.crosshair },
      },
      timeScale: { borderColor: colors.border },
      rightPriceScale: { borderColor: colors.border },
    });
    seriesRef.current.applyOptions({
      upColor: colors.up,
      downColor: colors.down,
      wickUpColor: colors.up,
      wickDownColor: colors.down,
    });
  }, [resolvedTheme]);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-foreground text-lg font-medium">
          {symbol}
          <span className="ml-2 text-xs text-muted-foreground font-normal">
            Candlestick
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={containerRef} className="w-full" />
      </CardContent>
    </Card>
  );
};
