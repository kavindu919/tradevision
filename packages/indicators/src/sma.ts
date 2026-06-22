/**
 * Simple Moving Average
 * @param values - Array of closing prices
 * @param period - Number of periods
 * @returns Array of SMA values (NaN for insufficient data)
 */
export const sma = (values: number[], period: number): number[] => {
  try {
    return values.map((_, i) => {
      if (i < period - 1) {
        return NaN;
      }
      const slice = values.slice(i - period + 1, i + 1);
      return slice.reduce((sum, v) => sum + v, 0) / period;
    });
  } catch (error) {
    throw error;
  }
};
