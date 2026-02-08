import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: request, 2: reset
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "https://localhost:7159/api/Account/forgot-password",
        { email },
        { headers: { "Content-Type": "application/json", accept: "*/*" } }
      );
      if (res.data.success) {
        showSuccess("Please enter your new password.");
        setStep(2);
      } else {
        showError("Failed to initiate password reset.");
      }
    } catch (err) {
      showError(err.response?.data || "Error sending request.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "https://localhost:7159/api/Account/reset-password",
        { email, newPassword },
        { headers: { "Content-Type": "application/json", accept: "*/*" } }
      );
      if (res.data.success) {
        showSuccess("Password reset successful. Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showError("Failed to reset password.");
      }
    } catch (err) {
      showError(err.response?.data || "Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="forgot-password-container"
      style={{
        maxWidth: 400,
        margin: "60px auto",
        padding: 32,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Forgot Password</h2>
      {step === 1 && (
        <form onSubmit={handleForgotPassword}>
          <label style={{ fontWeight: 600 }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              marginBottom: 18,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              background: "#6366f1",
              color: "#fff",
              fontWeight: 700,
              border: "none",
            }}
          >
            {loading ? "Sending..." : "Send Reset Request"}
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleResetPassword}>
          <label style={{ fontWeight: 600 }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              marginBottom: 18,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
            disabled
          />
          <label style={{ fontWeight: 600 }}>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{
              width: "100%",
              marginBottom: 18,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              background: "#6366f1",
              color: "#fff",
              fontWeight: 700,
              border: "none",
            }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
