export interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  asset_symbol: string;
  timeframe: string;
  code: string;
  tags: string[];
}

export const STRATEGY_TEMPLATES: StrategyTemplate[] = [
  {
    id: "ma-crossover",
    name: "MA Crossover",
    description:
      "Buy when fast SMA crosses above slow SMA, sell on cross below.",
    asset_symbol: "AAPL",
    timeframe: "1h",
    tags: ["trend", "beginner"],
    code: `const closes = candles.map(c => c.close);
const fast = indicators.sma(closes, 10);
const slow = indicators.sma(closes, 20);
const i = candles.length - 1;

if (fast[i] > slow[i] && fast[i - 1] <= slow[i - 1] && !position) {
  buy();
}
if (fast[i] < slow[i] && fast[i - 1] >= slow[i - 1] && position) {
  sell();
}`,
  },
  {
    id: "rsi-overbought",
    name: "RSI Overbought/Oversold",
    description:
      "Buy when RSI drops below 30 (oversold), sell when it rises above 70.",
    asset_symbol: "AAPL",
    timeframe: "1h",
    tags: ["oscillator", "beginner"],
    code: `const closes = candles.map(c => c.close);
const rsi = indicators.rsi(closes, 14);
const i = candles.length - 1;

if (rsi[i] < 30 && !position) {
  buy();
}
if (rsi[i] > 70 && position) {
  sell();
}`,
  },
  {
    id: "macd-signal",
    name: "MACD Signal Cross",
    description:
      "Buy on MACD line crossing above signal line, sell on cross below.",
    asset_symbol: "AAPL",
    timeframe: "4h",
    tags: ["trend", "intermediate"],
    code: `const closes = candles.map(c => c.close);
const { macd, signal } = indicators.macd(closes, 12, 26, 9);
const i = candles.length - 1;

if (macd[i] > signal[i] && macd[i - 1] <= signal[i - 1] && !position) {
  buy();
}
if (macd[i] < signal[i] && macd[i - 1] >= signal[i - 1] && position) {
  sell();
}`,
  },
  {
    id: "bollinger-bands",
    name: "Bollinger Band Bounce",
    description: "Buy at lower band (mean reversion), sell at upper band.",
    asset_symbol: "AAPL",
    timeframe: "1h",
    tags: ["mean-reversion", "intermediate"],
    code: `const closes = candles.map(c => c.close);
const { upper, lower } = indicators.bollingerBands(closes, 20, 2);
const i = candles.length - 1;

if (closes[i] <= lower[i] && !position) {
  buy();
}
if (closes[i] >= upper[i] && position) {
  sell();
}`,
  },
];
