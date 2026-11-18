import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";
import Message from "../models/Message.js";

const getPatientDashboard = async (req, res) => {
  try {
    const patient = await User.findById(req.user.id).select("-password");

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    if (patient.role !== "patient") {
      return res.status(403).json({
        message: "Access denied. Patient account required.",
      });
    }

    const appointments = await Appointment.find({
      patient: req.user.id,
    })
      .populate(
        "doctor",
        "name specialization qualification consultationFee"
      )
      .sort({ appointmentDate: 1 });

    const upcomingAppointments = appointments
      .filter(
        (appointment) =>
          appointment.status !== "Cancelled" &&
          new Date(appointment.appointmentDate) >= new Date()
      )
      .slice(0, 5);

    const prescriptionCount = await Prescription.countDocuments({
      patient: req.user.id,
    });

    const unreadMessages = await Message.countDocuments({
      receiver: req.user.id,
      read: false,
    });

    const formattedAppointments = upcomingAppointments.map(
      (appointment) => ({
        id: appointment._id,
        doctorName: appointment.doctor?.name || "Doctor",
        specialization:
          appointment.doctor?.specialization || "General",
        date: appointment.appointmentDate,
        time: appointment.time,
        type: appointment.type,
        status: appointment.status,
      })
    );

    res.json({
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
      },

      stats: {
        appointments: appointments.length,
        prescriptions: prescriptionCount,
        unreadMessages,
      },

      upcomingAppointments: formattedAppointments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export { getPatientDashboard };