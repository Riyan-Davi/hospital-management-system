import DoctorSidebar from "./DoctorSidebar";
import DoctorTopbar from "./DoctorTopbar";
import "./DoctorLayout.css";

function DoctorLayout({ children }) {
  return (
    <div className="doctor-app">
      <DoctorSidebar />

      <div className="doctor-main">
        <DoctorTopbar />

        <main className="doctor-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DoctorLayout;