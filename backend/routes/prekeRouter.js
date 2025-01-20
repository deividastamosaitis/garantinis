import { Router } from "express";

const router = Router();

import {
  getAllPrekes,
  createPreke,
  getPreke,
  updatePreke,
  deletePreke,
} from "../controllers/prekeController.js";
import {
  validatePrekeInput,
  validateIdParam,
} from "../middlewares/validationMiddleware.js";

router.route("/").get(getAllPrekes).post(validatePrekeInput, createPreke);
router
  .route("/:id")
  .get(validateIdParam, getPreke)
  .patch(validatePrekeInput, validateIdParam, updatePreke)
  .delete(validateIdParam, deletePreke);

export default router;
