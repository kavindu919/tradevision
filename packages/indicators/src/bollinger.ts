import { sma } from "./sma";

export interface BollingerBandsResult {
  upper: number[];
  middle: number[];
  lower: number[];
  bandwidth: number[];
}

/**
 * Bollinger Bands
 * @param values - Array of closing prices
 * @param period - Default 20
 * @param stdDev - Standard deviation multiplier, default 2
 */

export const bollingerBands = (
  values: number[],
  period: number = 20,
  stdDev: number = 2,
): BollingerBandsResult => {
  const middle = sma(values, period);
  const upper: number[] = [];
  const lower: number[] = [];
  const bandwidth: number[] = [];

  for (let i = 0; i < values.length; i++) {
    if (isNaN(middle[i])) {
      upper.push(NaN);
      lower.push(NaN);
      bandwidth.push(NaN);
      continue;
    }

    const slice = values.slice(i - period + 1, i + 1);
    const mean = middle[i];
    const variance =
      slice.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / period;
    const sd = Math.sqrt(variance);

    upper.push(mean + stdDev * sd);
    lower.push(mean - stdDev * sd);
    bandwidth.push((mean + stdDev * sd - (mean - stdDev * sd)) / mean);
  }

  return { upper, middle, lower, bandwidth };
};
