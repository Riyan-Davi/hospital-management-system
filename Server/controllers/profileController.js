import User from "../models/User.js";

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      country,
      zipCode,
      specialization,
      qualification,
      experience,
      licenseNumber,
      consultationFee,
      bio,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.gender = gender;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (country !== undefined) user.country = country;
    if (zipCode !== undefined) user.zipCode = zipCode;

    if (user.role === "doctor") {
      if (specialization !== undefined) {
        user.specialization = specialization;
      }

      if (qualification !== undefined) {
        user.qualification = qualification;
      }

      if (experience !== undefined) {
        user.experience = experience;
      }

      if (licenseNumber !== undefined) {
        user.licenseNumber = licenseNumber;
      }

      if (consultationFee !== undefined) {
        user.consultationFee = Number(consultationFee) || 0;
      }

      if (bio !== undefined) {
        user.bio = bio;
      }
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
        zipCode: user.zipCode,
        specialization: user.specialization,
        qualification: user.qualification,
        experience: user.experience,
        licenseNumber: user.licenseNumber,
        consultationFee: user.consultationFee,
        bio: user.bio,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  getProfile,
  updateProfile,
};