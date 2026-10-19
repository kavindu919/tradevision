export type MockStrategy = {
  id: string;
  name: string;
  asset: string;
  timeframe: string;
  status: "active" | "paused" | "archived";
  version: string;
  updatedAt: string;
  description: string;
};

// Placeholder data for the strategies list until it is wired to GET /strategies.
export const MOCK_STRATEGIES: MockStrategy[] = [
  {
    id: "1",
    name: "MA Crossover",
    asset: "AAPL",
    timeframe: "1h",
    status: "active",
    version: "v3",
    updatedAt: "2 hours ago",
    description:
      "Buy when fast SMA crosses above slow SMA, sell on cross below.",
  },
  {
    id: "2",
    name: "RSI Overbought/Oversold",
    asset: "BTC/USD",
    timeframe: "1h",
    status: "active",
    version: "v5",
    updatedAt: "Yesterday",
    description:
      "Buy when RSI drops below 30 (oversold), sell when it rises above 70.",
  },
  {
    id: "3",
    name: "Bollinger Band Bounce",
    asset: "AAPL",
    timeframe: "1h",
    status: "active",
    version: "v1",
    updatedAt: "Just now",
    description: "Buy at lower band (mean reversion), sell at upper band.",
  },
  {
    id: "4",
    name: "MACD Signal Cross",
    asset: "ETH/USD",
    timeframe: "4h",
    status: "paused",
    version: "v2",
    updatedAt: "4 days ago",
    description:
      "Buy on MACD line crossing above signal line, sell on cross below.",
  },
  {
    id: "5",
    name: "MA Crossover",
    asset: "MSFT",
    timeframe: "1D",
    status: "paused",
    version: "v4",
    updatedAt: "1 week ago",
    description: "Cloned from the AAPL crossover, retuned for daily candles.",
  },
  {
    id: "6",
    name: "RSI Overbought/Oversold",
    asset: "GOOGL",
    timeframe: "15m",
    status: "archived",
    version: "v1",
    updatedAt: "Just Now",
    description:
      "Buy when RSI drops below 30 (oversold), sell when it rises above 70.",
  },
];
