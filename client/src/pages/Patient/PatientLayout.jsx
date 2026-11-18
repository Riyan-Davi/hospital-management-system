import PatientSidebar from "./PatientSidebar";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./PatientLayout.css";

function PatientLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="patient-layout">
      <PatientSidebar />

      <main className="patient-main">
        <header className="patient-topbar">

          <div className="patient-topbar-left">
            <h2>Patient Portal</h2>
            <p>Manage your health, appointments and records</p>
          </div>

          <div className="patient-topbar-right">

            <button className="patient-notification-button">
              🔔
            </button>

            <div className="patient-user">

              <div className="patient-user-avatar">
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "U"}
              </div>

              <div className="patient-user-info">
                <strong>{user?.name || "Patient"}</strong>
                <span>Patient</span>
              </div>

            </div>

            <button
              type="button"
              className="patient-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </header>

        <div className="patient-content">
          {children}
        </div>

      </main>
    </div>
  );
}

export default PatientLayout;