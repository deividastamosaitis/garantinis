import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { getSalesByGroup } from "../controllers/analyticsController.js";

const router = express.Router();

// GET /analytics/kalakutas?range=month|week|quarter|halfyear|year
//   arba ?from=2025-08-01&to=2025-08-30
router.get("/kalakutas", authenticateUser, getSalesByGroup);

export default router;
