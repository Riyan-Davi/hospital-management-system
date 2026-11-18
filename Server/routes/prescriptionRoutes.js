import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getPrescriptions,
  updatePrescriptionStatus,
} from "../controllers/prescriptionController.js";

const router = express.Router();

router.get("/", protect, getPrescriptions);

router.put(
  "/:id/status",
  protect,
  updatePrescriptionStatus
);

export default router;