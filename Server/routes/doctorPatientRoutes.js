import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getDoctorPatients,
  getDoctorPatient,
} from "../controllers/doctorPatientController.js";

const router = express.Router();

router.get("/", protect, getDoctorPatients);
router.get("/:id", protect, getDoctorPatient);

export default router;