import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
//import "./Tourist.css";
import departure from "../../images/departures.svg";
import arrival from "../../images/arrivals.svg";
import backgroundImage from "../../images/airplane.jpg";
import CustomNavbar from "../CustomNavbar";
import ShareLinkItinerary from "../ShareLinkItinerary"; // Import the ShareLink component
import ShareLink from "../ShareLink"; // Import the ShareLink component

const ViewItinerariesGuest = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPriceChecked, setIsPriceChecked] = useState(false);
  const [isRatingChecked, setIsRatingChecked] = useState(false);
  const [showSort, setShowSort] = useState(false);

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

  const handlePreferenceChange = (e) => {
    const selected = e.target.value;
    setSelectedPreference(selected);
    // Save the selected preference in localStorage
  };

  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3002/preferences");
      setPreferences(response.data);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load preferences. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSliderChange = (values) => {
    setStartPrice(values[0]);
    setEndPrice(values[1]);
  };

  // Fetch itineraries based on filters
  const fetchItineraries = async () => {
    setLoading(true);
    let queryParams = [];

    // Add the selected preference if it exists
    if (selectedPreference) {
      queryParams.push(`preferences=${selectedPreference}`);
    }

    // Add other query parameters (like price, dates, etc.)
    if (startPrice || endPrice) {
      queryParams.push(`startPrice=${startPrice}`, `endPrice=${endPrice}`);
    }
    if (startDate) queryParams.push(`startDate=${startDate}`);
    if (endDate) queryParams.push(`endDate=${endDate}`);
    if (language) queryParams.push(`language=${language}`);
    if (sortBy) queryParams.push(`sortBy=${sortBy}`);

    const queryString =
      queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    try {
      const response = await axios.get(
        `http://localhost:3002/itineraries-filter${queryString}`
      );
      setItineraries(response.data);
    } catch (error) {
      setError("Error fetching itineraries.");
    } finally {
      setLoading(false);
    }
  };
   // Filter itineraries to exclude flagged ones
   const filteredItineraries = itineraries.filter(
    (itinerary) =>
      (itinerary.active && itinerary.booked) ||
      (!itinerary.active && itinerary.booked) ||
      !itinerary.isFlagged
  );

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleSort = (field, order) => {
    setItineraries((prevItineraries) => {
      const sortedItineraries = [...prevItineraries];
      sortedItineraries.sort((a, b) => {
        if (order === "asc") {
          return a[field] - b[field];
        } else {
          return b[field] - a[field];
        }
      });
      return sortedItineraries;
    });
  };

  const handleItineraryBooking = async (itineraryName) => {
    const user = JSON.parse(localStorage.getItem("user")); // Get the logged-in user details
    const username = user ? user.username : null;

    if (!username) {
      alert("You must be logged in to book an itinerary.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3002/itineraries/book-itinerary",
        {
          Itinerary_Name: itineraryName,
          username, // Include username in the request
        }
      );

      alert(response.data.message);
      setItineraries((prevItineraries) =>
        prevItineraries.map((itinerary) =>
          itinerary.Itinerary_Name === itineraryName
            ? { ...itinerary, booked: true }
            : itinerary
        )
      );
    } catch (error) {
      console.error("Error booking itinerary:", error);
      alert("Failed to book itinerary. Please try again.");
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchItineraries();
  };

  const handleFilterView = () => {
    setFilterVisible((prevShowFilters) => !prevShowFilters);
    setShowSort(false);
  };

  const handleSortView = () => {
    setShowSort((prevShowSort) => !prevShowSort);
    setFilterVisible(false);
  };

  const clearQueryParams = () => {
    setSelectedPreference("");
  };

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

  // Handle preference selection


  if (error) {
    return <div>{error}</div>;
  }

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
      <CustomNavbar />
      <div className="container-fluid">
        <div className="d-flex justify-content-end">
        {filterVisible && (
            <div className="ms-3 justify-content-start">
              {
                <form
                  onSubmit={handleFilter}
                  className="container"
                  style={{
                    position: "absolute",
                    minWidth: "700px",
                    maxWidth: "100%",
                    right: "-18%",
                    padding: "20px",
                    borderRadius: "8px",
                    marginTop: "50px",
                  }}
                >
                  <div>
                    <div className="position-relative">
                      <div
                        className="z-3 card p-3 position-relative w-25"
                        style={{
                          marginLeft: "800px",
                        }}
                      >
                        <label>Language:</label>
                        <input
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          style={{
                            width: "100%", // Make the dropdown take the full width
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ced4da",
                            marginBottom: "15px",
                          }}
                        ></input>
                        {/* <label>Category:</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          style={{
                            width: "100%", // Make the dropdown take the full width
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ced4da",
                            marginBottom: "15px",
                          }}
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat, index) => (
                            <option key={index} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select> */}

                        <label>Budget:</label>
                        <div className="col-12 w-full max-w-md mx-auto p-4">
                          <Slider
                            range
                            min={0}
                            max={100000}
                            step={100}
                            value={[startPrice, endPrice]}
                            onChange={handleSliderChange}
                            trackStyle={[{ backgroundColor: "#5ddec2" }]}
                            railStyle={{ backgroundColor: "#e0e0e0" }}
                            handleStyle={[
                              {
                                backgroundColor: "#5ddec2",
                                border: "none",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                height: 20,
                                width: 20,
                                marginTop: -8,
                              },
                              {
                                backgroundColor: "#5ddec2",
                                border: "none",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                height: 20,
                                width: 20,
                                marginTop: -8,
                              },
                            ]}
                          />
                          <div className="d-flex justify-content-between mt-3 text-sm text-gray-600">
                            <span>Min: ${startPrice}</span>
                            <span>Max: ${endPrice}</span>
                          </div>
                        </div>

                        {/* <label>Min. Date:</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "15px",
                            borderRadius: "4px",
                            border: "1px solid #ced4da",
                          }}
                        /> */}

                        <label>Max. Date:</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "15px",
                            borderRadius: "4px",
                            border: "1px solid #ced4da",
                          }}
                        />
                        <label>Preferences:</label>
                        <select
                          id="preferencesDropdown"
                          className="form-select"
                          value={selectedPreference} // Controlled value, updates with state
                          onChange={handlePreferenceChange} // Update state on selection
                          style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ced4da",
                          }}
                        >
                          <option value="" disabled>
                            Select a preference
                          </option>
                          {preferences.map((preference, index) => (
                            <option key={index} value={preference}>
                              {preference}
                            </option>
                          ))}
                        </select>

                        <button
                          type="submit"
                          style={{
                            width: "100%", // Full-width button
                            padding: "10px",
                            backgroundColor: "#5ddec2",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            marginTop: "20px",
                            cursor: "pointer",
                            fontSize: "16px",
                          }}
                        >
                          Filter
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              }
            </div>
          )}
        </div>

        <div className="d-flex justify-content-end mt-3">


          <div className="d-flex justify-content-end mt-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-sort-down me-2"
              viewBox="0 0 16 16 "
              onClick={handleSortView}
              style={{
                fill: "#4ed4b7", // Same color as search icon
                cursor: "pointer", // Make it clickable
                transition: "transform 0.3s ease", // Smooth transition for hover effect
              }}
            >
              <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z" />
            </svg>

            <svg
              className="filterProductBar"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              style={{
                fill: "#4ed4b7",
                cursor: "pointer",
                transition: "transform 0.3s ease",
              }}
              viewBox="0 0 16 16"
              onClick={handleFilterView}
            >
              <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />
            </svg>
          </div>
        </div>

        <div className="d-flex align-items-center">
          {/* Sorting Menu */}
          {showSort && (
            <div className="ms-3 justify-content-start">
              <div
                className="container"
                style={{
                  position: "absolute",
                  minWidth: "700px",
                  maxWidth: "100%",
                  right: "-18%",
                  padding: "20px",
                  borderRadius: "8px",
                  zIndex: "3",
                }}
              >
                <div
                  className="card p-3 position-relative w-25"
                  style={{ marginLeft: "800px", fontSize: "18px" }}
                >
                  <h5>Sort By</h5>

                  {/* Price Sort Option */}
                  <div className="mb-3 d-flex align-items-center">
                    <div className="d-flex flex-row align-items-center">
                      <input
                        type="checkbox"
                        id="sortPrice"
                        checked={isPriceChecked}
                        onChange={(e) => setIsPriceChecked(e.target.checked)}
                      />
                      <label htmlFor="sortPrice" className="ms-2 my-0">
                        Price
                      </label>
                    </div>
                    {isPriceChecked && (
                      <select
                        onChange={(e) => {
                          const order =
                            e.target.value === "low-to-high" ? "asc" : "desc";
                          handleSort("price", order);
                        }}
                        className="form-select mt-2 ms-auto"
                        style={{
                          width: "180px",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #ced4da",
                        }}
                      >
                        <option value="">Select</option>
                        <option value="low-to-high">Low to High</option>
                        <option value="high-to-low">High to Low</option>
                      </select>
                    )}
                  </div>

                  {/* Rating Sort Option */}
                  <div className="mb-3 d-flex align-items-center">
                    <div className="d-flex flex-row align-items-center">
                      <input
                        type="checkbox"
                        id="sortRating"
                        checked={isRatingChecked}
                        onChange={(e) => setIsRatingChecked(e.target.checked)}
                      />
                      <label htmlFor="sortRating" className="ms-2 my-0">
                        Rating
                      </label>
                    </div>
                    {isRatingChecked && (
                      <select
                        onChange={(e) => {
                          const order =
                            e.target.value === "low-to-high" ? "asc" : "desc";
                          handleSort("rating", order);
                        }}
                        className="form-select mt-2 ms-auto"
                        style={{
                          width: "180px",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #ced4da",
                        }}
                      >
                        <option value="">Select</option>
                        <option value="low-to-high">Low to High</option>
                        <option value="high-to-low">High to Low</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Itineraries Section */}
        <div className="container my-5">
          <div className="row text-center">
          {filteredItineraries.map((itinerary, index) => (
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
                        <a
                          className="text-white ps-0"
                          style={{ opacity: "0.7", fontSize: "14px" }}
                          onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                          onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                          onClick={() => navigate(`/itinerary-guest/${itinerary._id}`)}
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
                    <div className="d-flex flex-column text-start w-50">
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

export default ViewItinerariesGuest;
