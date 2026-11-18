import { API_BASE_URL } from "../../config/api";
import { useEffect, useMemo, useState } from "react";
import DoctorLayout from "./DoctorLayout";
import "./Prescriptions.css";

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    patientId: "",
    diagnosis: "",
    notes: "",
    prescriptionDate: new Date().toISOString().split("T")[0],
    medicines: [
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ],
  });

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setLoading(true);

      const [prescriptionResponse, patientResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/doctor-prescriptions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch(`${API_BASE_URL}/api/doctor-patients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const prescriptionData = await prescriptionResponse.json();
      const patientData = await patientResponse.json();

      if (!prescriptionResponse.ok) {
        throw new Error(
          prescriptionData.message || "Failed to load prescriptions"
        );
      }

      if (!patientResponse.ok) {
        throw new Error(patientData.message || "Failed to load patients");
      }

      setPrescriptions(prescriptionData.prescriptions || []);
      setPatients(patientData.patients || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPrescriptions = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return prescriptions;

    return prescriptions.filter(
      (prescription) =>
        prescription.patient?.name?.toLowerCase().includes(value) ||
        prescription.diagnosis?.toLowerCase().includes(value)
    );
  }, [prescriptions, search]);

  const updateMedicine = (index, field, value) => {
    setForm((previous) => {
      const medicines = [...previous.medicines];

      medicines[index] = {
        ...medicines[index],
        [field]: value,
      };

      return {
        ...previous,
        medicines,
      };
    });
  };

  const addMedicine = () => {
    setForm((previous) => ({
      ...previous,
      medicines: [
        ...previous.medicines,
        {
          name: "",
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ],
    }));
  };

  const removeMedicine = (index) => {
    if (form.medicines.length === 1) return;

    setForm((previous) => ({
      ...previous,
      medicines: previous.medicines.filter((_, i) => i !== index),
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/doctor-prescriptions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create prescription");
      }

      setShowCreate(false);

      setForm({
        patientId: "",
        diagnosis: "",
        notes: "",
        prescriptionDate: new Date().toISOString().split("T")[0],
        medicines: [
          {
            name: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: "",
          },
        ],
      });

      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const deletePrescription = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this prescription?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/doctor-prescriptions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete prescription");
      }

      setPrescriptions((previous) =>
        previous.filter((item) => item._id !== id)
      );

      setSelectedPrescription(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <DoctorLayout>
      <div className="doctor-prescriptions-page">
        <div className="doctor-prescription-heading">
          <div>
            <span className="doctor-page-label">MEDICATION MANAGEMENT</span>
            <h1>Prescriptions</h1>
            <p>Create and manage prescriptions for your patients.</p>
          </div>

          <button
            type="button"
            className="doctor-create-prescription"
            onClick={() => setShowCreate(true)}
          >
            + New Prescription
          </button>
        </div>

        <div className="doctor-prescription-toolbar">
          <div className="doctor-prescription-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search patient or diagnosis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="doctor-prescription-total">
            <strong>{prescriptions.length}</strong>
            <span>Total Prescriptions</span>
          </div>
        </div>

        {error && <div className="doctor-prescription-error">{error}</div>}

        {loading ? (
          <div className="doctor-prescription-empty">
            Loading prescriptions...
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="doctor-prescription-empty">
            <div className="doctor-prescription-empty-icon">▤</div>
            <h3>No prescriptions found</h3>
            <p>Create a prescription for one of your patients.</p>
          </div>
        ) : (
          <div className="doctor-prescription-list">
            {filteredPrescriptions.map((prescription) => (
              <div
                className="doctor-prescription-card"
                key={prescription._id}
              >
                <div className="doctor-prescription-card-header">
                  <div className="doctor-prescription-patient">
                    <div className="doctor-prescription-avatar">
                      {prescription.patient?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "P"}
                    </div>

                    <div>
                      <h3>{prescription.patient?.name || "Patient"}</h3>
                      <span>{prescription.patient?.email || "—"}</span>
                    </div>
                  </div>

                  <span className="doctor-prescription-date">
                    {new Date(
                      prescription.prescriptionDate
                    ).toLocaleDateString()}
                  </span>
                </div>

                <div className="doctor-prescription-diagnosis">
                  <span>DIAGNOSIS</span>
                  <strong>
                    {prescription.diagnosis || "General Consultation"}
                  </strong>
                </div>

                <div className="doctor-medicine-tags">
                  {prescription.medicines?.map((medicine, index) => (
                    <span key={index}>
                      {medicine.name}
                      {medicine.dosage ? ` · ${medicine.dosage}` : ""}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  className="doctor-prescription-view"
                  onClick={() => setSelectedPrescription(prescription)}
                >
                  View Prescription →
                </button>
              </div>
            ))}
          </div>
        )}

        {showCreate && (
          <div
            className="doctor-prescription-overlay"
            onClick={() => setShowCreate(false)}
          >
            <div
              className="doctor-prescription-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="doctor-prescription-close"
                onClick={() => setShowCreate(false)}
              >
                ×
              </button>

              <div className="doctor-modal-title">
                <span>NEW PRESCRIPTION</span>
                <h2>Create Prescription</h2>
                <p>Add medication details for your patient.</p>
              </div>

              <form onSubmit={handleCreate}>
                <div className="doctor-form-grid">
                  <label>
                    Patient
                    <select
                      value={form.patientId}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          patientId: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select patient</option>

                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Prescription Date
                    <input
                      type="date"
                      value={form.prescriptionDate}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          prescriptionDate: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>

                <label className="doctor-form-full">
                  Diagnosis
                  <input
                    type="text"
                    placeholder="e.g. Viral fever"
                    value={form.diagnosis}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        diagnosis: e.target.value,
                      })
                    }
                  />
                </label>

                <div className="doctor-medicines-form">
                  <div className="doctor-medicines-heading">
                    <h3>Medicines</h3>

                    <button
                      type="button"
                      onClick={addMedicine}
                    >
                      + Add Medicine
                    </button>
                  </div>

                  {form.medicines.map((medicine, index) => (
                    <div className="doctor-medicine-form-card" key={index}>
                      <div className="doctor-medicine-number">
                        {index + 1}
                      </div>

                      <div className="doctor-medicine-fields">
                        <input
                          placeholder="Medicine name"
                          value={medicine.name}
                          onChange={(e) =>
                            updateMedicine(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          required
                        />

                        <input
                          placeholder="Dosage"
                          value={medicine.dosage}
                          onChange={(e) =>
                            updateMedicine(
                              index,
                              "dosage",
                              e.target.value
                            )
                          }
                        />

                        <input
                          placeholder="Frequency"
                          value={medicine.frequency}
                          onChange={(e) =>
                            updateMedicine(
                              index,
                              "frequency",
                              e.target.value
                            )
                          }
                        />

                        <input
                          placeholder="Duration"
                          value={medicine.duration}
                          onChange={(e) =>
                            updateMedicine(
                              index,
                              "duration",
                              e.target.value
                            )
                          }
                        />

                        <input
                          className="doctor-medicine-instructions"
                          placeholder="Instructions"
                          value={medicine.instructions}
                          onChange={(e) =>
                            updateMedicine(
                              index,
                              "instructions",
                              e.target.value
                            )
                          }
                        />

                        {form.medicines.length > 1 && (
                          <button
                            type="button"
                            className="doctor-remove-medicine"
                            onClick={() => removeMedicine(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <label className="doctor-form-full">
                  Additional Notes
                  <textarea
                    rows="3"
                    placeholder="Additional instructions..."
                    value={form.notes}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        notes: e.target.value,
                      })
                    }
                  />
                </label>

                <button
                  type="submit"
                  className="doctor-save-prescription"
                >
                  Save Prescription
                </button>
              </form>
            </div>
          </div>
        )}

        {selectedPrescription && (
          <div
            className="doctor-prescription-overlay"
            onClick={() => setSelectedPrescription(null)}
          >
            <div
              className="doctor-prescription-modal doctor-view-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="doctor-prescription-close"
                onClick={() => setSelectedPrescription(null)}
              >
                ×
              </button>

              <div className="doctor-modal-title">
                <span>PRESCRIPTION DETAILS</span>
                <h2>
                  {selectedPrescription.patient?.name || "Patient"}
                </h2>

                <p>
                  {new Date(
                    selectedPrescription.prescriptionDate
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="doctor-prescription-detail-box">
                <span>DIAGNOSIS</span>
                <strong>
                  {selectedPrescription.diagnosis ||
                    "General Consultation"}
                </strong>
              </div>

              <div className="doctor-detail-medicines">
                <h3>Medicines</h3>

                {selectedPrescription.medicines?.map(
                  (medicine, index) => (
                    <div
                      className="doctor-detail-medicine"
                      key={index}
                    >
                      <div>
                        <strong>{medicine.name}</strong>
                        <span>
                          {medicine.dosage || "Dosage not specified"}
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
                <div className="doctor-prescription-detail-box">
                  <span>ADDITIONAL NOTES</span>
                  <strong>{selectedPrescription.notes}</strong>
                </div>
              )}

              <button
                type="button"
                className="doctor-delete-prescription"
                onClick={() =>
                  deletePrescription(selectedPrescription._id)
                }
              >
                Delete Prescription
              </button>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}

export default Prescriptions;