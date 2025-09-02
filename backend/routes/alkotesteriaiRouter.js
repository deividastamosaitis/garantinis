import { Router } from "express";
const router = Router();

import {
  getAllAlkotesteriai,
  getTodayAlkotesteriai,
  createAlkotesteris,
  getAlkotesteris,
  updateAlkotesteris,
  updateAlkotesterisStatus,
  deleteAlkotesteris,
  searchAlkotesteriaiByClient,
  sendAlkotesterisSms,
} from "../controllers/alkotesteriaiController.js";
import { validateAlkotesterisIdParam } from "../middlewares/validationMiddleware.js";

router.route("/").get(getAllAlkotesteriai).post(createAlkotesteris);

router.route("/today").get(getTodayAlkotesteriai);

router.route("/search").get(searchAlkotesteriaiByClient);

router
  .route("/:id/status")
  .patch(validateAlkotesterisIdParam, updateAlkotesterisStatus);

router
  .route("/:id")
  .get(validateAlkotesterisIdParam, getAlkotesteris)
  .patch(validateAlkotesterisIdParam, updateAlkotesteris)
  .delete(validateAlkotesterisIdParam, deleteAlkotesteris);

router.route("/:id/sms").post(validateAlkotesterisIdParam, sendAlkotesterisSms);

export default router;
