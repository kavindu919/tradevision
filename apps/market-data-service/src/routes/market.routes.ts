import { Router } from "express";
import { getHistory } from "../controllers/market.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { twelvedataSchema } from "../schemas/twelveData.schema.js";

const router = Router();

router.get("/history", validate(twelvedataSchema), getHistory);

export default router;
