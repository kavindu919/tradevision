import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { randomUUID } from "crypto";
import strategyRoutes from "./routes/strategies.route";
import { extractUserFromHeaders } from "./middleware/user.middleware";

const app = express();
const PORT = process.env.PORT ?? 3003;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3007",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use((req, _res, next) => {
  if (!req.headers["x-request-id"]) {
    req.headers["x-request-id"] = randomUUID();
  }
  next();
});
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "backtest-service",
    timestamp: new Date().toISOString(),
  });
});

app.use(extractUserFromHeaders);
app.use(strategyRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
  });
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
