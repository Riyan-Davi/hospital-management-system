import Prescription from "../models/Prescription.js";

const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patient: req.user.id,
    })
      .populate(
        "doctor",
        "name specialization qualification experience"
      )
      .populate(
        "appointment",
        "appointmentDate time type"
      )
      .sort({ prescriptionDate: -1 });

    res.json({
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getPatientPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.id,
      patient: req.user.id,
    })
      .populate(
        "doctor",
        "name email phone specialization qualification experience"
      )
      .populate(
        "appointment",
        "appointmentDate time type"
      );

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    res.json({
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  getPatientPrescriptions,
  getPatientPrescription,
};