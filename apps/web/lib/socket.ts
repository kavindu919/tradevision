import { io, Socket } from "socket.io-client";

const MARKET_SERVICE_URL =
  process.env.MARKET_SERVICE_URL ?? "http://localhost:3002";

export const socket: Socket = io(MARKET_SERVICE_URL, {
  transports: ["websocket", "polling"],
  autoConnect: false,
});
