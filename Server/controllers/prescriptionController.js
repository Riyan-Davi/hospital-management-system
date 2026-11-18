import Prescription from "../models/Prescription.js";

const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patient: req.user.id,
    }).sort({ startDate: -1 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let changed = false;

    for (const prescription of prescriptions) {
      if (
        prescription.endDate &&
        new Date(prescription.endDate) < today &&
        prescription.status === "Active"
      ) {
        prescription.status = "Expired";
        await prescription.save();
        changed = true;
      }
    }

    const updatedPrescriptions = changed
      ? await Prescription.find({
          patient: req.user.id,
        }).sort({ startDate: -1 })
      : prescriptions;

    res.json({
      prescriptions: updatedPrescriptions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updatePrescriptionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Active",
      "Completed",
      "Expired",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid prescription status",
      });
    }

    const prescription = await Prescription.findOne({
      _id: req.params.id,
      patient: req.user.id,
    });

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    prescription.status = status;

    await prescription.save();

    res.json({
      message: "Prescription status updated successfully",
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  getPrescriptions,
  updatePrescriptionStatus,
};