import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const STRATEGY_TYPES = `
declare const indicators: {
  sma(prices: number[], period: number): number[];
  ema(prices: number[], period: number): number[];
  rsi(prices: number[], period: number): number[];
  macd(prices: number[], fast: number, slow: number, signal: number): {
    macd: number[]; signal: number[]; histogram: number[];
  };
  bollingerBands(prices: number[], period: number, stdDev: number): {
    upper: number[]; middle: number[]; lower: number[];
  };
  atr(high: number[], low: number[], close: number[], period: number): number[];
};

declare function buy(quantity?: number): void;
declare function sell(quantity?: number): void;
declare function log(message: string): void;

declare const candles: Array<{
  time: number; open: number; high: number;
  low: number; close: number; volume: number;
}>;
declare const position: { size: number; entryPrice: number } | null;
`;

export const DEFAULT_CODE = `// TradeVision Strategy
// candles[], indicators, buy(), sell(), position are available

const closes = candles.map(c => c.close);
const fast = indicators.sma(closes, 10);
const slow = indicators.sma(closes, 20);

const i = candles.length - 1;

if (fast[i] > slow[i] && !position) {
  buy();
}

if (fast[i] < slow[i] && position) {
  sell();
}
`;

export const TIMEFRAMES = ["1m", "5m", "15m", "1h", "4h", "1D", "1W"];
