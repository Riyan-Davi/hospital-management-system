import { API_BASE_URL } from "../../config/api";
import { useEffect, useMemo, useState } from "react";
import PatientLayout from "./PatientLayout";
import "./PatientDoctors.css";

function PatientDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/doctors`,
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const specializations = useMemo(() => {
    const values = doctors
      .map((doctor) => doctor.specialization)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const value = search.toLowerCase().trim();

    return doctors.filter((doctor) => {
      const matchesSearch =
        !value ||
        doctor.name?.toLowerCase().includes(value) ||
        doctor.specialization?.toLowerCase().includes(value) ||
        doctor.qualification?.toLowerCase().includes(value);

      const matchesSpecialization =
        specialization === "All" ||
        doctor.specialization === specialization;

      return matchesSearch && matchesSpecialization;
    });
  }, [doctors, search, specialization]);

  return (
    <PatientLayout>
      <div className="patient-doctors-page">
        <div className="patient-doctors-heading">
          <div>
            <span className="patient-page-label">
              FIND YOUR DOCTOR
            </span>

            <h1>Our Doctors</h1>

            <p>
              Browse doctors and choose the right specialist for your care.
            </p>
          </div>

          <div className="patient-doctors-count">
            <strong>{doctors.length}</strong>
            <span>Doctors</span>
          </div>
        </div>

        {error && (
          <div className="patient-doctors-error">
            {error}
          </div>
        )}

        <div className="patient-doctors-toolbar">
          <div className="patient-doctors-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search doctor or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="patient-doctor-filters">
            {specializations.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  specialization === item ? "active" : ""
                }
                onClick={() => setSpecialization(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="patient-doctors-empty">
            Loading doctors...
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="patient-doctors-empty">
            <div className="patient-doctors-empty-icon">
              ●
            </div>

            <h3>No doctors found</h3>

            <p>
              Try another name or specialization.
            </p>
          </div>
        ) : (
          <div className="patient-doctors-grid">
            {filteredDoctors.map((doctor) => (
              <div
                className="patient-doctor-card"
                key={doctor._id}
              >
                <div className="patient-doctor-top">
                  <div className="patient-doctor-avatar">
                    {doctor.name
                      ?.charAt(0)
                      ?.toUpperCase() || "D"}
                  </div>

                  <div>
                    <h3>Dr. {doctor.name}</h3>

                    <span>
                      {doctor.specialization ||
                        "General Physician"}
                    </span>
                  </div>
                </div>

                <div className="patient-doctor-details">
                  <div>
                    <span>Qualification</span>

                    <strong>
                      {doctor.qualification || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Experience</span>

                    <strong>
                      {doctor.experience || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Consultation Fee</span>

                    <strong>
                      {doctor.consultationFee
                        ? `₹${doctor.consultationFee}`
                        : "Not specified"}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="patient-view-doctor"
                  onClick={() =>
                    setSelectedDoctor(doctor)
                  }
                >
                  View Profile →
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedDoctor && (
          <div
            className="patient-doctor-modal-overlay"
            onClick={() => setSelectedDoctor(null)}
          >
            <div
              className="patient-doctor-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="patient-doctor-close"
                onClick={() =>
                  setSelectedDoctor(null)
                }
              >
                ×
              </button>

              <div className="patient-doctor-modal-header">
                <div className="patient-doctor-modal-avatar">
                  {selectedDoctor.name
                    ?.charAt(0)
                    ?.toUpperCase() || "D"}
                </div>

                <div>
                  <span>DOCTOR PROFILE</span>

                  <h2>
                    Dr. {selectedDoctor.name}
                  </h2>

                  <p>
                    {selectedDoctor.specialization ||
                      "General Physician"}
                  </p>
                </div>
              </div>

              <div className="patient-doctor-modal-grid">
                <div>
                  <span>Qualification</span>

                  <strong>
                    {selectedDoctor.qualification || "—"}
                  </strong>
                </div>

                <div>
                  <span>Experience</span>

                  <strong>
                    {selectedDoctor.experience || "—"}
                  </strong>
                </div>

                <div>
                  <span>Consultation Fee</span>

                  <strong>
                    {selectedDoctor.consultationFee
                      ? `₹${selectedDoctor.consultationFee}`
                      : "Not specified"}
                  </strong>
                </div>

                <div>
                  <span>Phone</span>

                  <strong>
                    {selectedDoctor.phone || "—"}
                  </strong>
                </div>

                <div>
                  <span>Email</span>

                  <strong>
                    {selectedDoctor.email || "—"}
                  </strong>
                </div>

                <div>
                  <span>Location</span>

                  <strong>
                    {[
                      selectedDoctor.city,
                      selectedDoctor.state,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </strong>
                </div>
              </div>

              {selectedDoctor.bio && (
                <div className="patient-doctor-bio">
                  <span>ABOUT THE DOCTOR</span>

                  <p>{selectedDoctor.bio}</p>
                </div>
              )}

              <button
                type="button"
                className="patient-book-doctor"
                onClick={() => {
                  setSelectedDoctor(null);
                  window.location.href =
                    "/patient/appointments";
                }}
              >
                Book Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}

export default PatientDoctors;