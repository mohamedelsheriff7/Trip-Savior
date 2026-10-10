import React, { useState, useEffect } from "react";
import axios from "axios";
import AdvertiserNavbar from "./AdvertiserNavbar";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Core Swiper CSS
import "swiper/css/navigation"; // Navigation buttons
import "swiper/css/pagination"; // Pagination dots
import { Navigation, Pagination } from "swiper/modules";
import "../../styles/HistoricalGuest.css";
import backButtonImage from "../../images/backbutton.png";
import CreateActivity from "./CreateActivity";
import DeleteActivityButton from "./DeleteActivityButton";
import { useNavigate } from "react-router-dom";
import ShareLinkItinerary from "../ShareLinkItinerary";
import "../../styles/AddComplaintButton.css";

const ActivitiesView = () => {
  // State variables
  const [advertiserUsername, setAdvertiserUsername] = useState("");
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(-1); // Index of the activity being edited
  const [updatedData, setUpdatedData] = useState({}); // Data being edited

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch all activities on component mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/advertiser/getAllActivities"
        );

        // Filter activities based on user's username
        const userActivities = response.data.filter(
          (activity) => activity.advertiserUsername === user.username
        );
        setActivities(userActivities);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError("Error fetching activities. Please try again.");
      }
    };

    fetchActivities();
  }, [user.username]);

  // Handle input change for advertiserUsername
  const handleAdvertiserUsernameChange = (event) => {
    setAdvertiserUsername(event.target.value);
  };

  // Filter activities based on advertiserUsername
  const handleShowActivities = () => {
    console.log("Advertiser Username Entered:", advertiserUsername);
    const filtered = activities.filter((activity) => {
      const advertiserFromActivity = activity.advertiserUsername;
      return (
        advertiserFromActivity &&
        advertiserFromActivity.toLowerCase() ===
          advertiserUsername.toLowerCase()
      );
    });

    console.log("Filtered Activities:", filtered);

    if (filtered.length === 0) {
      setError("No activities found for this advertiser.");
      setFilteredActivities([]);
    } else {
      setFilteredActivities(filtered);
      setError("");
    }
  };

  // Handle input changes in the edit form
  //   const handleInputChange = (event) => {
  //     const { name, value } = event.target;
  //     setUpdatedData((prev) => ({
  //       ...prev,
  //       [name]: name === "price" ? Number(value) : value, // Convert to number if necessary
  //     }));
  //   };

  // The following functions are commented out to disable Edit and Delete functionalities

  /*
  // Handle updating an activity
  const handleUpdateActivity = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:3002/advertiser/updateActivity/${id}`,
        updatedData
      );
      setFilteredActivities((prev) =>
        prev.map((activity, index) =>
          index === editIndex ? response.data : activity
        )
      );
      setActivities((prev) =>
        prev.map((activity) => (activity._id === id ? response.data : activity))
      );
      setEditIndex(-1); // Exit edit mode
      setError("");
      console.log("Activity updated successfully");
    } catch (err) {
      console.error("Error updating activity:", err);
      setError("Error updating activity. Please try again.");
    }
  };

  // Handle deleting an activity
  const handleDeleteActivity = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/advertiser/deleteActivity/${id}`);
      setFilteredActivities((prev) =>
        prev.filter((activity) => activity._id !== id)
      );
      setActivities((prev) => prev.filter((activity) => activity._id !== id));
      console.log("Activity deleted successfully");
    } catch (err) {
      console.error("Error deleting activity:", err);
      setError("Error deleting activity. Please try again.");
    }
  };

  // Handle clicking the edit button
  const handleEditClick = (index) => {
    setEditIndex(index);
    setUpdatedData(filteredActivities[index]); // Pre-fill with current data
  };
  */

  // Handle canceling the edit
  const handleCancelEdit = () => {
    setEditIndex(-1);
    setUpdatedData({});
  };

  // Inline styles for a professional, modern look
  const containerStyle = {
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: "1200px",
    margin: "auto",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  };

  const headerStyle = {
    textAlign: "center",
    color: "#343a40",
    marginBottom: "30px",
    fontSize: "2.5rem",
    fontWeight: "600",
  };

  const sortContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  };

  const selectStyle = {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ced4da",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  };

  const swiperStyle = {
    maxWidth: "100%",
    borderRadius: "8px",
  };

  const arrowStyle = {
    color: "rgba(128, 128, 128, 0.6)", // Grey with 60% opacity
    transition: "color 0.3s", // Smooth color transition
  };

  return (
    <>
      {/* <div
key={backgroundImage}
className="position-absolute top-0 start-0 w-100 h-100 transition-opacity"
style={{
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  filter: "blur(5px)",
  width: "100%",
  height: "100%",
  zIndex: "-1",
  transitionDuration: "1s", // Bootstrap doesn't have a built-in transition duration, so we add this directly in the style
  transitionTimingFunction: "ease-in-out",
}}
/> */}
      <AdvertiserNavbar />
      <div className="container-fluid">
        <h1 style={headerStyle}>My Activities</h1>
        <div className="d-flex justify-content-center align-items-center mb-4">
          <button
            onClick={() => navigate("/advertiser-create-activity")}
            className="icon-btn add-complaint-btn"
          >
            <div className="add-complaint-icon"></div>
            <div className="btn-txt">Add Activity</div>
          </button>
        </div>

        {/* Itineraries Section */}
        <div className="container my-5">
          <div className="row text-center">
            {activities.map((activity, index) => (
              <div
                key={activity._id || index}
                className="col-lg-4 col-md-6 col-sm-12 mb-4 text-start d-flex"
              >
                <div className="card rounded-3 p-2 mt-lg-0 mt-4 flex-grow-1">
                  {/* Title */}
                  <div
                  className="activity-img mb-2 d-flex align-items-end"
                   style={{
                  backgroundImage: activity.pictures[0]
                  ? `url(http://localhost:3002/${activity.pictures[0].replace(/\\/g, "/")})`
                    : "none", // Fallback if there's no image path
                   }}
                  >
                    <div className="itinerary-title d-flex justify-content-between align-items-end w-100">
                      <div className="d-flex flex-column justify-content-start px-2 pb-2">
                        <h4
                          className="mb-1" /* Ensures consistent spacing below the title */
                          style={{
                            color: "white",
                            opacity: "0.9",
                            textAlign: "left", // Ensures alignment is consistent
                          }}
                        >
                          {activity.name}
                        </h4>
                        <a
                          className="text-white ps-0"
                          style={{ opacity: "0.7", fontSize: "14px" }}
                          onMouseEnter={(e) =>
                            (e.target.style.textDecoration = "underline")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.textDecoration = "none")
                          }
                          onClick={() =>
                            navigate(
                              `/advertiser-activity-details/${activity._id}`
                            )
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
                              fill-rule="evenodd"
                              d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"
                            />
                          </svg>
                        </a>
                      </div>
                      <div className="me-3 mt-2 mb-2">
                        <DeleteActivityButton
                          activityNameParam={activity.name}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="fw-bold">
                        {new Date(activity.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>

                      {/* <ul
                      style={{ padding: "0", margin: "0", listStyle: "none" }}
                    >
                      {itinerary.activity.map((act, index) => (
                        <li key={index}>
                          <span
                            className="rounded-pill text-center px-2 mb-1"
                            style={{
                              display: "inline-block",
                              backgroundColor: "#5ddec2",
                              color: "#ffffff",
                              width: "110px",
                            }}
                          >
                            {act.time}
                          </span>{" "}
                          {act.name}
                        </li>
                      ))}
                    </ul> */}
                    </div>
                    <div>
                      <div className="d-flex justify-content-end align-items-center mt-auto mb-2">
                        {/* Render stars based on the rating */}

                        {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            className={`me-1 ${
                              index < activity.rating
                                ? "text-warning"
                                : "text-secondary"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    {/* <div
                    className="rounded-3 w-50 p-2"
                    style={{
                      background:
                        "linear-gradient(to bottom, #5ddec2, #a5e0d4, #c5e0da)",
                    }}
                  >
                    <span
                      className="fw-bold bg-white rounded-pill ms-2 px-2"
                      style={{ color: "#5ddec2" }}
                    >
                      Locations
                    </span>
                    <p className="mb-0 ms-2">
                      {itinerary.locationToBeVisited.join(", ")}
                    </p>
                  </div> */}
                    <div
                      className="d-flex flex-row ps-3"
                      style={{ width: "100%" }}
                    >
                      <div className="d-flex flex-column justify-content-start align-items-start w-50 ">
                        <div className="d-flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="35"
                            height="35"
                            fill="#5ddec2"
                            className="bi bi-geo-alt"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                          </svg>
                          <span className="ms-2">{activity.location}</span>
                        </div>
                        <div className="d-flex align-items-center mt-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="#5ddec2"
                            class="bi bi-clock"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
                          </svg>
                          <span className="ms-2">{activity.time}</span>
                        </div>
                      </div>
                      <div className="w-100 ps-5 ">
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
  Tags
</span>
<p className="mb-0 ms-3">
  {activity.tags
    .map(tag => typeof tag === 'string' ? tag : '') // Filter out any non-string items
    .filter(tag => tag) // Remove any empty strings
    .join(", ")}
</p>
                        </div>
                        {/* <div
                      className="rounded-3 p-2"
                      style={{
                        background:
                          "linear-gradient(to bottom, #5ddec2, #a5e0d4, #c5e0da)",
                      }}
                    >
                      <span
                        className="fw-bold bg-white rounded-pill ms-2 px-2"
                        style={{ color: "#5ddec2" }}
                      >
                        Discounts
                      </span>
                      <p className="mb-0">{activity.specialDiscounts}</p>
                    </div> */}
                      </div>
                    </div>
                  </div>

                  {/* Book Button */}
                  <div
                    style={{ bottom: "0" }}
                    className="d-flex justify-content-between text-center pt-1 mt-auto"
                  >
                    {/* Book Button */}
                    <div className="d-flex flex-column text-start w-50">
                      <button
                        onClick={() => {
                          localStorage.setItem('activityNameToEdit', activity.name);
                          navigate(`/advertiser-edit-activity/${activity.name}`);
                        }}
                        className="btn btn-lg btn-more px-4 mt-2 flex-grow-1 me-2 mb-1"
                      >
                        Edit
                      </button>
                      {/* <ShareLink type="itinerary" id={itinerary._id} /> */}
                    </div>
                    {/* Price */}
                    <div
                      className="d-flex  justify-content-end rounded p-2"
                      style={{ width: "50%" }}
                    >
                      <span className="text-black fs-3 fw-bold">
                        ${activity.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivitiesView;
