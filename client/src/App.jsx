import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";

// Admin Module
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageDoctors from "./pages/Admin/ManageDoctors";
import ManagePatients from "./pages/Admin/ManagePatients";
import ManageDepartments from "./pages/Admin/ManageDepartments";
import ManageAppointments from "./pages/Admin/ManageAppointments";
import ManageHospital from "./pages/Admin/ManageHospital";
import Reports from "./pages/Admin/Reports";
import AuditLogs from "./pages/Admin/AuditLogs";

// Doctor Module
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import Appointments from "./pages/Doctor/Appointments";
import Patients from "./pages/Doctor/Patients";
import Prescriptions from "./pages/Doctor/Prescriptions";
import MedicalRecords from "./pages/Doctor/MedicalRecords";
import Messages from "./pages/Doctor/Messages";
import Profile from "./pages/Doctor/Profile";
import Settings from "./pages/Doctor/Settings";

// Patient Module
import PatientDashboard from "./pages/Patient/PatientDashboard";
import PatientAppointments from "./pages/Patient/PatientAppointments";
import PatientDoctors from "./pages/Patient/PatientDoctors";
import PatientPrescriptions from "./pages/Patient/PatientPrescriptions";
import PatientMedicalRecords from "./pages/Patient/PatientMedicalRecords";
import PatientLabReports from "./pages/Patient/PatientLabReports";
import PatientMessages from "./pages/Patient/PatientMessages";
import PatientProfile from "./pages/Patient/PatientProfile";
import PatientSettings from "./pages/Patient/PatientSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            MAIN WEBSITE
        ========================== */}

        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* =========================
            ADMIN MODULE
        ========================== */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManageDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManagePatients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/departments"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManageDepartments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManageAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hospital"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManageHospital />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRole="admin">
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute allowedRole="admin">
              <AuditLogs />
            </ProtectedRoute>
          }
        />

        {/* =========================
            DOCTOR MODULE
        ========================== */}

        <Route
          path="/doctordashboard"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute allowedRole="doctor">
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <ProtectedRoute allowedRole="doctor">
              <Patients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/prescriptions"
          element={
            <ProtectedRoute allowedRole="doctor">
              <Prescriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/records"
          element={
            <ProtectedRoute allowedRole="doctor">
              <MedicalRecords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/messages"
          element={
            <ProtectedRoute allowedRole="doctor">
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute allowedRole="doctor">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/settings"
          element={
            <ProtectedRoute allowedRole="doctor">
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* =========================
            PATIENT MODULE
        ========================== */}

        <Route
          path="/patientdashboard"
          element={
            <ProtectedRoute allowedRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute allowedRole="patient">
              <PatientAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/doctors"
          element={
            <ProtectedRoute allowedRole="patient">
              <PatientDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/prescriptions"
          element={
            <ProtectedRoute allowedRole="patient">
              <PatientPrescriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/records"
          element={
            <ProtectedRoute allowedRole="patient">
              <PatientMedicalRecords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/lab-reports"
          element={
            <ProtectedRoute allowedRole="patient">
              <PatientLabReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/messages"
          element={
            <ProtectedRoute allowedRole="patient">
              <PatientMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute allowedRole="patient">
              <PatientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/settings"
          element={
            <ProtectedRoute allowedRole="patient">
              <PatientSettings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;