import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { redisClient } from "../config/redis.js";
import { PriceUpdate } from "../util/webHookInterface.js";
import { twelveDataClient } from "../config/twelvedata.js";

class WebSocketService {
  private io: SocketIOServer;
  private subscribedSymbols = new Map<string, Set<string>>();
  private priceIntervals = new Map<string, NodeJS.Timeout>();

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3007",
        credentials: true,
        methods: ["GET", "POST"],
      },
      transports: ["websocket", "polling"],
    });
    this.setupHandlers();
  }

  private setupHandlers() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on("subscribe:market", (data: { symbols: string[] }) => {
        this.handleSubscribe(socket, data);
      });

      socket.on("unsubscribe:market", (data: { symbols: string[] }) => {
        this.handleUnsubscribe(socket, data);
      });

      socket.on("disconnect", () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private handleSubscribe(socket: Socket, data: { symbols: string[] }) {
    data.symbols.forEach((symbol) => {
      const upSymbol = symbol.toUpperCase();
      if (!this.subscribedSymbols.has(upSymbol)) {
        this.subscribedSymbols.set(upSymbol, new Set());
        this.startPriceStream(upSymbol);
      }
      this.subscribedSymbols.get(upSymbol)?.add(socket.id);
      socket.join(`price:${upSymbol}`);
    });

    socket.emit("subscribe:success", {
      symbols: data.symbols.map((s) => s.toUpperCase()),
    });
  }

  private handleUnsubscribe(socket: Socket, data: { symbols: string[] }) {
    data.symbols.forEach((symbol) => {
      const upSymbol = symbol.toUpperCase();
      const subscribers = this.subscribedSymbols.get(upSymbol);
      if (subscribers) {
        subscribers.delete(socket.id);
        if (subscribers.size === 0) {
          this.stopPriceStream(upSymbol);
          this.subscribedSymbols.delete(upSymbol);
        }
      }
      socket.leave(`price:${upSymbol}`);
    });
  }

  private handleDisconnect(socket: Socket) {
    this.subscribedSymbols.forEach((subscribers, symbol) => {
      if (subscribers.has(socket.id)) {
        subscribers.delete(socket.id);

        if (subscribers.size === 0) {
          this.stopPriceStream(symbol);
          this.subscribedSymbols.delete(symbol);
        }
      }
    });

    console.log(`Client disconnected: ${socket.id}`);
  }

  private startPriceStream(symbol: string) {
    const interval = setInterval(() => {
      this.fetchAndBroadcastPrice(symbol);
    }, 5000);

    this.priceIntervals.set(symbol, interval);
    this.fetchAndBroadcastPrice(symbol);
  }

  private stopPriceStream(symbol: string) {
    const interval = this.priceIntervals.get(symbol);
    if (interval) {
      clearInterval(interval);
      this.priceIntervals.delete(symbol);
    }
  }

  private async fetchAndBroadcastPrice(symbol: string) {
    try {
      const cacheKey = `price:${symbol}:latest`;
      const cached = await redisClient.get(cacheKey);

      let priceData: PriceUpdate;
      if (cached) {
        priceData = JSON.parse(
          typeof cached === "string" ? cached : cached.toString(),
        );
      } else {
        const response = await twelveDataClient.get("/quote", {
          params: {
            symbol,
          },
        });

        if (response.data) {
          priceData = this.transformPriceData(response.data);
          await redisClient.set(cacheKey, JSON.stringify(priceData), {
            EX: 5,
          });
        } else {
          return;
        }
      }
      this.io.to(`price:${symbol}`).emit("price:update", priceData);
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
    }
  }

  private transformPriceData(data: any): PriceUpdate {
    const current = parseFloat(data.close);
    const previous = parseFloat(data.previous_close || data.open);
    const change = current - previous;
    const changePercent = (change / previous) * 100;

    return {
      symbol: data.symbol,
      price: current,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      high: parseFloat(data.high),
      low: parseFloat(data.low),
      volume: data.volume ? parseFloat(data.volume) : 0,
      timestamp: new Date().toISOString(),
    };
  }

  getIO() {
    return this.io;
  }
}

export default WebSocketService;
