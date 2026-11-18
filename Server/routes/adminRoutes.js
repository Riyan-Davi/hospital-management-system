import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

import {
  getAdminDashboard,
  getDoctorsAdmin,
  addDoctorAdmin,
  updateDoctorAdmin,
  toggleUserStatus,
  getPatientsAdmin,
  getDepartmentsAdmin,
  addDepartmentAdmin,
  updateDepartmentAdmin,
  deleteDepartmentAdmin,
  getAppointmentsAdmin,
  updateAppointmentStatusAdmin,
  getHospitalInfoAdmin,
  updateHospitalInfoAdmin,
  getAuditLogs,
  sendNotificationAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

// Apply protect & adminOnly to all admin routes
router.use(protect, adminOnly);

/* Dashboard */
router.get("/dashboard", getAdminDashboard);

/* Doctors */
router.get("/doctors", getDoctorsAdmin);
router.post("/doctors", addDoctorAdmin);
router.put("/doctors/:id", updateDoctorAdmin);
router.patch("/users/:id/status", toggleUserStatus);

/* Patients */
router.get("/patients", getPatientsAdmin);

/* Departments */
router.get("/departments", getDepartmentsAdmin);
router.post("/departments", addDepartmentAdmin);
router.put("/departments/:id", updateDepartmentAdmin);
router.delete("/departments/:id", deleteDepartmentAdmin);

/* Appointments */
router.get("/appointments", getAppointmentsAdmin);
router.put("/appointments/:id/status", updateAppointmentStatusAdmin);

/* Hospital Info */
router.get("/hospital-info", getHospitalInfoAdmin);
router.put("/hospital-info", updateHospitalInfoAdmin);

/* Audit Logs & Notifications */
router.get("/audit-logs", getAuditLogs);
router.post("/notifications", sendNotificationAdmin);

export default router;
