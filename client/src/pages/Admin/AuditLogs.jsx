import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import AdminLayout from "./AdminLayout";
import "./AuditLogs.css";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/audit-logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <AdminLayout>
      <div className="audit-logs-page">
        <div className="page-header-flex">
          <div>
            <span className="admin-section-label">SYSTEM GOVERNANCE</span>
            <h1>Audit & Activity Logs</h1>
            <p>Track all administrative actions, data changes, and system activities.</p>
          </div>
          <button onClick={fetchLogs} className="admin-btn-primary">
            Refresh Logs
          </button>
        </div>

        {loading ? (
          <div className="admin-loading-state">Loading audit trail...</div>
        ) : logs.length === 0 ? (
          <div className="admin-card empty-card">
            <h3>No audit logs recorded</h3>
            <p>Administrative activities will appear here.</p>
          </div>
        ) : (
          <div className="admin-card">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id}>
                      <td>
                        <small>{new Date(log.createdAt).toLocaleString()}</small>
                      </td>
                      <td>
                        <strong>{log.userName}</strong>
                        <small className="d-block text-muted">{log.userRole}</small>
                      </td>
                      <td>
                        <span className="action-tag">{log.action}</span>
                      </td>
                      <td>{log.entity || "System"}</td>
                      <td>{log.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AuditLogs;
