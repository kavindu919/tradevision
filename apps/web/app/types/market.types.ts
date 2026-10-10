export interface PriceUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  timestamp: string;
}

export interface UseMarketPriceReturn {
  prices: Record<string, PriceUpdate>;
  isSubscribed: boolean;
}
