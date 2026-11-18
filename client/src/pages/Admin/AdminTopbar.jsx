import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function AdminTopbar() {
  const { user } = useAuth();

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <span className="admin-badge">ADMINISTRATION PORTAL</span>
        <h3 className="admin-welcome-text">
          Hospital Operations Center
        </h3>
      </div>

      <div className="admin-topbar-right">
        <div className="admin-user-info">
          <div className="admin-avatar">
            {(user?.name || "A").charAt(0).toUpperCase()}
          </div>
          <div className="admin-user-details">
            <strong className="admin-name">{user?.name || "Administrator"}</strong>
            <span className="admin-email">{user?.email || "admin@hospital.com"}</span>
          </div>
        </div>

        <Link to="/" className="admin-view-site-btn">
          View Hospital Site →
        </Link>
      </div>
    </header>
  );
}

export default AdminTopbar;
