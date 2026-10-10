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
import TouristNavbar from "./TouristNavbar";
import ShareLinkItinerary from "../ShareLinkItinerary"; // Import the ShareLink component
import ShareLink from "../ShareLink"; // Import the ShareLink component
import Select from "react-select";

const TouristItinerary = () => {
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

  const [modalShow, setModalShow] = useState(false);
  const [modalType, setModalType] = useState("");

  const [addresses, setAddresses] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cart, setCart] = useState([]); // Example cart state
  const [bookingitinerary, setBookingitinerary] = useState({ price: 1 });
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : null;
  const [totalPrice, setTotalPrice] = useState(
    bookingitinerary.price * (1 - discount / 100) + 5
  );
  const handleBookWithCard = () => {
    // Add address logic
  };
  const handleBookWithWallet = () => {
    // Add address logic
  };
  const handleBookmark = async (itinerary) => {
    const user = JSON.parse(localStorage.getItem("user")); // Ensure a user is logged in
    const touristId = user ? user._id : null;

    if (!touristId) {
      alert("You must be logged in to bookmark an itinerary.");
      return;
    }

    try {
      await axios.post("http://localhost:3002/api/bookmark/add", {
        touristId: touristId,
        eventId: itinerary._id,
        type: "itinerary",
      });
      alert("Itinerary bookmarked successfully!");
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === "Event already bookmarked"
      ) {
        alert("This itinerary is already bookmarked.");
      } else {
        console.error("Error bookmarking itinerary:", error);
        alert("Failed to bookmark itinerary. Please try again.");
      }
    }
  };

  const handleRemoveBookmark = async (itinerary) => {
    const user = JSON.parse(localStorage.getItem("user")); // Ensure a user is logged in
    const touristId = user ? user._id : null;

    if (!touristId) {
      alert("You must be logged in to remove a bookmark.");
      return;
    }

    try {
      await axios.post("http://localhost:3002/api/bookmark/remove", {
        touristId: touristId,
        eventId: itinerary._id,
        type: "itinerary",
      });
      alert("Itinerary removed from bookmarks successfully!");
    } catch (error) {
      if (
        error.response &&
        error.response.status === 404 &&
        error.response.data.message === "Bookmark not found"
      ) {
        alert("This itinerary is not bookmarked.");
      } else {
        console.error("Error removing bookmark:", error);
        alert("Failed to remove bookmark. Please try again.");
      }
    }
  };

  const handleAddAddress = () => {
    // Add address logic
  };

  const handleAddressChange = (e, id) => {
    // Handle address change logic
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "card") {
      handleBookWithCard();
    } else {
      handleBookWithWallet();
    }
  };

  const handleOpenModal = (itinerary) => {
    setBookingitinerary(itinerary);
    setTotalPrice(itinerary.price * (1 - discount / 100) + 5);
    setModalShow(true);
  };

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
        // If query is not empty, modify the URL for search
        if (query) {
          const url = `http://localhost:3002/search?name=${encodeURIComponent(
            query
          )}&category=${encodeURIComponent(query)}&tag=${encodeURIComponent(
            query
          )}`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Failed to fetch search results");
          }

          const data = await response.json();
          setItineraries(data.itineraries);
        } else {
          fetchItineraries();
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 300); // Delay of 300ms (adjust as needed)

    setSearchTimeout(timeout);
  };

  const handleSliderChange = (values) => {
    setStartPrice(values[0]);
    setEndPrice(values[1]);
  };

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

  const handleItineraryBooking = async (itineraryName) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.username;

    if (!username) {
      alert("You must be logged in to book an itinerary.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3002/itineraries/book-itinerary",
        {
          Itinerary_Name: itineraryName,
          username,
        }
      );

      alert(response.data.message);
      setItineraries((prev) =>
        prev.map((itinerary) =>
          itinerary.Itinerary_Name === itineraryName
            ? { ...itinerary, booked: true }
            : itinerary
        )
      );
    } catch (error) {
      alert("Failed to book itinerary. Please try again.");
    }
  };
  const handlePromoCode = async (promoCode) => {
    try {
      const response = await axios.post(
        "http://localhost:3002/validatePromoCode",
        {
          promoCode,
          username,
        }
      );
      console.log(response);
      if (response.status !== 200) {
        alert("invalid Promo Code");
        return;
      }
      setDiscount(response.data.discount);
      setTotalPrice(
        bookingitinerary.price * (1 - response.data.discount / 100) + 5
      );
      alert("PromoCode Discount Added!");
    } catch (error) {
      console.error("Error adding promoCode:", error.message);
      alert("Invalid Promo Code");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default form submission
      handlePromoCode(promoCode);
    }
  };

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

  const handleFilter = (e) => {
    e.preventDefault();
    fetchItineraries();
  };

  const closeModal = () => {
    setBookingitinerary({});
    setModalShow(false);
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
    setSearchTerm("");
  };

  useEffect(() => {
    fetchItineraries();
  }, [budget, date, preferences, language, sortBy]);

  if (error) return <div>{error}</div>;

  const filteredItineraries = itineraries.filter(
    (itinerary) =>
      (itinerary.active && itinerary.booked) ||
      (!itinerary.active && itinerary.booked) ||
      !itinerary.isFlagged
  );

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
      <TouristNavbar />
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          {/* Filter menu */}
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

        <div className="d-flex justify-content-between mt-3">
          <div></div>
          <div className="input-group rounded mx-3" style={{ width: "40%" }}>
            <input
              type="search"
              className="form-control rounded d-flex me-2"
              placeholder="Search by name or tag"
              aria-label="Search"
              aria-describedby="search-addon"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ borderColor: "#5ddec2", borderWidth: "2px" }}
            />
            <svg
              className="searchProductBar me-2 align-self-center"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              style={{
                fill: "#4ed4b7", // Set the icon color
                cursor: "pointer", // Make it clickable if necessary
                transition: "transform 0.3s ease", // Add transition for hover effect
              }}
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </div>

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
                        ? `url(http://localhost:3002/${itinerary.pictures[0].replace(
                            /\\/g,
                            "/"
                          )})`
                        : "none", // Fallback if there's no image path
                    }}
                  >
                    <div className="itinerary-title d-flex justify-content-between align-items-end w-100">
                      <div className="d-flex flex-column justify-content-start px-2 pb-2">
                        <div className="d-flex flex-row align-items-center">
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
                            fill="white"
                            class="bi bi-bookmark mb-1 ms-2"
                            viewBox="0 0 16 16"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleBookmark(itinerary)}
                          >
                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
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
                            navigate(`/itinerary/${itinerary._id}`)
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
                    <div className="d-flex flex-column text-start w-50">
                      <button
                        className="btn btn-lg btn-more px-4 mt-2 flex-grow-1 me-2 mb-1"
                        onClick={() => handleOpenModal(itinerary)}
                      >
                        Book
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
                maxWidth: "800px",
                width: "90%",
                margin: "0 auto",
              }}
            >
              <div
                className="modal-content"
                style={{
                  maxHeight: "90vh",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title">Checkout My Order</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => closeModal()}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Payment Options */}
                  <div
                    className="payment-method-section"
                    style={{ marginTop: "20px", width: "100%" }}
                  >
                    <div
                      className="container"
                      style={{ width: "100%", padding: "0" }}
                    >
                      <div
                        className="payment-method-options"
                        style={{ width: "100%" }}
                      >
                        <div
                          className="payment-option-container"
                          style={{ width: "100%" }}
                        >
                          <div
                            className="payment-method-box"
                            style={{ width: "100%" }}
                          >
                            <label
                              htmlFor="wallet"
                              className="payment-method-label"
                            >
                              Wallet
                            </label>
                            <input
                              type="radio"
                              name="payment-method"
                              value="wallet"
                              checked={paymentMethod === "wallet"}
                              onChange={handlePaymentMethodChange}
                              className="payment-radio-button"
                              style={{ marginLeft: "auto" }}
                            />
                          </div>
                        </div>
                        <div
                          className="payment-option-container"
                          style={{ width: "100%" }}
                        >
                          <div
                            className="payment-method-box"
                            style={{ width: "100%" }}
                          >
                            <label
                              htmlFor="card"
                              className="payment-method-label"
                            >
                              Credit Card
                            </label>
                            <input
                              type="radio"
                              name="payment-method"
                              value="card"
                              checked={paymentMethod === "card"}
                              onChange={handlePaymentMethodChange}
                              className="payment-radio-button"
                              style={{ marginLeft: "auto" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Section */}
                  <div className="summary-container">
                    <div>
                      <h5>Summary</h5>
                    </div>
                    <hr />
                    {/* Display only the first itinerary (or your selected item) */}
                    {filteredItineraries.length > 0 && (
                      <div className="row">
                        <div className="col">
                          {bookingitinerary.Itinerary_Name}
                        </div>
                        <div className="col text-right">
                          &euro;{bookingitinerary.price}
                        </div>
                      </div>
                    )}

                    {/* Promo Code Field (Leftmost) */}
                    <div style={{ marginTop: "10px" }}>
                      <h5>Promo Code</h5>
                      <input
                        type="text"
                        placeholder="Enter your promo code"
                        className="form-control"
                        style={{ width: "100%", marginBottom: "10px" }}
                        onChange={(e) => setPromoCode(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                    </div>

                    <div className="row">
                      <div className="col">TOTAL PRICE</div>
                      <div className="col text-right">
                        &euro;
                        {totalPrice}
                      </div>
                    </div>

                    {/* Full Width Button */}
                    <button
                      className="btn btn-lg btn-buy px-4 mt-2 me-2 flex-grow-1 mb-1 w-100"
                      onClick={handlePlaceOrder}
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TouristItinerary;
