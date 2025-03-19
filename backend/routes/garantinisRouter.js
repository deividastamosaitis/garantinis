import { Router } from "express";

const router = Router();

import {
  createGarantinis,
  getAllGarantinis,
  getGarantinis,
  updateGarantinis,
  getTodayGarantinis,
} from "../controllers/garantinisController.js";
import { validateGarantinisIdParam } from "../middlewares/validationMiddleware.js";

router.route("/").post(createGarantinis).get(getAllGarantinis);
router.route("/today").get(getTodayGarantinis);
router
  .route("/:id")
  .get(validateGarantinisIdParam, getGarantinis)
  .patch(validateGarantinisIdParam, updateGarantinis);

export default router;
