import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getPatientAppointments,
  getDoctorsForBooking,
  createPatientAppointment,
  cancelPatientAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/", protect, getPatientAppointments);

router.get("/doctors", protect, getDoctorsForBooking);

router.post("/", protect, createPatientAppointment);

router.put("/:id/cancel", protect, cancelPatientAppointment);

export default router;