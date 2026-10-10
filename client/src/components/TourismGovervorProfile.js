import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/HistoricalGuest.css";
import { Link } from "react-router-dom";
import DeleteHistoricalPlace from "./tourismGovernor/deleteHistoricalPlace";
import UpdateHistoricalPlace from "./tourismGovernor/updateHistoricalPlace";
import logo from "../images/logos.jpg";


import { useNavigate } from "react-router-dom";

const CreatedHistoricalPlacesView = () => {
  const navigate = useNavigate();
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editingPlaceId, setEditingPlaceId] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [modalType, setModalType] = useState(""); // Track modal type (admin or governor)
  const [updatedPlaceData, setUpdatedPlaceData] = useState({
    location: "",
    historicalSignificance: "",
    established: "",
    entryFeeForeign: "",
    entryFeeNative: "",
    entryFeeStudent: "",
    openingHours: "",
    category: "",
    website: "",
  });
  const [messageType, setMessageType] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // State for confirming the new password
  const [message, setMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false); // State for toggling password visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchTags = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3002/historical-places"
      );
      const types = response.data
        .map((place) => place.tag?.type)
        .filter(Boolean);
      const historicalPeriods = response.data
        .map((place) => place.tag?.historicalPeriod)
        .filter(Boolean);
      const uniqueTags = Array.from(new Set([...types, ...historicalPeriods]));
      setTags(uniqueTags);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };

  const handleDeleteSuccess = (deletedPlaceId) => {
    const updatedPlaces = historicalPlaces.filter(
      (place) => place._id !== deletedPlaceId
    );
    setHistoricalPlaces(updatedPlaces);
    setFilteredPlaces(updatedPlaces);
  };

  const handleDelete = async (placeId, placeName) => {
    try {
      await axios.delete(
        "http://localhost:3002/tourismGovernor/deleteHistoricalPlace",
        {
          data: { name: placeName },
        }
      );
      handleDeleteSuccess(placeId);
    } catch (err) {
      console.error("Error deleting historical place", err);
    }
  };
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
      const response = await axios.post(
        "http://localhost:3002/tourism-governor/change-password",
        {
          Username: JSON.parse(localStorage.getItem("user")).Username,
          newPassword,
        }
      );

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
  const fetchTagsAndPlaces = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3002/historical-places"
      );
      const loggedInUsername = localStorage.getItem("tourismGovernorName");
      const filteredData = response.data.filter(
        (place) => place.governorUsername === loggedInUsername
      );

      const types = response.data
        .map((place) => place.tag?.type)
        .filter(Boolean);
      const historicalPeriods = response.data
        .map((place) => place.tag?.historicalPeriod)
        .filter(Boolean);
      const uniqueTags = Array.from(new Set([...types, ...historicalPeriods]));

      setTags(uniqueTags);
      setHistoricalPlaces(filteredData);
      setFilteredPlaces(filteredData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error fetching historical places.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTagsAndPlaces();
  }, []);

  const handleCheckboxChange = (tag) => {
    const updatedSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(updatedSelectedTags);

    if (updatedSelectedTags.length > 0) {
      const filtered = historicalPlaces.filter((place) =>
        updatedSelectedTags.some(
          (tag) =>
            place.tag?.type === tag || place.tag?.historicalPeriod === tag
        )
      );
      setFilteredPlaces(filtered);
    } else {
      setFilteredPlaces(historicalPlaces);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleEditClick = (place) => {
    setEditingPlaceId(place._id);
    setUpdatedPlaceData({
      description: place.description,
      pictures: place.pictures.join(", "),
      location: place.location,
      openingHours: place.openingHours,
      entryFeeForeign: place.entryFeeForeign || 250,
      entryFeeNative: place.entryFeeNative || 200,
      entryFeeStudent: place.entryFeeStudent || 150,
    });
  };
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
  const handleSaveEdit = async () => {
    try {
      const updatedPlace = await axios.put(
        "http://localhost:3002/tourismGovernor/updateHistoricalPlace",
        {
          id: editingPlaceId,
          updatedPlaceData,
        }
      );

      const updatedPlaces = historicalPlaces.map((place) =>
        place._id === editingPlaceId ? updatedPlace.data : place
      );

      setHistoricalPlaces(updatedPlaces);
      setFilteredPlaces(updatedPlaces);
      setEditingPlaceId(null);
    } catch (err) {
      console.error("Error updating place:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <nav className="navbar navbar-expand-lg shadow-sm">
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
          <div className="collapse navbar-collapse" id="navbarNav">
          <a className="navbar-brand fs-3" href="/" style={{ color: "#9095A1" }}>
        <img 
    alt="Logo" 
    src={logo}
    onClick={() => navigate("/")}

    style={{
        clipPath: 'inset(10% 10% 10% 10%)',
        padding: '0',
        margin: '0',
        marginBottom: '-10px',
      width: '60px', // Maintain aspect ratio
      objectFit: 'contain', // Ensure it fills the navbar height
      overflow: 'hidden',
      cursor: 'pointer', // Show hand cursor on hover
    }} 
  />
        </a>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link
                  className="nav-link me-2"
                  onClick={() => {
                    setModalShow(true);
                    setModalType("change-password");
                  }}
                >
                  Change Password
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/create-historicalplace">
                  Create New Historical Place
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container pt-4">
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="d-flex align-items-center">
            {showFilters && (
              <div className="filter-menu ms-3 justify-content-start position-relative">
                {tags.map((tag) => (
                  <div className="d-flex me-3" key={tag}>
                    <input
                      type="checkbox"
                      value={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleCheckboxChange(tag)}
                      className="form-check-input"
                    />
                    <label className="ms-2">{tag}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="container my-5">
          <div className="row text-center">
            {filteredPlaces.map((place) => (
              <div
                key={place._id}
                className="col-lg-4 col-md-6 col-sm-12 mb-4 text-start d-flex"
              >
                <div className="card rounded-3 p-2 mt-lg-0 mt-4 flex-grow-1">
                  <div
                    className="activity-img mb-2 d-flex align-items-end"
                    style={{
                      backgroundImage: place.pictures[0]
                        ? `url(http://localhost:3002/${place.pictures[0].replace(
                            /\\/g,
                            "/"
                          )})`
                        : "none", // Fallback if there's no image path
                    }}
                  >
                    <div className="itinerary-title d-flex justify-content-between align-items-end w-100">
                      <div className="d-flex flex-column justify-content-start px-2 pb-2">
                        <h4
                          className="mb-1"
                          style={{
                            color: "white",
                            opacity: "0.9",
                            textAlign: "left",
                          }}
                        >
                          {place.name}
                        </h4>
                        {/* Trash Icon */}

                        <a
                          className="text-white ps-0"
                          style={{ opacity: "0.7", fontSize: "14px" }}
                          onClick={() =>
                            navigate(`/tourism-hp-details/${place._id}`)
                          }
                        >
                          View Details
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            fill="currentColor"
                            className="bi bi-box-arrow-up-right ms-1 mb-1"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"
                            />
                          </svg>
                        </a>
                      </div>
                      <svg
                        onClick={() => handleDelete(place._id, place.name)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="red"
                        className="bi bi-trash3"
                        viewBox="0 0 16 16"
                        style={{
                          cursor: "pointer",
                          marginRight: "10px",
                          marginBottom: "-30px",
                        }}
                      >
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                      </svg>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="fw-bold mb-0">{place.location}</p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="#5ddec2"
                        className="bi bi-buildings"
                        viewBox="0 0 16 16"
                      >
                        <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022M6 8.694 1 10.36V15h5zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5z" />
                      </svg>
                      <span className="ms-2 fs-sm">{place.category}</span>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <div className="d-flex flex-row " style={{ width: "100%" }}>
                      <div className="w-100">
                        <div
                          className="rounded-3 p-2 mb-2"
                          style={{
                            background:
                              "linear-gradient(to bottom, #5ddec2, #a5e0d4, #c5e0da)",
                          }}
                        >
                          <span
                            className="fw-bold bg-white rounded-pill ms-2 px-2"
                            style={{ color: "#5ddec2" }}
                          >
                            Entry Fee
                          </span>
                          <ul className="mb-0 ">
                            <li>Foreign: ${place.entryFeeForeign}</li>
                            <li>Native: ${place.entryFeeNative}</li>
                            <li>Student: ${place.entryFeeStudent}</li>
                          </ul>
                        </div>
                        <div className="d-flex flex-column text-start w-50">
                          <button
                            onClick={() =>
                              navigate(`/edit-historical-place/${place.name}`)
                            }
                            className="btn btn-lg btn-more px-4 mt-2 flex-grow-1 me-2 mb-1"
                          >
                            Edit
                          </button>
                          {/* <ShareLink type="itinerary" id={itinerary._id} /> */}
                        </div>
                      </div>
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
                                  {modalType === "governor" &&
                                    "Add Tourism Governor"}
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
                                  <div
                                    className="alert alert-danger"
                                    role="alert"
                                  >
                                    {errorMessage}
                                  </div>
                                )}
                                {successMessage && (
                                  <div
                                    className="alert alert-success"
                                    role="alert"
                                  >
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
                                        onChange={(e) =>
                                          setUsername(e.target.value)
                                        }
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
                                        onChange={(e) =>
                                          setPassword(e.target.value)
                                        }
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
                                        onChange={(e) =>
                                          setUsername(e.target.value)
                                        }
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
                                        onChange={(e) =>
                                          setPassword(e.target.value)
                                        }
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
                                          modalType === "change-password"
                                            ? "35%"
                                            : "30%",
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
                                          <h5 className="modal-title">
                                            {modalType === "admin" &&
                                              "Add New Admin"}
                                            {modalType === "governor" &&
                                              "Add Tourism Governor"}
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
                                            <div
                                              className="alert alert-danger"
                                              role="alert"
                                            >
                                              {errorMessage}
                                            </div>
                                          )}
                                          {successMessage && (
                                            <div
                                              className="alert alert-success"
                                              role="alert"
                                            >
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
                                                <label htmlFor="username">
                                                  Username
                                                </label>
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  id="username"
                                                  placeholder="Enter username"
                                                  value={username}
                                                  onChange={(e) =>
                                                    setUsername(e.target.value)
                                                  }
                                                  required
                                                  style={{
                                                    padding: "10px",
                                                    borderRadius: "5px",
                                                    border: "1px dashed #ccc",
                                                  }}
                                                />
                                              </div>
                                              <div className="form-group">
                                                <label htmlFor="password">
                                                  Password
                                                </label>
                                                <input
                                                  type="password"
                                                  className="form-control"
                                                  id="password"
                                                  placeholder="Enter password"
                                                  value={password}
                                                  onChange={(e) =>
                                                    setPassword(e.target.value)
                                                  }
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
                                                <label htmlFor="username">
                                                  Username
                                                </label>
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  id="username"
                                                  placeholder="Enter username"
                                                  value={username}
                                                  onChange={(e) =>
                                                    setUsername(e.target.value)
                                                  }
                                                  required
                                                  style={{
                                                    padding: "10px",
                                                    borderRadius: "5px",
                                                    border: "1px dashed #ccc",
                                                  }}
                                                />
                                              </div>
                                              <div className="form-group">
                                                <label htmlFor="password">
                                                  Password
                                                </label>
                                                <input
                                                  type="password"
                                                  className="form-control"
                                                  id="password"
                                                  placeholder="Enter password"
                                                  value={password}
                                                  onChange={(e) =>
                                                    setPassword(e.target.value)
                                                  }
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
                                                    showCurrentPassword
                                                      ? "text"
                                                      : "password"
                                                  }
                                                  className="form-control"
                                                  id="currentPassword"
                                                  placeholder="Enter current password"
                                                  value={currentPassword}
                                                  onChange={(e) =>
                                                    setCurrentPassword(
                                                      e.target.value
                                                    )
                                                  }
                                                  required
                                                  style={{
                                                    padding:
                                                      "10px 40px 10px 10px", // Add right padding for the icon
                                                    borderRadius: "5px",
                                                    border: "1px dashed #ccc",
                                                  }}
                                                />
                                                <span
                                                  role="button"
                                                  onClick={() =>
                                                    setShowCurrentPassword(
                                                      !showCurrentPassword
                                                    )
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
                                                  {showCurrentPassword
                                                    ? "👁️"
                                                    : "🙈"}
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
                                                  type={
                                                    showNewPassword
                                                      ? "text"
                                                      : "password"
                                                  }
                                                  className="form-control"
                                                  id="newPassword"
                                                  placeholder="Enter new password"
                                                  value={newPassword}
                                                  onChange={(e) =>
                                                    setNewPassword(
                                                      e.target.value
                                                    )
                                                  }
                                                  required
                                                  style={{
                                                    padding:
                                                      "10px 40px 10px 10px", // Add right padding for the icon
                                                    borderRadius: "5px",
                                                    border: "1px dashed #ccc",
                                                  }}
                                                />
                                                <span
                                                  role="button"
                                                  onClick={() =>
                                                    setShowNewPassword(
                                                      !showNewPassword
                                                    )
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
                                                  {showNewPassword
                                                    ? "👁️"
                                                    : "🙈"}
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
                                                    showConfirmNewPassword
                                                      ? "text"
                                                      : "password"
                                                  }
                                                  className="form-control"
                                                  id="confirmNewPassword"
                                                  placeholder="Confirm new password"
                                                  value={confirmNewPassword}
                                                  onChange={(e) =>
                                                    setConfirmNewPassword(
                                                      e.target.value
                                                    )
                                                  }
                                                  required
                                                  style={{
                                                    padding:
                                                      "10px 40px 10px 10px", // Add right padding for the icon
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
                                                  {showConfirmNewPassword
                                                    ? "👁️"
                                                    : "🙈"}
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
                                                style={styles.submitButton}
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
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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

export default CreatedHistoricalPlacesView;
