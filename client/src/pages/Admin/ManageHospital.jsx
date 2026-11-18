import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import AdminLayout from "./AdminLayout";
import "./ManageHospital.css";

function ManageHospital() {
  const [info, setInfo] = useState({
    hospitalName: "",
    about: "",
    address: "",
    phone: "",
    email: "",
    emergencyNumber: "",
    website: "",
    workingHours: "",
    mission: "",
    vision: "",
    facilities: [],
    services: [],
  });

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [facilityInput, setFacilityInput] = useState("");
  const [serviceInput, setServiceInput] = useState("");

  const fetchHospitalInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/hospital-info`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.hospitalInfo) {
        setInfo(data.hospitalInfo);
      }
    } catch (err) {
      setMsg("Failed to load hospital info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalInfo();
  }, []);

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/hospital-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(info),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save hospital info");

      setMsg("Hospital information updated successfully!");
    } catch (err) {
      setMsg(err.message);
    }
  };

  const addFacility = () => {
    if (!facilityInput.trim()) return;
    setInfo({ ...info, facilities: [...(info.facilities || []), facilityInput.trim()] });
    setFacilityInput("");
  };

  const removeFacility = (index) => {
    const updated = [...info.facilities];
    updated.splice(index, 1);
    setInfo({ ...info, facilities: updated });
  };

  const addService = () => {
    if (!serviceInput.trim()) return;
    setInfo({ ...info, services: [...(info.services || []), serviceInput.trim()] });
    setServiceInput("");
  };

  const removeService = (index) => {
    const updated = [...info.services];
    updated.splice(index, 1);
    setInfo({ ...info, services: updated });
  };

  return (
    <AdminLayout>
      <div className="manage-hospital-page">
        <div className="page-header-flex">
          <div>
            <span className="admin-section-label">PUBLIC PROFILE & INFRASTRUCTURE</span>
            <h1>Hospital Profile & Facilities</h1>
            <p>Manage public hospital details, emergency contacts, mission statement, facilities, and services.</p>
          </div>
        </div>

        {msg && <div className="admin-alert-banner">{msg}</div>}

        {loading ? (
          <div className="admin-loading-state">Loading hospital details...</div>
        ) : (
          <form onSubmit={handleSubmit} className="admin-card hospital-form">
            <div className="form-section">
              <h3>General Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Hospital Name *</label>
                  <input type="text" name="hospitalName" value={info.hospitalName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Emergency Contact Number *</label>
                  <input type="text" name="emergencyNumber" value={info.emergencyNumber} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>General Phone</label>
                  <input type="text" name="phone" value={info.phone} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Official Email</label>
                  <input type="email" name="email" value={info.email} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Official Website</label>
                  <input type="text" name="website" value={info.website} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Working Hours</label>
                  <input type="text" name="workingHours" value={info.workingHours} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group full-width mt-2">
                <label>Address</label>
                <input type="text" name="address" value={info.address} onChange={handleChange} />
              </div>

              <div className="form-group full-width mt-2">
                <label>About Hospital</label>
                <textarea name="about" rows="3" value={info.about} onChange={handleChange}></textarea>
              </div>
            </div>

            <div className="form-section mt-3">
              <h3>Mission & Vision</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Mission Statement</label>
                  <textarea name="mission" rows="3" value={info.mission} onChange={handleChange}></textarea>
                </div>

                <div className="form-group">
                  <label>Vision Statement</label>
                  <textarea name="vision" rows="3" value={info.vision} onChange={handleChange}></textarea>
                </div>
              </div>
            </div>

            <div className="form-section mt-3">
              <h3>Hospital Facilities</h3>
              <div className="list-builder">
                <div className="builder-input-group">
                  <input
                    type="text"
                    placeholder="Add facility (e.g. 24/7 ICU, Diagnostic Radiology...)"
                    value={facilityInput}
                    onChange={(e) => setFacilityInput(e.target.value)}
                  />
                  <button type="button" onClick={addFacility} className="btn-add">
                    + Add
                  </button>
                </div>

                <div className="tags-container">
                  {info.facilities?.map((fac, idx) => (
                    <span key={idx} className="tag-chip">
                      {fac}
                      <button type="button" onClick={() => removeFacility(idx)} className="chip-remove">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-section mt-3">
              <h3>Clinical Services</h3>
              <div className="list-builder">
                <div className="builder-input-group">
                  <input
                    type="text"
                    placeholder="Add clinical service (e.g. Cardiology, Neuro-surgery...)"
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                  />
                  <button type="button" onClick={addService} className="btn-add">
                    + Add
                  </button>
                </div>

                <div className="tags-container">
                  {info.services?.map((serv, idx) => (
                    <span key={idx} className="tag-chip green">
                      {serv}
                      <button type="button" onClick={() => removeService(idx)} className="chip-remove">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-actions mt-4">
              <button type="submit" className="admin-btn-primary">
                Save Hospital Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}

export default ManageHospital;
