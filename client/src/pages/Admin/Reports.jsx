import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import AdminLayout from "./AdminLayout";
import "./Reports.css";

function Reports() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {},
    statusDistribution: [],
    departmentStats: [],
  });

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok) {
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const exportCSV = () => {
    const csvRows = [
      ["Metric", "Value"],
      ["Total Doctors", data.stats?.totalDoctors || 0],
      ["Total Patients", data.stats?.totalPatients || 0],
      ["Total Appointments", data.stats?.totalAppointments || 0],
      ["Today's Appointments", data.stats?.todayAppointments || 0],
      ["Pending Appointments", data.stats?.pendingAppointments || 0],
      ["Completed Appointments", data.stats?.completedAppointments || 0],
      ["Cancelled Appointments", data.stats?.cancelledAppointments || 0],
      ["Available Doctors", data.stats?.availableDoctors || 0],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hospital_system_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="reports-page">
        <div className="page-header-flex">
          <div>
            <span className="admin-section-label">SYSTEM ANALYTICS</span>
            <h1>Reports & Hospital Metrics</h1>
            <p>Export reports and inspect registration trends, staffing distribution, and operational metrics.</p>
          </div>
          <button onClick={exportCSV} className="admin-btn-primary">
            Export Report (CSV)
          </button>
        </div>

        {loading ? (
          <div className="admin-loading-state">Compiling system analytics...</div>
        ) : (
          <div className="reports-grid">
            <div className="admin-card">
              <h3>System Overview Summary</h3>
              <div className="report-summary-list">
                <div className="summary-row">
                  <span>Registered Doctors</span>
                  <strong>{data.stats?.totalDoctors || 0}</strong>
                </div>
                <div className="summary-row">
                  <span>Active Registered Patients</span>
                  <strong>{data.stats?.totalPatients || 0}</strong>
                </div>
                <div className="summary-row">
                  <span>Total Appointments Processed</span>
                  <strong>{data.stats?.totalAppointments || 0}</strong>
                </div>
                <div className="summary-row">
                  <span>Today's Consultation Schedule</span>
                  <strong>{data.stats?.todayAppointments || 0}</strong>
                </div>
                <div className="summary-row">
                  <span>Completed Consultations</span>
                  <strong>{data.stats?.completedAppointments || 0}</strong>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <h3>Appointment Status Distribution</h3>
              <div className="chart-bars-list mt-2">
                {data.statusDistribution?.map((item) => (
                  <div key={item.name} className="chart-bar-item">
                    <div className="chart-bar-labels">
                      <strong>{item.name}</strong>
                      <span>{item.count} Appointments</span>
                    </div>
                    <div className="chart-bar-track">
                      <div
                        className={`chart-bar-fill ${item.name.toLowerCase()}`}
                        style={{
                          width: `${data.stats?.totalAppointments > 0 ? (item.count / data.stats.totalAppointments) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default Reports;
