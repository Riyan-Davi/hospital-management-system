
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "./models/User.js";
import Department from "./models/Department.js";
import HospitalInfo from "./models/HospitalInfo.js";
import Appointment from "./models/Appointment.js";
import AuditLog from "./models/AuditLog.js";

dotenv.config();

const DEFAULT_PASSWORD = "Password123!";

const departmentsData = [
  {
    name: "Cardiology",
    description: "Comprehensive heart and cardiovascular care",
    icon: "heart",
    headDoctor: "Dr. Sarah Jenkins",
  },
  {
    name: "Neurology",
    description: "Brain, spine and nerve diagnostic care",
    icon: "activity",
    headDoctor: "Dr. Robert Vance",
  },
  {
    name: "Orthopedics",
    description: "Bone, joint and musculoskeletal care",
    icon: "shield",
    headDoctor: "Dr. Marcus Thorne",
  },
  {
    name: "Pediatrics",
    description: "Specialized infant and child healthcare",
    icon: "smile",
    headDoctor: "Dr. Emily Watson",
  },
  {
    name: "Dermatology",
    description: "Skin, hair and cosmetic care",
    icon: "sun",
    headDoctor: "Dr. Alan Grant",
  },
  {
    name: "General Medicine",
    description: "Primary diagnosis and preventive medicine",
    icon: "plus-circle",
    headDoctor: "Dr. John Harrison",
  },
  {
    name: "General Surgery",
    description: "Advanced surgical care",
    icon: "scissors",
    headDoctor: "Dr. Elena Rostova",
  },
  {
    name: "Gynecology",
    description: "Women's reproductive and maternity care",
    icon: "user",
    headDoctor: "Dr. Clara Oswald",
  },
];

const doctorsData = [
  {
    name: "Dr. John Harrison",
    email: "doctor@hospital.com",
    role: "doctor",
    status: "active",
    specialization: "General Medicine",
    department: "General Medicine",
    qualification: "MBBS, MD",
    experience: "12 Years",
    consultationFee: 500,
    phone: "+1 (555) 234-5678",
    licenseNumber: "MED-99201",
    bio: "Senior physician specializing in chronic disease management and internal medicine.",
    availableDays: "Mon, Tue, Wed, Thu, Fri",
    workingHours: "09:00 AM - 04:00 PM",
  },
  {
    name: "Dr. Sarah Jenkins",
    email: "sarah.jenkins@hospital.com",
    role: "doctor",
    status: "active",
    specialization: "Cardiology",
    department: "Cardiology",
    qualification: "MBBS, DM (Cardiology)",
    experience: "15 Years",
    consultationFee: 1200,
    phone: "+1 (555) 345-6789",
    licenseNumber: "MED-88102",
    bio: "Interventional cardiologist specializing in cardiac care.",
    availableDays: "Mon, Wed, Fri",
    workingHours: "10:00 AM - 05:00 PM",
  },
  {
    name: "Dr. Robert Vance",
    email: "robert.vance@hospital.com",
    role: "doctor",
    status: "active",
    specialization: "Neurology",
    department: "Neurology",
    qualification: "MD, DM (Neurology)",
    experience: "10 Years",
    consultationFee: 1000,
    phone: "+1 (555) 456-7890",
    licenseNumber: "MED-77304",
    bio: "Specialist in neurological disorders, stroke management and epilepsy.",
    availableDays: "Tue, Thu, Sat",
    workingHours: "09:00 AM - 03:00 PM",
  },
  {
    name: "Dr. Emily Watson",
    email: "emily.watson@hospital.com",
    role: "doctor",
    status: "active",
    specialization: "Pediatrics",
    department: "Pediatrics",
    qualification: "MBBS, DCH, MD",
    experience: "8 Years",
    consultationFee: 600,
    phone: "+1 (555) 567-8901",
    licenseNumber: "MED-66405",
    bio: "Pediatrician specializing in newborn and child healthcare.",
    availableDays: "Mon, Tue, Thu, Fri",
    workingHours: "08:00 AM - 02:00 PM",
  },
];

const patientsData = [
  {
    name: "Alex Johnson",
    email: "patient@hospital.com",
    role: "patient",
    status: "active",
    phone: "+1 (555) 777-8888",
    dateOfBirth: "1992-06-20",
    gender: "Male",
    bloodGroup: "O+",
    address: "45 Elm Street, Cityville",
    allergies: "Penicillin",
    medicalConditions: "Mild Asthma",
    medications: "Albuterol Inhaler",
    emergencyContact: "Mary Johnson (Spouse)",
    emergencyPhone: "+1 (555) 777-9999",
  },
  {
    name: "Emily Davis",
    email: "emily.davis@hospital.com",
    role: "patient",
    status: "active",
    phone: "+1 (555) 888-9999",
    dateOfBirth: "1988-11-12",
    gender: "Female",
    bloodGroup: "A+",
    address: "88 Maple Drive, Cityville",
    allergies: "Peanuts",
    medicalConditions: "Hypertension",
    medications: "Lisinopril 10mg",
  },
  {
    name: "Michael Brown",
    email: "michael.brown@hospital.com",
    role: "patient",
    status: "active",
    phone: "+1 (555) 999-0000",
    dateOfBirth: "1975-03-30",
    gender: "Male",
    bloodGroup: "B-",
    address: "12 Pine Ridge Road",
    allergies: "None",
    medicalConditions: "Type 2 Diabetes",
  },
];

