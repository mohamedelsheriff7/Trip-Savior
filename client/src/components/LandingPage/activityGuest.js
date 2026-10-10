import React, { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Core Swiper CSS
import "swiper/css/navigation"; // Navigation buttons
import "swiper/css/pagination"; // Pagination dots
import { Navigation, Pagination } from "swiper/modules";
import "../../styles/HistoricalGuest.css";
import CustomNavbar from "../CustomNavbar";
import backButtonImage from "../../images/backbutton.png";
import ShareLinkItinerary from "../ShareLinkItinerary"; // Import the ShareLink component


const ActivityGuest = () => {
  const [activities, setActivities] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); // Loading state
  const navigate = useNavigate(); // Initialize navigate

  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]); // State to hold categories
  const [category, setCategory] = useState("");
  const [startPrice, setStartPrice] = useState(0);
  const [endPrice, setEndPrice] = useState(100000);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rating, setRating] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [isPriceChecked, setIsPriceChecked] = useState(false);
  const [isRatingChecked, setIsRatingChecked] = useState(false);


  const handleSliderChange = (values) => {
    setStartPrice(values[0]);
    setEndPrice(values[1]);
  };

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3002/getUpcomingActivities"
      );
      const fetchedActivities = response.data;

      // Filter out flagged activities
      const filteredActivities = fetchedActivities.filter(
        (activity) => !activity.isFlagged
      );

      setActivities(filteredActivities);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(filteredActivities.map((activity) => activity.category)),
      ];
      setCategories(uniqueCategories);
      setError("");
    } catch (err) {
      setError(
        err.response
          ? err.response.data.message
          : "Failed to load activities. Please try again."
      );
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilter = async (event) => {
    event.preventDefault();
    const filterData = {
      category,
      startPrice,
      endPrice,
      startDate,
      endDate,
      rating,
    };
    console.log("Filter Data:", filterData);

    try {
      const response = await axios.get("http://localhost:3002/filterActivity", {
        params: { startPrice, endPrice, startDate, endDate, category, rating },
      });

      // Filter out flagged activities from the response data
      const filteredData = response.data.filter(
        (activity) => !activity.isFlagged
      );

      setActivities(filteredData);
      setShowFilters(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSort = (field, order) => {
    setActivities((prevActivities) => {
      const sortedActivities = [...prevActivities];
      sortedActivities.sort((a, b) => {
        return order === "asc" ? a[field] - b[field] : b[field] - a[field];
      });
      return sortedActivities;
    });
  };

  useEffect(() => {
    const fetchActivitiesSort = (sortOption) => {
      setActivities((prevActivities) => {
        const unflaggedActivities = prevActivities.filter(
          (activity) => !activity.isFlagged
        ); // Filter out flagged activities

        const sortedActivities = [...unflaggedActivities];
        if (sortOption === "price") {
          sortedActivities.sort((a, b) => a.price - b.price); // Sort by price
        } else if (sortOption === "rating") {
          sortedActivities.sort((a, b) => b.rating - a.rating); // Sort by rating
        }

        return sortedActivities;
      });
    };

    fetchActivitiesSort(sortBy);
  }, [sortBy]);

  useEffect(() => {
    fetchActivities(); // Fetch activities once on component mount
  }, []);

  const isBookedByUser = (activity) => {
    return activity.bookedBy && activity.bookedBy.includes(user?.username);
  };

  const handleFilterView = () => {
    setShowFilters((prevShowFilters) => !prevShowFilters);
    setShowSort(false);
  };

  const handleSortView = () => {
    setShowSort((prevShowSort) => !prevShowSort);
    setShowFilters(false);
  };


  // Function to handle booking
  /*const handleBooking = async (activityName, activityPrice) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : null;
  if (!username) {
      alert("You must be logged in to book an activity.");
      return;
  }

  try {
      const response = await axios.post("http://localhost:3002/activities/book-activity", {
          name: activityName,
          username,
      });
      alert(response.data.message);
      setActivities(prevActivities => 
          prevActivities.map(activity => 
              activity.name === activityName ? { ...activity, bookingOpen: false } : activity
          )
      );
  } catch (error) {
      console.error("Error booking activity:", error);
      alert("Failed to book activity. Please check your wallet balance and try again.");
  }
};*/

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
      <CustomNavbar />
      <div className="container-fluid">
      <div className="container d-flex flex-row w-100 justify-content-end align-items-center mt-3">
          {/* Filter Button */}
          <div className="d-flex flex-row justify-self-end">
            <svg
              onClick={handleSortView}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-sort-down me-2"
              viewBox="0 0 16 16 "
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
              onClick={handleFilterView}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              style={{
                fill: "#4ed4b7",
                cursor: "pointer",
                transition: "transform 0.3s ease",
              }}
              viewBox="0 0 16 16"
            >
              <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />
            </svg>
          </div>
        </div>

        <div className="d-flex align-items-center">
          {/* Filter menu */}
          {showFilters && (
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
                        <label>Category:</label>
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
                        </select>

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

                        <label>Rating:</label>
                        <div className="flex items-center gap-3">
                          <div className="flex-grow max-w-[200px]">
                            <Slider
                              min={0}
                              max={5}
                              step={0.1}
                              value={rating}
                              onChange={(value) => setRating(value)}
                              trackStyle={{ backgroundColor: "#5ddec2" }}
                              railStyle={{ backgroundColor: "#e0e0e0" }}
                              handleStyle={{
                                backgroundColor: "#5ddec2",
                                border: "none",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                height: 16,
                                width: 16,
                                marginTop: -7,
                              }}
                            />
                          </div>
                          <span className="font-medium text-gray-700">
                            {Number(rating).toFixed(1)}
                          </span>
                        </div>

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
                  <div className="d-flex align-items-center w-100">
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
          {activities
        .filter(activity => !activity.isFlagged) // Filter out flagged activities
        .map((activity, index) => (
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
                          onClick={() => navigate(`/activity-guest/${activity._id}`)}
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
                            {activity.tags.join(", ")}
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

export default ActivityGuest;
