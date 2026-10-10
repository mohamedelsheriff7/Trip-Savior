import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useNavigate } from "react-router-dom";
//import "./Tourist.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Core Swiper CSS
import "swiper/css/navigation"; // Navigation buttons
import "swiper/css/pagination"; // Pagination dots
import { Navigation, Pagination } from "swiper/modules";
import departure from "../../images/departures.svg";
import arrival from "../../images/arrivals.svg";
import backgroundImage from "../../images/airplane.jpg";
import TourGuideNavigationBar from "../TourguideNavBar";
import ShareLinkItinerary from "../ShareLinkItinerary"; // Import the ShareLink component
import ShareLink from "../ShareLink"; // Import the ShareLink component
import Select from "react-select";

const TourGuideItineraries = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPriceChecked, setIsPriceChecked] = useState(false);
  const [isRatingChecked, setIsRatingChecked] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Filter states
  const [budget, setBudget] = useState("");
  const [startPrice, setStartPrice] = useState(0);
  const [endPrice, setEndPrice] = useState(100000);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rating, setRating] = useState("");
  const [date, setDate] = useState("");
  const [preferences, setPreferences] = useState([]);
  const [language, setLanguage] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState("");

  const handleFlagToggle = async (id) => {
    try {
      // Determine the new flag status
      const itinerary = itineraries.find((itinerary) => itinerary._id === id);
      const updatedFlagStatus = !itinerary.active;
      console.log("updatedFlagStatus", updatedFlagStatus);

      // Send the updated isFlagged property to the server
      const response = await axios.put(
        `http://localhost:3002/itinerary/${id}`,
        { active: updatedFlagStatus }
      );
      if (response.status === 200) {
        setItineraries((prevItineraries) =>
          prevItineraries.map((item) =>
            item._id === id ? { ...item, active: updatedFlagStatus } : item
          )
        );
      } else {
        console.error("Failed to update the flag status");
      }

      // Update the local state based on the response
    } catch (err) {
      console.error("Error updating flag status:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Send DELETE request to the server
      const response = await axios.delete(`http://localhost:3002/itinerary/${id}`);
  
      if (response.status === 200) {
        // Update local state to remove the deleted itinerary
        setItineraries((prevItineraries) =>
          prevItineraries.filter((itinerary) => itinerary._id !== id)
        );
        console.log(response.data.message); // Optional: Log success message
      } else {
        console.error("Failed to delete itinerary");
      }
    } catch (err) {
      console.error("Error deleting itinerary:", err);
    }
  };

  const fetchItineraries = async () => {
    setLoading(true);

    try {
      // Fetch all itineraries
      const response = await axios.get("http://localhost:3002/itinerary");

      // Get the username from localStorage
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      console.log("loggedInUser", loggedInUser);

      if (loggedInUser) {
        // Filter itineraries to show only those with tourGuideName matching the logged-in user
        const filteredItineraries = response.data.filter(
          (itinerary) => itinerary.tourGuideName === loggedInUser.username
        );
        console.log("user", loggedInUser.username);

        setItineraries(filteredItineraries);
        console.log("filteredItineraries", itineraries);
      } else {
        // If no user is logged in, set itineraries to an empty array
        setItineraries([]);
      }
    } catch (error) {
      setError("Error fetching itineraries.");
    } finally {
      setLoading(false);
    }
  };
  // Filter itineraries to exclude flagged ones

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get("http://localhost:3002/preferences");
        setPreferences(response.data);
        setError("");
      } catch (err) {
        setError("Failed to load preferences.");
      }
    };
    console.log("itineraries", itineraries);

    fetchPreferences();
    // Clear query params and fetch itineraries on filter change
    fetchItineraries();
  }, [
    startPrice,
    endPrice,
    startDate,
    endDate,
    language,
    sortBy,
    selectedPreference,
  ]);

  const handleNotifyRequest = async (itineraryId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.username;

    if (!username) {
      alert("You must be logged in to request notifications.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:3002/itineraries/${itineraryId}/notify`,
        {
          username,
          email: user.email,
        }
      );
      alert("You will be notified when this itinerary starts taking bookings.");
    } catch (error) {
      alert("Failed to request notification. Please try again.");
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, [budget, date, preferences, language, sortBy]);

  if (error) return <div>{error}</div>;

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
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
      <TourGuideNavigationBar />
      <div className="container-fluid mt-3">
        <h1 className="text-center my-4 fs-2">My Itineraries</h1>
        <div className="d-flex justify-content-center align-items-center mb-4">
          <button
            onClick={() => navigate("/tg-create-itinerary")}
            className="icon-btn add-complaint-btn"
          >
            <div className="add-complaint-icon"></div>
            <div className="btn-txt">Add Itinerary</div>
          </button>
        </div>

        {/* Itineraries Section */}
        <div className="container my-5">
          <div className="row text-center">
            {itineraries.map((itinerary, index) => (
              <div
                key={itinerary._id || index}
                className="col-lg-4 col-md-6 col-sm-12 mb-4 text-start d-flex"
              >
                <div className="card rounded-3 p-2 mt-lg-0 mt-4 flex-grow-1">
                  {/* Title */}
                  <div
                  className="activity-img mb-2 d-flex align-items-end"
                   style={{
                  backgroundImage: itinerary.pictures[0]
                  ? `url(http://localhost:3002/${itinerary.pictures[0].replace(/\\/g, "/")})`
                    : "none", // Fallback if there's no image path
                   }}
                  >
                    <div className="itinerary-title d-flex justify-content-between align-items-end w-100">
                      <div className="d-flex flex-column justify-content-start px-2 pb-2">
                        <div className="d-flex flex-colum align-items-center">
                        <h4
                          className="mb-1" /* Ensures consistent spacing below the title */
                          style={{
                            color: "white",
                            opacity: "0.9",
                            textAlign: "left", // Ensures alignment is consistent
                          }}
                        >
                          {itinerary.Itinerary_Name}
                        </h4>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="red"
                          class="bi bi-trash ms-2 mb-1"
                          viewBox="0 0 16 16"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(itinerary._id)}
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                        </div>
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
                            navigate(`/tg-itinerary/${itinerary._id}`)
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
                        <ShareLinkItinerary
                          type="itinerary"
                          id={itinerary._id}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="fw-bold">
                        {new Date(itinerary.date_time).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          }
                        )}
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
                      <div className="d-flex flex-column justify-content-start align-items-start ms-3">
                        <div className="d-flex align-items-center">
                          <img
                            src={departure}
                            alt="departure"
                            className="me-1"
                            style={{
                              width: "18px",
                              height: "18px",
                              objectFit: "cover",
                            }}
                          />
                          <span className="ms-2">
                            {itinerary.pickupLocation}
                          </span>
                        </div>
                        <div className="d-flex align-items-center mt-2">
                          <img
                            src={arrival}
                            alt="departure"
                            className="me-1"
                            style={{
                              width: "18px",
                              height: "18px",
                              objectFit: "cover",
                            }}
                          />
                          <span className="ms-2">
                            {itinerary.dropoffLocation}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="d-flex justify-content-end align-items-center mt-auto mb-2">
                        {/* Render stars based on the rating */}

                        {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            className={`me-1 ${
                              index < itinerary.rating
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
                    <div
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
                    </div>
                    <div
                      className="d-flex flex-column ps-3"
                      style={{ width: "50%" }}
                    >
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
                          Preferences
                        </span>
                        <p className="mb-0 ms-2">
                          {itinerary.preferences.join(", ")}
                        </p>
                      </div>
                      <div
                        className="d-flex justify-content-between rounded-3 p-2"
                        style={{
                          background:
                            "linear-gradient(to bottom, #5ddec2, #a5e0d4, #c5e0da)",
                        }}
                      >
                        <span
                          className="fw-bold bg-white rounded-pill ms-2 px-2"
                          style={{ color: "#5ddec2" }}
                        >
                          Language
                        </span>
                        <p className="mb-0">{itinerary.languageOfTour}</p>
                      </div>
                    </div>
                  </div>

                  {/* Book Button */}
                  <div
                    style={{ bottom: "0" }}
                    className="d-flex justify-content-between text-center pt-1 mt-auto"
                  >
                    {/* Book Button */}
                    <div className="d-flex flex-row text-start w-50">
                      <button
                        className="btn btn-lg btn-buy px-4 mt-2 flex-grow-1 me-2 mb-1"
                        onClick={() =>
                          navigate(`/tg-update-itinerary/${itinerary._id}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-lg btn-more px-4 mt-2 flex-grow-1 me-2 mb-1"
                        onClick={() => handleFlagToggle(itinerary._id)}
                      >
                        {itinerary.active ? "Deactivate" : "Activate"}
                      </button>
                      {/* <ShareLink type="itinerary" id={itinerary._id} /> */}
                    </div>
                    {/* Price */}
                    <div
                      className="d-flex  justify-content-end rounded p-2"
                      style={{ width: "50%" }}
                    >
                      <span className="text-black fs-3 fw-bold">
                        ${itinerary.price}
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

export default TourGuideItineraries;
