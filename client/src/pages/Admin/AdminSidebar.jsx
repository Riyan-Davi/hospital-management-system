import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-logo-circle">+</div>
        <div className="admin-logo-text">
          <h2>HMS Admin</h2>
          <span>Hospital Control Panel</span>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive ? "admin-nav-item active" : "admin-nav-item"
          }
        >
          <svg viewBox="0 0 24 24" className="admin-nav-icon">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
          </svg>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/doctors"
          className={({ isActive }) =>
            isActive ? "admin-nav-item active" : "admin-nav-item"
          }
        >
          <svg viewBox="0 0 24 24" className="admin-nav-icon">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M19 8v6M22 11h-6" />
          </svg>
          <span>Manage Doctors</span>
        </NavLink>

        <NavLink
          to="/admin/patients"
          className={({ isActive }) =>
            isActive ? "admin-nav-item active" : "admin-nav-item"
          }
        >
          <svg viewBox="0 0 24 24" className="admin-nav-icon">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>Manage Patients</span>
        </NavLink>

        <NavLink
          to="/admin/departments"
          className={({ isActive }) =>
            isActive ? "admin-nav-item active" : "admin-nav-item"
          }
        >
          <svg viewBox="0 0 24 24" className="admin-nav-icon">
            <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
          </svg>
          <span>Departments</span>
        </NavLink>

        <NavLink
          to="/admin/appointments"
          className={({ isActive }) =>
            isActive ? "admin-nav-item active" : "admin-nav-item"
          }
        >
          <svg viewBox="0 0 24 24" className="admin-nav-icon">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>All Appointments</span>
        </NavLink>

        <NavLink
          to="/admin/hospital"
          className={({ isActive }) =>
            isActive ? "admin-nav-item active" : "admin-nav-item"
          }
        >
          <svg viewBox="0 0 24 24" className="admin-nav-icon">
            <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>Hospital Profile</span>
        </NavLink>

        <NavLink
          to="/admin/reports"
          className={({ isActive }) =>
            isActive ? "admin-nav-item active" : "admin-nav-item"
          }
        >
          <svg viewBox="0 0 24 24" className="admin-nav-icon">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span>Reports & Analytics</span>
        </NavLink>

        <NavLink
          to="/admin/audit-logs"
          className={({ isActive }) =>
            isActive ? "admin-nav-item active" : "admin-nav-item"
          }
        >
          <svg viewBox="0 0 24 24" className="admin-nav-icon">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span>Audit Logs</span>
        </NavLink>
      </nav>

      <div className="admin-sidebar-footer">
        <button type="button" className="admin-logout-btn" onClick={logout}>
          <svg viewBox="0 0 24 24" className="admin-nav-icon">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
