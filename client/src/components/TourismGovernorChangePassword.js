import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TourismGovernorChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const storedPassword = localStorage.getItem("tourismGovernorPassword");
    if (currentPassword !== storedPassword) {
      setError("Current password is incorrect.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3002/tourism-governor/change-password", {
        Username: JSON.parse(localStorage.getItem("user")).Username,
        newPassword,
      });

      if (response.status === 200) {
        localStorage.setItem("tourismGovernorPassword", newPassword);
        alert("Password changed successfully. Please log in again.");
        navigate("/tourism-governor-login");
      } else {
        setError("Error updating password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
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
                  type={showConfirmPassword ? "text" : "password"}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  role="button"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? "👁️" : "🙈"}
                </span>
              </label>
            </div>

            <button type="submit" style={styles.submitButton}>Change Password</button>
          </form>
        </div>

        {error && <p style={styles.errorMessage}>{error}</p>} {/* Display error message */}
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "30vw",
    height: "auto",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f988",
    border: "1px solid #fff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  header: {
    textAlign: "center",
    marginBottom: "15px",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px dashed #ccc",
    width: "100%",
  },
  submitButton: {
    padding: "10px",
    backgroundColor: "#5ddec2",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginTop: "15px",
  },
  message: {
    textAlign: "center",
    color: "red",
    marginTop: "15px",
  },
  errorMessage: {
    textAlign: "center",
    color: "red",
    marginTop: "10px",
    fontWeight: "bold",
  },
};

export default TourismGovernorChangePassword;
