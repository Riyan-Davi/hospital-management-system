import { useState } from "react";
import DoctorLayout from "./DoctorLayout";
import "./Settings.css";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem(
      "doctorSettings",
      JSON.stringify({
        notifications,
        emailUpdates,
        appointmentReminders,
        messageAlerts,
      })
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <DoctorLayout>
      <div className="doctor-settings-page">
        <div className="doctor-settings-heading">
          <span className="doctor-page-label">ACCOUNT PREFERENCES</span>

          <h1>Settings</h1>

          <p>
            Manage your notification and account preferences.
          </p>
        </div>

        {saved && (
          <div className="doctor-settings-success">
            Settings saved successfully.
          </div>
        )}

        <div className="doctor-settings-grid">
          <section className="doctor-settings-card">
            <div className="doctor-settings-card-heading">
              <div className="doctor-settings-icon">♧</div>

              <div>
                <h2>Notifications</h2>
                <p>Choose which notifications you want to receive.</p>
              </div>
            </div>

            <div className="doctor-setting-row">
              <div>
                <strong>Push Notifications</strong>
                <span>Receive important alerts inside the application.</span>
              </div>

              <button
                type="button"
                className={`doctor-toggle ${
                  notifications ? "active" : ""
                }`}
                onClick={() => setNotifications(!notifications)}
              >
                <span />
              </button>
            </div>

            <div className="doctor-setting-row">
              <div>
                <strong>Appointment Reminders</strong>
                <span>
                  Get reminders about upcoming patient appointments.
                </span>
              </div>

              <button
                type="button"
                className={`doctor-toggle ${
                  appointmentReminders ? "active" : ""
                }`}
                onClick={() =>
                  setAppointmentReminders(!appointmentReminders)
                }
              >
                <span />
              </button>
            </div>

            <div className="doctor-setting-row">
              <div>
                <strong>Message Alerts</strong>
                <span>Get notified when a patient sends a message.</span>
              </div>

              <button
                type="button"
                className={`doctor-toggle ${
                  messageAlerts ? "active" : ""
                }`}
                onClick={() =>
                  setMessageAlerts(!messageAlerts)
                }
              >
                <span />
              </button>
            </div>

            <div className="doctor-setting-row">
              <div>
                <strong>Email Updates</strong>
                <span>
                  Receive important account updates by email.
                </span>
              </div>

              <button
                type="button"
                className={`doctor-toggle ${
                  emailUpdates ? "active" : ""
                }`}
                onClick={() =>
                  setEmailUpdates(!emailUpdates)
                }
              >
                <span />
              </button>
            </div>
          </section>

          <section className="doctor-settings-card">
            <div className="doctor-settings-card-heading">
              <div className="doctor-settings-icon">●</div>

              <div>
                <h2>Account Information</h2>
                <p>Your account details are managed from your profile.</p>
              </div>
            </div>

            <div className="doctor-account-info">
              <div>
                <span>Account Role</span>
                <strong>Doctor</strong>
              </div>

              <div>
                <span>Profile</span>
                <strong>Doctor Profile</strong>
              </div>

              <div>
                <span>Security</span>
                <strong>Protected Account</strong>
              </div>
            </div>
          </section>

          <section className="doctor-settings-card doctor-settings-wide">
            <div className="doctor-settings-card-heading">
              <div className="doctor-settings-icon">⚙</div>

              <div>
                <h2>System Preferences</h2>
                <p>General preferences for your MediCare+ account.</p>
              </div>
            </div>

            <div className="doctor-system-row">
              <div>
                <strong>Language</strong>
                <span>Application language</span>
              </div>

              <select defaultValue="English">
                <option>English</option>
              </select>
            </div>

            <div className="doctor-system-row">
              <div>
                <strong>Time Zone</strong>
                <span>Used for appointments and reminders</span>
              </div>

              <select defaultValue="Asia/Kolkata">
                <option value="Asia/Kolkata">
                  India Standard Time
                </option>
                <option value="UTC">
                  UTC
                </option>
              </select>
            </div>
          </section>
        </div>

        <div className="doctor-settings-actions">
          <button
            type="button"
            className="doctor-save-settings"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </DoctorLayout>
  );
}

export default Settings;