import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import marketRoutes from "./routes/market.routes.js";

const app = express();
const PORT = process.env.PORT ?? 3002;

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3002",
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

app.listen(PORT, () => {
  console.log(`server runing on port ${PORT}`);
});
