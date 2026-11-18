import { useState } from "react";
import PatientLayout from "./PatientLayout";
import { useAuth } from "../../context/AuthContext";
import "./PatientSettings.css";

function PatientSettings() {
  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = () => {
    setSaving(true);
    setMessage("");

    setTimeout(() => {
      localStorage.setItem(
        "patientSettings",
        JSON.stringify({
          notifications,
          emailUpdates,
        })
      );

      setSaving(false);
      setMessage("Settings saved successfully.");
    }, 500);
  };

  return (
    <PatientLayout>
      <div className="patient-settings-page">
        <div className="settings-header">
          <p className="section-label">SETTINGS</p>
          <h1>Settings</h1>
          <p>Manage your account and notification preferences.</p>
        </div>

        {message && (
          <div className="settings-success">
            {message}
          </div>
        )}

        <div className="settings-grid">
          <section className="settings-card">
            <div className="card-heading">
              <h2>Account</h2>
              <p>Your current account information.</p>
            </div>

            <div className="account-info">
              <div>
                <span>Name</span>
                <strong>{user?.name || "—"}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{user?.email || "—"}</strong>
              </div>

              <div>
                <span>Role</span>
                <strong>Patient</strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>{user?.phone || "Not added"}</strong>
              </div>
            </div>
          </section>

          <section className="settings-card">
            <div className="card-heading">
              <h2>Notifications</h2>
              <p>Choose how you want to receive updates.</p>
            </div>

            <div className="setting-row">
              <div>
                <strong>App Notifications</strong>
                <span>
                  Receive appointment and message notifications.
                </span>
              </div>

              <button
                type="button"
                className={`toggle ${
                  notifications ? "active" : ""
                }`}
                onClick={() =>
                  setNotifications(!notifications)
                }
              >
                <span />
              </button>
            </div>

            <div className="setting-row">
              <div>
                <strong>Email Updates</strong>
                <span>
                  Receive important updates through email.
                </span>
              </div>

              <button
                type="button"
                className={`toggle ${
                  emailUpdates ? "active" : ""
                }`}
                onClick={() =>
                  setEmailUpdates(!emailUpdates)
                }
              >
                <span />
              </button>
            </div>

            <button
              className="save-settings-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </section>

          <section className="settings-card danger-card">
            <div className="card-heading">
              <h2>Account Actions</h2>
              <p>Manage your current session.</p>
            </div>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Log Out
            </button>
          </section>
        </div>
      </div>
    </PatientLayout>
  );
}

export default PatientSettings;