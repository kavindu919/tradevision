import { Router } from "express";
import {
  archiveStrategy,
  cloneStrategy,
  createStrategy,
  getStrategy,
  listStrategies,
  listStrategyVersions,
  restoreStrategyVersion,
  updateStrategy,
} from "../controllers/strategy.controller";
import { validate } from "../middleware/strategie.validator";
import {
  createStrategySchema,
  updateStrategySchema,
} from "../validators/strategy.validator";

const router = Router();

router.get("/", listStrategies);
router.post("/", validate(createStrategySchema), createStrategy);
router.get("/:id", getStrategy);
router.put("/:id", validate(updateStrategySchema), updateStrategy);
router.delete("/:id", archiveStrategy);
router.post("/:id/clone", cloneStrategy);
router.get("/:id/versions", listStrategyVersions);
router.post("/:id/versions/:version/restore", restoreStrategyVersion);

export default router;
