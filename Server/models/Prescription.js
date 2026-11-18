import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },

    diagnosis: {
      type: String,
      default: "",
      trim: true,
    },

    medicines: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        dosage: {
          type: String,
          default: "",
          trim: true,
        },
        frequency: {
          type: String,
          default: "",
          trim: true,
        },
        duration: {
          type: String,
          default: "",
          trim: true,
        },
        instructions: {
          type: String,
          default: "",
          trim: true,
        },
      },
    ],

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    prescriptionDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Prescription = mongoose.model(
  "Prescription",
  prescriptionSchema
);

export default Prescription;