const hospitalData = {
  hospitalName: "Metro Care General Hospital",
  about:
    "Metro Care General Hospital is a multispecialty medical center committed to compassionate healthcare.",
  address: "100 Medical Center Parkway, Metropolitan Area",
  phone: "+1 (800) 555-CARE",
  email: "contact@metrocarehospital.com",
  emergencyNumber: "+1 (800) 911-EMERGENCY",
  website: "www.metrocarehospital.com",
  workingHours: "24/7 Emergency and ICU Services",
  mission:
    "Delivering exceptional healthcare services with empathy and innovation.",
  vision:
    "To be recognized as a center of healthcare excellence.",
  facilities: [
    "24/7 Trauma and Emergency Center",
    "Advanced Intensive Care Unit",
    "Modern Operation Theatres",
    "MRI and CT Scan Diagnostic Suite",
    "Pathology Laboratory",
    "In-house Pharmacy and Blood Bank",
    "Pediatric and Maternity Wings",
  ],
  services: [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Dermatology",
    "General Surgery",
    "Emergency Medicine",
  ],
};

const seedUserIfMissing = async (userData, passwordHash) => {
  const existingUser = await User.findOne({
    email: userData.email.toLowerCase(),
  });

  if (existingUser) {
    console.log(`Existing account preserved: ${userData.email}`);
    return existingUser;
  }

  const user = await User.create({
    ...userData,
    email: userData.email.toLowerCase(),
    password: passwordHash,
  });

  console.log(`Created account: ${userData.email}`);

  return user;
};

const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from Server/.env");
    }

    console.log("Connecting to MongoDB Atlas...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully.");

    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    // 1. Admin account
    console.log("\nSeeding Admin...");

    const admin = await seedUserIfMissing(
      {
        name: "Hospital Administrator",
        email: "admin@hospital.com",
        role: "admin",
        status: "active",
        phone: "+1 (555) 000-1111",
      },
      passwordHash
    );

    // 2. Departments
    console.log("\nSeeding Departments...");

    for (const department of departmentsData) {
      await Department.updateOne(
        { name: department.name },
        { $setOnInsert: department },
        { upsert: true }
      );
    }

    // 3. Doctors
    console.log("\nSeeding Doctors...");

    const seededDoctors = [];

    for (const doctor of doctorsData) {
      const user = await seedUserIfMissing(
        doctor,
        passwordHash
      );

      seededDoctors.push(user);
    }

    // 4. Patients
    console.log("\nSeeding Patients...");

    const seededPatients = [];

    for (const patient of patientsData) {
      const user = await seedUserIfMissing(
        patient,
        passwordHash
      );

      seededPatients.push(user);
    }

    // 5. Hospital information
    console.log("\nSeeding Hospital Information...");

    const existingHospital = await HospitalInfo.findOne({});

    if (!existingHospital) {
      await HospitalInfo.create(hospitalData);
      console.log("Hospital information created.");
    } else {
      console.log("Existing hospital information preserved.");
    }

    // 6. Sample appointments
    console.log("\nSeeding Sample Appointments...");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const sampleAppointments = [
      {
        patient: seededPatients[0]._id,
        doctor: seededDoctors[0]._id,
        appointmentDate: today,
        time: "10:30 AM",
        type: "Consultation",
        reason: "Routine health checkup and BP review",
        status: "Confirmed",
      },
      {
        patient: seededPatients[1]._id,
        doctor: seededDoctors[1]._id,
        appointmentDate: nextWeek,
        time: "02:00 PM",
        type: "Follow-up",
        reason: "ECG evaluation and cardiac consultation",
        status: "Scheduled",
      },
      {
        patient: seededPatients[2]._id,
        doctor: seededDoctors[2]._id,
        appointmentDate: today,
        time: "11:00 AM",
        type: "Consultation",
        reason: "Headache and migraine assessment",
        status: "Completed",
      },
    ];

    for (const appointment of sampleAppointments) {
      const existingAppointment = await Appointment.findOne({
        patient: appointment.patient,
        doctor: appointment.doctor,
        time: appointment.time,
        reason: appointment.reason,
      });

      if (!existingAppointment) {
        await Appointment.create(appointment);
        console.log(`Created appointment: ${appointment.reason}`);
      } else {
        console.log(`Existing appointment preserved: ${appointment.reason}`);
      }
    }

    // 7. Initial audit log
    console.log("\nChecking initial audit log...");

    const existingAudit = await AuditLog.findOne({
      userId: admin._id,
      action: "SYSTEM_INIT",
    });

    if (!existingAudit) {
      await AuditLog.create({
        userId: admin._id,
        userName: admin.name,
        userRole: "admin",
        action: "SYSTEM_INIT",
        entity: "System",
        description:
          "Hospital Management System database initialized successfully.",
      });

      console.log("Initial audit log created.");
    } else {
      console.log("Initial audit log already exists.");
    }

    console.log("\n====================================");
    console.log("DATABASE SEEDING COMPLETED");
    console.log("====================================");
    console.log("Demo accounts are created only when missing.");
    console.log("Existing account passwords are preserved.");
    console.log("Default password for newly created demo accounts:");
    console.log(DEFAULT_PASSWORD);
    console.log("====================================");
  } catch (error) {
    console.error("\nDATABASE SEEDING FAILED:");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
};

seedDatabase();
