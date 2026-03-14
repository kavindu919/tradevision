import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { randomUUID } from "crypto";
import passport from "./middleware/passport.middleware";
import authRoutes from "./routes/auth.routes";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3007",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false }));
app.use((req, _res, next) => {
  if (!req.headers["x-request-id"]) {
    req.headers["x-request-id"] = randomUUID();
  }
  next();
});
app.use(express.json());
app.use(passport.initialize());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "auth-service",
    timestamp: new Date().toISOString(),
  });
});
app.use(authRoutes);
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
  console.log(`server runing on port ${PORT}`);
});
