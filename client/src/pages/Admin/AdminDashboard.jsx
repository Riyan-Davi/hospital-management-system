import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import AdminLayout from "./AdminLayout";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    stats: {
      totalDoctors: 0,
      totalPatients: 0,
      totalAppointments: 0,
      todayAppointments: 0,
      pendingAppointments: 0,
      completedAppointments: 0,
      cancelledAppointments: 0,
      availableDoctors: 0,
      totalDepartments: 0,
    },
    recentAppointments: [],
    recentPatients: [],
    recentLogs: [],
    statusDistribution: [],
    departmentStats: [],
  });

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to load admin dashboard");
      }

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = data.stats;

  return (
    <AdminLayout>
      <div className="admin-dashboard-page">
        {/* HEADER */}
        <div className="admin-dashboard-header">
          <div>
            <span className="admin-section-label">OVERVIEW & ANALYTICS</span>
            <h1>Hospital Admin Dashboard</h1>
            <p>Monitor hospital statistics, doctor availability, appointment flows, and system activities.</p>
          </div>
          <button className="admin-btn-primary" onClick={fetchDashboardData}>
            Refresh Analytics
          </button>
        </div>

        {error && <div className="admin-error-alert">{error}</div>}

        {loading ? (
          <div className="admin-loading-state">Loading administration metrics...</div>
        ) : (
          <>
            {/* STATS GRID */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card blue">
                <div className="stat-card-header">
                  <span>Total Doctors</span>
                  <span className="stat-badge">Active: {stats.availableDoctors}</span>
                </div>
                <h2>{stats.totalDoctors}</h2>
                <p>Registered Medical Specialists</p>
              </div>

              <div className="admin-stat-card green">
                <div className="stat-card-header">
                  <span>Total Patients</span>
                  <span className="stat-badge green">Registered</span>
                </div>
                <h2>{stats.totalPatients}</h2>
                <p>Patients under hospital care</p>
              </div>

              <div className="admin-stat-card indigo">
                <div className="stat-card-header">
                  <span>Total Appointments</span>
                  <span className="stat-badge purple">System-wide</span>
                </div>
                <h2>{stats.totalAppointments}</h2>
                <p>Booked consultations</p>
              </div>

              <div className="admin-stat-card amber">
                <div className="stat-card-header">
                  <span>Today's Schedule</span>
                  <span className="stat-badge amber">Today</span>
                </div>
                <h2>{stats.todayAppointments}</h2>
                <p>Appointments scheduled today</p>
              </div>

              <div className="admin-stat-card yellow">
                <div className="stat-card-header">
                  <span>Pending Requests</span>
                  <span className="stat-badge yellow">Action Needed</span>
                </div>
                <h2>{stats.pendingAppointments}</h2>
                <p>Awaiting doctor approval</p>
              </div>

              <div className="admin-stat-card emerald">
                <div className="stat-card-header">
                  <span>Completed</span>
                  <span className="stat-badge green">Successful</span>
                </div>
                <h2>{stats.completedAppointments}</h2>
                <p>Consultations conducted</p>
              </div>

              <div className="admin-stat-card rose">
                <div className="stat-card-header">
                  <span>Cancelled</span>
                  <span className="stat-badge red">Released</span>
                </div>
                <h2>{stats.cancelledAppointments}</h2>
                <p>Cancelled by patient/doctor</p>
              </div>

              <div className="admin-stat-card cyan">
                <div className="stat-card-header">
                  <span>Departments</span>
                  <span className="stat-badge cyan">Specialties</span>
                </div>
                <h2>{stats.totalDepartments}</h2>
                <p>Hospital active departments</p>
              </div>
            </div>

            {/* VISUAL CHARTS & METRICS */}
            <div className="admin-charts-grid">
              {/* Chart 1: Status Distribution */}
              <div className="admin-chart-card">
                <div className="chart-card-header">
                  <h3>Appointment Status Distribution</h3>
                  <span>Real-time Breakdown</span>
                </div>

                <div className="chart-bars-list">
                  {data.statusDistribution?.map((item) => {
                    const percentage = stats.totalAppointments > 0
                      ? Math.round((item.count / stats.totalAppointments) * 100)
                      : 0;

                    return (
                      <div key={item.name} className="chart-bar-item">
                        <div className="chart-bar-labels">
                          <strong>{item.name}</strong>
                          <span>{item.count} ({percentage}%)</span>
                        </div>
                        <div className="chart-bar-track">
                          <div
                            className={`chart-bar-fill ${item.name.toLowerCase()}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart 2: Doctor Distribution */}
              <div className="admin-chart-card">
                <div className="chart-card-header">
                  <h3>Doctor Distribution by Department</h3>
                  <span>Medical Staffing</span>
                </div>

                <div className="chart-bars-list">
                  {data.departmentStats?.map((dept) => {
                    const percentage = stats.totalDoctors > 0
                      ? Math.round((dept.doctors / stats.totalDoctors) * 100)
                      : 0;

                    return (
                      <div key={dept.name} className="chart-bar-item">
                        <div className="chart-bar-labels">
                          <strong>{dept.name}</strong>
                          <span>{dept.doctors} Doctors</span>
                        </div>
                        <div className="chart-bar-track">
                          <div
                            className="chart-bar-fill department"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RECENT ACTIVITY & APPOINTMENTS */}
            <div className="admin-tables-grid">
              {/* Recent Appointments */}
              <div className="admin-card">
                <div className="card-header-flex">
                  <div>
                    <h3>Recent Appointments</h3>
                    <p className="card-subtitle">Latest booking requests</p>
                  </div>
                  <button onClick={() => navigate("/admin/appointments")} className="btn-link">
                    View All →
                  </button>
                </div>

                {data.recentAppointments?.length === 0 ? (
                  <p className="empty-state">No recent appointments recorded.</p>
                ) : (
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Doctor</th>
                          <th>Date / Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentAppointments?.map((app) => (
                          <tr key={app._id}>
                            <td>
                              <strong>{app.patient?.name || "Patient"}</strong>
                            </td>
                            <td>{app.doctor?.name || "Doctor"}</td>
                            <td>
                              {app.appointmentDate} <br />
                              <small className="text-muted">{app.time}</small>
                            </td>
                            <td>
                              <span className={`status-tag ${app.status?.toLowerCase()}`}>
                                {app.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* System Audit Activity Logs */}
              <div className="admin-card">
                <div className="card-header-flex">
                  <div>
                    <h3>Audit Activity Logs</h3>
                    <p className="card-subtitle">System governance and action tracking</p>
                  </div>
                  <button onClick={() => navigate("/admin/audit-logs")} className="btn-link">
                    View All Logs →
                  </button>
                </div>

                {data.recentLogs?.length === 0 ? (
                  <p className="empty-state">No audit logs logged yet.</p>
                ) : (
                  <div className="audit-log-list">
                    {data.recentLogs?.map((log) => (
                      <div key={log._id} className="audit-log-item">
                        <div className="audit-log-icon">
                          <span>{log.action?.charAt(0) || "A"}</span>
                        </div>
                        <div className="audit-log-details">
                          <strong>{log.description}</strong>
                          <span>
                            {log.userName} ({log.userRole}) • {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
