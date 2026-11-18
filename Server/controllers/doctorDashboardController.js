import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

const getDoctorDashboard = async (req, res) => {
  try {
    const doctor = await User.findById(
      req.user.id
    ).select("-password");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    if (doctor.role !== "doctor") {
      return res.status(403).json({
        message: "Access denied. Doctor account required.",
      });
    }

    const patientCount = await User.countDocuments({
      role: "patient",
    });

    const appointmentCount =
      await Appointment.countDocuments({
        doctor: req.user.id,
      });

    const appointments = await Appointment.find({
      doctor: req.user.id,
    })
      .populate("patient", "name email phone")
      .sort({
        appointmentDate: 1,
      })
      .limit(5);

    const formattedAppointments = appointments.map(
      (appointment) => ({
        id: appointment._id,
        patientName:
          appointment.patient?.name || "Patient",
        time: appointment.time,
        type:
          appointment.type || "Consultation",
        status: appointment.status,
        date: appointment.appointmentDate,
      })
    );

    const recentPatients = await User.find({
      role: "patient",
    })
      .select("name email phone createdAt")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    const formattedPatients = recentPatients.map(
      (patient) => ({
        id: patient._id,
        name: patient.name,
        lastVisit: "Patient registered",
      })
    );

    res.json({
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
      },

      stats: {
        appointments: appointmentCount,
        patients: patientCount,
        prescriptions: 0,
        satisfaction: 98,
      },

      appointments: formattedAppointments,

      recentPatients: formattedPatients,

      activity: [],
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export { getDoctorDashboard };