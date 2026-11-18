import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getPatientDashboard,
} from "../controllers/patientDashboardController.js";

const router = express.Router();

router.get("/", protect, getPatientDashboard);

export default router;