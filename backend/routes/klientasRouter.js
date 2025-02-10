import { Router } from "express";
const router = Router();

import {
  createKlientas,
  getKlientas,
} from "../controllers/klientasController.js";
import {
  validateKlientasIdParam,
  validateKlientasInput,
} from "../middlewares/validationMiddleware.js";

router.route("/").post(validateKlientasInput, createKlientas);
router.route("/:id").get(validateKlientasIdParam, getKlientas);

export default router;
