import { describe, it, expect } from "vitest";
import { sma, ema, rsi, macd, bollingerBands } from "../index";

const closes = [
  44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.1, 45.15, 43.61, 44.33, 44.83,
  45.1, 45.15, 45.98, 45.4, 45.43, 45.84, 46.03, 45.61, 46.28, 46.28, 46.0,
];

describe("SMA", () => {
  it("returns NaN for insufficient data", () => {
    const result = sma(closes, 14);
    expect(isNaN(result[0])).toBe(true);
    expect(isNaN(result[12])).toBe(true);
  });

  it("computes correct value at period boundary", () => {
    const result = sma([1, 2, 3, 4, 5], 3);
    expect(result[2]).toBeCloseTo(2);
    expect(result[4]).toBeCloseTo(4);
  });
});

describe("EMA", () => {
  it("seeds from SMA then smooths", () => {
    const result = ema([1, 2, 3, 4, 5, 6, 7], 3);
    expect(isNaN(result[0])).toBe(true);
    expect(isNaN(result[1])).toBe(true);
    expect(result[2]).toBeCloseTo(2);
  });
});

describe("RSI", () => {
  it("returns values between 0 and 100", () => {
    const result = rsi(closes, 14);
    result.forEach((v) => {
      if (!isNaN(v)) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
    });
  });
});

describe("MACD", () => {
  it("returns three arrays of equal length", () => {
    const result = macd(closes);
    expect(result.macd.length).toBe(closes.length);
    expect(result.signal.length).toBe(closes.length);
    expect(result.histogram.length).toBe(closes.length);
  });
});

describe("Bollinger Bands", () => {
  it("upper is always above lower", () => {
    const result = bollingerBands(closes, 10);
    result.upper.forEach((u, i) => {
      if (!isNaN(u)) {
        expect(u).toBeGreaterThan(result.lower[i]);
      }
    });
  });
});
