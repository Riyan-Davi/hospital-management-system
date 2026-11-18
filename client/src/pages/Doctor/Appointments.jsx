import { API_BASE_URL } from "../../config/api";
import { useEffect, useState } from "react";
import DoctorLayout from "./DoctorLayout";
import "./Appointments.css";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/doctor-appointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to load appointments"
        );
        return;
      }

      setAppointments(data.appointments || []);
    } catch (error) {
      setMessage("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/doctor-appointments/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to update appointment"
        );
        return;
      }

      setAppointments((current) =>
        current.map((appointment) =>
          appointment._id === id
            ? {
                ...appointment,
                status,
              }
            : appointment
        )
      );

      setMessage("Appointment status updated");
    } catch (error) {
      setMessage("Unable to connect to the server");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredAppointments =
    filter === "All"
      ? appointments
      : appointments.filter(
          (appointment) =>
            appointment.status === filter
        );

  return (
    <DoctorLayout>
      <div className="doctor-appointments-page">

        {/* HEADER */}

        <div className="doctor-appointments-header">
          <div>
            <span className="doctor-appointments-label">
              APPOINTMENTS
            </span>

            <h1>Appointments</h1>

            <p>
              Manage your patient appointments and daily schedule.
            </p>
          </div>

          <button
            type="button"
            className="doctor-appointments-refresh"
            onClick={fetchAppointments}
          >
            Refresh
          </button>
        </div>

        {message && (
          <div className="doctor-appointments-message">
            {message}
          </div>
        )}

        {/* SUMMARY */}

        <div className="doctor-appointment-summary">

          <div>
            <span>Total</span>
            <strong>{appointments.length}</strong>
          </div>

          <div>
            <span>Scheduled</span>
            <strong>
              {
                appointments.filter(
                  (item) =>
                    item.status === "Scheduled"
                ).length
              }
            </strong>
          </div>

          <div>
            <span>Confirmed</span>
            <strong>
              {
                appointments.filter(
                  (item) =>
                    item.status === "Confirmed"
                ).length
              }
            </strong>
          </div>

          <div>
            <span>Completed</span>
            <strong>
              {
                appointments.filter(
                  (item) =>
                    item.status === "Completed"
                ).length
              }
            </strong>
          </div>

        </div>

        {/* FILTERS */}

        <div className="doctor-appointment-filters">
          {[
            "All",
            "Scheduled",
            "Confirmed",
            "Completed",
            "Cancelled",
          ].map((item) => (
            <button
              type="button"
              key={item}
              className={
                filter === item
                  ? "active"
                  : ""
              }
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {/* TABLE */}

        <section className="doctor-appointments-card">

          {loading ? (
            <div className="doctor-appointments-empty">
              Loading appointments...
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="doctor-appointments-empty">

              <div className="doctor-appointments-empty-icon">
                <svg viewBox="0 0 24 24">
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="17"
                    rx="3"
                  />
                  <path d="M8 2v4M16 2v4M3 9h18" />
                </svg>
              </div>

              <h2>No appointments found</h2>

              <p>
                Appointments matching your selection
                will appear here.
              </p>

            </div>
          ) : (
            <div className="doctor-appointments-table-wrapper">

              <table className="doctor-appointments-table">

                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAppointments.map(
                    (appointment) => (
                      <tr key={appointment._id}>

                        <td>
                          <div className="doctor-appointment-patient">

                            <div className="doctor-appointment-avatar">
                              {(
                                appointment.patient
                                  ?.name || "P"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {
                                  appointment.patient
                                    ?.name ||
                                  "Patient"
                                }
                              </strong>

                              <span>
                                {
                                  appointment.patient
                                    ?.email ||
                                  "No email"
                                }
                              </span>
                            </div>

                          </div>
                        </td>

                        <td>
                          {formatDate(
                            appointment.appointmentDate
                          )}
                        </td>

                        <td>
                          {appointment.time}
                        </td>

                        <td>
                          {appointment.type ||
                            "Consultation"}
                        </td>

                        <td>
                          <span
                            className={`doctor-appointment-status ${appointment.status
                              ?.toLowerCase()
                              .replace(
                                " ",
                                "-"
                              )}`}
                          >
                            {appointment.status}
                          </span>
                        </td>

                        <td>
                          <select
                            className="doctor-status-select"
                            value={
                              appointment.status
                            }
                            onChange={(event) =>
                              updateStatus(
                                appointment._id,
                                event.target.value
                              )
                            }
                          >
                            <option value="Scheduled">
                              Scheduled
                            </option>

                            <option value="Confirmed">
                              Confirmed
                            </option>

                            <option value="Completed">
                              Completed
                            </option>

                            <option value="Cancelled">
                              Cancelled
                            </option>

                            <option value="Pending">
                              Pending
                            </option>
                          </select>
                        </td>

                      </tr>
                    )
                  )}
                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>
    </DoctorLayout>
  );
}

export default Appointments;