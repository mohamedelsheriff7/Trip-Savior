import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Tourist.css";

const TouristChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // State for confirming the new password
  const [message, setMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false); // State for toggling password visibility
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve logged-in user's data

    if (newPassword !== confirmNewPassword) {
      setMessage("New password and confirmation do not match.");
      return;
    }

    try {
      const response = await axios.put("http://localhost:3002/tourist/change-password", {
        username: user.username,
        currentPassword,
        newPassword,
      });

      // Check response data for success
      if (response.data.success) {
        setMessage("Password changed successfully!");
        setTimeout(() => {
          navigate("/tourist-login"); // Change this to your actual login route
        }, 2000); // Redirect after 2 seconds
      } else {
        setMessage(response.data.message || "Current password is incorrect.");
      }

    } catch (err) {
      console.error("Error changing password:", err.response);
      setMessage(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="d-flex">
      
      <div style={styles.container}>
        <h1 className="title text-start mb-4" style={styles.header}>Change Password</h1>
        <div style={styles.formContainer}>
          <form className="form" onSubmit={handleChangePassword} style={styles.form}>
            {/* Current Password */}
            <div style={styles.inputGroup}>
              <label>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  className="input"
                  placeholder=""
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={styles.input}
                />
                <span className="span">Current Password</span>
                <span
                  className="toggle-password"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  role="button"
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? "👁️" : "🙈"}
                </span>
              </label>
            </div>

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

            <button type="submit" style={styles.submitButton}>Change Password</button>
          </form>
        </div>
        {message && <p style={{ color: "red" }}>{message}</p>}
      </div>
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

export default TouristChangePassword;
