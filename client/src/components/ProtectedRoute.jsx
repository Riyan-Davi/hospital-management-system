import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRole &&
    user.role !== allowedRole
  ) {
    if (user.role === "admin") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    if (user.role === "doctor") {
      return (
        <Navigate
          to="/doctordashboard"
          replace
        />
      );
    }

    if (user.role === "patient") {
      return (
        <Navigate
          to="/patientdashboard"
          replace
        />
      );
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;