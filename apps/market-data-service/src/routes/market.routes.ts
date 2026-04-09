import { Router } from "express";
import {
  getHistory,
  getIntraday,
  getMarketStatus,
  getMultipleQuotes,
  getQuote,
} from "../controllers/market.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  getIntradaySchema,
  getMultipleQuotesSchema,
  getQuoteSchema,
  twelvedataSchema,
} from "../schemas/twelveData.schema.js";

const router = Router();

router.get("/history", validate(twelvedataSchema), getHistory);
router.get("/quote", validate(getQuoteSchema), getQuote);
router.post("/quotes", validate(getMultipleQuotesSchema), getMultipleQuotes);
router.get("/intraday", validate(getIntradaySchema), getIntraday);
router.get("/status", getMarketStatus);

export default router;
