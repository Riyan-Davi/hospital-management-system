import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getDoctorMedicalRecords,
  getDoctorMedicalRecord,
} from "../controllers/doctorMedicalRecordController.js";

const router = express.Router();

router.get("/", protect, getDoctorMedicalRecords);

router.get("/:id", protect, getDoctorMedicalRecord);

export default router;