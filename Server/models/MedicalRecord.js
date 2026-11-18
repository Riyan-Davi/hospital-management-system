import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    recordType: {
      type: String,
      enum: [
        "Lab Report",
        "Prescription",
        "Visit Summary",
        "Imaging",
        "Others",
      ],
      default: "Others",
    },

    doctorName: {
      type: String,
      default: "",
      trim: true,
    },

    specialty: {
      type: String,
      default: "",
      trim: true,
    },

    hospital: {
      type: String,
      default: "",
      trim: true,
    },

    recordDate: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    fileName: {
      type: String,
      default: "",
      trim: true,
    },

    fileUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const MedicalRecord = mongoose.model(
  "MedicalRecord",
  medicalRecordSchema
);

export default MedicalRecord;