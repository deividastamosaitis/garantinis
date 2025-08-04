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
  updateGarantinisSignature,
  resendGarantinisSignature,
  downloadGarantinisExcel,
} from "../controllers/garantinisController.js";
import { validateGarantinisIdParam } from "../middlewares/validationMiddleware.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

router
  .route("/")
  .post(authenticateUser, createGarantinis)
  .get(getAllGarantinis);
router.route("/today").get(authenticateUser, getTodayGarantinis);
router.route("/search").get(authenticateUser, searchGarantinisByClient);
router.route("/statistics").get(authenticateUser, getSalesStatistics);
router.route("/statistika").get(authenticateUser, getStatistics);
router.patch("/:id/signature", updateGarantinisSignature);
router.get("/:id/excel", downloadGarantinisExcel);
router.post("/:id/resend-signature", resendGarantinisSignature);

router
  .route("/:id")
  .get(validateGarantinisIdParam, getGarantinis)
  .patch(authenticateUser, validateGarantinisIdParam, updateGarantinis)
  .delete(authenticateUser, deleteGarantinis);

export default router;
