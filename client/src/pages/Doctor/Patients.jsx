import { API_BASE_URL } from "../../config/api";
import { useEffect, useMemo, useState } from "react";
import DoctorLayout from "./DoctorLayout";
import "./Patients.css";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_BASE_URL}/api/doctor-patients`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load patients");
        }

        setPatients(data.patients || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return patients;

    return patients.filter(
      (patient) =>
        patient.name?.toLowerCase().includes(value) ||
        patient.email?.toLowerCase().includes(value) ||
        patient.phone?.toLowerCase().includes(value)
    );
  }, [patients, search]);

  const openPatient = async (patient) => {
    setSelectedPatient(patient);
    setPatientDetails(null);
    setDetailsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/doctor-patients/${patient.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load patient");
      }

      setPatientDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <DoctorLayout>
      <div className="doctor-patients-page">
        <div className="doctor-page-heading">
          <div>
            <span className="doctor-page-label">PATIENT MANAGEMENT</span>
            <h1>My Patients</h1>
            <p>View patients who have appointments with you.</p>
          </div>

          <div className="doctor-patient-count">
            <strong>{patients.length}</strong>
            <span>Patients</span>
          </div>
        </div>

        <div className="doctor-patients-toolbar">
          <div className="doctor-patient-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {error && <div className="doctor-patient-error">{error}</div>}

        {loading ? (
          <div className="doctor-patient-empty">
            <div className="doctor-loading">Loading patients...</div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="doctor-patient-empty">
            <div className="doctor-empty-icon">♟</div>
            <h3>No patients found</h3>
            <p>
              {search
                ? "Try a different search."
                : "Patients will appear here after they have appointments with you."}
            </p>
          </div>
        ) : (
          <div className="doctor-patient-grid">
            {filteredPatients.map((patient) => (
              <div className="doctor-patient-card" key={patient.id}>
                <div className="doctor-patient-card-top">
                  <div className="doctor-patient-avatar">
                    {patient.name?.charAt(0)?.toUpperCase() || "P"}
                  </div>

                  <div>
                    <h3>{patient.name}</h3>
                    <span>Patient</span>
                  </div>
                </div>

                <div className="doctor-patient-info">
                  <div>
                    <span>Email</span>
                    <strong>{patient.email || "—"}</strong>
                  </div>

                  <div>
                    <span>Phone</span>
                    <strong>{patient.phone || "—"}</strong>
                  </div>

                  <div>
                    <span>Gender</span>
                    <strong>{patient.gender || "—"}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="doctor-view-patient"
                  onClick={() => openPatient(patient)}
                >
                  View Patient
                  <span>→</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedPatient && (
          <div
            className="doctor-patient-modal-overlay"
            onClick={() => setSelectedPatient(null)}
          >
            <div
              className="doctor-patient-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="doctor-modal-close"
                onClick={() => setSelectedPatient(null)}
              >
                ×
              </button>

              {detailsLoading ? (
                <div className="doctor-modal-loading">
                  Loading patient details...
                </div>
              ) : patientDetails ? (
                <>
                  <div className="doctor-modal-header">
                    <div className="doctor-modal-avatar">
                      {patientDetails.patient?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "P"}
                    </div>

                    <div>
                      <span>PATIENT PROFILE</span>
                      <h2>{patientDetails.patient?.name}</h2>
                      <p>{patientDetails.patient?.email}</p>
                    </div>
                  </div>

                  <div className="doctor-modal-section">
                    <h3>Personal Information</h3>

                    <div className="doctor-modal-grid">
                      <div>
                        <span>Phone</span>
                        <strong>
                          {patientDetails.patient?.phone || "—"}
                        </strong>
                      </div>

                      <div>
                        <span>Date of Birth</span>
                        <strong>
                          {patientDetails.patient?.dateOfBirth || "—"}
                        </strong>
                      </div>

                      <div>
                        <span>Gender</span>
                        <strong>
                          {patientDetails.patient?.gender || "—"}
                        </strong>
                      </div>

                      <div>
                        <span>City</span>
                        <strong>
                          {patientDetails.patient?.city || "—"}
                        </strong>
                      </div>

                      <div className="doctor-modal-full">
                        <span>Address</span>
                        <strong>
                          {patientDetails.patient?.address || "—"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="doctor-modal-section">
                    <h3>Appointment History</h3>

                    {patientDetails.appointments?.length ? (
                      <div className="doctor-history-list">
                        {patientDetails.appointments.map((appointment) => (
                          <div
                            className="doctor-history-item"
                            key={appointment._id}
                          >
                            <div>
                              <strong>
                                {new Date(
                                  appointment.appointmentDate
                                ).toLocaleDateString()}
                              </strong>
                              <span>
                                {appointment.time} ·{" "}
                                {appointment.type || "Consultation"}
                              </span>
                            </div>

                            <span
                              className={`doctor-history-status ${appointment.status
                                ?.toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            >
                              {appointment.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="doctor-no-history">
                        No appointment history found.
                      </p>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}

export default Patients;