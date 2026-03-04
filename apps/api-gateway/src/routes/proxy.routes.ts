import { Router, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { optionalAuth, requireAuth } from "../middleware/auth.middleware";

const router = Router();

const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL ?? "http://localhost:3001",
  market: process.env.MARKET_SERVICE_URL ?? "http://localhost:3002",
  backtest: process.env.BACKTEST_SERVICE_URL ?? "http://localhost:3003",
  paperTrading:
    process.env.PAPER_TRADING_SERVICE_URL ?? "http://localhost:3004",
  ai: process.env.AI_SERVICE_URL ?? "http://localhost:3005",
  notification: process.env.NOTIFICATION_SERVICE_URL ?? "http://localhost:3006",
};

function proxy(target: string) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    on: {
      error: (_err, _req, res) => {
        (res as Response).status(501).json({
          success: false,
          error: {
            code: "SERVICE_UNAVAILABLE",
            message: "Upstream service is unavailable",
          },
        });
      },
    },
  });
}

router.use("api/auth", proxy(SERVICES.auth));
router.use("/api/market", optionalAuth, proxy(SERVICES.market));
router.use("/api/strategies", requireAuth, proxy(SERVICES.backtest));
router.use("/api/backtest", requireAuth, proxy(SERVICES.backtest));
router.use("/api/paper-trading", requireAuth, proxy(SERVICES.paperTrading));
router.use("api/ai", requireAuth, proxy(SERVICES.ai));
router.use("api/notifications", requireAuth, proxy(SERVICES.notification));

export default router;
