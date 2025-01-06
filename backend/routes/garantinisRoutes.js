import express from "express";
import {
  addPreke,
  getPrekes,
  deletePreke,
  updatePreke,
} from "../controllers/prekeController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

//Visos prekes
router.get("/", getPrekes);
//Prideti preke
router.post("/", auth, addPreke);
//Istrinti preke
router.delete("/:id", auth, deletePreke);
//Atnaujinti preke
router.patch("/:id", auth, updatePreke);

export { router as garantinisRoutes };
