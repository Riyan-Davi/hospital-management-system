import { API_BASE_URL } from "../../config/api";
import { useEffect, useState } from "react";
import PatientLayout from "./PatientLayout";
import { useAuth } from "../../context/AuthContext";
import "./PatientProfile.css";

function PatientProfile() {
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        const profile = data.user;

        setFormData({
          name: profile.name || "",
          phone: profile.phone || "",
          dateOfBirth: profile.dateOfBirth || "",
          gender: profile.gender || "",
          address: profile.address || "",
          city: profile.city || "",
          state: profile.state || "",
          country: profile.country || "India",
          zipCode: profile.zipCode || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      const updatedUser = data.user;

      login(updatedUser, token);

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PatientLayout>
        <div className="profile-loading">
          Loading profile...
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="patient-profile-page">
        <div className="profile-header">
          <p className="section-label">MY PROFILE</p>
          <h1>Patient Profile</h1>
          <p>
            Manage your personal information and contact details.
          </p>
        </div>

        {message && (
          <div className="profile-success">
            {message}
          </div>
        )}

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

        <form
          className="profile-card"
          onSubmit={handleSubmit}
        >
          <div className="profile-card-heading">
            <h2>Personal Information</h2>
            <p>Keep your information up to date.</p>
          </div>

          <div className="profile-grid">
            <div className="profile-field">
              <label>Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="profile-field">
              <label>Email</label>
              <input
                value={user?.email || ""}
                disabled
              />
            </div>

            <div className="profile-field">
              <label>Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </div>

            <div className="profile-field">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="profile-field">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">
                  Prefer not to say
                </option>
              </select>
            </div>
          </div>

          <div className="profile-card-heading address-heading">
            <h2>Address</h2>
            <p>Your current residential information.</p>
          </div>

          <div className="profile-grid">
            <div className="profile-field full-width">
              <label>Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
              />
            </div>

            <div className="profile-field">
              <label>City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>

            <div className="profile-field">
              <label>State</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>

            <div className="profile-field">
              <label>Country</label>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
              />
            </div>

            <div className="profile-field">
              <label>ZIP Code</label>
              <input
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="ZIP code"
              />
            </div>
          </div>

          <div className="profile-actions">
            <button
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </PatientLayout>
  );
}

export default PatientProfile;