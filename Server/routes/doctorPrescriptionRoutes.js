import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getDoctorPrescriptions,
  getDoctorPrescription,
  createPrescription,
  deletePrescription,
} from "../controllers/doctorPrescriptionController.js";

const router = express.Router();

router.get("/", protect, getDoctorPrescriptions);

router.get("/:id", protect, getDoctorPrescription);

router.post("/", protect, createPrescription);

router.delete("/:id", protect, deletePrescription);

export default router;