import express from "express";
import {
  addKrepselis,
  getAllKrepseliai,
  getKrepselis,
} from "../controllers/krepselisController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

//gauti visus pardavimus
router.get("/", auth, getAllKrepseliai);
//gauti viena pardavima
router.get("/:id", auth, getKrepselis);
//sukurti pardavima
router.post("/", auth, addKrepselis);

export { router as krepselisRoutes };
