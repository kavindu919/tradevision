import { Router } from "express";
import { getHistory } from "../controllers/market.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { twelvedataSchema } from "../schemas/twelveData.schema.js";

const router = Router();

router.get("/history", validate(twelvedataSchema), getHistory);
// router.get("/quote", getQuote);
// router.post("/quotes", getMultipleQuotes);
// router.get("/intraday", getIntraday);
// router.get("/status", getMarketStatus);

export default router;
