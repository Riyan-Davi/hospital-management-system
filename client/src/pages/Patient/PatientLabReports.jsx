import { API_BASE_URL } from "../../config/api";
import { useEffect, useState } from "react";
import PatientLayout from "./PatientLayout";
import "./PatientLabReports.css";

function PatientLabReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    testName: "",
    reportDate: "",
    laboratory: "",
    doctorName: "",
    result: "",
    normalRange: "",
    status: "Normal",
    notes: "",
    fileName: "",
    fileUrl: "",
  });

  const token = localStorage.getItem("token");

  const fetchReports = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/lab-reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load lab reports");
      }

      setReports(data.reports || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/lab-reports`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create lab report");
      }

      setReports((prev) => [data.report, ...prev]);

      setFormData({
        testName: "",
        reportDate: "",
        laboratory: "",
        doctorName: "",
        result: "",
        normalRange: "",
        status: "Normal",
        notes: "",
        fileName: "",
        fileUrl: "",
      });

      setShowForm(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lab report?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/lab-reports/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete lab report");
      }

      setReports((prev) => prev.filter((report) => report._id !== id));

      if (selectedReport?._id === id) {
        setSelectedReport(null);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <PatientLayout>
      <div className="lab-reports-page">
        <div className="lab-header">
          <div>
            <p className="section-label">LAB REPORTS</p>
            <h1>My Lab Reports</h1>
            <p className="lab-subtitle">
              View and manage your laboratory test reports.
            </p>
          </div>

          <button
            className="add-report-btn"
            onClick={() => setShowForm(true)}
          >
            + Add Report
          </button>
        </div>

        {error && <div className="lab-error">{error}</div>}

        {loading ? (
          <div className="lab-empty">Loading lab reports...</div>
        ) : reports.length === 0 ? (
          <div className="lab-empty">
            <h3>No lab reports found</h3>
            <p>Your laboratory reports will appear here.</p>
          </div>
        ) : (
          <div className="lab-grid">
            {reports.map((report) => (
              <div className="lab-card" key={report._id}>
                <div className="lab-card-top">
                  <span className="lab-status">
                    {report.status || "Normal"}
                  </span>

                  <span className="lab-date">
                    {formatDate(report.reportDate)}
                  </span>
                </div>

                <h3>{report.testName}</h3>

                {report.laboratory && (
                  <p>
                    <strong>Laboratory:</strong> {report.laboratory}
                  </p>
                )}

                {report.doctorName && (
                  <p>
                    <strong>Doctor:</strong> {report.doctorName}
                  </p>
                )}

                {report.result && (
                  <p>
                    <strong>Result:</strong> {report.result}
                  </p>
                )}

                <div className="lab-actions">
                  <button onClick={() => setSelectedReport(report)}>
                    View
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(report._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="modal-overlay">
            <div className="lab-modal">
              <div className="modal-header">
                <div>
                  <p className="section-label">NEW REPORT</p>
                  <h2>Add Lab Report</h2>
                </div>

                <button
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Test Name</label>
                    <input
                      name="testName"
                      value={formData.testName}
                      onChange={handleChange}
                      placeholder="e.g. Complete Blood Count"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Report Date</label>
                    <input
                      type="date"
                      name="reportDate"
                      value={formData.reportDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Laboratory</label>
                    <input
                      name="laboratory"
                      value={formData.laboratory}
                      onChange={handleChange}
                      placeholder="Laboratory name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Doctor Name</label>
                    <input
                      name="doctorName"
                      value={formData.doctorName}
                      onChange={handleChange}
                      placeholder="Doctor name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Result</label>
                    <input
                      name="result"
                      value={formData.result}
                      onChange={handleChange}
                      placeholder="Test result"
                    />
                  </div>

                  <div className="form-group">
                    <label>Normal Range</label>
                    <input
                      name="normalRange"
                      value={formData.normalRange}
                      onChange={handleChange}
                      placeholder="Normal reference range"
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option>Normal</option>
                      <option>Abnormal</option>
                      <option>Pending</option>
                      <option>Critical</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>File Name</label>
                    <input
                      name="fileName"
                      value={formData.fileName}
                      onChange={handleChange}
                      placeholder="report.pdf"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Additional notes"
                      rows="4"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>File URL</label>
                    <input
                      name="fileUrl"
                      value={formData.fileUrl}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="save-btn">
                    Save Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedReport && (
          <div className="modal-overlay">
            <div className="lab-modal details-modal">
              <div className="modal-header">
                <div>
                  <p className="section-label">REPORT DETAILS</p>
                  <h2>{selectedReport.testName}</h2>
                </div>

                <button
                  className="close-btn"
                  onClick={() => setSelectedReport(null)}
                >
                  ×
                </button>
              </div>

              <div className="report-details">
                <div>
                  <span>Report Date</span>
                  <strong>
                    {formatDate(selectedReport.reportDate)}
                  </strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>{selectedReport.status || "Normal"}</strong>
                </div>

                <div>
                  <span>Laboratory</span>
                  <strong>{selectedReport.laboratory || "—"}</strong>
                </div>

                <div>
                  <span>Doctor</span>
                  <strong>{selectedReport.doctorName || "—"}</strong>
                </div>

                <div>
                  <span>Result</span>
                  <strong>{selectedReport.result || "—"}</strong>
                </div>

                <div>
                  <span>Normal Range</span>
                  <strong>{selectedReport.normalRange || "—"}</strong>
                </div>

                <div className="details-full">
                  <span>Notes</span>
                  <p>{selectedReport.notes || "No notes added."}</p>
                </div>

                {selectedReport.fileUrl && (
                  <div className="details-full">
                    <span>Document</span>
                    <a
                      href={selectedReport.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {selectedReport.fileName || "Open report"}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}

export default PatientLabReports;