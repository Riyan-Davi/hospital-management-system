import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getDoctorAppointments,
  getDoctorAppointment,
  updateAppointmentStatus,
  createDemoAppointment,
} from "../controllers/doctorAppointmentController.js";

const router = express.Router();

router.get(
  "/",
  protect,
  getDoctorAppointments
);

router.get(
  "/:id",
  protect,
  getDoctorAppointment
);

router.put(
  "/:id/status",
  protect,
  updateAppointmentStatus
);

router.post(
  "/",
  protect,
  createDemoAppointment
);

export default router;