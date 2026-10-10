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
import "../styles/HistoricalGuest.css";
import ShareLink from "./ShareLink"; // Import the ShareLink component
import backButtonImage from "../images/backbutton.png";
import TouristNavbar from "./Profile/TouristNavbar";

const TouristActivity = () => {
  const [activities, setActivities] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); // Loading state
  const navigate = useNavigate(); // Initialize navigate
  const [bookedActivities, setBookedActivities] = useState([]); // Track booked activities
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

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
      setActivities(response.data);
      const uniqueCategories = [
        ...new Set(activities.map((activity) => activity.category)),
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

  useEffect(() => {
    const fetchActivitiesSort = (sortOption) => {
      setActivities((prevActivities) => {
        const sortedActivities = [...prevActivities];
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
      console.log(response.data);
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Function to handle booking
  const handleBooking = async (activityName) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.username : null;

    if (!username) {
      alert("You must be logged in to book an activity.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3002/activities/book-activity",
        {
          name: activityName,
          username,
        }
      );

      alert(response.data.message);
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.name === activityName
            ? {
                ...activity,
                bookedBy: [...(activity.bookedBy || []), username],
              }
            : activity
        )
      );
    } catch (error) {
      console.error("Error booking activity:", error.message);
      alert("Failed to book activity. Please try again.");
    }
  };

  const isBookedByUser = (activity) => {
    return activity.bookedBy && activity.bookedBy.includes(user?.username);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
    // Clear the previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout
    const timeout = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch data from API with query for name, category, or tag
        const response = await fetch(
          `http://localhost:3002/search?name=${encodeURIComponent(
            query
          )}&category=${encodeURIComponent(query)}&tag=${encodeURIComponent(
            query
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await response.json();

        setActivities(data.activities);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 3000); // Delay of 300ms (adjust as needed)

    setSearchTimeout(timeout);
  };

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

  if (loading) return <div style={containerStyle}>Loading activities...</div>;
  if (!loading && activities.length === 0)
    return (
      <div style={containerStyle}>No activities available at the moment.</div>
    );

  //const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : null;
  //const isBookedByUser = activity.bookedBy?.includes(username);

  return (
    <>
      <TouristNavbar />
      <div className="container-fluid w-100">
        <div className="container pt-4">
          <div className="d-flex justify-content-between">
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
                        right: "0",
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

                            <label>Min. Date:</label>
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
                            />

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
          </div>

          <div style={containerStyle}>
            <div className="d-flex align-items-center justify-content-between">
              {/* Back Button */}
              <button
                onClick={() => window.history.back()}
                className=""
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <img
                  src={backButtonImage}
                  alt="Back to previous page"
                  style={{
                    width: "85px",
                    height: "85px",
                  }}
                  onClick={() => (window.location.href = "/")}
                />
              </button>

              {/* Search Bar */}
              <div
                className="input-group rounded mx-3"
                style={{ width: "40%" }}
              >
                <input
                  type="search"
                  className="form-control rounded"
                  placeholder="Search by name or category or tag"
                  aria-label="Search"
                  aria-describedby="search-addon"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{ borderColor: "#5ddec2", borderWidth: "2px" }}
                />
              </div>

              {/* Filter Button */}
              <button
                title="filter"
                className="filter ms-0"
                onClick={() => setShowFilters(!showFilters)}
                style={{ zIndex: 2 }}
              >
                <svg
                  fill="#000000"
                  width="800px"
                  height="800px"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19,2H5A3,3,0,0,0,2,5V6.17a3,3,0,0,0,.25,1.2l0,.06a2.81,2.81,0,0,0,.59.86L9,14.41V21a1,1,0,0,0,.47.85A1,1,0,0,0,10,22a1,1,0,0,0,.45-.11l4-2A1,1,0,0,0,15,19V14.41l6.12-6.12a2.81,2.81,0,0,0,.59-.86l0-.06A3,3,0,0,0,22,6.17V5A3,3,0,0,0,19,2ZM13.29,13.29A1,1,0,0,0,13,14v4.38l-2,1V14a1,1,0,0,0-.29-.71L5.41,8H18.59ZM20,6H4V5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1Z" />
                </svg>
              </button>
            </div>

            <h1 style={headerStyle}>Upcoming Activities</h1>

            {/* Dropdown for sorting */}
            <div style={sortContainerStyle}>
              <label>
                <select
                  style={selectStyle}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Sort activities by</option>
                  <option value="price">Price (Low to High)</option>
                  <option value="rating">Rating (High to Low)</option>
                </select>
              </label>
            </div>

            {activities
              .filter((activity) => !activity.isFlagged)
              .map((activity, index) => (
                <div className="row my-5" key={activity._id}>
                  {/* Alternate the order based on the index */}
                  {index % 2 === 0 ? (
                    <div className="card d-flex flex-row">
                      {/* Text First, Image Second */}
                      <div className="col-md-6 col-12 order-md-1 order-2 p-4">
                        <div className="ms-md-5 ps-lg-5 text-md-start text-center">
                          <h1 className="mb-0">{activity.name}</h1>
                          <h1 className="mb-0">
                            {activities.name}{" "}
                            <ShareLink
                              type="activity"
                              id={activity._id}
                            ></ShareLink>
                          </h1>
                          <div className="d-flex align-items-center">
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

                          <hr
                            className="d-md-block d-none"
                            style={{ width: "40%", color: "rgb(5, 5, 112)" }}
                          />

                          <div className="d-flex">
                            <p className="fw-bold me-1">Location:</p>
                            <p>{activity.location}</p>
                          </div>
                          <div className="d-flex">
                            <p className="fw-bold me-1">Date:</p>
                            <p>
                              {activity.date
                                ? new Date(activity.date).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                          <div className="d-flex">
                            <p className="fw-bold me-1">Category:</p>
                            <p>{activity.category}</p>
                          </div>
                          <div className="d-flex">
                            <p className="fw-bold me-1">Special Discounts:</p>
                            <p>{activity.specialDiscounts || "N/A"}</p>
                          </div>
                          <div className="d-flex">
                            <p className="fw-bold me-1">Price:</p>
                            <p>${activity.price}</p>
                          </div>
                          <button
                            onClick={() => handleBooking(activity.name)}
                            disabled={isBookedByUser(activity)} // Disable if booked by user
                            style={{
                              color: "white",
                              backgroundColor: isBookedByUser(activity)
                                ? "gray"
                                : "#5ddec2",
                              border: isBookedByUser(activity)
                                ? "none"
                                : "2px solid #5ddec2", // Remove border if booked
                              borderRadius: "0.5vw", // Same as border-radius
                              width: "30%",
                              margin: "auto",
                              cursor: isBookedByUser(activity)
                                ? "not-allowed"
                                : "pointer", // Add cursor change when disabled
                            }}
                          >
                            {isBookedByUser(activity) ? "Booked" : "Book Now"}
                          </button>
                        </div>
                      </div>
                      <div className="col-md-6 col-12 order-md-2 order-1 text-center align-content-center mb-md-0 mb-4">
                        {activity.pictures.length > 0 && (
                          <Swiper
                            modules={[Navigation, Pagination]}
                            navigation={{
                              nextEl: ".swiper-button-next",
                              prevEl: ".swiper-button-prev",
                            }}
                            pagination={{ clickable: true }}
                            spaceBetween={10}
                            slidesPerView={1}
                            style={swiperStyle}
                          >
                            {activity.pictures.map((picture, index) => (
                              <SwiperSlide key={index}>
                                <img
                                  className="img-square"
                                  src={picture}
                                  alt={`Activity ${activity.name} ${index + 1}`}
                                  style={{
                                    width: "75%",
                                    height: "300px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                  }}
                                />
                              </SwiperSlide>
                            ))}
                            <div
                              className="swiper-button-next"
                              style={arrowStyle}
                            ></div>
                            <div
                              className="swiper-button-prev"
                              style={arrowStyle}
                            ></div>
                          </Swiper>
                        )}
                      </div>
                      <hr />
                    </div>
                  ) : (
                    <div className="card d-flex flex-row p-4">
                      {/* Image First, Text Second */}
                      <div className="col-md-6 col-12 order-md-1 order-1 text-center align-content-center mb-md-0 mb-4">
                        {activity.pictures.length > 0 && (
                          <Swiper
                            modules={[Navigation, Pagination]}
                            navigation={{
                              nextEl: ".swiper-button-next",
                              prevEl: ".swiper-button-prev",
                            }}
                            pagination={{ clickable: true }}
                            spaceBetween={10}
                            slidesPerView={1}
                            style={swiperStyle}
                          >
                            {activity.pictures.map((picture, index) => (
                              <SwiperSlide key={index}>
                                <img
                                  src={picture}
                                  alt={`Activity ${activity.name} ${index + 1}`}
                                  style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                  }}
                                />
                              </SwiperSlide>
                            ))}
                            <div
                              className="swiper-button-next"
                              style={arrowStyle}
                            ></div>
                            <div
                              className="swiper-button-prev"
                              style={arrowStyle}
                            ></div>
                          </Swiper>
                        )}
                      </div>
                      <div className="col-md-6 col-12 order-md-2 order-2">
                        <div className="ms-md-5 ps-lg-5 text-md-start text-center">
                          <h1 className="mb-0">{activity.name}</h1>
                          <h1 className="mb-0">
                            {activities.name}{" "}
                            <ShareLink
                              type="activity"
                              id={activity._id}
                            ></ShareLink>
                          </h1>
                          <div className="d-flex align-items-center">
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

                          <hr
                            className="d-md-block d-none"
                            style={{ width: "40%", color: "rgb(5, 5, 112)" }}
                          />
                          <div className="d-flex">
                            <p className="fw-bold me-1">Location:</p>
                            <p>{activity.location}</p>
                          </div>
                          <div className="d-flex">
                            <p className="fw-bold me-1">Date:</p>
                            <p>
                              {activity.date
                                ? new Date(activity.date).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                          <div className="d-flex">
                            <p className="fw-bold me-1">Category:</p>
                            <p>{activity.category}</p>
                          </div>
                          <div className="d-flex">
                            <p className="fw-bold me-1">Special Discounts:</p>
                            <p>{activity.specialDiscounts || "N/A"}</p>
                          </div>
                          <div className="d-flex">
                            <p className="fw-bold me-1">Price:</p>
                            <p>${activity.price}</p>
                          </div>
                          <button
                            onClick={() => handleBooking(activity.name)}
                            disabled={isBookedByUser(activity)} // Disable if booked by user
                            style={{
                              color: "white",
                              backgroundColor: isBookedByUser(activity)
                                ? "gray"
                                : "#5ddec2",
                              border: isBookedByUser(activity)
                                ? "none"
                                : "2px solid #5ddec2", // Remove border if booked
                              borderRadius: "0.5vw", // Same as border-radius
                              width: "30%",
                              margin: "auto",
                              cursor: isBookedByUser(activity)
                                ? "not-allowed"
                                : "pointer", // Add cursor change when disabled
                            }}
                          >
                            {isBookedByUser(activity) ? "Booked" : "Book Now"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TouristActivity;
