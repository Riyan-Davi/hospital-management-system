import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

const getDoctorPatients = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.id,
    }).select("patient");

    const patientIds = [
      ...new Set(appointments.map((appointment) => appointment.patient.toString())),
    ];

    const patients = await User.find({
      _id: { $in: patientIds },
      role: "patient",
    })
      .select(
        "name email phone dateOfBirth gender address city state country zipCode createdAt"
      )
      .sort({ name: 1 });

    const formattedPatients = patients.map((patient) => ({
      id: patient._id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      address: patient.address,
      city: patient.city,
      state: patient.state,
      country: patient.country,
      zipCode: patient.zipCode,
      registeredAt: patient.createdAt,
    }));

    res.json({
      patients: formattedPatients,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getDoctorPatient = async (req, res) => {
  try {
    const patient = await User.findOne({
      _id: req.params.id,
      role: "patient",
    }).select("-password");

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    const appointmentExists = await Appointment.exists({
      doctor: req.user.id,
      patient: req.params.id,
    });

    if (!appointmentExists) {
      return res.status(403).json({
        message: "You do not have access to this patient",
      });
    }

    const appointments = await Appointment.find({
      doctor: req.user.id,
      patient: req.params.id,
    })
      .sort({ appointmentDate: -1 })
      .select("appointmentDate time type reason status notes");

    res.json({
      patient,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  getDoctorPatients,
  getDoctorPatient,
};