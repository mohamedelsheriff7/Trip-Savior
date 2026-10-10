import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../images/logos.jpg";


function TouristCustomNavbar({ handleSignup, handleLogin }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [modalType, setModalType] = useState(""); // Track modal type (admin or governor)
  const [messageType, setMessageType] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // State for confirming the new password
  const [message, setMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false); // State for toggling password visibility
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wallet, setWallet] = useState(0); // Assuming wallet state is available
  const [loyaltyPoints, setLoyaltyPoints] = useState(0); // Assuming loyalty points are fetched initially
  const [level, setLevel] = useState(1); // Tourist level
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [preferences, setPreferences] = useState([]); // Example preferences
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [filteredPreferences, setFilteredPreferences] = useState(preferences);
  const [promocodes, setPromocodes] = useState([]);
  const [showPromocodes, setShowPromocodes] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          const response = await fetch(
            `http://localhost:3002/tourist/get-notifications/${user.username}`
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

  useEffect(() => {
    const fetchPromocodes = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          const response = await fetch(
            `http://localhost:3002/api/promo-codes/${user._id}`
          );
          const data = await response.json(); // Parse JSON response

          // Check if promo codes are present and set the state
          if (response.ok) {
            setPromocodes(data.promoCodes || []); // Assuming backend returns { promoCodes: [...] }
          } else {
            console.error("Failed to fetch promo codes:", data.message);
          }
        }
      } catch (err) {
        console.error("Error fetching promo codes:", err);
      }
    };

    fetchPromocodes();
  }, []);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/AllPreferences"
        );
        // Assuming the response is an array of objects with a `name` property
        const preferenceNames = response.data.map(
          (preference) => preference.Name
        );
        setPreferences(preferenceNames);
      } catch (err) {
        console.error("Error fetching preferences:", err);
      }
    };

    fetchPreferences();
  }, []);

  const fetchTouristPreferences = async () => {
    try {
      let username = localStorage.getItem("username");
      console.log("Raw username from localStorage:", username);

      // Remove quotes if present
      username = username.replace(/^"|"$/g, "");
      console.log("Processed username:", username);

      // Log the full URL being called
      console.log(
        "Fetching preferences from:",
        `/tourist/getPreference?username=${username}`
      );

      const response = await axios.get(
        `http://localhost:3002/tourist/getPreference?username=${username}`
      );

      // Log the entire response
      console.log("Full response:", response);
      console.log("Response data:", response.data);

      // Check if preferences exist and set them
      if (response.data && response.data.preferences) {
        setSelectedPreferences(response.data.preferences);
        console.log("Set preferences:", response.data.preferences);
      } else {
        console.log("No preferences found");
        setSelectedPreferences([]); // Ensure it's an empty array if no preferences
      }
    } catch (error) {
      console.error("Full error details:", error);

      // Log more specific error information
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received", error.request);
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", error.message);
      }
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve logged-in user's data

    if (newPassword !== confirmNewPassword) {
      setMessage("New password and confirmation do not match.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:3002/tourist/change-password",
        {
          username: user.username,
          currentPassword,
          newPassword,
        }
      );

      // Check response data for success
      if (response.data.success) {
        setMessage("Password changed successfully!");
        setTimeout(() => {
          navigate("/tourist-profile2"); // Change this to your actual login route
        }, 2000); // Redirect after 2 seconds
      } else {
        setMessage(response.data.message || "Current password is incorrect.");
      }
    } catch (err) {
      console.error("Error changing password:", err.response);
      setMessage(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const handlePreferencesSubmit = async () => {
    try {
      let username = localStorage.getItem("username");
      console.log(username); // This logs the raw value, which may have extra quotes

      // Remove the extra quotes (escaped characters)
      username = username.replace(/^"|"$/g, ""); // Removes leading and trailing quotes if present

      console.log(username); // Should log "seiff" without extra quotes

      if (
        !username ||
        !selectedPreferences ||
        selectedPreferences.length === 0
      ) {
        alert("User is not logged in or preferences are missing.");
        return;
      }

      // Trim each preference in the selectedPreferences array
      const trimmedPreferences = selectedPreferences.map((preference) =>
        preference.trim()
      );

      // Ensure preferences is an array
      if (!Array.isArray(trimmedPreferences)) {
        alert("Preferences must be an array.");
        return;
      }

      // Prepare the data to send
      const data = {
        username: username, // Cleaned username
        preferences: trimmedPreferences, // Trimmed preferences
        action: "add", // Assuming "add" action; this can change based on your use case
      };

      console.log(data); // Check what you're sending

      // Make POST request with axios
      const response = await axios.post(
        "http://localhost:3002/tourist/updatePreferences",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      alert(response.data.message || "Preferences updated successfully!");
    } catch (err) {
      console.error("Error submitting preferences:", err);
      alert(`Failed to update preferences: ${err.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission for Admin
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    // Handle form submission for Governor
  };

  const handlePreferencesClick = () => {
    setModalType("preferences"); // Show the Preferences modal
    setModalShow(true); // Show the modal
    fetchTouristPreferences();
    console.log(selectedPreferences);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setFilteredPreferences(
      preferences.filter((preference) =>
        preference.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleSelect = (preference) => {
    setSelectedPreferences((prev) => {
      // Check if the preference already exists
      if (prev.includes(preference)) {
        return prev; // Do nothing if it already exists
      }
      return [...prev, preference]; // Add the new preference
    });
  };

  const handleRemove = async (preference) => {
    // Create a new array without the specified preference
    const updatedPreferences = selectedPreferences.filter(
      (item) => item !== preference
    );
    const removedPreferences = selectedPreferences.filter(
      (item) => item === preference
    );
    // Log the original and updated preferences for clarity
    console.log("Original Preferences:", selectedPreferences);
    console.log("Preference to Remove:", preference);
    console.log("Updated Preferences:", updatedPreferences);

    // Optimistically update local state
    setSelectedPreferences(updatedPreferences);

    try {
      let username = localStorage.getItem("username");
      username = username.replace(/^"|"$/g, ""); // Remove extra quotes

      if (!username) {
        alert("User is not logged in.");
        return;
      }

      // Prepare the data to send
      const data = {
        username: username,
        preferences: removedPreferences, // Send the full updated array
        action: "remove",
      };

      console.log("Detailed Data Being Sent:", JSON.stringify(data, null, 2));

      const response = await axios.post(
        "http://localhost:3002/tourist/updatePreferences",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Full Server Response:", response);
      console.log("Server Response Data:", response.data);

      if (response.data.success === false) {
        // Revert local state if server update fails
        setSelectedPreferences(selectedPreferences);
        alert(response.data.message || "Failed to remove preference");
      } else {
        alert(response.data.message || "Preference removed successfully!");
      }
    } catch (err) {
      // Revert local state
      setSelectedPreferences(selectedPreferences);

      console.error("Comprehensive Error Details:", {
        errorMessage: err.message,
        errorResponse: err.response,
        errorRequest: err.request,
      });

      // Comprehensive error handling
      if (err.response) {
        console.error("Detailed Server Error:", err.response.data);
        alert(
          `Failed to update preferences: ${
            err.response.data.message || err.message
          }`
        );
      } else if (err.request) {
        alert(
          "No response received from server. Please check your connection."
        );
      } else {
        alert(`Error: ${err.message}`);
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
  const handleRedeemPoints = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const username = user?.username;

      if (!username) {
        return alert("User not found.");
      }

      const response = await axios.post(
        "http://localhost:3002/tourist/redeem-points",
        { username }
      );

      // Set success message for the alert
      setAlertMessage(response.data.message);
      setShowAlert(true);

      // Hide the alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);

      // Update other data if necessary
      setWallet(response.data.newWalletBalance);
      setLoyaltyPoints(response.data.remainingPoints);
      setLevel(response.data.newlevel); // Set new level

      fetchData();
    } catch (error) {
      console.error("Error redeeming points:", error);
      setAlertMessage("Failed to redeem points. Please try again.");
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const { username } = user;
      try {
        const response = await fetch(
          `http://localhost:3002/tourist/profile/${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setProfileData(data);
        setFormData(data); // Initialize form data with fetched data
      } catch (err) {
        console.error(err);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };
  return (
    <>
      <nav className="container-fluid shadow-sm navbar navbar-expand-lg navbar-light bg-white ">
        {showAlert && (
          <div
            style={{
              position: "fixed",
              top: "10px", // Adjusted to make it appear at the top
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#5ddec2", // Light green color
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              fontSize: "16px",
              zIndex: 9999,
              width: "auto",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            {alertMessage}
          </div>
        )}
        <a className="navbar-brand fs-3" href="/" style={{ color: "#9095A1" }}>
        <img 
    alt="Logo" 
    src={logo}
    onClick={() => navigate("/")}

    style={{
        clipPath: 'inset(10% 10% 10% 10%)',
        padding: '0',
        margin: '0',
      width: '60px', // Maintain aspect ratio
      objectFit: 'contain', // Ensure it fills the navbar height
      overflow: 'hidden',
      cursor: 'pointer', // Show hand cursor on hover
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

        {/* Navbar Items */}
        <div
          className="collapse navbar-collapse justify-content-end" // Align navbar items to the right
          id="navbarNav"
        >
          <ul className="navbar-nav ms-0" style={{ fontSize: "18px" }}>
            <li className="nav-item">
              <a
                className="nav-link navbar-link me-lg-4 ms-lg-0 ms-3"
                onClick={() => navigate("/tourist-itinerary")}
              >
                Home
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link navbar-link dropdown-toggle me-lg-4"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Book
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    className="dropdown-item"
                    onClick={() => navigate("/tourist-itinerary")}
                  >
                    Itinerary
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => navigate("/tourist-activity")}
                  >
                    Activity
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/book-flight">
                    Flight
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/book-hotel">
                    Hotel
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/book-transportation">
                    Transportation
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link navbar-link dropdown-toggle me-lg-4"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Products
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <a
                    className="dropdown-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/product-tourist-page")}
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/orders">
                    Purchases
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a
                className="nav-link navbar-link me-lg-4 ms-lg-0 ms-3"
                onClick={() => navigate("/tourist-hp")}
              >
                Historical Places
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link navbar-link dropdown-toggle me-lg-4"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                My Bookings
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => navigate("/tourist-booked-itineraries")}
                  >
                    Itineraries
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => navigate("/tourist-booked-activities")}
                  >
                    Activities
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => navigate("/tourist-booked-flights")}
                  >
                    Flights
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => navigate("/tourist-booked-hotels")}
                  >
                    Hotels
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => navigate("/tourist-booked-transport")}
                  >
                    Transportation
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a
                className="nav-link navbar-link me-lg-4 ms-lg-0 ms-3"
                onClick={() => navigate("/tourist-complaints")}
              >
                Complaints
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link navbar-link dropdown-toggle me-lg-4"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Rate
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <a
                    className="dropdown-item"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate("/rate-comment-itineraries-tourguide")
                    }
                  >
                    Itineraries & Tour Guides
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/attended-activites")}
                  >
                    Activities
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link navbar-link dropdown-toggle me-lg-4"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Bookmarks
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <a
                    className="dropdown-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/tourist-bookmark-itineraries")}
                  >
                    Itineraries
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/attended-activites")}
                  >
                    Activities
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a
                className="nav-link navbar-link me-lg-4 ms-lg-0 ms-3"
                onClick={handlePreferencesClick} // Trigger modal on Preferences button click
              >
                Preferences
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link navbar-link me-lg-4 ms-lg-0 ms-3"
                onClick={() => navigate("/step-by-step")} // Trigger modal on Preferences button click
              >
                Help 
              </a>
            </li>
          </ul>
          <div className="d-flex ms-auto">
            <div className="d-flex flex-row align-items-center ms-auto">
              {/* Promocode Icon */}
              <svg
                onClick={() => setShowPromocodes(!showPromocodes)}
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="#5ddec2"
                class="bi bi-ticket me-2"
                viewBox="0 0 16 16"
                style={{ cursor: "pointer" }}
              >
                <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6zM1.5 4a.5.5 0 0 0-.5.5v1.05a2.5 2.5 0 0 1 0 4.9v1.05a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-1.05a2.5 2.5 0 0 1 0-4.9V4.5a.5.5 0 0 0-.5-.5z" />
              </svg>
              {/* notification icon */}
              <svg
                id="Notification"
                onClick={() => setShowNotifications(!showNotifications)}
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="#5ddec2"
                className="bi bi-bell me-2"
                viewBox="0 0 16 16"
                style={{ cursor: "pointer" }}
              >
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
              </svg>
              <li className="nav-item wishlist">
                <a
                  className="nav-link navbar-link me-lg-2 ms-lg-0 ms-3"
                  onClick={() => navigate("/wishlist")}
                  style={{ cursor: "pointer" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    class="bi bi-bag-heart "
                    viewBox="0 0 16 16"
                    style={{ color: "#5ddec2" }}
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0M14 14V5H2v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1M8 7.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"
                    />
                  </svg>
                </a>
              </li>
              <li className="nav-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="#5ddec2"
                  class="bi bi-basket me-2"
                  viewBox="0 0 16 16"
                  onClick={() => navigate("/cart")}
                  style={{ cursor: "pointer" }}
                >
                  <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9zM1 7v1h14V7zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5" />
                </svg>
              </li>
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
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => navigate("/tourist-profile2")}
                    >
                      View Profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={handleRedeemPoints}>
                      Redeem Points
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
                </ul>
              </li>
            </div>
          </div>
        </div>
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
                maxWidth: "500px",
                width: "90%",
                margin: "0 auto",
              }}
            >
              <div
                className="modal-content"
                style={{
                  maxHeight: "80vh",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title">
                    {modalType === "preferences" && "Select My Preferences"}
                    {modalType === "change-password" && "Change Password"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setModalShow(false)}
                    aria-label="Close"
                  ></button>
                </div>

                {modalType === "preferences" && (
                  <div className="modal-body">
                    <div className="search-bar mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search preferences..."
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </div>

                    {selectedPreferences.length > 0 && (
                      <div className="selected-preferences mb-3">
                        <h6>Selected Preferences:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedPreferences.map((preference) => (
                            <div
                              key={preference}
                              className="badge btn btn-lg btn-buy px-1 mt-2 me-2 mb-1 d-flex align-items-center justify-content-center ms-1"
                              style={{
                                padding: "0.15rem 0.35rem",
                                fontSize: "0.9rem",
                                height: "2.5rem",
                                lineHeight: "1",
                                width: "auto",
                                minWidth: "2rem",
                                textAlign: "center",
                              }}
                            >
                              {preference}
                              <button
                                className="btn btn-sm btn-close ms-2"
                                onClick={() => handleRemove(preference)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="preferences-list">
                      <h6>Available Preferences:</h6>
                      <div
                        className="list-group"
                        style={{
                          maxHeight: "250px",
                          overflowY: "auto",
                        }}
                      >
                        {preferences.map((preference) => (
                          <button
                            key={preference}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleSelect(preference)}
                          >
                            {preference}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* New Submit Button */}
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-lg btn-buy px-4 mt-2 me-2 flex-grow-1 mb-1"
                        onClick={handlePreferencesSubmit}
                        disabled={selectedPreferences.length === 0}
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                )}

                {modalType === "change-password" && (
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

                    <form
                      onSubmit={handleChangePassword}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px",
                      }}
                    >
                      {/* Current Password */}
                      <div
                        className="form-group"
                        style={{ position: "relative" }}
                      >
                        <label htmlFor="currentPassword">
                          Current Password
                        </label>
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          className="form-control"
                          id="currentPassword"
                          placeholder="Enter current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                          style={{
                            padding: "10px 40px 10px 10px",
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
                            right: "10px",
                            cursor: "pointer",
                            color: "#5ddec2",
                          }}
                        >
                          {showCurrentPassword ? "👁️" : "🙈"}
                        </span>
                      </div>

                      {/* New Password */}
                      <div
                        className="form-group"
                        style={{ position: "relative" }}
                      >
                        <label htmlFor="newPassword">New Password</label>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          className="form-control"
                          id="newPassword"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          style={{
                            padding: "10px 40px 10px 10px",
                            borderRadius: "5px",
                            border: "1px dashed #ccc",
                          }}
                        />
                        <span
                          role="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "10px",
                            cursor: "pointer",
                            color: "#5ddec2",
                          }}
                        >
                          {showNewPassword ? "👁️" : "🙈"}
                        </span>
                      </div>

                      {/* Confirm New Password */}
                      <div
                        className="form-group"
                        style={{ position: "relative" }}
                      >
                        <label htmlFor="confirmNewPassword">
                          Confirm New Password
                        </label>
                        <input
                          type={showConfirmNewPassword ? "text" : "password"}
                          className="form-control"
                          id="confirmNewPassword"
                          placeholder="Confirm new password"
                          value={confirmNewPassword}
                          onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                          }
                          required
                          style={{
                            padding: "10px 40px 10px 10px",
                            borderRadius: "5px",
                            border: "1px dashed #ccc",
                          }}
                        />
                        <span
                          role="button"
                          onClick={() =>
                            setShowConfirmNewPassword(!showConfirmNewPassword)
                          }
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "10px",
                            cursor: "pointer",
                            color: "#5ddec2",
                          }}
                        >
                          {showConfirmNewPassword ? "👁️" : "🙈"}
                        </span>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-lg btn-buy px-4 mt-2 me-2 flex-grow-1  mb-1"
                      >
                        Change Password
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
              <p
                style={{ padding: "10px", textAlign: "center", color: "#666" }}
              >
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
                    your account? This action cannot be undone, and all your
                    data will be lost.
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
      </nav>

      {showPromocodes && (
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
          {promocodes.length > 0 ? (
            promocodes.map((promocode, index) => (
              <div
                key={promocode.id}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                }}
              >
                {" "}
                <p style={{ color: "#000000", margin: 0 }}>
                  Happy Birthday! Here's your Promo Code🎉
                </p>
                <p style={{ color: "#000000", margin: 0 }}>
                  Code: {promocode.code}
                </p>
                <p style={{ color: "#000000", margin: 0 }}>
                  Expiry Date: {promocode.expiryDate}
                </p>
              </div>
            ))
          ) : (
            <p style={{ padding: "10px", textAlign: "center", color: "#666" }}>
              No Promocodes
            </p>
          )}
        </div>
      )}
    </>
  );
}
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

export default TouristCustomNavbar;
