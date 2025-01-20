import express from "express";
import {
  registerUser,
  loginUser,
  logout,
} from "../controllers/authController.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../middlewares/validationMiddleware.js";

const router = express.Router();

//register user
router.post("/register", validateRegisterInput, registerUser);
//login user
router.post("/login", validateLoginInput, loginUser);
//logout user
router.get("/logout", logout);

export { router as authRouter };
