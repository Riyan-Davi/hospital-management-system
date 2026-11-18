import LabReport from "../models/LabReport.js";

const getLabReports = async (req, res) => {
  try {
    const reports = await LabReport.find({
      patient: req.user.id,
    }).sort({ reportDate: -1 });

    res.json({ reports });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getLabReport = async (req, res) => {
  try {
    const report = await LabReport.findOne({
      _id: req.params.id,
      patient: req.user.id,
    });

    if (!report) {
      return res.status(404).json({
        message: "Lab report not found",
      });
    }

    res.json({ report });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const createLabReport = async (req, res) => {
  try {
    const {
      testName,
      reportDate,
      laboratory,
      doctorName,
      result,
      normalRange,
      status,
      notes,
      fileName,
      fileUrl,
    } = req.body;

    if (!testName || !reportDate) {
      return res.status(400).json({
        message: "Test name and report date are required",
      });
    }

    const report = await LabReport.create({
      patient: req.user.id,
      testName,
      reportDate,
      laboratory: laboratory || "",
      doctorName: doctorName || "",
      result: result || "",
      normalRange: normalRange || "",
      status: status || "Normal",
      notes: notes || "",
      fileName: fileName || "",
      fileUrl: fileUrl || "",
    });

    res.status(201).json({
      message: "Lab report created successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteLabReport = async (req, res) => {
  try {
    const report = await LabReport.findOne({
      _id: req.params.id,
      patient: req.user.id,
    });

    if (!report) {
      return res.status(404).json({
        message: "Lab report not found",
      });
    }

    await report.deleteOne();

    res.json({
      message: "Lab report deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  getLabReports,
  getLabReport,
  createLabReport,
  deleteLabReport,
};