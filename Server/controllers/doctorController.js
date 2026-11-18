import User from "../models/User.js";

const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
    })
      .select(
        "name email phone specialization qualification experience consultationFee bio city state country"
      )
      .sort({ name: 1 });

    res.json({
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getDoctor = async (req, res) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      role: "doctor",
    }).select(
      "name email phone specialization qualification experience consultationFee bio city state country"
    );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json({
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  getDoctors,
  getDoctor,
};