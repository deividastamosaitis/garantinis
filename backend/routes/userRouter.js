import express from "express";
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
} from "../controllers/userController.js";
import { validateUpdateUserInput } from "../middlewares/validationMiddleware.js";
import { authorizedPermission } from "../middlewares/authMiddleware.js";
const router = express.Router();

//register user
router.get("/current-user", getCurrentUser);
//login user
router.get("/admin/app-stats", [
  authorizedPermission("admin"),
  getApplicationStats,
]);
//logout user
router.patch("/update-user", validateUpdateUserInput, updateUser);

export { router as userRouter };
