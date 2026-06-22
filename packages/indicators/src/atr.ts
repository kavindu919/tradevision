export interface Candle {
  high: number;
  low: number;
  close: number;
}

export const atr = (candles: Candle[], period: number = 14): number[] => {
  const result: number[] = new Array(candles.length).fill(NaN);
  if (candles.length < period) return result;

  const trueRanges = candles.map((c, i) => {
    if (i === 0) return c.high - c.low;
    const prevClose = candles[i - 1].close;
    return Math.max(
      c.high - c.low,
      Math.abs(c.high - prevClose),
      Math.abs(c.low - prevClose),
    );
  });

  result[period - 1] =
    trueRanges.slice(0, period).reduce((s, v) => s + v, 0) / period;
  for (let i = period; i < candles.length; i++) {
    result[i] = (result[i - 1] * (period - 1) + trueRanges[i]) / period;
  }
  return result;
};
