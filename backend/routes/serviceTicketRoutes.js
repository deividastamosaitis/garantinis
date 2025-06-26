import { Router } from "express";
const router = Router();

import {
  createServiceTicket,
  getAllServiceTickets,
  getServiceTicket,
  updateServiceTicket,
  deleteServiceTicket,
  updateExternalServiceInfo,
} from "../controllers/serviceTicketController.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";

// Viešas: peržiūrėti visus
router
  .route("/")
  .get(getAllServiceTickets)
  .post(authenticateUser, createServiceTicket);

router
  .route("/:id")
  .get(getServiceTicket)
  .patch(authenticateUser, updateServiceTicket)
  .delete(authenticateUser, deleteServiceTicket);

router.patch("/:id/external", authenticateUser, updateExternalServiceInfo);

export default router;
