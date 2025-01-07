import express from "express";
import {
  addKlientas,
  updateKlientas,
  getKlientas,
} from "../controllers/klientasController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

//gauti klientus
router.get("/", auth, getKlientas);
//prideti klienta
router.post("/", auth, addKlientas);
//atnaujinti klienta
router.patch("/:id", auth, updateKlientas);

export { router as klientasRoutes };
