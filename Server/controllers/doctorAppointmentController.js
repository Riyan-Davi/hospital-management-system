import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.id,
    })
      .populate("patient", "name email phone dateOfBirth gender")
      .sort({ appointmentDate: 1 });

    res.json({
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getDoctorAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user.id,
    }).populate(
      "patient",
      "name email phone dateOfBirth gender address city state country zipCode"
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.json({
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Scheduled",
      "Confirmed",
      "Completed",
      "Cancelled",
      "Pending",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid appointment status",
      });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user.id,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = status;

    await appointment.save();

    const updatedAppointment =
      await Appointment.findById(appointment._id).populate(
        "patient",
        "name email phone"
      );

    res.json({
      message: "Appointment status updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const createDemoAppointment = async (req, res) => {
  try {
    const { patientId, appointmentDate, time, type, reason } =
      req.body;

    if (!patientId || !appointmentDate || !time) {
      return res.status(400).json({
        message:
          "Patient, appointment date and time are required",
      });
    }

    const patient = await User.findOne({
      _id: patientId,
      role: "patient",
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    const appointment = await Appointment.create({
      patient: patientId,
      doctor: req.user.id,
      appointmentDate,
      time,
      type: type || "Consultation",
      reason: reason || "",
      status: "Scheduled",
    });

    const populatedAppointment =
      await Appointment.findById(
        appointment._id
      ).populate(
        "patient",
        "name email phone"
      );

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: populatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  getDoctorAppointments,
  getDoctorAppointment,
  updateAppointmentStatus,
  createDemoAppointment,
};