import { Router } from "express";
import {
  archiveStrategy,
  cloneStrategy,
  createStrategy,
  getStrategy,
  listStrategies,
  updateStrategy,
} from "../controllers/strategy.controller";
import { validate } from "../middleware/strategie.validator";
import { createStrategySchema } from "../validators/strategy.validator";

const router = Router();

router.get("/", listStrategies);
router.post("/", validate(createStrategySchema), createStrategy);
router.get("/:id", getStrategy);
router.put("/:id", updateStrategy);
router.delete("/:id", archiveStrategy);
router.post("/:id/clone", cloneStrategy);

export default router;
