import Prescription from "../models/Prescription.js";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

const getDoctorPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      doctor: req.user.id,
    })
      .populate("patient", "name email phone")
      .sort({ prescriptionDate: -1 });

    res.json({ prescriptions });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getDoctorPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.id,
      doctor: req.user.id,
    })
      .populate(
        "patient",
        "name email phone dateOfBirth gender address city state country zipCode"
      )
      .populate("appointment", "appointmentDate time type");

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    res.json({ prescription });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const createPrescription = async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      diagnosis,
      medicines,
      notes,
      prescriptionDate,
    } = req.body;

    if (!patientId) {
      return res.status(400).json({
        message: "Patient is required",
      });
    }

    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        message: "At least one medicine is required",
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

    if (appointmentId) {
      const appointment = await Appointment.findOne({
        _id: appointmentId,
        doctor: req.user.id,
        patient: patientId,
      });

      if (!appointment) {
        return res.status(400).json({
          message: "Invalid appointment",
        });
      }
    }

    const prescription = await Prescription.create({
      doctor: req.user.id,
      patient: patientId,
      appointment: appointmentId || null,
      diagnosis: diagnosis || "",
      medicines,
      notes: notes || "",
      prescriptionDate: prescriptionDate || new Date(),
    });

    const populatedPrescription =
      await Prescription.findById(prescription._id)
        .populate("patient", "name email phone")
        .populate("appointment", "appointmentDate time type");

    res.status(201).json({
      message: "Prescription created successfully",
      prescription: populatedPrescription,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.id,
      doctor: req.user.id,
    });

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    await prescription.deleteOne();

    res.json({
      message: "Prescription deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  getDoctorPrescriptions,
  getDoctorPrescription,
  createPrescription,
  deletePrescription,
};