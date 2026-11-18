
import { API_BASE_URL } from "../config/api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    role: "patient",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            phone: formData.phone,
            dateOfBirth: formData.dateOfBirth,
            role: formData.role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess(
        data.message ||
          "Registration successful. Please sign in."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        dateOfBirth: "",
        role: "patient",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setError(err.message || "Unable to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <div className="register-logo">+</div>

          <p className="register-label">
            HOSPITAL MANAGEMENT SYSTEM
          </p>

          <h1>Create Account</h1>

          <p>
            Register to access your healthcare account
          </p>
        </div>

        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        {success && (
          <div className="register-success">
            {success}
            <p>Redirecting to login...</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="register-form"
        >
          <div className="register-field">
            <label>Register As</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading || !!success}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <div className="register-field">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              maxLength={120}
              required
              disabled={loading || !!success}
            />
          </div>

          <div className="register-field">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={loading || !!success}
            />
          </div>

          <div className="register-row">
            <div className="register-field">
              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                disabled={loading || !!success}
              />
            </div>

            <div className="register-field">
              <label>Date of Birth</label>

              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={loading || !!success}
              />
            </div>
          </div>

          <div className="register-field">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              minLength={8}
              required
              disabled={loading || !!success}
            />
          </div>

          <div className="register-field">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              minLength={8}
              required
              disabled={loading || !!success}
            />
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading || !!success}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <div className="register-footer">
          <span>Already have an account?</span>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
