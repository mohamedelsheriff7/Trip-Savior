import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Tourist.css";
import { useLocation } from 'react-router-dom';





const ResetPassword = () => {
    const location = useLocation();
    const email = location.state?.email || '';
    const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // State for confirming the new password
  const [message, setMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false); // State for toggling password visibility
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
   
   
     
   
    if (!email) {
      setMessage("Email is missing. Please start the reset process again.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage("New password and confirmation do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3002/reset-password", {
        email,
        newPassword,
      });

      // Check response data for success
      if (response.data.success) {
        setMessage("Password reset successfully!");
        setTimeout(() => {
          navigate("/"); // Redirect to login page
        }, 2000); // Redirect after 2 seconds
      } else {
        setMessage(response.data.message || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Error resetting password:", err.response);
      setMessage(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 className="title text-start mb-4" style={styles.header}>Reset Password</h1>
      <div style={styles.formContainer}>
        <form className="form" onSubmit={handleResetPassword} style={styles.form}>
          {/* New Password */}
          <div style={styles.inputGroup}>
            <label>
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                className="input"
                placeholder=""
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={styles.input}
              />
              <span className="span">New Password</span>
              <span
                className="toggle-password"
                onClick={() => setShowNewPassword(!showNewPassword)}
                role="button"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? "👁️" : "🙈"}
              </span>
            </label>
          </div>

          {/* Confirm New Password */}
          <div style={styles.inputGroup}>
            <label>
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                id="confirmNewPassword"
                name="confirmNewPassword"
                className="input"
                placeholder=""
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                style={styles.input}
              />
              <span className="span">Confirm New Password</span>
              <span
                className="toggle-password"
                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                role="button"
                aria-label={showConfirmNewPassword ? "Hide password" : "Show password"}
              >
                {showConfirmNewPassword ? "👁️" : "🙈"}
              </span>
            </label>
          </div>

          <button type="submit" style={styles.submitButton}>Reset Password</button>
        </form>
      </div>
      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    width: '30vw',
    height: "auto",
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f988',
    border: '1px solid #fff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '15px',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px dashed #ccc',
    width: '100%',
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#5ddec2',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '15px',
  },
};

export default ResetPassword;
