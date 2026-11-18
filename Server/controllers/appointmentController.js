
import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

const requirePatient = (req, res) => {
  if (req.user?.role !== "patient") {
    res.status(403).json({
      message: "Access denied. A Patient account is required.",
    });
    return false;
  }

  return true;
};

const getPatientAppointments = async (req, res) => {
  if (!requirePatient(req, res)) return;

  try {
    const appointments = await Appointment.find({
      patient: req.user.id,
    })
      .populate(
        "doctor",
        "name email phone specialization qualification experience consultationFee"
      )
      .sort({ appointmentDate: 1 });

    return res.json({ appointments });
  } catch (error) {
    console.error("Get patient appointments failed:", error.message);
    return res.status(500).json({
      message: "Unable to retrieve appointments.",
    });
  }
};

const getDoctorsForBooking = async (req, res) => {
  if (!requirePatient(req, res)) return;

  try {
    const doctors = await User.find({
      role: "doctor",
      status: "active",
    })
      .select(
        "name email phone specialization qualification experience consultationFee bio department availableDays workingHours"
      )
      .sort({ name: 1 });

    return res.json({ doctors });
  } catch (error) {
    console.error("Get doctors failed:", error.message);
    return res.status(500).json({
      message: "Unable to retrieve doctors.",
    });
  }
};

const createPatientAppointment = async (req, res) => {
  if (!requirePatient(req, res)) return;

  try {
    const { doctorId, appointmentDate, time, type, reason } = req.body;

    if (!doctorId || !appointmentDate || !time) {
      return res.status(400).json({
        message: "Doctor, appointment date and time are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        message: "Invalid doctor ID.",
      });
    }

    if (
      typeof time !== "string" ||
      time.trim().length < 1 ||
      time.trim().length > 40
    ) {
      return res.status(400).json({
        message: "Please provide a valid appointment time.",
      });
    }

    const parsedDate = new Date(appointmentDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid appointment date.",
      });
    }

    // Compare calendar dates so a booking for today is allowed,
    // even if the date value represents midnight.
    const appointmentDay = new Date(parsedDate);
    appointmentDay.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDay < today) {
      return res.status(400).json({
        message: "Appointments cannot be booked for past dates.",
      });
    }

    const patient = await User.findById(req.user.id).select("role status");

    if (!patient || patient.role !== "patient" || patient.status !== "active") {
      return res.status(403).json({
        message: "Your Patient account is not active.",
      });
    }

    const doctor = await User.findOne({
      _id: doctorId,
      role: "doctor",
      status: "active",
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Active doctor not found.",
      });
    }

    const nextDay = new Date(appointmentDay);
    nextDay.setDate(nextDay.getDate() + 1);

    const existingBooking = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: {
        $gte: appointmentDay,
        $lt: nextDay,
      },
      time: time.trim(),
      status: { $ne: "Cancelled" },
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "This doctor already has a booking for that date and time.",
      });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      appointmentDate: parsedDate,
      time: time.trim(),
      type:
        typeof type === "string" && type.trim()
          ? type.trim().slice(0, 100)
          : "Consultation",
      reason:
        typeof reason === "string"
          ? reason.trim().slice(0, 1000)
          : "",
      status: "Pending",
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate(
        "doctor",
        "name email phone specialization qualification consultationFee"
      )
      .populate("patient", "name email phone");

    return res.status(201).json({
      message: "Appointment booked successfully.",
      appointment: populatedAppointment,
    });
  } catch (error) {
    console.error("Create appointment failed:", error.message);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid appointment information.",
      });
    }

    return res.status(500).json({
      message: "Unable to book the appointment.",
    });
  }
};

const cancelPatientAppointment = async (req, res) => {
  if (!requirePatient(req, res)) return;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid appointment ID.",
      });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user.id,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    if (appointment.status === "Completed") {
      return res.status(400).json({
        message: "Completed appointments cannot be cancelled.",
      });
    }

    if (appointment.status === "Cancelled") {
      return res.status(400).json({
        message: "This appointment is already cancelled.",
      });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    return res.json({
      message: "Appointment cancelled successfully.",
      appointment,
    });
  } catch (error) {
    console.error("Cancel appointment failed:", error.message);
    return res.status(500).json({
      message: "Unable to cancel the appointment.",
    });
  }
};

export {
  getPatientAppointments,
  getDoctorsForBooking,
  createPatientAppointment,
  cancelPatientAppointment,
};
