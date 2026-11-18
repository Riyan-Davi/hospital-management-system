import { NavLink } from "react-router-dom";

function SidebarIcon({ type }) {
  const icons = {
    dashboard: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </>
    ),

    appointments: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="3" />
        <path d="M8 2v4M16 2v4M3 10h18" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01" />
      </>
    ),

    patients: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M2.5 21c.5-4 3-6 6.5-6s6 2 6.5 6" />
        <circle cx="17" cy="9" r="3" />
        <path d="M15 15c3 .3 4.9 2.1 5.5 5.5" />
      </>
    ),

    prescriptions: (
      <>
        <rect x="5" y="2.5" width="14" height="19" rx="2" />
        <path d="M9 7h6M9 11h6M9 15h3M15 15h.01" />
      </>
    ),

    records: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H10l2 2h5.5A2.5 2.5 0 0 1 20 7.5v10a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5Z" />
        <path d="M8 11h8M8 15h5" />
      </>
    ),

    messages: (
      <>
        <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 3v-3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
        <path d="M7 10h10M7 14h6" />
      </>
    ),

    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c.7-4.1 3.3-6 8-6s7.3 1.9 8 6" />
      </>
    ),

    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.06.06-1.42 1.42-.06-.06a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.08 1.65V20h-2v-.31a1.8 1.8 0 0 0-1.08-1.65 1.8 1.8 0 0 0-1.98.36l-.06.06-1.42-1.42.06-.06A1.8 1.8 0 0 0 9.16 15a1.8 1.8 0 0 0-1.65-1.08H7v-2h.51A1.8 1.8 0 0 0 9.16 10a1.8 1.8 0 0 0-.36-1.98l-.06-.06 1.42-1.42.06.06a1.8 1.8 0 0 0 1.98.36A1.8 1.8 0 0 0 13.28 5.3V5h2v.31a1.8 1.8 0 0 0 1.08 1.65 1.8 1.8 0 0 0 1.98-.36l.06-.06 1.42 1.42-.06.06A1.8 1.8 0 0 0 19.4 10a1.8 1.8 0 0 0 1.65 1.08h.31v2h-.31A1.8 1.8 0 0 0 19.4 15Z" />
      </>
    ),
  };

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[type]}
    </svg>
  );
}

function DoctorSidebar() {
  const menuItems = [
    {
      label: "Dashboard",
      path: "/doctordashboard",
      icon: "dashboard",
    },
    {
      label: "Appointments",
      path: "/doctor/appointments",
      icon: "appointments",
    },
    {
      label: "Patients",
      path: "/doctor/patients",
      icon: "patients",
    },
    {
      label: "Prescriptions",
      path: "/doctor/prescriptions",
      icon: "prescriptions",
    },
    {
      label: "Medical Records",
      path: "/doctor/records",
      icon: "records",
    },
    {
      label: "Messages",
      path: "/doctor/messages",
      icon: "messages",
      badge: 3,
    },
    {
      label: "Profile",
      path: "/doctor/profile",
      icon: "profile",
    },
    {
      label: "Settings",
      path: "/doctor/settings",
      icon: "settings",
    },
  ];

  return (
    <aside className="doctor-sidebar">

      <div className="doctor-brand">
        <div className="doctor-brand-icon">+</div>

        <div>
          <h1>
            MediCare<span>+</span>
          </h1>

          <p>Care Today, Healthier Tomorrow</p>
        </div>
      </div>

      <nav className="doctor-navigation">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `doctor-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="doctor-nav-icon">
              <SidebarIcon type={item.icon} />
            </span>

            <span className="doctor-nav-label">
              {item.label}
            </span>

            {item.badge && (
              <span className="doctor-nav-badge">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="doctor-sidebar-quote">

        <div className="doctor-quote-icon">
          ♡
        </div>

        <p>
          "Healing people,
          <br />
          one patient at a time."
        </p>

        <span>— MediCare+ Team</span>

      </div>

    </aside>
  );
}

export default DoctorSidebar;