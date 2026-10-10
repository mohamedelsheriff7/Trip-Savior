import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user")); // Get user info

    if (user) {
      const { username, email } = user;
      try {
        const response = await fetch("http://localhost:3002/tour_guide/change-password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, currentPassword, newPassword }),
        });

        const data = await response.json();
        if (response.ok) {
          setMessage("Password updated successfully.");
          // Redirect to login page after a successful update
          setTimeout(() => {
            navigate("/login"); // Change this to your actual login route
          }, 2000); // Redirect after 2 seconds
        } else {
          setMessage(data.message);
        }
      } catch (err) {
        console.error(err);
        setMessage("An error occurred while updating the password.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Change Password</h2>
      <form onSubmit={handleChangePassword} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Current Password:</label>
          <div style={styles.inputWrapper}>
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              style={styles.input}
            />
            <span onClick={() => setShowCurrentPassword(!showCurrentPassword)} style={styles.icon}>
              {showCurrentPassword ? "👁️" : "🙈"}
            </span>
          </div>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>New Password:</label>
          <div style={styles.inputWrapper}>
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={styles.input}
            />
            <span onClick={() => setShowNewPassword(!showNewPassword)} style={styles.icon}>
              {showNewPassword ? "👁️" : "🙈"}
            </span>
          </div>
        </div>
        <button type="submit" style={styles.button}>Change Password</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#555",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "border 0.3s",
  },
  icon: {
    marginLeft: "10px",
    cursor: "pointer",
    color: "#888",
  },
  button: {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  message: {
    textAlign: "center",
    color: "red",
    marginTop: "10px",
  },
};

export default ChangePassword;
