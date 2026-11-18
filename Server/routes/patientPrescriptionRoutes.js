import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getPatientPrescriptions,
  getPatientPrescription,
} from "../controllers/patientPrescriptionController.js";

const router = express.Router();

router.get("/", protect, getPatientPrescriptions);

router.get("/:id", protect, getPatientPrescription);

export default router;