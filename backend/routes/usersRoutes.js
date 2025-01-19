import express from "express";
import { registerUser, loginUser } from "../controllers/usersController.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../middlewares/validationMiddleware.js";

const router = express.Router();

//register user
router.post("/register", validateRegisterInput, registerUser);
//login user
router.post("/login", validateLoginInput, loginUser);

export { router as usersRoutes };
