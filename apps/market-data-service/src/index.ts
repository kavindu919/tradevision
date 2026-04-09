import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import marketRoutes from "./routes/market.routes.js";
import WebSocketService from "./services/websocket.service.js";
import { initializeOHLCVTable } from "./services/timescaledb.service.js";

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT ?? 3002;

const wsService = new WebSocketService(httpServer);

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3007",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "market-data-service",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/market", marketRoutes);

(async () => {
  await initializeOHLCVTable();

  httpServer.listen(PORT, () => {
    console.log(`server runing on port ${PORT}`);
    console.log(`WebSocket enabled for real-time prices`);
    console.log(`TimescaleDB initialized`);
  });
})();
