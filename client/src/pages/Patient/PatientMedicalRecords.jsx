import { API_BASE_URL } from "../../config/api";
import { useEffect, useState } from "react";
import PatientLayout from "./PatientLayout";
import "./PatientMedicalRecords.css";

function PatientMedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    recordType: "Others",
    doctorName: "",
    specialty: "",
    hospital: "",
    recordDate: "",
    description: "",
    fileName: "",
    fileUrl: "",
  });

  const token = localStorage.getItem("token");

  const fetchRecords = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/medical-records`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load records");
      }

      setRecords(data.records || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
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
        `${API_BASE_URL}/api/medical-records`,
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
        throw new Error(data.message || "Failed to create record");
      }

      setRecords((prev) => [data.record, ...prev]);

      setFormData({
        title: "",
        recordType: "Others",
        doctorName: "",
        specialty: "",
        hospital: "",
        recordDate: "",
        description: "",
        fileName: "",
        fileUrl: "",
      });

      setShowForm(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medical record?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/medical-records/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete record");
      }

      setRecords((prev) => prev.filter((record) => record._id !== id));

      if (selectedRecord?._id === id) {
        setSelectedRecord(null);
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
      <div className="patient-records-page">
        <div className="records-header">
          <div>
            <p className="section-label">MEDICAL RECORDS</p>
            <h1>My Medical Records</h1>
            <p className="records-subtitle">
              View and manage your medical history and documents.
            </p>
          </div>

          <button
            className="add-record-btn"
            onClick={() => setShowForm(true)}
          >
            + Add Record
          </button>
        </div>

        {error && <div className="records-error">{error}</div>}

        {loading ? (
          <div className="records-empty">Loading medical records...</div>
        ) : records.length === 0 ? (
          <div className="records-empty">
            <h3>No medical records found</h3>
            <p>Your medical records will appear here.</p>
          </div>
        ) : (
          <div className="records-grid">
            {records.map((record) => (
              <div className="record-card" key={record._id}>
                <div className="record-card-top">
                  <span className="record-type">
                    {record.recordType || "Others"}
                  </span>

                  <span className="record-date">
                    {formatDate(record.recordDate)}
                  </span>
                </div>

                <h3>{record.title}</h3>

                {record.doctorName && (
                  <p>
                    <strong>Doctor:</strong> {record.doctorName}
                  </p>
                )}

                {record.hospital && (
                  <p>
                    <strong>Hospital:</strong> {record.hospital}
                  </p>
                )}

                {record.description && (
                  <p className="record-description">
                    {record.description}
                  </p>
                )}

                <div className="record-actions">
                  <button
                    onClick={() => setSelectedRecord(record)}
                  >
                    View
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(record._id)}
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
            <div className="record-modal">
              <div className="modal-header">
                <div>
                  <p className="section-label">NEW RECORD</p>
                  <h2>Add Medical Record</h2>
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
                    <label>Title</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Blood Test Report"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Record Type</label>
                    <select
                      name="recordType"
                      value={formData.recordType}
                      onChange={handleChange}
                    >
                      <option>Lab Report</option>
                      <option>Prescription</option>
                      <option>Visit Summary</option>
                      <option>Imaging</option>
                      <option>Others</option>
                    </select>
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
                    <label>Specialty</label>
                    <input
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      placeholder="e.g. Cardiology"
                    />
                  </div>

                  <div className="form-group">
                    <label>Hospital</label>
                    <input
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleChange}
                      placeholder="Hospital name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Record Date</label>
                    <input
                      type="date"
                      name="recordDate"
                      value={formData.recordDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Add notes about this record"
                      rows="4"
                    />
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

                  <div className="form-group">
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
                    Save Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedRecord && (
          <div className="modal-overlay">
            <div className="record-modal details-modal">
              <div className="modal-header">
                <div>
                  <p className="section-label">RECORD DETAILS</p>
                  <h2>{selectedRecord.title}</h2>
                </div>

                <button
                  className="close-btn"
                  onClick={() => setSelectedRecord(null)}
                >
                  ×
                </button>
              </div>

              <div className="record-details">
                <div>
                  <span>Record Type</span>
                  <strong>{selectedRecord.recordType}</strong>
                </div>

                <div>
                  <span>Record Date</span>
                  <strong>
                    {formatDate(selectedRecord.recordDate)}
                  </strong>
                </div>

                <div>
                  <span>Doctor</span>
                  <strong>{selectedRecord.doctorName || "—"}</strong>
                </div>

                <div>
                  <span>Specialty</span>
                  <strong>{selectedRecord.specialty || "—"}</strong>
                </div>

                <div>
                  <span>Hospital</span>
                  <strong>{selectedRecord.hospital || "—"}</strong>
                </div>

                <div className="details-full">
                  <span>Description</span>
                  <p>{selectedRecord.description || "No description added."}</p>
                </div>

                {selectedRecord.fileUrl && (
                  <div className="details-full">
                    <span>Document</span>
                    <a
                      href={selectedRecord.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {selectedRecord.fileName || "Open document"}
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

export default PatientMedicalRecords;