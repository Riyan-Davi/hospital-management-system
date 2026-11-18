import { API_BASE_URL } from "../../config/api";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientLayout from "./PatientLayout";
import "./PatientAppointments.css";

function PatientAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState("All");
  const [showBooking, setShowBooking] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: "",
    time: "",
    type: "Consultation",
    reason: "",
  });

  const token = localStorage.getItem("token");

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/appointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load appointments"
        );
      }

      setAppointments(data.appointments || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/appointments/doctors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load doctors"
        );
      }

      setDoctors(data.doctors || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAppointments(),
        fetchDoctors(),
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  const filteredAppointments = useMemo(() => {
    if (activeFilter === "All") {
      return appointments;
    }

    return appointments.filter(
      (appointment) =>
        appointment.status === activeFilter
    );
  }, [appointments, activeFilter]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    setBookingLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to book appointment"
        );
      }

      setAppointments((prev) => [
        ...prev,
        data.appointment,
      ]);

      setFormData({
        doctorId: "",
        appointmentDate: "",
        time: "",
        type: "Consultation",
        reason: "",
      });

      setShowBooking(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/appointments/${id}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to cancel appointment"
        );
      }

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === id
            ? {
                ...appointment,
                status: "Cancelled",
              }
            : appointment
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatShortDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
      }
    );
  };

  const getStatusClass = (status) => {
    return status
      ?.toLowerCase()
      .replace(/\s+/g, "-") || "pending";
  };

  return (
    <PatientLayout>
      <div className="patient-appointments-page">

        {/* HEADER */}
        <div className="appointments-header">
          <div>
            <p className="appointments-label">
              APPOINTMENT MANAGEMENT
            </p>

            <h1>My Appointments</h1>

            <p className="appointments-subtitle">
              Manage your upcoming and previous doctor
              appointments.
            </p>
          </div>

          <button
            className="book-appointment-btn"
            onClick={() => setShowBooking(true)}
          >
            <span>+</span>
            Book Appointment
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="appointments-error">
            {error}
          </div>
        )}

        {/* FILTERS */}
        <div className="appointments-toolbar">
          <div className="appointment-filters">
            {[
              "All",
              "Pending",
              "Scheduled",
              "Confirmed",
              "Completed",
              "Cancelled",
            ].map((filter) => (
              <button
                key={filter}
                className={
                  activeFilter === filter
                    ? "filter-btn active"
                    : "filter-btn"
                }
                onClick={() =>
                  setActiveFilter(filter)
                }
              >
                {filter}
              </button>
            ))}
          </div>

          <span className="appointment-count">
            {filteredAppointments.length} appointment
            {filteredAppointments.length !== 1
              ? "s"
              : ""}
          </span>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="appointments-loading">
            <div className="loading-spinner"></div>
            <p>Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="appointments-empty">
            <div className="empty-calendar-icon">
              📅
            </div>

            <h2>No appointments yet</h2>

            <p>
              Book your first appointment with one of
              our doctors.
            </p>

            <button
              onClick={() => setShowBooking(true)}
            >
              Book Appointment
            </button>
          </div>
        ) : (
          <div className="appointments-list">
            {filteredAppointments.map(
              (appointment) => (
                <div
                  className="appointment-card"
                  key={appointment._id}
                >
                  <div className="appointment-date-box">
                    <span>
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString("en-IN", {
                        month: "short",
                      })}
                    </span>

                    <strong>
                      {new Date(
                        appointment.appointmentDate
                      ).getDate()}
                    </strong>

                    <small>
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString("en-IN", {
                        weekday: "short",
                      })}
                    </small>
                  </div>

                  <div className="appointment-main">
                    <div className="appointment-top">
                      <div>
                        <h2>
                          Dr.{" "}
                          {appointment.doctor?.name ||
                            "Doctor"}
                        </h2>

                        <p>
                          {appointment.doctor
                            ?.specialization ||
                            "General Consultation"}
                        </p>
                      </div>

                      <span
                        className={`appointment-status ${getStatusClass(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div className="appointment-info">
                      <div>
                        <span>DATE</span>
                        <strong>
                          {formatDate(
                            appointment.appointmentDate
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>TIME</span>
                        <strong>
                          {appointment.time}
                        </strong>
                      </div>

                      <div>
                        <span>TYPE</span>
                        <strong>
                          {appointment.type ||
                            "Consultation"}
                        </strong>
                      </div>
                    </div>

                    {appointment.reason && (
                      <div className="appointment-reason">
                        <span>Reason:</span>{" "}
                        {appointment.reason}
                      </div>
                    )}

                    <div className="appointment-actions">
                      <button
                        className="view-btn"
                        onClick={() =>
                          setSelectedAppointment(
                            appointment
                          )
                        }
                      >
                        View Details
                      </button>

                      {appointment.status !==
                        "Cancelled" &&
                        appointment.status !==
                          "Completed" && (
                          <button
                            className="cancel-appointment-btn"
                            onClick={() =>
                              cancelAppointment(
                                appointment._id
                              )
                            }
                          >
                            Cancel
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* BOOK APPOINTMENT MODAL */}
        {showBooking && (
          <div className="appointment-modal-overlay">
            <div className="appointment-modal">
              <div className="modal-heading">
                <div>
                  <p className="appointments-label">
                    NEW APPOINTMENT
                  </p>

                  <h2>Book Appointment</h2>

                  <p>
                    Select a doctor and appointment time.
                  </p>
                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setShowBooking(false)
                  }
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleBooking}>
                <div className="booking-form-grid">

                  <div className="booking-field full">
                    <label>Select Doctor</label>

                    <select
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Choose a doctor
                      </option>

                      {doctors.map((doctor) => (
                        <option
                          key={doctor._id}
                          value={doctor._id}
                        >
                          Dr. {doctor.name}
                          {doctor.specialization
                            ? ` — ${doctor.specialization}`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="booking-field">
                    <label>Appointment Date</label>

                    <input
                      type="date"
                      name="appointmentDate"
                      value={
                        formData.appointmentDate
                      }
                      onChange={handleChange}
                      min={
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                      required
                    />
                  </div>

                  <div className="booking-field">
                    <label>Time</label>

                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="booking-field">
                    <label>Appointment Type</label>

                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option>
                        Consultation
                      </option>

                      <option>
                        Follow-up
                      </option>

                      <option>
                        General Checkup
                      </option>

                      <option>
                        Specialist Consultation
                      </option>
                    </select>
                  </div>

                  <div className="booking-field full">
                    <label>Reason for Visit</label>

                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Briefly describe the reason for your visit..."
                    />
                  </div>

                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-cancel"
                    onClick={() =>
                      setShowBooking(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="modal-submit"
                    disabled={bookingLoading}
                  >
                    {bookingLoading
                      ? "Booking..."
                      : "Book Appointment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DETAILS MODAL */}
        {selectedAppointment && (
          <div className="appointment-modal-overlay">
            <div className="appointment-modal details-modal">
              <div className="modal-heading">
                <div>
                  <p className="appointments-label">
                    APPOINTMENT DETAILS
                  </p>

                  <h2>
                    Dr.{" "}
                    {selectedAppointment.doctor?.name ||
                      "Doctor"}
                  </h2>
                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setSelectedAppointment(null)
                  }
                >
                  ×
                </button>
              </div>

              <div className="details-status-row">
                <span
                  className={`appointment-status ${getStatusClass(
                    selectedAppointment.status
                  )}`}
                >
                  {selectedAppointment.status}
                </span>
              </div>

              <div className="appointment-details-grid">
                <div>
                  <span>Date</span>
                  <strong>
                    {formatDate(
                      selectedAppointment.appointmentDate
                    )}
                  </strong>
                </div>

                <div>
                  <span>Time</span>
                  <strong>
                    {selectedAppointment.time}
                  </strong>
                </div>

                <div>
                  <span>Specialization</span>
                  <strong>
                    {selectedAppointment.doctor
                      ?.specialization ||
                      "General"}
                  </strong>
                </div>

                <div>
                  <span>Appointment Type</span>
                  <strong>
                    {selectedAppointment.type ||
                      "Consultation"}
                  </strong>
                </div>

                <div className="details-full">
                  <span>Reason for Visit</span>
                  <p>
                    {selectedAppointment.reason ||
                      "No reason provided."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </PatientLayout>
  );
}

export default PatientAppointments;