import { Router } from "express";

const router = Router();

import {
  createGarantinis,
  getAllGarantinis,
  getGarantinis,
  updateGarantinis,
} from "../controllers/garantinisController.js";
import { validateGarantinisIdParam } from "../middlewares/validationMiddleware.js";

router.route("/").post(createGarantinis).get(getAllGarantinis);
router
  .route("/:id")
  .get(validateGarantinisIdParam, getGarantinis)
  .patch(validateGarantinisIdParam, updateGarantinis);

export default router;
