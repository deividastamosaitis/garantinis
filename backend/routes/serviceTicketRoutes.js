import { Router } from "express";
const router = Router();

import {
  createServiceTicket,
  getAllServiceTickets,
  getServiceTicket,
  updateServiceTicket,
  deleteServiceTicket,
  updateExternalServiceInfo,
  sendClientInquiry,
  addClientReply,
  sendToRMTools,
} from "../controllers/serviceTicketController.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";

// Viešas: peržiūrėti visus
router
  .route("/")
  .get(authenticateUser, getAllServiceTickets)
  .post(authenticateUser, createServiceTicket);

router
  .route("/:id")
  .get(authenticateUser, getServiceTicket)
  .patch(authenticateUser, updateServiceTicket)
  .delete(authenticateUser, deleteServiceTicket);

router.post("/public", createServiceTicket);
router.post("/:id/inquiry", authenticateUser, sendClientInquiry);
router.post("/:id/inquiry-reply", authenticateUser, addClientReply);
router.post("/:id/send-to-rmtools", sendToRMTools);

router.patch("/:id/external", authenticateUser, updateExternalServiceInfo);

export default router;
