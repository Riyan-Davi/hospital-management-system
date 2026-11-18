import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    dateOfBirth: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    zipCode: {
      type: String,
      default: "",
      trim: true,
    },

    // Doctor-specific information
    specialization: {
      type: String,
      default: "",
      trim: true,
    },

    department: {
      type: String,
      default: "",
      trim: true,
    },

    qualification: {
      type: String,
      default: "",
      trim: true,
    },

    experience: {
      type: String,
      default: "",
      trim: true,
    },

    licenseNumber: {
      type: String,
      default: "",
      trim: true,
    },

    consultationFee: {
      type: Number,
      default: 0,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    languages: {
      type: String,
      default: "English",
    },

    availableDays: {
      type: String,
      default: "Mon, Tue, Wed, Thu, Fri",
    },

    workingHours: {
      type: String,
      default: "09:00 AM - 05:00 PM",
    },

    // Patient-specific medical information
    bloodGroup: {
      type: String,
      default: "",
    },

    emergencyContact: {
      type: String,
      default: "",
    },

    emergencyPhone: {
      type: String,
      default: "",
    },

    allergies: {
      type: String,
      default: "None",
    },

    medicalConditions: {
      type: String,
      default: "None",
    },

    medications: {
      type: String,
      default: "None",
    },

    insuranceInformation: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;