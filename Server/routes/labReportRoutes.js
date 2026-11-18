import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getLabReports,
  getLabReport,
  createLabReport,
  deleteLabReport,
} from "../controllers/labReportController.js";

const router = express.Router();

router.get("/", protect, getLabReports);
router.get("/:id", protect, getLabReport);
router.post("/", protect, createLabReport);
router.delete("/:id", protect, deleteLabReport);

export default router;