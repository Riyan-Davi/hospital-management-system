import MedicalRecord from "../models/MedicalRecord.js";
import Appointment from "../models/Appointment.js";

const getDoctorMedicalRecords = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.id,
    }).select("patient");

    const patientIds = [
      ...new Set(
        appointments.map((appointment) => appointment.patient.toString())
      ),
    ];

    const records = await MedicalRecord.find({
      patient: { $in: patientIds },
    })
      .populate("patient", "name email phone")
      .sort({ recordDate: -1 });

    res.json({ records });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getDoctorMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id).populate(
      "patient",
      "name email phone dateOfBirth gender address city state country zipCode"
    );

    if (!record) {
      return res.status(404).json({
        message: "Medical record not found",
      });
    }

    const appointmentExists = await Appointment.exists({
      doctor: req.user.id,
      patient: record.patient._id,
    });

    if (!appointmentExists) {
      return res.status(403).json({
        message: "You do not have access to this record",
      });
    }

    res.json({ record });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  getDoctorMedicalRecords,
  getDoctorMedicalRecord,
};