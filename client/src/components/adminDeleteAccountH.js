import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavigationbar from "./AdminNavigationBar"; 
const AdminDeleteAccount = () => {
  const [username, setUsername] = useState("");
  const [category, setCategory] = useState("seller");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  // Fetch deletion requests on component mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:3002/Requests");
        setRequests(response.data.filter((req) => req.status === "pending"));
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to fetch account deletion requests.");
      }
    };

    fetchRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!username) {
      setError("Username is required.");
      return;
    }

    if (!category) {
      setError("Category is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.delete(
        "http://localhost:3002/deleteAccount",
        {
          data: { category, username },
        }
      );

      if (response.status === 200) {
        setMessage(response.data.message);
        setUsername("");
        setCategory("seller");
      } else {
        setError("Failed to delete the account.");
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("An error occurred while deleting the account.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (username, status) => {
    try {
      const response = await axios.put("http://localhost:3002/Requests/status", {
        Username: username,
        status,
      });

      if (response.status === 200) {
        setMessage(`Request ${status} successfully.`);
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.Username !== username)
        );
      } else {
        setError("Failed to update request status.");
      }
    } catch (err) {
      console.error("Error updating request status:", err);
      setError("An error occurred while processing the request.");
    }
  };

  return (
    <div style={styles.container}>
       <AdminNavigationbar />
      <h2 style={styles.title}>Delete User Account</h2>

      {/* Form Section */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="username" style={styles.label}>
            Username:
          </label>
          <input
  type="text"
  id="username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  placeholder="Enter username"
  style={{
    ...styles.input,
    ...(isFocused ? styles.inputFocus : {}), // Apply focus styles dynamically
  }}
  onFocus={() => setIsFocused(true)} // Set focus state on focus
  onBlur={() => setIsFocused(false)} // Reset focus state on blur
  required
/>

        </div>

        <div style={styles.formGroup}>
          <label htmlFor="category" style={styles.label}>
            Category:
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              ...styles.select,
              ...(isSelectFocused ? styles.selectFocus : {}),
            }}
            onFocus={() => setIsSelectFocused(true)}
            onBlur={() => setIsSelectFocused(false)}
            required
          >
            <option value="seller">Seller</option>
            <option value="tour guide">Tour Guide</option>
            <option value="tourism governor">Tourism Governor</option>
            <option value="advertiser">Advertiser</option>
            <option value="guest">Guest</option>
          </select>
        </div>

        <button
      type="submit"
      style={{
        ...styles.deleteAccountButton,
        ...(isHovered ? styles.deleteAccountButtonHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={loading}
    >
      {loading ? "Deleting..." : "Delete Account"}
    </button>
      </form>

      {/* Success/Error Messages */}
      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* Requests Table */}
      <table style={styles.table}>
        <thead style={styles.tableHead}>
          <tr>
            <th style={styles.tableHeader}>Username</th>
            <th style={styles.tableHeader}>Request Date</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request, index) => (
              <tr
                key={request._id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e3f2fd")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    index % 2 === 0 ? "#f9f9f9" : "#ffffff")
                }
              >
                <td style={styles.tableCell}>{request.Username}</td>
                <td style={styles.tableCell}>
                  {new Date(request.requestDate).toLocaleString()}
                </td>
                <td style={styles.tableCell}>
                  <a
                    href="#"
                    style={styles.acceptLink}
                    onClick={() => handleStatusUpdate(request.Username, "accepted")}
                  >
                    Accept
                  </a>
                  <a
                    href="#"
                    style={styles.rejectLink}
                    onClick={() => handleStatusUpdate(request.Username, "rejected")}
                  >
                    Reject
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={styles.noRequests}>
                No account deletion requests available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  
  container: {
    margin: "90px auto",
    padding: "20px",
    maxWidth: "1300px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  
  title: {
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "bold",
    color: "#000",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
    display: "block",
  },
  input: {
    padding: "10px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "4px",
    transition: "box-shadow 0.3s ease", // Add smooth transition for focus
    outline: "none", // Remove default outline
  },
  select: {
    padding: "10px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "4px",
    transition: "box-shadow 0.3s ease",
    outline: "none",
    backgroundColor: "#fff",
    fontSize: "14px",
  },
  selectFocus: {
    boxShadow: "0 4px 8px rgba(93, 222, 194, 0.6)",
    borderColor: "#5ddec2",
  },
  inputFocus: {
    boxShadow: "0 4px 8px rgba(93, 222, 194, 0.6)", // Same shadow as the button
    borderColor: "#5ddec2", // Optional: Change border color to match shadow
  },
  select: {
    padding: "10px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
 
  deleteAccountButton: {
    display: "inline-block", // Ensures the button size fits the content
    backgroundColor: "#ffffff", // Set button's default background color to white
    color: "#5ddec2", // Current button color for text
    border: "2px solid #5ddec2", // Border matching the hover color
    padding: "8px 12px", // Decrease padding to make the button smaller
    borderRadius: "4px", // Smooth corners
    fontSize: "16px", // Decrease font size for a smaller button
    fontWeight: "bold", // Make text bold
    cursor: "pointer", // Change the cursor to indicate interactivity
    textAlign: "center", // Center the text
    textDecoration: "none", // Remove underline
    transition: "box-shadow 0.3s ease, color 0.3s ease", // Smooth hover effect
    margin: "0 auto", // Center the button horizontally
  },
  deleteAccountButtonHover: {
    boxShadow: "0 4px 8px rgba(93, 222, 194, 0.6)", // Apply a shadow effect
    color: "#5ddec2", // Keep text color consistent
  },
  
  button: {
    padding: "10px",
    backgroundColor: "#5ddec2",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "50%",
    margin: "10px auto",
  },
  success: {
    textAlign: "center",
    color: "green",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  error: {
    textAlign: "center",
    color: "red",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  table: {
    marginTop: "20px",
    width: "100%",
    borderCollapse: "collapse",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  tableHead: {
    backgroundColor: "#5ddec2",
    color: "white",
  },
  tableHeader: {
    padding: "12px",
    textAlign: "center",
    fontWeight: "bold",
  },
  tableCell: {
    padding: "12px",
    textAlign: "center",
    border: "1px solid #ddd",
  },
  noRequests: {
    textAlign: "center",
    padding: "20px",
    fontWeight: "bold",
  },
  acceptLink: {
    color: "#28a745",
    cursor: "pointer",
    textDecoration: "none",
    marginRight: "10px",
  },
  rejectLink: {
    color: "#dc3545",
    cursor: "pointer",
    textDecoration: "none",
  },
};

export default AdminDeleteAccount;
