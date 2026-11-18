
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

import patientDashboardRoutes from "./routes/patientDashboardRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import medicalRecordRoutes from "./routes/medicalRecordRoutes.js";
import labReportRoutes from "./routes/labReportRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import patientPrescriptionRoutes from "./routes/patientPrescriptionRoutes.js";

import doctorDashboardRoutes from "./routes/doctorDashboardRoutes.js";
import doctorAppointmentRoutes from "./routes/doctorAppointmentRoutes.js";
import doctorPatientRoutes from "./routes/doctorPatientRoutes.js";
import doctorPrescriptionRoutes from "./routes/doctorPrescriptionRoutes.js";
import doctorMedicalRecordRoutes from "./routes/doctorMedicalRecordRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header, such as
      // server-to-server requests and local health checks.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Hospital Management System API is running",
    database: "The API starts only after MongoDB connects.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/profile", profileRoutes);

app.use("/api/patient-dashboard", patientDashboardRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/lab-reports", labReportRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/patient-prescriptions", patientPrescriptionRoutes);

app.use("/api/doctor-dashboard", doctorDashboardRoutes);
app.use("/api/doctor-appointments", doctorAppointmentRoutes);
app.use("/api/doctor-patients", doctorPatientRoutes);
app.use("/api/doctor-prescriptions", doctorPrescriptionRoutes);
app.use("/api/doctor-medical-records", doctorMedicalRecordRoutes);

app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
  });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.message === "Origin not allowed by CORS") {
    return res.status(403).json({
      message: "This frontend origin is not allowed.",
    });
  }

  console.error("Unhandled server error:", err);

  return res.status(500).json({
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from Server/.env.");
    }

    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
