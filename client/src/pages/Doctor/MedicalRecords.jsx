import { API_BASE_URL } from "../../config/api";
import { useEffect, useMemo, useState } from "react";
import DoctorLayout from "./DoctorLayout";
import "./MedicalRecords.css";

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/doctor-medical-records`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load medical records"
          );
        }

        setRecords(data.records || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [token]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesFilter =
        activeFilter === "All" ||
        record.recordType === activeFilter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        record.title?.toLowerCase().includes(searchText) ||
        record.patient?.name
          ?.toLowerCase()
          .includes(searchText) ||
        record.doctorName
          ?.toLowerCase()
          .includes(searchText) ||
        record.specialty
          ?.toLowerCase()
          .includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [records, search, activeFilter]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DoctorLayout>
      <div className="doctor-medical-records-page">

        <div className="medical-records-header">
          <div>
            <p className="section-label">
              PATIENT HEALTH INFORMATION
            </p>

            <h1>Medical Records</h1>

            <p className="medical-records-subtitle">
              View medical records belonging to patients
              under your care.
            </p>
          </div>
        </div>

        {error && (
          <div className="medical-records-error">
            {error}
          </div>
        )}

        <div className="records-toolbar">
          <div className="records-count">
            <strong>{filteredRecords.length}</strong>
            <span>Records</span>
          </div>

          <div className="records-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search records or patients..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        </div>

        <div className="records-filters">
          {[
            "All",
            "Lab Report",
            "Prescription",
            "Visit Summary",
            "Imaging",
            "Others",
          ].map((filter) => (
            <button
              key={filter}
              className={
                activeFilter === filter
                  ? "record-filter active"
                  : "record-filter"
              }
              onClick={() =>
                setActiveFilter(filter)
              }
            >
              {filter}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="medical-records-loading">
            <div className="records-spinner"></div>
            <p>Loading medical records...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="medical-records-empty">
            <div className="empty-record-icon">
              ▤
            </div>

            <h2>No medical records found</h2>

            <p>
              Medical records from your patients will
              appear here.
            </p>
          </div>
        ) : (
          <div className="medical-records-grid">
            {filteredRecords.map((record) => (
              <div
                className="medical-record-card"
                key={record._id}
              >
                <div className="record-card-header">
                  <span className="record-type">
                    {record.recordType}
                  </span>

                  <span className="record-date">
                    {formatDate(record.recordDate)}
                  </span>
                </div>

                <h2>{record.title}</h2>

                <div className="record-patient">
                  <div className="patient-avatar">
                    {record.patient?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "P"}
                  </div>

                  <div>
                    <span>Patient</span>
                    <strong>
                      {record.patient?.name ||
                        "Unknown Patient"}
                    </strong>
                  </div>
                </div>

                {record.doctorName && (
                  <div className="record-info">
                    <span>Doctor</span>
                    <strong>
                      {record.doctorName}
                    </strong>
                  </div>
                )}

                {record.specialty && (
                  <div className="record-info">
                    <span>Specialty</span>
                    <strong>
                      {record.specialty}
                    </strong>
                  </div>
                )}

                {record.description && (
                  <p className="record-description">
                    {record.description}
                  </p>
                )}

                <div className="record-card-footer">
                  <button
                    onClick={() =>
                      setSelectedRecord(record)
                    }
                  >
                    View Record
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedRecord && (
          <div className="record-modal-overlay">
            <div className="record-modal">

              <div className="record-modal-header">
                <div>
                  <p className="section-label">
                    MEDICAL RECORD
                  </p>

                  <h2>
                    {selectedRecord.title}
                  </h2>
                </div>

                <button
                  className="record-modal-close"
                  onClick={() =>
                    setSelectedRecord(null)
                  }
                >
                  ×
                </button>
              </div>

              <div className="record-modal-grid">

                <div>
                  <span>Patient</span>
                  <strong>
                    {selectedRecord.patient?.name ||
                      "Unknown Patient"}
                  </strong>
                </div>

                <div>
                  <span>Record Type</span>
                  <strong>
                    {selectedRecord.recordType}
                  </strong>
                </div>

                <div>
                  <span>Record Date</span>
                  <strong>
                    {formatDate(
                      selectedRecord.recordDate
                    )}
                  </strong>
                </div>

                <div>
                  <span>Doctor</span>
                  <strong>
                    {selectedRecord.doctorName ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>Specialty</span>
                  <strong>
                    {selectedRecord.specialty ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>Hospital</span>
                  <strong>
                    {selectedRecord.hospital ||
                      "—"}
                  </strong>
                </div>

                <div className="record-modal-full">
                  <span>Description</span>

                  <p>
                    {selectedRecord.description ||
                      "No description available."}
                  </p>
                </div>

                {selectedRecord.fileName && (
                  <div className="record-modal-full">
                    <span>File</span>

                    <strong>
                      {selectedRecord.fileName}
                    </strong>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </DoctorLayout>
  );
}

export default MedicalRecords;