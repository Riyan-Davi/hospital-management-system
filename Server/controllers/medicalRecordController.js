import MedicalRecord from "../models/MedicalRecord.js";

const getMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({
      patient: req.user.id,
    }).sort({ recordDate: -1 });

    res.json({ records });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findOne({
      _id: req.params.id,
      patient: req.user.id,
    });

    if (!record) {
      return res.status(404).json({
        message: "Medical record not found",
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

const createMedicalRecord = async (req, res) => {
  try {
    const {
      title,
      recordType,
      doctorName,
      specialty,
      hospital,
      recordDate,
      description,
      fileName,
      fileUrl,
    } = req.body;

    if (!title || !recordDate) {
      return res.status(400).json({
        message: "Title and record date are required",
      });
    }

    const record = await MedicalRecord.create({
      patient: req.user.id,
      title,
      recordType: recordType || "Others",
      doctorName: doctorName || "",
      specialty: specialty || "",
      hospital: hospital || "",
      recordDate,
      description: description || "",
      fileName: fileName || "",
      fileUrl: fileUrl || "",
    });

    res.status(201).json({
      message: "Medical record created successfully",
      record,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findOne({
      _id: req.params.id,
      patient: req.user.id,
    });

    if (!record) {
      return res.status(404).json({
        message: "Medical record not found",
      });
    }

    await record.deleteOne();

    res.json({
      message: "Medical record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  getMedicalRecords,
  getMedicalRecord,
  createMedicalRecord,
  deleteMedicalRecord,
};