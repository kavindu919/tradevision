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

interface Props {
  data: CandlestickData<Time>[];
  symbol: string;
}

export const CandlestickChart = ({ data, symbol }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    chartRef.current = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 420,
      layout: {
        background: { color: "#1C2333" },
        textColor: "#8B949E",
      },
      grid: {
        vertLines: { color: "#21262D" },
        horzLines: { color: "#21262D" },
      },
      crosshair: {
        vertLine: { color: "#7C3AED" },
        horzLine: { color: "#7C3AED" },
      },
      timeScale: {
        borderColor: "#30363D",
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: "#30363D",
      },
    });

    seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
      upColor: "#10B981",
      downColor: "#EF4444",
      borderVisible: false,
      wickUpColor: "#10B981",
      wickDownColor: "#EF4444",
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

  return (
    <Card className="border-[#30363D] bg-[#1C2333]">
      <CardHeader className="pb-2">
        <CardTitle className="text-[#E6EDF3] text-lg font-medium">
          {symbol}
          <span className="ml-2 text-xs text-[#8B949E] font-normal">
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
