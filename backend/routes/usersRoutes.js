import express from "express";
import { registerUser, loginUser } from "../controllers/usersController.js";

const router = express.Router();

//register user
router.post("/register", registerUser);
//login user
router.post("/login", loginUser);

export { router as usersRoutes };
