import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../images/logos.jpg";

const SellerNavigationBar = () => {
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

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          const response = await fetch(
            `http://localhost:3002/seller/get-notifications/${user.username}`
          );
          // Assuming the backend sends an array of notification messages
          const data = await response.json(); // Parse JSON response

          // Check if notifications are present and set the state
          if (data.notifications) {
            setNotifications(data.notifications); // Assuming it's an array of messages
          } else {
            console.error("No notifications found.");
          }
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
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
    if (newPassword !== confirmNewPassword) {
      setMessage("New password and confirm password do not match.");
      setMessageType("error");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user")); // Get user info

    if (user) {
      const { username, email } = user;
      try {
        const response = await fetch(
          "http://localhost:3002/sellers/change-password",
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
          setMessageType("success");
          setTimeout(() => {
            navigate("/seller-finalprofile");
          }, 1000);
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
      const response = await axios.post(
        "http://localhost:3002/request-account-deletion",
        {
          Username: username,
          status: "pending",
          requestDate: new Date(),
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error requesting account deletion:", error);
      alert(
        "Failed to submit account deletion request. Please try again later."
      );
    }

    setShowDeleteModal(false); // Close the modal after action
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        style={{
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#ffffff",
          zIndex: 1,
          padding: "10px 20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#sellerNavbar"
            aria-controls="sellerNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse align-items-center"
            id="sellerNavbar"
          >
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <img
                  className="me-4"
                  alt="Logo"
                  src={logo}
                  onClick={() => navigate("/")}
                  style={{
                    clipPath: "inset(10% 10% 10% 10%)",
                    padding: "0",
                    marginBottom: "-15px",
                    width: "60px", // Maintain aspect ratio
                    objectFit: "contain", // Ensure it fills the navbar height
                    overflow: "hidden",
                    cursor: "pointer", // Show hand cursor on hover
                  }}
                />
              </li>

              <li className="nav-item navbar-list me-2">
                <a
                  className="nav-link text-secondary"
                  href="#"
                  onClick={() => {
                    navigate("/adminsellerproduct2");
                  }}
                  style={{ fontSize: "16px" }}
                >
                  Products
                </a>
              </li>

              {/* Dropdown for Sales Report and Product Quantity */}
              <li className="nav-item dropdown me-2">
                <a
                  className="nav-link dropdown-toggle text-secondary"
                  href="#"
                  id="reportsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ fontSize: "16px" }}
                >
                  Reports
                </a>
                <ul className="dropdown-menu" aria-labelledby="reportsDropdown">
                  <li>
                    <a
                      className="dropdown-item"
                      href="/products-sales-report"
                      style={{ fontSize: "16px" }}
                    >
                      Sales Report
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="/seller-productsales-table"
                      style={{ fontSize: "16px" }}
                    >
                      Product Quantity and Sold
                    </a>
                  </li>
                </ul>
              </li>

              <li className="nav-item me-2">
                <a
                  className="nav-link text-secondary"
                  href="#"
                  onClick={() => {
                    setModalShow(true);
                    setModalType("change-password"); // Set modal type to 'change-password'
                  }}
                  style={{ fontSize: "16px" }}
                >
                  Change Password
                </a>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link text-secondary"
                  onClick={() => setShowDeleteModal(true)} // Open the modal on click
                  style={{
                    fontSize: "16px",
                    background: "none",
                    border: "none",
                    color: "inherit",
                  }}
                >
                  Request Account Deletion
                </button>
              </li>
            </ul>
          </div>
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

            <li className="nav-item dropdown">
              <svg
                alt="Profile"
                style={{ cursor: "pointer" }}
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="#5ddec2"
                class="bi bi-person-circle ms-2"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                <path
                  fill-rule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                />
              </svg>
              <ul
                className="dropdown-menu dropdown-menu-end me-2"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => navigate("/seller-finalprofile")}
                  >
                    View Profile
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => {
                      setModalShow(true);
                      setModalType("change-password");
                    }}
                  >
                    Change Password
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => setShowDeleteModal(true)}
                    style={{ color: "red" }}
                  >
                    Delete account
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" onClick={() => navigate("/")}>
                    Logout
                  </a>
                </li>
              </ul>
            </li>
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
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div
                key={index}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                }}
              >
                {" "}
                <p style={{ color: "#000000", margin: 0 }}>
                  {notification.message}
                </p>
              </div>
            ))
          ) : (
            <p style={{ padding: "10px", textAlign: "center", color: "#666" }}>
              No Notifications
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

export default SellerNavigationBar;
