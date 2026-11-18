import mongoose from "mongoose";

const labReportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    testName: {
      type: String,
      required: true,
      trim: true,
    },

    testType: {
      type: String,
      default: "Other",
      trim: true,
    },

    doctorName: {
      type: String,
      default: "",
      trim: true,
    },

    hospital: {
      type: String,
      default: "",
      trim: true,
    },

    testDate: {
      type: Date,
      required: true,
    },

    result: {
      type: String,
      enum: ["Normal", "Abnormal", "Pending"],
      default: "Pending",
    },

    resultValue: {
      type: String,
      default: "",
      trim: true,
    },

    referenceRange: {
      type: String,
      default: "",
      trim: true,
    },

    summary: {
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

const LabReport = mongoose.model(
  "LabReport",
  labReportSchema
);

export default LabReport;