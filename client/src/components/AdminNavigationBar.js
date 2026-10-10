import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faTags,
  faClipboardList,
  faComments,
  faBox,
  faTrash,
  faFlag,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function AdminNavigationbar() {
  const navigate = useNavigate();
  const [messageType, setMessageType] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // State for confirming the new password
  const [message, setMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false); // State for toggling password visibility
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [modalType, setModalType] = useState(""); // Track modal type (admin or governor)
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const buttonColor = "#5ddec2";

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          const response = await fetch(
            `http://localhost:3002/admin/get-notifications/${user.username}`
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
          email: email,
        }
      );
      console.log("TourismGoverner created:", response);
      // Clear the input fields after a successful request
      setUsername("");
      setPassword("");
      setEmail("");
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
        email: email,
      });
      console.log("Admin created:", response);
      // Clear the input fields after a successful request
      setUsername("");
      setPassword("");
      setEmail("");
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
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve logged-in user's data

    if (newPassword !== confirmNewPassword) {
      setMessage("New password and confirmation do not match.");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3002/admin/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.username,
            currentPassword,
            newPassword,
          }), // Send Username and passwords
        }
      );

      // Check response data for success
      if (response.ok) {
        setMessage("Password changed successfully!");
        setMessageType("success");
        setTimeout(() => {
          navigate("/adminfinalprofile"); // Change this to your actual login route
        }, 2000); // Redirect after 2 seconds
      } else {
        setMessage("Current password is incorrect or something went wrong.");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg "
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#ffffff",

          zIndex: 1000,
          padding: "10px 5px",
        }}
      >
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse " id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item me-2">
                <a
                  className="nav-link text-secondary"
                  href="/adminfinalprofile"
                  style={{ fontSize: "16px" }}
                >
                  Admin Dashboard
                </a>
              </li>
              <li className="nav-item dropdown me-2">
                <a
                  className="nav-link dropdown-toggle text-secondary"
                  href="#"
                  id="inviteDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ fontSize: "16px" }}
                >
                  Invite
                </a>
                <ul className="dropdown-menu" aria-labelledby="inviteDropdown">
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => {
                        setModalType("admin");
                        setModalShow(true);
                      }}
                    >
                      Add New Admin
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => {
                        setModalType("governor");
                        setModalShow(true);
                      }}
                    >
                      Add Tourism Governor
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown me-2">
                <a
                  className="nav-link dropdown-toggle text-secondary"
                  href="#"
                  id="viewDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ fontSize: "16px" }}
                >
                  Add Options
                </a>
                <ul className="dropdown-menu" aria-labelledby="viewDropdown">
                  <li>
                    <a className="dropdown-item" href="/categories">
                      Add Categories
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/preferences">
                      Add Preferences
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/create-promo-code">
                      Add PromoCode
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown me-2">
                <a
                  className="nav-link dropdown-toggle text-secondary"
                  href="#"
                  id="viewDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ fontSize: "16px" }}
                >
                  View Documents
                </a>
                <ul className="dropdown-menu" aria-labelledby="viewDropdown">
                  <li>
                    <a
                      className="dropdown-item"
                      href="/tourguide-viewdocuments"
                    >
                      View TourGuide Documents
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/seller-viewdocuments">
                      View Seller Documents
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/adv-viewdocuments">
                      View Advertiser Documents
                    </a>
                  </li>
                </ul>
              </li>

              <li className="nav-item me-2">
                <a
                  className="nav-link text-secondary"
                  href="/admin-complaints"
                  style={{ fontSize: "16px" }}
                >
                  Complaints
                </a>
              </li>
              <li className="nav-item  dropdown me-2">
                <a
                  className="nav-link dropdown-toggle text-secondary"
                  href="#"
                  id="productsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ fontSize: "16px" }}
                >
                  Products
                </a>
                <ul
                  className="dropdown-menu"
                  style={{zIndex: 1000}}
                  aria-labelledby="productsDropdown"
                >
                  <li>
                    <a className="dropdown-item" href="/adminsellerproduct">
                      View Products
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="/admin-productsales-table"
                    >
                      View Product Sales
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item me-2">
                <a
                  className="nav-link text-secondary"
                  href="/admin-delete-account"
                  style={{ fontSize: "16px" }}
                >
                  Delete Users
                </a>
              </li>

              <li className="nav-item me-2">
                <a
                  className="nav-link text-secondary"
                  href="/admin-flag"
                  style={{ fontSize: "16px" }}
                >
                  Flag Events
                </a>
              </li>
              <li className="nav-item me-2">
                <a
                  className="nav-link text-secondary"
                  href="#"
                  onClick={() => {
                    setModalType("change-password");
                    setModalShow(true);
                  }}
                  style={{ fontSize: "16px" }}
                >
                  Change Password
                </a>
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
                class="bi bi-person-circle"
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
                      <label htmlFor="email">Email</label>{" "}
                      {/* Step 2: Add an email input field */}
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                      <label htmlFor="email">Email</label>{" "}
                      {/* Step 2: Add an email input field */}
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                              <div className="form-group mb-3">
                                <label htmlFor="email">Email</label>{" "}
                                {/* Step 2: Add an email input field */}
                                <input
                                  type="email"
                                  className="form-control"
                                  id="email"
                                  placeholder="Enter email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
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
                              <div className="form-group mb-3">
                                <label htmlFor="email">Email</label>{" "}
                                {/* Step 2: Add an email input field */}
                                <input
                                  type="email"
                                  className="form-control"
                                  id="email"
                                  placeholder="Enter email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
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
}

export default AdminNavigationbar;
