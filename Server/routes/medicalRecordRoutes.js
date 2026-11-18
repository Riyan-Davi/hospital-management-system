import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getMedicalRecords,
  getMedicalRecord,
  createMedicalRecord,
  deleteMedicalRecord,
} from "../controllers/medicalRecordController.js";

const router = express.Router();

router.get("/", protect, getMedicalRecords);
router.get("/:id", protect, getMedicalRecord);
router.post("/", protect, createMedicalRecord);
router.delete("/:id", protect, deleteMedicalRecord);

export default router;