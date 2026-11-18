import { API_BASE_URL } from "../../config/api";
import { useEffect, useState } from "react";
import DoctorLayout from "./DoctorLayout";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");

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
        setMessage(data.message || "Unable to load profile");
        return;
      }

      setProfile(data.user);
      setFormData(data.user);
    } catch (error) {
      setMessage("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      const token = localStorage.getItem("token");

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
        setMessage(data.message || "Unable to update profile");
        return;
      }

      setProfile(data.user);
      setFormData(data.user);
      setEditing(false);
      setMessage("Profile updated successfully");
    } catch (error) {
      setMessage("Unable to connect to the server");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
    setMessage("");
  };

  if (loading) {
    return (
      <DoctorLayout>
        <div className="doctor-profile-loading">
          Loading profile...
        </div>
      </DoctorLayout>
    );
  }

  if (!profile) {
    return (
      <DoctorLayout>
        <div className="doctor-profile-loading">
          {message || "Profile not found"}
        </div>
      </DoctorLayout>
    );
  }

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "DR";

  return (
    <DoctorLayout>
      <div className="doctor-profile-page">

        {/* HEADER */}

        <div className="doctor-profile-header">
          <div>
            <span className="doctor-profile-label">
              DOCTOR PROFILE
            </span>

            <h1>My Profile</h1>

            <p>
              Manage your professional and personal information.
            </p>
          </div>

          {!editing ? (
            <button
              type="button"
              className="doctor-profile-edit-button"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <div className="doctor-profile-header-actions">
              <button
                type="button"
                className="doctor-profile-cancel-button"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="doctor-profile-save-button"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {message && (
          <div className="doctor-profile-message">
            {message}
          </div>
        )}

        {/* PROFILE SUMMARY */}

        <section className="doctor-profile-summary">

          <div className="doctor-profile-avatar">
            {initials}
          </div>

          <div className="doctor-profile-summary-info">
            <h2>Dr. {profile.name}</h2>

            <p>
              {profile.specialization ||
                "Medical Professional"}
            </p>

            <span>{profile.email}</span>
          </div>

          <div className="doctor-profile-status">
            <span></span>
            Active Doctor
          </div>
        </section>

        {/* PROFESSIONAL INFORMATION */}

        <section className="doctor-profile-card">

          <div className="doctor-profile-card-header">
            <div>
              <span>PROFESSIONAL</span>
              <h2>Professional Information</h2>
            </div>
          </div>

          <div className="doctor-profile-fields">

            <div className="doctor-profile-field">
              <label>Specialization</label>

              <input
                name="specialization"
                value={formData.specialization || ""}
                onChange={handleChange}
                disabled={!editing}
                placeholder="e.g. Cardiology"
              />
            </div>

            <div className="doctor-profile-field">
              <label>Qualification</label>

              <input
                name="qualification"
                value={formData.qualification || ""}
                onChange={handleChange}
                disabled={!editing}
                placeholder="e.g. MBBS, MD"
              />
            </div>

            <div className="doctor-profile-field">
              <label>Experience</label>

              <input
                name="experience"
                value={formData.experience || ""}
                onChange={handleChange}
                disabled={!editing}
                placeholder="e.g. 10 years"
              />
            </div>

            <div className="doctor-profile-field">
              <label>Medical License Number</label>

              <input
                name="licenseNumber"
                value={formData.licenseNumber || ""}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Enter license number"
              />
            </div>

            <div className="doctor-profile-field">
              <label>Consultation Fee</label>

              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee || ""}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Enter consultation fee"
              />
            </div>

          </div>

          <div className="doctor-profile-bio">
            <label>Professional Bio</label>

            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Tell patients about your professional experience..."
              rows="5"
            />
          </div>

        </section>

        {/* PERSONAL INFORMATION */}

        <section className="doctor-profile-card">

          <div className="doctor-profile-card-header">
            <div>
              <span>PERSONAL</span>
              <h2>Personal Information</h2>
            </div>
          </div>

          <div className="doctor-profile-fields">

            <div className="doctor-profile-field">
              <label>Full Name</label>

              <input
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="doctor-profile-field">
              <label>Email Address</label>

              <input
                value={profile.email || ""}
                disabled
              />
            </div>

            <div className="doctor-profile-field">
              <label>Phone Number</label>

              <input
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Enter phone number"
              />
            </div>

            <div className="doctor-profile-field">
              <label>Date of Birth</label>

              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="doctor-profile-field">
              <label>Gender</label>

              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                disabled={!editing}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

          </div>

        </section>

        {/* ADDRESS */}

        <section className="doctor-profile-card">

          <div className="doctor-profile-card-header">
            <div>
              <span>CONTACT</span>
              <h2>Address Information</h2>
            </div>
          </div>

          <div className="doctor-profile-fields">

            <div className="doctor-profile-field doctor-profile-full">
              <label>Address</label>

              <input
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Enter address"
              />
            </div>

            <div className="doctor-profile-field">
              <label>City</label>

              <input
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="doctor-profile-field">
              <label>State</label>

              <input
                name="state"
                value={formData.state || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="doctor-profile-field">
              <label>Country</label>

              <input
                name="country"
                value={formData.country || "India"}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="doctor-profile-field">
              <label>ZIP Code</label>

              <input
                name="zipCode"
                value={formData.zipCode || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

          </div>

        </section>

      </div>
    </DoctorLayout>
  );
}

export default Profile;