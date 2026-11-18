import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function DoctorTopbar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const doctorName = user?.name || "Riyan";
  const doctorEmail = user?.email || "doctor@medicare.com";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="doctor-topbar">

      {/* SEARCH */}
      <div className="doctor-search">

        <span className="doctor-search-icon">
          ⌕
        </span>

        <input
          type="text"
          placeholder="Search patients, appointments, or records..."
        />

        <span className="doctor-search-shortcut">
          Ctrl + K
        </span>

      </div>


      {/* RIGHT SIDE */}
      <div className="doctor-topbar-right">

        {/* NOTIFICATIONS */}
        <button
          type="button"
          className="doctor-notification"
          aria-label="Notifications"
        >
          ♧

          <span>3</span>
        </button>


        {/* PROFILE */}
        <div className="doctor-profile-wrapper">

          <button
            type="button"
            className="doctor-profile-button"
            onClick={() => setOpen(!open)}
          >

            <div className="doctor-avatar">
              DR
            </div>

            <div className="doctor-profile-info">

              <strong>
                {doctorName}
              </strong>

              <small>
                Cardiologist
              </small>

            </div>

            <span className="doctor-profile-arrow">
              {open ? "⌃" : "⌄"}
            </span>

          </button>


          {/* DROPDOWN */}
          {open && (
            <div className="doctor-profile-menu">

              <div className="doctor-menu-header">

                <strong>
                  {doctorName}
                </strong>

                <span>
                  {doctorEmail}
                </span>

              </div>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate("/doctor/profile");
                }}
              >
                <span>●</span>
                My Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate("/doctor/settings");
                }}
              >
                <span>⚙</span>
                Settings
              </button>

              <div className="doctor-menu-divider" />

              <button
                type="button"
                className="doctor-logout-button"
                onClick={handleLogout}
              >
                <span>↪</span>
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}

export default DoctorTopbar;