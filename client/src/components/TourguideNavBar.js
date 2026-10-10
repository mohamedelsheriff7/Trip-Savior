import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../images/logos.jpg";

const TourGuideNavigationBar = () => {
  const navigate = useNavigate();
  const [messageType, setMessageType] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // State for confirming the new password
  const [message, setMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false); // State for toggling password visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [modalType, setModalType] = useState(""); // Track modal type (admin or governor)

  const [flaggedItineraries, setFlaggedItineraries] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchFlaggedActivities = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          const response = await fetch(`http://localhost:3002/itinerary`);
          const data = await response.json();
          // Filter activities that are flagged and belong to the current advertiser
          const flagged = data.filter(
            (itinerary) =>
              itinerary.isFlagged && itinerary.tourGuideName === user.username
          );
          setFlaggedItineraries(flagged);
        }
      } catch (err) {
        console.error("Error fetching flagged activities:", err);
      }
    };

    fetchFlaggedActivities();
  }, []);

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    // Example of sending the data to an API
    try {
      const response = await axios.post(
        "http://localhost:3002/createTourismGoverner",
        {
          username: username,
          Password: password,
        }
      );
      console.log("TourismGoverner created:", response);
      // Clear the input fields after a successful request
      setUsername("");
      setPassword("");
    } catch (error) {
      // Display error message if request fails
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    // Example of sending the data to an API
    try {
      const response = await axios.post("http://localhost:3002/createAdmin", {
        username: username,
        Password: password,
      });
      console.log("Admin created:", response);
      // Clear the input fields after a successful request
      setUsername("");
      setPassword("");
    } catch (error) {
      // Display error message if request fails
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user")); // Get user info

    if (user) {
      const { username, email } = user;
      try {
        const response = await fetch(
          "http://localhost:3002/tour_guide/change-password",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              email,
              currentPassword,
              newPassword,
            }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          setMessage("Password updated successfully.");
          // Redirect to login page after a successful update
          setTimeout(() => {
            // Change this to your actual login route
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
  const handleAccountDeletionRequest = async () => {
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user data
    const username = user?.username || "";

    if (!username) {
      alert("User is not logged in or username is missing.");
      return;
    }

    try {
      // Step 1: Fetch all itineraries for the current tour guide
      const itinerariesResponse = await axios.get(
        "http://localhost:3002/itinerary",
        {
          params: { tourGuideName: username }, // Pass the username as a query parameter to filter itineraries
        }
      );

      // Step 2: Check if any itinerary has bookings (i.e., `bookedBy` array is not empty)
      const hasActiveBookings = itinerariesResponse.data.some(
        (itinerary) =>
          itinerary.tourGuideName === username && itinerary.bookedBy.length > 0 // Check if bookedBy is non-empty
      );

      if (hasActiveBookings) {
        // If there are bookings, show an alert message
        alert(
          "Your account cannot be deleted because there are active bookings."
        );
      } else {
        // If no active bookings, proceed with account deletion
        const deletionResponse = await axios.post(
          "http://localhost:3002/request-account-deletion",
          {
            Username: username,
            status: "pending",
            requestDate: new Date(),
          }
        );

        alert(deletionResponse.data.message);
      }
    } catch (error) {
      console.error(
        "Error checking itineraries or requesting account deletion:",
        error
      );
      alert(
        "Failed to process the account deletion request. Please try again later."
      );
    }

    setShowDeleteModal(false); // Close the modal after action
  };

  return (
    <>
      <nav className="container-fluid shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <a
          className="navbar-brand ms- fs-3"
          href="/"
          style={{ color: "#9095A1" }}
        >
          <img
            alt="Logo"
            src={logo}
            onClick={() => navigate("/")}
            style={{
              clipPath: "inset(10% 10% 10% 10%)",
              padding: "0",
              margin: "0",
              width: "60px", // Maintain aspect ratio
              objectFit: "contain", // Ensure it fills the navbar height
              overflow: "hidden",
              cursor: "pointer", // Show hand cursor on hover
            }}
          />
        </a>
        <button
          className="navbar-toggler me-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse ms-1 mb-lg-0 mb-4 mt-lg-0 mt-4"
          id="navbarNav"
        >
          <ul className="navbar-nav ms-0" style={{ fontSize: "18px" }}>
            <li className="nav-item">
              <a
                className="nav-link navbar-link me-lg-4 ms-lg-0 ms-3"
                onClick={() => {
                  navigate("/tg-itinerary"); // Set modal type to 'change-password'
                }}
              >
                {" "}
                Itineraries
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link navbar-link me-lg-4 ms-lg-0 ms-3"
                onClick={() => {
                  setModalShow(true);
                  setModalType("change-password"); // Set modal type to 'change-password'
                }}
              >
                {" "}
                Change Password
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link navbar-link me-lg-4 ms-lg-0 ms-3"
                onClick={() => setShowDeleteModal(true)}
              >
                {" "}
                Request Account Deletion
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link navbar-link me-lg-4 ms-lg-0 ms-3"
                onClick={() => navigate("/revf-report")}
              >
                Sales Report
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link navbar-link me-lg-4 ms-lg-0 ms-3"
                onClick={() => navigate("/total-tourist-booked-itinerary")}
              >
                Total contributers
              </a>
            </li>
          </ul>
        </div>
        <div className="d-flex ms-auto">
          <div className="d-flex flex-row align-items-center ms-auto">
            <svg
              id="Notification"
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="#5ddec2"
              className="bi bi-bell"
              viewBox="0 0 16 16"
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ cursor: "pointer" }}
            >
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
            </svg>
            <svg
              alt="Profile"
              onClick={() => navigate("/tourguide-finalprofile")}
              style={{ cursor: "pointer" }}
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="#5ddec2"
              className="bi bi-person-circle mx-2"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path
                fill-rule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </svg>
          </div>
        </div>
      </nav>

      {showNotifications && (
        <div
          className="notification-dropdown"
          style={{
            position: "absolute",
            top: "40px", // Adjust as needed
            right: "0",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            zIndex: 1050,
            width: "300px", // Adjust width as needed
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {flaggedItineraries.length > 0 ? (
            flaggedItineraries.map((itinerary, index) => (
              <div
                key={index}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                }}
              >
                {" "}
                <p style={{ color: "#000000", margin: 0 }}>
                  Your Itinerary "{itinerary.Itinerary_Name}" has been flagged
                  as inappropriate by admin.
                </p>
                <small style={{ color: "#666" }}>
                  {new Date(itinerary.date_time).toLocaleDateString()}
                </small>
              </div>
            ))
          ) : (
            <p style={{ padding: "10px", textAlign: "center", color: "#666" }}>
              No flagged itineraries
            </p>
          )}
        </div>
      )}

      {showDeleteModal && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{
              maxWidth: "30%",
              width: "80%",
            }}
          >
            <div
              className="modal-content"
              style={{
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <div className="modal-header">
                <h5 className="modal-title">Confirm Account Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p
                  style={{
                    fontSize: "16px",
                    color: "#333",
                    marginBottom: "20px",
                  }}
                >
                  Are you sure you want to <strong>permanently delete</strong>{" "}
                  your account? This action cannot be undone, and all your data
                  will be lost.
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center", // Center-align the buttons
                    alignItems: "center",
                    gap: "10px", // Reduced gap between buttons
                    marginTop: "20px",
                  }}
                >
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    style={{
                      backgroundColor: "#d3d3d3", // Light gray for Cancel button
                      color: "#333",
                      border: "none",
                      padding: "10px 12px", // Reduced size
                      borderRadius: "4px",
                      fontSize: "13px",
                      width: "100px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAccountDeletionRequest}
                    style={{
                      backgroundColor: "#ff4d4d", // Red color for Delete button
                      color: "#fff",
                      border: "none",
                      padding: "10px 12px", // Reduced size
                      borderRadius: "4px",
                      fontSize: "13px",
                      width: "100px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalShow && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{
              maxWidth: "30%",
              width: "80%",
            }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === "admin" && "Add New Admin"}
                  {modalType === "governor" && "Add Tourism Governor"}
                  {modalType === "change-password" && "Change Password"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalShow(false)}
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                )}
                {modalType === "admin" && (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                      <label htmlFor="username">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        backgroundColor: "#5ddec2",
                        color: "#fff",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        marginLeft: "auto", // This moves the button to the right
                      }}
                    >
                      Invite
                    </button>
                  </form>
                )}

                {modalType === "governor" && (
                  <form onSubmit={handleSubmit2}>
                    <div className="form-group mb-3">
                      <label htmlFor="username">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        backgroundColor: "#5ddec2",
                        color: "#fff",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        marginLeft: "auto", // This moves the button to the right
                      }}
                    >
                      Invite
                    </button>
                  </form>
                )}

                {modalShow && (
                  <div
                    className="modal fade show d-flex align-items-center justify-content-center"
                    tabIndex="-1"
                    style={{
                      display: "block",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      zIndex: 1050,
                    }}
                  >
                    <div
                      className="modal-dialog modal-dialog-centered"
                      style={{
                        maxWidth:
                          modalType === "change-password" ? "35%" : "30%",
                        width: "80%",
                      }}
                    >
                      <div
                        className="modal-content"
                        style={{ borderRadius: "10px", padding: "20px" }}
                      >
                        <div className="modal-header">
                          <h5 className="modal-title">
                            {modalType === "admin" && "Add New Admin"}
                            {modalType === "governor" && "Add Tourism Governor"}
                            {modalType === "change-password" &&
                              "Change Password"}
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setModalShow(false)}
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          {errorMessage && (
                            <div className="alert alert-danger" role="alert">
                              {errorMessage}
                            </div>
                          )}
                          {successMessage && (
                            <div className="alert alert-success" role="alert">
                              {successMessage}
                            </div>
                          )}

                          {/* Admin Form */}
                          {modalType === "admin" && (
                            <form
                              onSubmit={handleSubmit}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "15px",
                              }}
                            >
                              <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="username"
                                  placeholder="Enter username"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  required
                                  style={{
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px dashed #ccc",
                                  }}
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                  type="password"
                                  className="form-control"
                                  id="password"
                                  placeholder="Enter password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                                  style={{
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px dashed #ccc",
                                  }}
                                />
                              </div>
                              <button
                                type="submit"
                                className="btn btn-primary"
                                style={{
                                  backgroundColor: "#5ddec2",
                                  color: "#fff",
                                  border: "none",
                                  padding: "10px 20px",
                                  borderRadius: "5px",
                                  marginLeft: "auto", // This moves the button to the right
                                }}
                              >
                                Invite
                              </button>
                            </form>
                          )}

                          {/* Governor Form */}
                          {modalType === "governor" && (
                            <form
                              onSubmit={handleSubmit2}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "15px",
                              }}
                            >
                              <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="username"
                                  placeholder="Enter username"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  required
                                  style={{
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px dashed #ccc",
                                  }}
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                  type="password"
                                  className="form-control"
                                  id="password"
                                  placeholder="Enter password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                                  style={{
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px dashed #ccc",
                                  }}
                                />
                              </div>
                              <button
                                type="submit"
                                className="btn btn-primary"
                                style={{
                                  backgroundColor: "#5ddec2",
                                  color: "#fff",
                                  border: "none",
                                  padding: "10px 20px",
                                  borderRadius: "5px",
                                  marginLeft: "auto", // This moves the button to the right
                                }}
                              >
                                Invite
                              </button>
                            </form>
                          )}

                          {modalType === "change-password" && (
                            <form
                              onSubmit={handleChangePassword}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "15px",
                              }}
                            >
                              <div
                                className="form-group"
                                style={{ position: "relative" }}
                              >
                                <label htmlFor="currentPassword">
                                  Current Password
                                </label>
                                <input
                                  type={
                                    showCurrentPassword ? "text" : "password"
                                  }
                                  className="form-control"
                                  id="currentPassword"
                                  placeholder="Enter current password"
                                  value={currentPassword}
                                  onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                  }
                                  required
                                  style={{
                                    padding: "10px 40px 10px 10px", // Add right padding for the icon
                                    borderRadius: "5px",
                                    border: "1px dashed #ccc",
                                  }}
                                />
                                <span
                                  role="button"
                                  onClick={() =>
                                    setShowCurrentPassword(!showCurrentPassword)
                                  }
                                  style={{
                                    position: "absolute",
                                    top: "50%",
                                    right: "10px", // Position it inside the input
                                    // transform: 'translateY(-50%)',
                                    cursor: "pointer",
                                    color: "#5ddec2",
                                  }}
                                >
                                  {showCurrentPassword ? "👁️" : "🙈"}
                                </span>
                              </div>

                              <div
                                className="form-group"
                                style={{ position: "relative" }}
                              >
                                <label htmlFor="newPassword">
                                  New Password
                                </label>
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  className="form-control"
                                  id="newPassword"
                                  placeholder="Enter new password"
                                  value={newPassword}
                                  onChange={(e) =>
                                    setNewPassword(e.target.value)
                                  }
                                  required
                                  style={{
                                    padding: "10px 40px 10px 10px", // Add right padding for the icon
                                    borderRadius: "5px",
                                    border: "1px dashed #ccc",
                                  }}
                                />
                                <span
                                  role="button"
                                  onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                  }
                                  style={{
                                    position: "absolute",
                                    top: "50%",
                                    right: "10px", // Position it inside the input
                                    //transform: 'translateY(-50%)',
                                    cursor: "pointer",
                                    color: "#5ddec2",
                                  }}
                                >
                                  {showNewPassword ? "👁️" : "🙈"}
                                </span>
                              </div>

                              <div
                                className="form-group"
                                style={{ position: "relative" }}
                              >
                                <label htmlFor="confirmNewPassword">
                                  Confirm New Password
                                </label>
                                <input
                                  type={
                                    showConfirmNewPassword ? "text" : "password"
                                  }
                                  className="form-control"
                                  id="confirmNewPassword"
                                  placeholder="Confirm new password"
                                  value={confirmNewPassword}
                                  onChange={(e) =>
                                    setConfirmNewPassword(e.target.value)
                                  }
                                  required
                                  style={{
                                    padding: "10px 40px 10px 10px", // Add right padding for the icon
                                    borderRadius: "5px",
                                    border: "1px dashed #ccc",
                                  }}
                                />
                                <span
                                  role="button"
                                  onClick={() =>
                                    setShowConfirmNewPassword(
                                      !showConfirmNewPassword
                                    )
                                  }
                                  style={{
                                    position: "absolute",
                                    top: "50%",
                                    right: "10px", // Position it inside the input
                                    //transform: 'translateY(-0%)',
                                    cursor: "pointer",
                                    color: "#5ddec2",
                                  }}
                                >
                                  {showConfirmNewPassword ? "👁️" : "🙈"}
                                </span>
                              </div>
                              {/* Message Display */}
                              {message && (
                                <div
                                  style={{
                                    color:
                                      messageType === "success"
                                        ? "green"
                                        : "red",
                                    textAlign: "center",
                                    marginTop: "10px",
                                  }}
                                >
                                  {message}
                                </div>
                              )}
                              <button type="submit" style={styles.submitButton}>
                                Change Password
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
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
    backgroundColor: "#5ddec2",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    marginLeft: "auto", // This moves the button to the right
  },
  message: {
    textAlign: "center",
    color: "red",
    marginTop: "15px",
  },
};

export default TourGuideNavigationBar;
