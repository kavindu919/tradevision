import { Request, Response } from "express";
import { twelveDataClient } from "../config/twelvedata.js";
import { redisClient } from "../config/redis.js";
import { insertOHLCVData } from "../services/timescaledb.service.js";

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

      await insertOHLCVData(candles);
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
    });
  }
};

export const getQuote = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.query;
    const cacheKey = `quote:${symbol.toString().toUpperCase()}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cached.toString()),
        message: "Data retrieved successfully",
      });
    }

    const response = await twelveDataClient.get("/quote", {
      params: { symbol },
    });
    if (!response.data) {
      return res.status(404).json({
        success: false,
        message: `Quote not found for symbol: ${symbol}`,
      });
    }
    await redisClient.set(cacheKey, JSON.stringify(response.data), {
      EX: 30,
    });
    return res.status(200).json({
      success: true,
      data: response.data,
      message: "Data retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
    });
  }
};

export const getMultipleQuotes = async (req: Request, res: Response) => {
  try {
    const { symbols } = req.body as { symbols: string[] };
    const limitedSymbols = symbols.slice(0, 10);
    const quotes = await Promise.all(
      limitedSymbols.map(async (symbol) => {
        const cacheKey = `quote:${symbol.toUpperCase()}`;
        const cached = await redisClient.get(cacheKey);

        if (cached) {
          return JSON.parse(cached.toString());
        }
        try {
          const response = await twelveDataClient.get("/quote", {
            params: { symbol },
          });
          if (response.data) {
            await redisClient.set(cacheKey, JSON.stringify(response.data), {
              EX: 30,
            });
            return response.data;
          }
        } catch (error) {
          console.warn(`Failed to fetch quote for ${symbol}:`, error);
          return null;
        }
      }),
    );

    return res.status(200).json({
      success: true,
      data: quotes.filter(Boolean),
      count: quotes.filter(Boolean).length,
    });
  } catch (error) {
    console.error("Error fetching getMultipleQuotes data:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
    });
  }
};

export const getIntraday = async (req: Request, res: Response) => {
  try {
    const { symbol, interval = "15min" } = req.query as {
      symbol: string;
      interval: string;
    };
    const cacheKey = `intraday:${symbol.toUpperCase()}:${interval}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cached.toString()),
        message: "Data retrieved successfully",
      });
    }
    const response = await twelveDataClient.get("/time_series", {
      params: {
        symbol,
        interval,
        outputsize: 60,
      },
    });
    if (!response.data.values || response.data.values.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No intraday data found",
      });
    }
    await redisClient.set(cacheKey, JSON.stringify(response.data), {
      EX: 300,
    });
    return res.status(200).json({
      success: true,
      data: response.data,
      message: "Data retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching intraday data:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch intraday data",
    });
  }
};

export const getMarketStatus = async (req: Request, res: Response) => {
  try {
    const cacheKey = "market:status";
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cached.toString()),
        source: "cache",
      });
    }

    const status = {
      market: "open",
      timestamp: new Date().toISOString(),
      note: "Status based on US market hours",
    };

    await redisClient.set(cacheKey, JSON.stringify(status), {
      EX: 60,
    });

    return res.status(200).json({
      success: true,
      data: status,
      message: "Data retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching market status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch market status",
    });
  }
};
