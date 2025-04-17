import { Router } from "express";
const router = Router();
import {
  createRMA,
  getAllRMA,
  getRMA,
  updateRMA,
  deleteRMA,
  checkEpromaStatus,
} from "../controllers/rmaController.js";

router.route("/").post(createRMA).get(getAllRMA);

router.route("/:id").get(getRMA).patch(updateRMA).delete(deleteRMA);

router.route("/check-status/:rmaCode").get(checkEpromaStatus);

export default router;
