import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import AdminLayout from "./AdminLayout";
import "./ManageDepartments.css";

function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    headDoctor: "Unassigned",
  });

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setDepartments(data.departments || []);
      }
    } catch (err) {
      setMsg("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/departments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not add department");

      setMsg("Department added successfully!");
      setShowAddModal(false);
      setFormData({ name: "", description: "", headDoctor: "Unassigned" });
      fetchDepartments();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/departments/${editingDept._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not update department");

      setMsg("Department updated successfully!");
      setEditingDept(null);
      fetchDepartments();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/departments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMsg("Department deleted successfully");
        fetchDepartments();
      }
    } catch (err) {
      setMsg("Failed to delete department");
    }
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name || "",
      description: dept.description || "",
      headDoctor: dept.headDoctor || "Unassigned",
    });
  };

  return (
    <AdminLayout>
      <div className="manage-departments-page">
        <div className="page-header-flex">
          <div>
            <span className="admin-section-label">HOSPITAL STRUCTURE</span>
            <h1>Departments Management</h1>
            <p>Manage hospital medical departments, head physicians, and specialized clinical branches.</p>
          </div>
          <button className="admin-btn-primary" onClick={() => { setShowAddModal(true); setEditingDept(null); }}>
            + Create Department
          </button>
        </div>

        {msg && <div className="admin-alert-banner">{msg}</div>}

        {loading ? (
          <div className="admin-loading-state">Loading department structure...</div>
        ) : (
          <div className="departments-grid">
            {departments.map((dept) => (
              <div key={dept._id} className="dept-card">
                <div className="dept-card-header">
                  <div className="dept-icon-box">
                    <span>{dept.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3>{dept.name}</h3>
                    <span className="head-doctor-text">Head: {dept.headDoctor || "Unassigned"}</span>
                  </div>
                </div>

                <p className="dept-desc">{dept.description || "Medical specialty department."}</p>

                <div className="dept-card-footer">
                  <span className={`status-pill ${dept.status === "Active" ? "active" : "inactive"}`}>
                    {dept.status || "Active"}
                  </span>

                  <div className="action-buttons-flex">
                    <button onClick={() => openEditModal(dept)} className="btn-action edit">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteDepartment(dept._id)} className="btn-action toggle deactivate">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL ADD / EDIT DEPT */}
        {(showAddModal || editingDept) && (
          <div className="modal-overlay">
            <div className="modal-content small">
              <div className="modal-header">
                <h2>{editingDept ? "Edit Department" : "Add Department"}</h2>
                <button onClick={() => { setShowAddModal(false); setEditingDept(null); }} className="close-btn">
                  ×
                </button>
              </div>

              <form onSubmit={editingDept ? handleUpdateDepartment : handleCreateDepartment} className="modal-form">
                <div className="form-group">
                  <label>Department Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Head Doctor Name</label>
                  <input type="text" name="headDoctor" value={formData.headDoctor} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => { setShowAddModal(false); setEditingDept(null); }} className="btn-cancel">
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary">
                    {editingDept ? "Save Changes" : "Create Department"}
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

export default ManageDepartments;
