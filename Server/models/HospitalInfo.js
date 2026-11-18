import mongoose from "mongoose";

const hospitalInfoSchema = new mongoose.Schema(
  {
    hospitalName: {
      type: String,
      default: "City General Hospital",
    },
    logo: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "Providing world-class healthcare with state-of-the-art facilities and experienced medical professionals.",
    },
    address: {
      type: String,
      default: "123 Healthcare Avenue, Medical District, City",
    },
    phone: {
      type: String,
      default: "+1 (555) 123-4567",
    },
    email: {
      type: String,
      default: "info@cityhospital.com",
    },
    emergencyNumber: {
      type: String,
      default: "+1 (555) 911-0000",
    },
    website: {
      type: String,
      default: "www.cityhospital.com",
    },
    workingHours: {
      type: String,
      default: "24/7 Emergency Services | OPD: Mon - Sat (8 AM - 8 PM)",
    },
    mission: {
      type: String,
      default: "To provide compassionate, accessible, high-quality, cost-effective healthcare to the community.",
    },
    vision: {
      type: String,
      default: "To be the leading healthcare institution recognized for clinical excellence and patient care.",
    },
    facilities: [
      { type: String }
    ],
    services: [
      { type: String }
    ],
  },
  { timestamps: true }
);

const HospitalInfo = mongoose.model("HospitalInfo", hospitalInfoSchema);
export default HospitalInfo;
