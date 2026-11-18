import { API_BASE_URL } from "../../config/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DoctorLayout from "./DoctorLayout";
import "./DoctorDashboard.css";

function DoctorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState({
    appointments: 0,
    patients: 0,
    prescriptions: 0,
    satisfaction: 0,
  });

  const [appointments, setAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_BASE_URL}/api/doctor-dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setDashboard({
            appointments: data.stats?.appointments ?? 0,
            patients: data.stats?.patients ?? 0,
            prescriptions: data.stats?.prescriptions ?? 0,
            satisfaction: data.stats?.satisfaction ?? 0,
          });

          setAppointments(data.appointments || []);
          setRecentPatients(data.recentPatients || []);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const doctorName = user?.name || "Doctor";

  const stats = [
    {
      title: "Today's Appointments",
      value: dashboard.appointments,
      label: "Scheduled today",
      type: "calendar",
    },
    {
      title: "Total Patients",
      value: dashboard.patients,
      label: "Patients under care",
      type: "patients",
    },
    {
      title: "Prescriptions",
      value: dashboard.prescriptions,
      label: "Issued prescriptions",
      type: "prescription",
    },
    {
      title: "Patient Satisfaction",
      value: `${dashboard.satisfaction}%`,
      label: "Overall satisfaction",
      type: "satisfaction",
    },
  ];

  const getIcon = (type) => {
    if (type === "calendar") {
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="4" width="18" height="17" rx="3" />
          <path d="M8 2v4M16 2v4M3 9h18M8 13h3M8 17h5" />
        </svg>
      );
    }

    if (type === "patients") {
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 20c.7-3.4 2.5-5 5.5-5s4.8 1.6 5.5 5" />
          <circle cx="17" cy="9" r="2.3" />
          <path d="M15.2 14.8c2.6-.3 4.4 1.3 5.1 4.2" />
        </svg>
      );
    }

    if (type === "prescription") {
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M9 7h6M9 11h6M9 15h3M15 15h.01" />
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3l2.1 4.4 4.9.7-3.5 3.4.8 4.8-4.3-2.3-4.3 2.3.8-4.8L5 8.1l4.9-.7L12 3z" />
        <path d="M8 20h8" />
      </svg>
    );
  };

  return (
    <DoctorLayout>
      <div className="doctor-dashboard-page">

        {/* PAGE HEADER */}
        <section className="doctor-dashboard-header">
          <div>
            <span className="doctor-page-label">DOCTOR DASHBOARD</span>

            <h1>
              Welcome back, Dr. {doctorName}
            </h1>

            <p>
              Here's an overview of your practice and today's activities.
            </p>
          </div>

          <div className="doctor-header-actions">
            <button
              type="button"
              className="doctor-secondary-button"
              onClick={() => navigate("/doctor/patients")}
            >
              View Patients
            </button>

            <button
              type="button"
              className="doctor-primary-button"
              onClick={() => navigate("/doctor/appointments")}
            >
              View Appointments
            </button>
          </div>
        </section>

        {/* WELCOME CARD */}
        <section className="doctor-welcome-card">
          <div className="doctor-welcome-content">
            <span>YOUR PRACTICE AT A GLANCE</span>

            <h2>
              Focus on your patients.
              <br />
              We'll keep everything organized.
            </h2>

            <p>
              Manage appointments, review patient information,
              update prescriptions and stay connected with your patients.
            </p>

            <button
              type="button"
              onClick={() => navigate("/doctor/appointments")}
            >
              Open Today's Schedule
              <span>→</span>
            </button>
          </div>

          <div className="doctor-welcome-visual">
            <div className="doctor-visual-circle">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <path
                  d="M50 18c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32S67.7 18 50 18Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  d="M50 34v32M34 50h32"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* STAT CARDS */}
        <section className="doctor-stats-grid">
          {stats.map((stat) => (
            <div className="doctor-stat-card" key={stat.title}>
              <div className="doctor-stat-top">
                <div className={`doctor-stat-icon ${stat.type}`}>
                  {getIcon(stat.type)}
                </div>

                <span className="doctor-stat-status">
                  Active
                </span>
              </div>

              <div className="doctor-stat-value">
                {loading ? "—" : stat.value}
              </div>

              <h3>{stat.title}</h3>

              <p>{stat.label}</p>
            </div>
          ))}
        </section>

        {/* MAIN CONTENT */}
        <section className="doctor-dashboard-grid">

          {/* APPOINTMENTS */}
          <div className="doctor-dashboard-card doctor-appointments-card">
            <div className="doctor-card-header">
              <div>
                <span className="doctor-card-label">SCHEDULE</span>
                <h2>Upcoming Appointments</h2>
              </div>

              <button
                type="button"
                onClick={() => navigate("/doctor/appointments")}
              >
                View all
              </button>
            </div>

            {loading ? (
              <div className="doctor-empty-state">
                <p>Loading appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="doctor-empty-state">
                <div className="doctor-empty-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="17" rx="3" />
                    <path d="M8 2v4M16 2v4M3 9h18" />
                  </svg>
                </div>

                <h3>No appointments yet</h3>

                <p>
                  Your upcoming appointments will appear here.
                </p>
              </div>
            ) : (
              <div className="doctor-appointment-list">
                {appointments.map((appointment, index) => (
                  <div
                    className="doctor-appointment-row"
                    key={appointment.id || index}
                  >
                    <div className="doctor-appointment-time">
                      <strong>
                        {appointment.time || "--:--"}
                      </strong>
                    </div>

                    <div className="doctor-patient-avatar">
                      {(appointment.patientName || "P")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="doctor-appointment-info">
                      <h3>
                        {appointment.patientName || "Patient"}
                      </h3>

                      <p>
                        {appointment.type || "Consultation"}
                      </p>
                    </div>

                    <span className="doctor-appointment-status">
                      {appointment.status || "Scheduled"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TODAY'S OVERVIEW */}
          <div className="doctor-dashboard-card doctor-overview-card">
            <div className="doctor-card-header">
              <div>
                <span className="doctor-card-label">TODAY</span>
                <h2>Daily Overview</h2>
              </div>
            </div>

            <div className="doctor-overview-list">

              <div className="doctor-overview-item">
                <div className="doctor-overview-number">
                  {loading ? "—" : dashboard.appointments}
                </div>

                <div>
                  <strong>Appointments</strong>
                  <span>Today's schedule</span>
                </div>
              </div>

              <div className="doctor-overview-item">
                <div className="doctor-overview-number">
                  {loading ? "—" : dashboard.patients}
                </div>

                <div>
                  <strong>Patients</strong>
                  <span>Total patients</span>
                </div>
              </div>

              <div className="doctor-overview-item">
                <div className="doctor-overview-number">
                  {loading ? "—" : dashboard.prescriptions}
                </div>

                <div>
                  <strong>Prescriptions</strong>
                  <span>Issued so far</span>
                </div>
              </div>

            </div>

            <button
              type="button"
              className="doctor-overview-button"
              onClick={() => navigate("/doctor/records")}
            >
              Review Medical Records
              <span>→</span>
            </button>
          </div>
        </section>

        {/* LOWER CONTENT */}
        <section className="doctor-dashboard-grid doctor-lower-grid">

          {/* RECENT PATIENTS */}
          <div className="doctor-dashboard-card">
            <div className="doctor-card-header">
              <div>
                <span className="doctor-card-label">PATIENTS</span>
                <h2>Recent Patients</h2>
              </div>

              <button
                type="button"
                onClick={() => navigate("/doctor/patients")}
              >
                View all
              </button>
            </div>

            {recentPatients.length === 0 ? (
              <div className="doctor-empty-state doctor-small-empty">
                <div className="doctor-empty-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="9" cy="8" r="3" />
                    <path d="M3.5 20c.7-3.4 2.5-5 5.5-5s4.8 1.6 5.5 5" />
                    <circle cx="17" cy="9" r="2.3" />
                  </svg>
                </div>

                <h3>No recent patients</h3>

                <p>
                  Patient activity will appear here.
                </p>
              </div>
            ) : (
              <div className="doctor-recent-patients">
                {recentPatients.map((patient, index) => (
                  <div
                    className="doctor-recent-patient"
                    key={patient.id || index}
                  >
                    <div className="doctor-patient-avatar">
                      {(patient.name || "P")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>{patient.name}</strong>
                      <span>
                        {patient.lastVisit || "Recent visit"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* QUICK ACTIONS */}
          <div className="doctor-dashboard-card doctor-quick-card">
            <div className="doctor-card-header">
              <div>
                <span className="doctor-card-label">SHORTCUTS</span>
                <h2>Quick Actions</h2>
              </div>
            </div>

            <div className="doctor-quick-actions">

              <button
                type="button"
                onClick={() => navigate("/doctor/appointments")}
              >
                <span className="doctor-quick-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="17" rx="3" />
                    <path d="M8 2v4M16 2v4M3 9h18M8 13h3M8 17h5" />
                  </svg>
                </span>

                <span>
                  <strong>Appointments</strong>
                  <small>Manage your schedule</small>
                </span>

                <span className="doctor-action-arrow">→</span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/doctor/patients")}
              >
                <span className="doctor-quick-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="9" cy="8" r="3" />
                    <path d="M3.5 20c.7-3.4 2.5-5 5.5-5s4.8 1.6 5.5 5" />
                    <circle cx="17" cy="9" r="2.3" />
                  </svg>
                </span>

                <span>
                  <strong>Patients</strong>
                  <small>Review patient information</small>
                </span>

                <span className="doctor-action-arrow">→</span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/doctor/prescriptions")}
              >
                <span className="doctor-quick-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="5" y="3" width="14" height="18" rx="2" />
                    <path d="M9 7h6M9 11h6M9 15h3" />
                  </svg>
                </span>

                <span>
                  <strong>Prescriptions</strong>
                  <small>Create and review prescriptions</small>
                </span>

                <span className="doctor-action-arrow">→</span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/doctor/messages")}
              >
                <span className="doctor-quick-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 5h16v11H8l-4 4V5Z" />
                    <path d="M8 9h8M8 12h5" />
                  </svg>
                </span>

                <span>
                  <strong>Messages</strong>
                  <small>Stay connected with patients</small>
                </span>

                <span className="doctor-action-arrow">→</span>
              </button>

            </div>
          </div>
        </section>
      </div>
    </DoctorLayout>
  );
}

export default DoctorDashboard;