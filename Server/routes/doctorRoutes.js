import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getDoctors,
  getDoctor,
} from "../controllers/doctorController.js";

const router = express.Router();

router.get("/", protect, getDoctors);

router.get("/:id", protect, getDoctor);

export default router;