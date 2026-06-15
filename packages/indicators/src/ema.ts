/**
 * Exponential Moving Average
 * @param values - Array of closing prices
 * @param period - Number of periods
 */

export const ema = (values: number[], period: number) => {
  const k = 2 / (period + 1);
  const result: number[] = new Array(values.length).fill(NaN);

  const firstValid = period - 1;
  const seed = values.slice(0, period).reduce((s, v) => s + v, 0) / period;
  result[firstValid] = seed;
  for (let i = firstValid + 1; i < values.length; i++) {
    result[i] = values[i] * k + result[i - 1] * (1 - k);
  }

  return result;
};
