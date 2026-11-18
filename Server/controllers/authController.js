
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, role } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: "Name, valid email and a password of at least 8 characters are required.",
      });
    }

    const selectedRole = String(role || "").toLowerCase();

    if (!["patient", "doctor"].includes(selectedRole)) {
      return res.status(400).json({
        message: "Public registration is available for Patients and Doctors only.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Doctor accounts require Admin activation before login.
    const accountStatus =
      selectedRole === "doctor" ? "inactive" : "active";

    const user = await User.create({
      name: name.trim().slice(0, 120),
      email: cleanEmail,
      password: hashedPassword,
      role: selectedRole,
      status: accountStatus,
      phone: typeof phone === "string" ? phone.trim().slice(0, 40) : "",
      dateOfBirth:
        typeof dateOfBirth === "string" ? dateOfBirth.trim() : "",
    });

    return res.status(201).json({
      message:
        selectedRole === "doctor"
          ? "Doctor registration submitted. Please wait for Admin activation before logging in."
          : "Registration successful. You can now log in.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    console.error("Registration failed:", error.message);

    return res.status(500).json({
      message: "Registration failed due to a server error.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from Server/.env");
      return res.status(500).json({
        message: "Login is temporarily unavailable due to server configuration.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message:
          user.role === "doctor"
            ? "Your Doctor account is awaiting Admin activation or has been deactivated."
            : "Your account is inactive. Please contact the hospital administrator.",
      });
    }

    const selectedRole = String(role || "").toLowerCase();

    if (!["patient", "doctor", "admin"].includes(selectedRole)) {
      return res.status(400).json({
        message: "Please select a valid account type.",
      });
    }

    if (user.role !== selectedRole) {
      return res.status(403).json({
        message: `This account is not registered as a ${selectedRole === "admin" ? "Hospital Admin" : selectedRole}.`,
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
        zipCode: user.zipCode,
        specialization: user.specialization,
        department: user.department,
        qualification: user.qualification,
        experience: user.experience,
        licenseNumber: user.licenseNumber,
        consultationFee: user.consultationFee,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Login failed:", error.message);

    return res.status(500).json({
      message: "Login failed due to a server error.",
    });
  }
};

export { register, login };
