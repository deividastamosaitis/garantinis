import { Router } from "express";

const router = Router();

import {
  getAllPrekes,
  createPreke,
  getPreke,
  updatePreke,
  deletePreke,
  getPrekeByBarcode,
  createOrUpdatePreke,
} from "../controllers/prekeController.js";
import {
  validatePrekeInput,
  validateIdParam,
} from "../middlewares/validationMiddleware.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

router.route("/").get(getAllPrekes).post(validatePrekeInput, createPreke);

router.route("/barcode/:barcode").get(authenticateUser, getPrekeByBarcode);

router
  .route("/upsert")
  .post(authenticateUser, validatePrekeInput, createOrUpdatePreke);

router
  .route("/:id")
  .get(validateIdParam, getPreke)
  .patch(validatePrekeInput, validateIdParam, updatePreke)
  .delete(validateIdParam, deletePreke);

export default router;
