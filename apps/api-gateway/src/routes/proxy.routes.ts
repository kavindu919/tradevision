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

function proxy(target: string, pathPrefix: string) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^${pathPrefix}`]: "" },
    proxyTimeout: 10000,
    on: {
      error: (_err, _req, res) => {
        (res as Response).status(502).json({
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

router.get("/api/auth/me", requireAuth, proxy(SERVICES.auth, "/api/auth"));
router.post("/api/auth/logout", requireAuth, proxy(SERVICES.auth, "/api/auth"));

router.use("/api/auth", proxy(SERVICES.auth, "/api/auth"));
router.use("/api/market", optionalAuth, proxy(SERVICES.market, "/api/market"));
router.use(
  "/api/strategies",
  requireAuth,
  proxy(SERVICES.backtest, "/api/strategies"),
);
router.use(
  "/api/backtest",
  requireAuth,
  proxy(SERVICES.backtest, "/api/backtest"),
);
router.use(
  "/api/paper-trading",
  requireAuth,
  proxy(SERVICES.paperTrading, "/api/paper-trading"),
);
router.use("/api/ai", requireAuth, proxy(SERVICES.ai, "/api/ai"));
router.use(
  "/api/notifications",
  requireAuth,
  proxy(SERVICES.notification, "/api/notifications"),
);

router.get("/api/auth/me", requireAuth, proxy(SERVICES.auth, "/api/auth"));
router.post("/api/auth/logout", requireAuth, proxy(SERVICES.auth, "/api/auth"));
router.use("/api/auth", proxy(SERVICES.auth, "/api/auth"));
router.use("/api/market", optionalAuth, proxy(SERVICES.market, "/api/market"));
router.use(
  "/api/strategies",
  requireAuth,
  proxy(SERVICES.backtest, "/api/strategies"),
);
router.use(
  "/api/backtest",
  requireAuth,
  proxy(SERVICES.backtest, "/api/backtest"),
);
router.use(
  "/api/paper-trading",
  requireAuth,
  proxy(SERVICES.paperTrading, "/api/paper-trading"),
);
router.use("/api/ai", requireAuth, proxy(SERVICES.ai, "/api/ai"));
router.use(
  "/api/notifications",
  requireAuth,
  proxy(SERVICES.notification, "/api/notifications"),
);

export default router;
