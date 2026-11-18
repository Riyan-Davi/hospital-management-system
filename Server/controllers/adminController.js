import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Department from "../models/Department.js";
import HospitalInfo from "../models/HospitalInfo.js";
import AuditLog from "../models/AuditLog.js";
import Notification from "../models/Notification.js";
import bcrypt from "bcryptjs";

// Helper to log audit actions
const logAudit = async (req, action, entity, entityId, description) => {
  try {
    await AuditLog.create({
      userId: req.user?.id,
      userName: req.user?.name || "Admin",
      userRole: req.user?.role || "admin",
      action,
      entity,
      entityId,
      description,
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
};

/* ==========================================================================
   ADMIN DASHBOARD & STATS
   ========================================================================== */
export const getAdminDashboard = async (req, res) => {
  try {
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalAppointments = await Appointment.countDocuments();

    const todayStr = new Date().toISOString().split("T")[0];
    const allApps = await Appointment.find().select("appointmentDate");
    const todayAppointments = allApps.filter((a) => String(a.appointmentDate || "").includes(todayStr)).length;

    const pendingAppointments = await Appointment.countDocuments({ status: "Pending" });
    const scheduledAppointments = await Appointment.countDocuments({ status: "Scheduled" });
    const confirmedAppointments = await Appointment.countDocuments({ status: "Confirmed" });
    const completedAppointments = await Appointment.countDocuments({ status: "Completed" });
    const cancelledAppointments = await Appointment.countDocuments({ status: "Cancelled" });

    const availableDoctors = await User.countDocuments({ role: "doctor", status: "active" });
    const totalDepartments = await Department.countDocuments({ status: "Active" });

    // Recent 5 appointments
    const recentAppointments = await Appointment.find()
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization department")
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 patients
    const recentPatients = await User.find({ role: "patient" })
      .select("name email phone createdAt status")
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 audit logs
    const recentLogs = await AuditLog.find().sort({ createdAt: -1 }).limit(5);

    // Appointment status distribution chart data
    const statusDistribution = [
      { name: "Scheduled", count: scheduledAppointments },
      { name: "Confirmed", count: confirmedAppointments },
      { name: "Completed", count: completedAppointments },
      { name: "Cancelled", count: cancelledAppointments },
      { name: "Pending", count: pendingAppointments },
    ];

    // Department distribution data
    const departmentsList = await Department.find();
    const departmentStats = await Promise.all(
      departmentsList.map(async (dept) => {
        const docCount = await User.countDocuments({ role: "doctor", department: dept.name });
        return { name: dept.name, doctors: docCount };
      })
    );

    res.json({
      stats: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        todayAppointments,
        pendingAppointments,
        completedAppointments,
        cancelledAppointments,
        availableDoctors,
        totalDepartments,
      },
      recentAppointments,
      recentPatients,
      recentLogs,
      statusDistribution,
      departmentStats,
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ==========================================================================
   DOCTOR MANAGEMENT
   ========================================================================== */
export const getDoctorsAdmin = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ doctors });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addDoctorAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      specialization,
      department,
      qualification,
      experience,
      licenseNumber,
      consultationFee,
      bio,
      workingHours,
      availableDays,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "Doctor email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "doctor",
      phone: phone || "",
      specialization: specialization || "General Medicine",
      department: department || "General Medicine",
      qualification: qualification || "MBBS",
      experience: experience || "5 Years",
      licenseNumber: licenseNumber || `MED-${Date.now().toString().slice(-6)}`,
      consultationFee: Number(consultationFee) || 500,
      bio: bio || "",
      workingHours: workingHours || "09:00 AM - 05:00 PM",
      availableDays: availableDays || "Mon, Tue, Wed, Thu, Fri",
      status: "active",
    });

    await logAudit(req, "CREATE", "Doctor", doctor._id.toString(), `Added doctor Dr. ${doctor.name}`);

    res.status(201).json({ message: "Doctor added successfully", doctor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateDoctorAdmin = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const fields = [
      "name", "phone", "specialization", "department", "qualification",
      "experience", "licenseNumber", "consultationFee", "bio", "workingHours", "availableDays"
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    if (req.body.password) {
      doctor.password = await bcrypt.hash(req.body.password, 10);
    }

    await doctor.save();
    await logAudit(req, "UPDATE", "Doctor", doctor._id.toString(), `Updated doctor Dr. ${doctor.name}`);

    res.json({ message: "Doctor updated successfully", doctor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = user.status === "active" ? "inactive" : "active";
    await user.save();

    await logAudit(req, "TOGGLE_STATUS", user.role, user._id.toString(), `Toggled status of ${user.name} to ${user.status}`);

    res.json({ message: `Account ${user.status === 'active' ? 'activated' : 'deactivated'} successfully`, status: user.status });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ==========================================================================
   PATIENT MANAGEMENT
   ========================================================================== */
export const getPatientsAdmin = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ patients });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ==========================================================================
   DEPARTMENT MANAGEMENT
   ========================================================================== */
export const getDepartmentsAdmin = async (req, res) => {
  try {
    let departments = await Department.find().sort({ name: 1 });
    if (departments.length === 0) {
      // Seed default departments if empty
      const defaultDepts = [
        { name: "Cardiology", description: "Heart and cardiovascular health", icon: "heart" },
        { name: "Neurology", description: "Brain and nervous system treatment", icon: "activity" },
        { name: "Orthopedics", description: "Bones, joints, and muscular systems", icon: "shield" },
        { name: "Pediatrics", description: "Infant, child, and adolescent care", icon: "smile" },
        { name: "Dermatology", description: "Skin, hair, and nail conditions", icon: "sun" },
        { name: "General Medicine", description: "Primary and general healthcare services", icon: "plus-circle" },
      ];
      departments = await Department.insertMany(defaultDepts);
    }
    res.json({ departments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addDepartmentAdmin = async (req, res) => {
  try {
    const { name, description, headDoctor } = req.body;
    if (!name) return res.status(400).json({ message: "Department name is required" });

    const dept = await Department.create({
      name: name.trim(),
      description: description || "",
      headDoctor: headDoctor || "Unassigned",
    });

    await logAudit(req, "CREATE", "Department", dept._id.toString(), `Created department ${dept.name}`);
    res.status(201).json({ message: "Department created", department: dept });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateDepartmentAdmin = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).json({ message: "Department not found" });

    if (req.body.name) dept.name = req.body.name;
    if (req.body.description !== undefined) dept.description = req.body.description;
    if (req.body.headDoctor !== undefined) dept.headDoctor = req.body.headDoctor;
    if (req.body.status) dept.status = req.body.status;

    await dept.save();
    await logAudit(req, "UPDATE", "Department", dept._id.toString(), `Updated department ${dept.name}`);
    res.json({ message: "Department updated", department: dept });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteDepartmentAdmin = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    await logAudit(req, "DELETE", "Department", req.params.id, `Deleted department`);
    res.json({ message: "Department deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ==========================================================================
   APPOINTMENT MANAGEMENT
   ========================================================================== */
export const getAppointmentsAdmin = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization department")
      .sort({ appointmentDate: -1 });
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateAppointmentStatusAdmin = async (req, res) => {
  try {
    const { status, appointmentDate, time } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (status) appointment.status = status;
    if (appointmentDate) appointment.appointmentDate = appointmentDate;
    if (time) appointment.time = time;

    await appointment.save();
    await logAudit(req, "UPDATE_STATUS", "Appointment", appointment._id.toString(), `Updated appointment status to ${status}`);

    const updated = await Appointment.findById(appointment._id)
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization department");

    res.json({ message: "Appointment updated", appointment: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ==========================================================================
   HOSPITAL INFO MANAGEMENT
   ========================================================================== */
export const getHospitalInfoAdmin = async (req, res) => {
  try {
    let info = await HospitalInfo.findOne();
    if (!info) {
      info = await HospitalInfo.create({
        facilities: ["Emergency 24/7", "ICU & CCU", "Diagnostic Radiology", "In-house Pharmacy", "Pathology Lab", "Operation Theatres"],
        services: ["Cardiology", "Neurology", "General Surgery", "Pediatric Care", "Dermatology Clinic", "Emergency Care"]
      });
    }
    res.json({ hospitalInfo: info });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateHospitalInfoAdmin = async (req, res) => {
  try {
    let info = await HospitalInfo.findOne();
    if (!info) {
      info = new HospitalInfo();
    }

    const fields = [
      "hospitalName", "about", "address", "phone", "email",
      "emergencyNumber", "website", "workingHours", "mission", "vision", "facilities", "services"
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        info[field] = req.body[field];
      }
    });

    await info.save();
    await logAudit(req, "UPDATE", "HospitalInfo", info._id.toString(), `Updated hospital profile information`);

    res.json({ message: "Hospital information updated successfully", hospitalInfo: info });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ==========================================================================
   AUDIT LOGS & NOTIFICATIONS
   ========================================================================== */
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const sendNotificationAdmin = async (req, res) => {
  try {
    const { targetRole, title, message, type } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    const notification = await Notification.create({
      targetRole: targetRole || "all",
      title,
      message,
      type: type || "info",
    });

    await logAudit(req, "BROADCAST", "Notification", notification._id.toString(), `Broadcasted notification '${title}' to ${targetRole || 'all'}`);

    res.status(201).json({ message: "Notification sent successfully", notification });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
