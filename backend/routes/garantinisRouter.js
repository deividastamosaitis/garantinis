import { Router } from "express";

const router = Router();

import {
  createGarantinis,
  getAllGarantinis,
  getGarantinis,
  updateGarantinis,
  getTodayGarantinis,
  deleteGarantinis,
  searchGarantinisByClient,
  getSalesStatistics,
  getStatistics,
} from "../controllers/garantinisController.js";
import { validateGarantinisIdParam } from "../middlewares/validationMiddleware.js";

router.route("/").post(createGarantinis).get(getAllGarantinis);
router.route("/today").get(getTodayGarantinis);
router.route("/search").get(searchGarantinisByClient);
router.route("/statistics").get(getSalesStatistics);
router.route("/statistika").get(getStatistics);

router
  .route("/:id")
  .get(validateGarantinisIdParam, getGarantinis)
  .patch(validateGarantinisIdParam, updateGarantinis)
  .delete(deleteGarantinis);

export default router;
