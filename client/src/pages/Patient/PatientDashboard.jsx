import { API_BASE_URL } from "../../config/api";
import { useEffect, useState } from "react";
import PatientLayout from "./PatientLayout";
import "./PatientDashboard.css";

function PatientDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/patient-dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load dashboard"
          );
        }

        setDashboard(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <PatientLayout>
        <div className="patient-dashboard-loading">
          Loading dashboard...
        </div>
      </PatientLayout>
    );
  }

  if (error) {
    return (
      <PatientLayout>
        <div className="patient-dashboard-error">
          {error}
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="patient-dashboard">
        <div className="dashboard-header">
          <div>
            <p className="section-label">PATIENT DASHBOARD</p>

            <h1>
              Welcome, {dashboard?.patient?.name || "Patient"}
            </h1>

            <p>
              Manage your appointments, prescriptions and
              healthcare information.
            </p>
          </div>
        </div>

        <div className="patient-stat-grid">
          <div className="patient-stat-card">
            <span>APPOINTMENTS</span>
            <strong>
              {dashboard?.stats?.appointments || 0}
            </strong>
            <p>Total appointments</p>
          </div>

          <div className="patient-stat-card">
            <span>PRESCRIPTIONS</span>
            <strong>
              {dashboard?.stats?.prescriptions || 0}
            </strong>
            <p>Your prescriptions</p>
          </div>

          <div className="patient-stat-card">
            <span>MESSAGES</span>
            <strong>
              {dashboard?.stats?.unreadMessages || 0}
            </strong>
            <p>Unread messages</p>
          </div>
        </div>

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p className="section-label">
                UPCOMING APPOINTMENTS
              </p>

              <h2>Your Appointments</h2>
            </div>
          </div>

          {dashboard?.upcomingAppointments?.length === 0 ? (
            <div className="dashboard-empty">
              <h3>No upcoming appointments</h3>
              <p>
                Your upcoming appointments will appear here.
              </p>
            </div>
          ) : (
            <div className="appointment-list">
              {dashboard.upcomingAppointments.map(
                (appointment) => (
                  <div
                    className="dashboard-appointment"
                    key={appointment.id}
                  >
                    <div className="appointment-date">
                      <strong>
                        {formatDate(appointment.date)}
                      </strong>

                      <span>{appointment.time}</span>
                    </div>

                    <div className="appointment-doctor">
                      <h3>
                        Dr. {appointment.doctorName}
                      </h3>

                      <p>
                        {appointment.specialization}
                      </p>
                    </div>

                    <div className="appointment-meta">
                      <span>
                        {appointment.type}
                      </span>

                      <strong className="appointment-status">
                        {appointment.status}
                      </strong>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </PatientLayout>
  );
}

export default PatientDashboard;