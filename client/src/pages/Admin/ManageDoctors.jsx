import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import AdminLayout from "./AdminLayout";
import "./ManageDoctors.css";

function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [msg, setMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "General Medicine",
    department: "General Medicine",
    qualification: "MBBS",
    experience: "5 Years",
    licenseNumber: "",
    consultationFee: 500,
    workingHours: "09:00 AM - 05:00 PM",
    availableDays: "Mon, Tue, Wed, Thu, Fri",
    bio: "",
  });

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setDoctors(data.doctors || []);
      }
    } catch (err) {
      setMsg("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not add doctor");

      setMsg("Doctor added successfully!");
      setShowAddModal(false);
      fetchDoctors();
      setFormData({
        name: "", email: "", password: "", phone: "", specialization: "General Medicine",
        department: "General Medicine", qualification: "MBBS", experience: "5 Years",
        licenseNumber: "", consultationFee: 500, workingHours: "09:00 AM - 05:00 PM",
        availableDays: "Mon, Tue, Wed, Thu, Fri", bio: ""
      });
    } catch (err) {
      setMsg(err.message);
    }
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/doctors/${editingDoctor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not update doctor");

      setMsg("Doctor details updated successfully!");
      setEditingDoctor(null);
      fetchDoctors();
    } catch (err) {
      setMsg(err.message);
    }
  };

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
        fetchDoctors();
      }
    } catch (err) {
      setMsg("Failed to update status");
    }
  };

  const openEditModal = (doc) => {
    setEditingDoctor(doc);
    setFormData({
      name: doc.name || "",
      email: doc.email || "",
      password: "",
      phone: doc.phone || "",
      specialization: doc.specialization || "General Medicine",
      department: doc.department || "General Medicine",
      qualification: doc.qualification || "MBBS",
      experience: doc.experience || "",
      licenseNumber: doc.licenseNumber || "",
      consultationFee: doc.consultationFee || 500,
      workingHours: doc.workingHours || "09:00 AM - 05:00 PM",
      availableDays: doc.availableDays || "Mon, Tue, Wed, Thu, Fri",
      bio: doc.bio || "",
    });
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      (doc.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (doc.specialization || "").toLowerCase().includes(search.toLowerCase()) ||
      (doc.email || "").toLowerCase().includes(search.toLowerCase());

    const matchesDept = deptFilter === "All" || doc.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <AdminLayout>
      <div className="manage-doctors-page">
        <div className="page-header-flex">
          <div>
            <span className="admin-section-label">DOCTOR MANAGEMENT</span>
            <h1>Hospital Doctors Directory</h1>
            <p>Add new doctors, manage availability schedules, and control account status.</p>
          </div>
          <button className="admin-btn-primary" onClick={() => { setShowAddModal(true); setEditingDoctor(null); }}>
            + Add New Doctor
          </button>
        </div>

        {msg && <div className="admin-alert-banner">{msg}</div>}

        {/* FILTERS & SEARCH */}
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search by doctor name, email, or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="dept-select"
          >
            <option value="All">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Dermatology">Dermatology</option>
            <option value="General Medicine">General Medicine</option>
          </select>
        </div>

        {/* DOCTORS TABLE */}
        {loading ? (
          <div className="admin-loading-state">Loading doctors list...</div>
        ) : filteredDoctors.length === 0 ? (
          <div className="admin-card empty-card">
            <h3>No doctors found</h3>
            <p>Try adjusting your search query or department filter.</p>
          </div>
        ) : (
          <div className="admin-card">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Doctor Name</th>
                    <th>Department / Specialization</th>
                    <th>Fee & Experience</th>
                    <th>Available Days & Hours</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doc) => (
                    <tr key={doc._id}>
                      <td>
                        <div className="doc-profile-cell">
                          <div className="doc-avatar">
                            {(doc.name || "D").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{doc.name}</strong>
                            <span className="text-muted d-block">{doc.email}</span>
                            <span className="text-muted">{doc.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="dept-tag">{doc.department || doc.specialization}</span>
                        <small className="d-block text-muted">{doc.qualification}</small>
                      </td>
                      <td>
                        <strong>${doc.consultationFee || 500}</strong>
                        <small className="d-block text-muted">{doc.experience || "N/A"}</small>
                      </td>
                      <td>
                        <small className="d-block"><strong>{doc.availableDays || "Mon - Fri"}</strong></small>
                        <small className="text-muted">{doc.workingHours || "09:00 AM - 05:00 PM"}</small>
                      </td>
                      <td>
                        <span className={`status-pill ${doc.status === "active" ? "active" : "inactive"}`}>
                          {doc.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-flex">
                          <button onClick={() => openEditModal(doc)} className="btn-action edit">
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(doc._id)}
                            className={`btn-action toggle ${doc.status === "active" ? "deactivate" : "activate"}`}
                          >
                            {doc.status === "active" ? "Deactivate" : "Activate"}
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

        {/* MODAL FOR ADD / EDIT DOCTOR */}
        {(showAddModal || editingDoctor) && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editingDoctor ? "Edit Doctor Profile" : "Add New Doctor"}</h2>
                <button onClick={() => { setShowAddModal(false); setEditingDoctor(null); }} className="close-btn">
                  ×
                </button>
              </div>

              <form onSubmit={editingDoctor ? handleUpdateDoctor : handleCreateDoctor} className="modal-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label>{editingDoctor ? "New Password (Leave blank to keep)" : "Password *"}</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required={!editingDoctor}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>Department</label>
                    <select name="department" value={formData.department} onChange={handleChange}>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="General Surgery">General Surgery</option>
                      <option value="Gynecology">Gynecology</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Specialization</label>
                    <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>Qualifications</label>
                    <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>Years of Experience</label>
                    <input type="text" name="experience" value={formData.experience} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>Consultation Fee ($)</label>
                    <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>Medical License Number</label>
                    <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>Available Days</label>
                    <input type="text" name="availableDays" value={formData.availableDays} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>Working Hours</label>
                    <input type="text" name="workingHours" value={formData.workingHours} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Bio / Description</label>
                  <textarea name="bio" rows="2" value={formData.bio} onChange={handleChange}></textarea>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => { setShowAddModal(false); setEditingDoctor(null); }} className="btn-cancel">
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary">
                    {editingDoctor ? "Save Changes" : "Create Doctor"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default ManageDoctors;
