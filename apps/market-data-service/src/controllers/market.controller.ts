import { Request, Response } from "express";
import { twelveDataClient } from "../config/twelvedata.js";
import { redisClient } from "../config/redis.js";
import prisma from "../../../../packages/db-client/src/index.js";

export const getHistory = async (req: Request, res: Response) => {
  try {
    const { symbol, interval, start, end } = req.query;

    const cacheKey = `ohlcv:${symbol}:${interval}:${start || "all"}:${end || "all"}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      const dataString =
        typeof cached === "string" ? cached : cached.toString();
      return res.status(200).json({
        success: true,
        data: JSON.parse(dataString),
        message: "data retrieved from cache",
      });
    }

    const response = await twelveDataClient.get("/time_series", {
      params: {
        symbol,
        interval,
        start_date: start,
        end_date: end,
        format: "JSON",
      },
    });

    if (response.data.values?.length > 0) {
      const symbol = req.query.symbol as string;
      const candles = response.data.values.map((c: any) => ({
        time: new Date(c.datetime),
        symbol: symbol.toUpperCase(),
        timeframe: interval,
        open: parseFloat(c.open),
        high: parseFloat(c.high),
        low: parseFloat(c.low),
        close: parseFloat(c.close),
        volume: c.volume ? parseFloat(c.volume) : null,
      }));

      await prisma.ohlcv.createMany({ data: candles, skipDuplicates: true });
    }

    await redisClient.set(cacheKey, JSON.stringify(response.data), {
      EX: 3600,
    });

    return res.status(200).json({
      success: true,
      data: response.data,
      message: "data retrived succesful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
    });
  }
};
