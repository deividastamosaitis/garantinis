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
  getPrekesMeta,
} from "../controllers/prekeController.js";
import {
  validatePrekeInput,
  validateIdParam,
} from "../middlewares/validationMiddleware.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

router
  .route("/")
  .get(getAllPrekes)
  .post(authenticateUser, validatePrekeInput, createPreke);

router.get("/meta", authenticateUser, getPrekesMeta);

router.route("/barcode/:barcode").get(authenticateUser, getPrekeByBarcode);

router
  .route("/upsert")
  .post(authenticateUser, validatePrekeInput, createOrUpdatePreke);

router
  .route("/:id")
  .get(validateIdParam, getPreke)
  .patch(validateIdParam, updatePreke)
  .delete(validateIdParam, deletePreke);

export default router;
