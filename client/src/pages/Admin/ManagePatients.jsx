import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import AdminLayout from "./AdminLayout";
import "./ManagePatients.css";

function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [msg, setMsg] = useState("");

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPatients(data.patients || []);
      }
    } catch (err) {
      setMsg("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(data.message);
        fetchPatients();
      }
    } catch (err) {
      setMsg("Failed to update status");
    }
  };

  const filteredPatients = patients.filter((pat) => {
    const q = search.toLowerCase();
    return (
      (pat.name || "").toLowerCase().includes(q) ||
      (pat.email || "").toLowerCase().includes(q) ||
      (pat.phone || "").toLowerCase().includes(q) ||
      (pat.bloodGroup || "").toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      <div className="manage-patients-page">
        <div className="page-header-flex">
          <div>
            <span className="admin-section-label">PATIENT RECORDS</span>
            <h1>Patient Management Directory</h1>
            <p>View registered patients, emergency details, medical profiles, and account statuses.</p>
          </div>
        </div>

        {msg && <div className="admin-alert-banner">{msg}</div>}

        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search patient by name, email, phone number, or blood group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {loading ? (
          <div className="admin-loading-state">Loading registered patients...</div>
        ) : filteredPatients.length === 0 ? (
          <div className="admin-card empty-card">
            <h3>No patients found</h3>
            <p>No matching patient records were found for your search query.</p>
          </div>
        ) : (
          <div className="admin-card">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Contact Info</th>
                    <th>Medical Profile</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((pat) => (
                    <tr key={pat._id}>
                      <td>
                        <div className="pat-profile-cell">
                          <div className="pat-avatar">
                            {(pat.name || "P").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{pat.name}</strong>
                            <small className="d-block text-muted">Gender: {pat.gender || "Not specified"}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{pat.email}</div>
                        <small className="text-muted">{pat.phone || "No phone"}</small>
                      </td>
                      <td>
                        <span className="blood-tag">{pat.bloodGroup || "Blood Group N/A"}</span>
                        <small className="d-block text-muted mt-1">
                          Allergies: {pat.allergies || "None"}
                        </small>
                      </td>
                      <td>
                        <small>{new Date(pat.createdAt).toLocaleDateString()}</small>
                      </td>
                      <td>
                        <span className={`status-pill ${pat.status === "active" ? "active" : "inactive"}`}>
                          {pat.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-flex">
                          <button onClick={() => setSelectedPatient(pat)} className="btn-action edit">
                            View Profile
                          </button>
                          <button
                            onClick={() => handleToggleStatus(pat._id)}
                            className={`btn-action toggle ${pat.status === "active" ? "deactivate" : "activate"}`}
                          >
                            {pat.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PATIENT DETAIL MODAL */}
        {selectedPatient && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Patient Medical Record: {selectedPatient.name}</h2>
                <button onClick={() => setSelectedPatient(null)} className="close-btn">
                  ×
                </button>
              </div>

              <div className="patient-modal-body">
                <div className="patient-info-grid">
                  <div className="info-box">
                    <span>Full Name</span>
                    <strong>{selectedPatient.name}</strong>
                  </div>
                  <div className="info-box">
                    <span>Email Address</span>
                    <strong>{selectedPatient.email}</strong>
                  </div>
                  <div className="info-box">
                    <span>Phone Number</span>
                    <strong>{selectedPatient.phone || "N/A"}</strong>
                  </div>
                  <div className="info-box">
                    <span>Date of Birth</span>
                    <strong>{selectedPatient.dateOfBirth || "N/A"}</strong>
                  </div>
                  <div className="info-box">
                    <span>Gender</span>
                    <strong>{selectedPatient.gender || "N/A"}</strong>
                  </div>
                  <div className="info-box">
                    <span>Blood Group</span>
                    <strong>{selectedPatient.bloodGroup || "N/A"}</strong>
                  </div>
                  <div className="info-box full">
                    <span>Address</span>
                    <strong>{selectedPatient.address || "N/A"}</strong>
                  </div>
                  <div className="info-box full">
                    <span>Emergency Contact</span>
                    <strong>
                      {selectedPatient.emergencyContact || "N/A"} {selectedPatient.emergencyPhone ? `(${selectedPatient.emergencyPhone})` : ""}
                    </strong>
                  </div>
                  <div className="info-box full">
                    <span>Known Allergies</span>
                    <strong className="text-warning">{selectedPatient.allergies || "None declared"}</strong>
                  </div>
                  <div className="info-box full">
                    <span>Existing Medical Conditions</span>
                    <strong>{selectedPatient.medicalConditions || "None declared"}</strong>
                  </div>
                </div>

                <div className="modal-actions">
                  <button onClick={() => setSelectedPatient(null)} className="btn-cancel">
                    Close Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default ManagePatients;
