import { useEffect, useMemo, useState } from "react";
import { PriceUpdate, UseMarketPriceReturn } from "../types/market.typs";
import { socket } from "../lib/socket";

export const useMarketPrice = (symbols: string[]): UseMarketPriceReturn => {
  const [prices, setPrices] = useState<Record<string, PriceUpdate>>({});
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const symbolsKey = useMemo(() => symbols.join(","), [symbols]);

  useEffect(() => {
    if (symbols.length === 0) return;
    socket.emit("subscribe:market", { symbols });
    setIsSubscribed(true);

    socket.on("price:update", (data: PriceUpdate) => {
      setPrices((prev) => ({ ...prev, [data.symbol]: data }));
    });

    return () => {
      socket.emit("unsubscribe:market", { symbols });
      socket.off("price:update");
      setIsSubscribed(false);
    };
  }, [symbolsKey]);
  return { prices, isSubscribed };
};
