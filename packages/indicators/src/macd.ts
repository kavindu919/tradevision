import { ema } from "./ema";

export interface MACDResult {
  macd: number[];
  signal: number[];
  histogram: number[];
}

/**
 * Moving Average Convergence Divergence
 * @param values - Array of closing prices
 * @param fastPeriod - Default 12
 * @param slowPeriod - Default 26
 * @param signalPeriod - Default 9
 */

export const macd = (
  values: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9,
): MACDResult => {
  const fastEma = ema(values, fastPeriod);
  const slowEma = ema(values, slowPeriod);

  const macdLine = fastEma.map((f, i) =>
    isNaN(f) || isNaN(slowEma[i]) ? NaN : f - slowEma[i],
  );

  const firstValidIdx = macdLine.findIndex((v) => !isNaN(v));
  const validSlice = macdLine.slice(firstValidIdx) as number[];
  const signalRaw = ema(validSlice, signalPeriod);
  const signal = new Array(firstValidIdx).fill(NaN).concat(signalRaw);

  const histogram = macdLine.map((m, i) =>
    isNaN(m) || isNaN(signal[i]) ? NaN : m - signal[i],
  );

  return { macd: macdLine, signal, histogram };
};
