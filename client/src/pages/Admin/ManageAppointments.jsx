import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import AdminLayout from "./AdminLayout";
import "./ManageAppointments.css";

function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [msg, setMsg] = useState("");

  const [editingApp, setEditingApp] = useState(null);
  const [statusForm, setStatusForm] = useState({
    status: "Confirmed",
    appointmentDate: "",
    time: "",
  });

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      setMsg("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/appointments/${editingApp._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(statusForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      setMsg("Appointment updated successfully");
      setEditingApp(null);
      fetchAppointments();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const openStatusModal = (app) => {
    setEditingApp(app);
    setStatusForm({
      status: app.status || "Confirmed",
      appointmentDate: app.appointmentDate || "",
      time: app.time || "",
    });
  };

  const filteredAppointments = appointments.filter((app) => {
    const q = search.toLowerCase();
    const patName = (app.patient?.name || "").toLowerCase();
    const docName = (app.doctor?.name || "").toLowerCase();
    const matchesSearch = patName.includes(q) || docName.includes(q);

    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="manage-appointments-page">
        <div className="page-header-flex">
          <div>
            <span className="admin-section-label">SYSTEM SCHEDULING</span>
            <h1>All Hospital Appointments</h1>
            <p>Monitor system-wide appointment requests, reschedule, approve, or resolve conflicts.</p>
          </div>
          <button className="admin-btn-primary" onClick={fetchAppointments}>
            Refresh Appointments
          </button>
        </div>

        {msg && <div className="admin-alert-banner">{msg}</div>}

        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search by patient name or doctor name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="dept-select"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="admin-loading-state">Loading appointments...</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="admin-card empty-card">
            <h3>No appointments found</h3>
            <p>No appointments matched your search query or status filter.</p>
          </div>
        ) : (
          <div className="admin-card">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Assigned Doctor</th>
                    <th>Department</th>
                    <th>Date & Time</th>
                    <th>Type & Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <strong>{app.patient?.name || "Patient"}</strong>
                        <small className="d-block text-muted">{app.patient?.phone || app.patient?.email}</small>
                      </td>
                      <td>
                        <strong>{app.doctor?.name || "Doctor"}</strong>
                        <small className="d-block text-muted">{app.doctor?.specialization}</small>
                      </td>
                      <td>
                        <span className="dept-tag">{app.doctor?.department || "General"}</span>
                      </td>
                      <td>
                        <strong>{app.appointmentDate}</strong>
                        <small className="d-block text-muted">{app.time}</small>
                      </td>
                      <td>
                        <span className="type-tag">{app.type || "Consultation"}</span>
                        <small className="d-block text-muted">{app.reason || "N/A"}</small>
                      </td>
                      <td>
                        <span className={`status-pill ${app.status?.toLowerCase()}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => openStatusModal(app)} className="btn-action edit">
                          Manage Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MANAGE STATUS MODAL */}
        {editingApp && (
          <div className="modal-overlay">
            <div className="modal-content small">
              <div className="modal-header">
                <h2>Manage Appointment Status</h2>
                <button onClick={() => setEditingApp(null)} className="close-btn">
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdateStatus} className="modal-form">
                <div className="form-group">
                  <label>Patient</label>
                  <input type="text" value={editingApp.patient?.name || ""} disabled />
                </div>

                <div className="form-group">
                  <label>Doctor</label>
                  <input type="text" value={editingApp.doctor?.name || ""} disabled />
                </div>

                <div className="form-group">
                  <label>Appointment Status</label>
                  <select
                    name="status"
                    value={statusForm.status}
                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Appointment Date</label>
                  <input
                    type="date"
                    value={statusForm.appointmentDate}
                    onChange={(e) => setStatusForm({ ...statusForm, appointmentDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Time Slot</label>
                  <input
                    type="text"
                    value={statusForm.time}
                    onChange={(e) => setStatusForm({ ...statusForm, time: e.target.value })}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setEditingApp(null)} className="btn-cancel">
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary">
                    Update Appointment
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

export default ManageAppointments;
