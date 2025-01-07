import express from "express";
import {
  addPardavimas,
  getAllPardavimai,
  getPardavimas,
} from "../controllers/pardavimasController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

//gauti visus pardavimus
router.get("/", auth, getAllPardavimai);
//gauti viena pardavima
router.get("/:id", auth, getPardavimas);
//sukurti pardavima
router.post("/", auth, addPardavimas);

export { router as pardavimasRoutes };
