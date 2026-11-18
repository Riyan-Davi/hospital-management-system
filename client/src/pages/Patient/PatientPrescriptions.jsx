import { API_BASE_URL } from "../../config/api";
import { useEffect, useMemo, useState } from "react";
import PatientLayout from "./PatientLayout";
import "./PatientPrescriptions.css";

function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPrescription, setSelectedPrescription] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_BASE_URL}/api/patient-prescriptions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load prescriptions"
          );
        }

        setPrescriptions(data.prescriptions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const filteredPrescriptions = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return prescriptions;

    return prescriptions.filter(
      (prescription) =>
        prescription.doctor?.name
          ?.toLowerCase()
          .includes(value) ||
        prescription.doctor?.specialization
          ?.toLowerCase()
          .includes(value) ||
        prescription.diagnosis
          ?.toLowerCase()
          .includes(value) ||
        prescription.medicines?.some((medicine) =>
          medicine.name?.toLowerCase().includes(value)
        )
    );
  }, [prescriptions, search]);

  return (
    <PatientLayout>
      <div className="patient-prescriptions-page">
        <div className="patient-prescriptions-heading">
          <div>
            <span className="patient-page-label">
              MEDICATION HISTORY
            </span>

            <h1>My Prescriptions</h1>

            <p>
              View prescriptions and medication instructions from your doctors.
            </p>
          </div>

          <div className="patient-prescriptions-count">
            <strong>{prescriptions.length}</strong>
            <span>Prescriptions</span>
          </div>
        </div>

        {error && (
          <div className="patient-prescription-error">
            {error}
          </div>
        )}

        <div className="patient-prescription-toolbar">
          <div className="patient-prescription-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search doctor, diagnosis or medicine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="patient-prescription-empty">
            Loading prescriptions...
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="patient-prescription-empty">
            <div className="patient-prescription-empty-icon">
              ▤
            </div>

            <h3>No prescriptions found</h3>

            <p>
              Prescriptions issued by your doctors will appear here.
            </p>
          </div>
        ) : (
          <div className="patient-prescription-list">
            {filteredPrescriptions.map((prescription) => (
              <div
                className="patient-prescription-card"
                key={prescription._id}
              >
                <div className="patient-prescription-header">
                  <div className="patient-prescription-doctor">
                    <div className="patient-prescription-avatar">
                      {prescription.doctor?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "D"}
                    </div>

                    <div>
                      <h3>
                        Dr.{" "}
                        {prescription.doctor?.name ||
                          "Doctor"}
                      </h3>

                      <span>
                        {prescription.doctor?.specialization ||
                          "General Physician"}
                      </span>
                    </div>
                  </div>

                  <span className="patient-prescription-date">
                    {new Date(
                      prescription.prescriptionDate
                    ).toLocaleDateString("en-IN")}
                  </span>
                </div>

                <div className="patient-prescription-diagnosis">
                  <span>DIAGNOSIS</span>

                  <strong>
                    {prescription.diagnosis ||
                      "General Consultation"}
                  </strong>
                </div>

                <div className="patient-prescription-medicines">
                  {prescription.medicines?.map(
                    (medicine, index) => (
                      <span key={index}>
                        {medicine.name}
                        {medicine.dosage
                          ? ` · ${medicine.dosage}`
                          : ""}
                      </span>
                    )
                  )}
                </div>

                <button
                  type="button"
                  className="patient-view-prescription"
                  onClick={() =>
                    setSelectedPrescription(
                      prescription
                    )
                  }
                >
                  View Prescription →
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedPrescription && (
          <div
            className="patient-prescription-overlay"
            onClick={() =>
              setSelectedPrescription(null)
            }
          >
            <div
              className="patient-prescription-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="patient-prescription-close"
                onClick={() =>
                  setSelectedPrescription(null)
                }
              >
                ×
              </button>

              <div className="patient-prescription-modal-title">
                <span>PRESCRIPTION DETAILS</span>

                <h2>
                  Dr.{" "}
                  {selectedPrescription.doctor?.name ||
                    "Doctor"}
                </h2>

                <p>
                  {selectedPrescription.doctor
                    ?.specialization ||
                    "General Physician"}
                </p>
              </div>

              <div className="patient-prescription-info">
                <div>
                  <span>Date</span>

                  <strong>
                    {new Date(
                      selectedPrescription.prescriptionDate
                    ).toLocaleDateString("en-IN")}
                  </strong>
                </div>

                <div>
                  <span>Diagnosis</span>

                  <strong>
                    {selectedPrescription.diagnosis ||
                      "General Consultation"}
                  </strong>
                </div>
              </div>

              <div className="patient-prescription-medicine-section">
                <h3>Medicines</h3>

                {selectedPrescription.medicines?.map(
                  (medicine, index) => (
                    <div
                      className="patient-medicine-detail"
                      key={index}
                    >
                      <div>
                        <strong>
                          {medicine.name}
                        </strong>

                        <span>
                          {medicine.dosage ||
                            "Dosage not specified"}
                        </span>
                      </div>

                      <div>
                        <span>Frequency</span>

                        <strong>
                          {medicine.frequency || "—"}
                        </strong>
                      </div>

                      <div>
                        <span>Duration</span>

                        <strong>
                          {medicine.duration || "—"}
                        </strong>
                      </div>

                      <div>
                        <span>Instructions</span>

                        <strong>
                          {medicine.instructions || "—"}
                        </strong>
                      </div>
                    </div>
                  )
                )}
              </div>

              {selectedPrescription.notes && (
                <div className="patient-prescription-notes">
                  <span>ADDITIONAL NOTES</span>

                  <p>
                    {selectedPrescription.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}

export default PatientPrescriptions;