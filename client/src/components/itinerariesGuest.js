import React, { useState, useEffect } from "react";
import axios from "axios";

const Itineraries2 = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");
  const [preferences, setPreferences] = useState([]);
  const [language, setLanguage] = useState("");
  const [sortBy, setSortBy] = useState("");

  // List of available preferences
  const availablePreferences = [
    "historic areas",
    "beaches",
    "family friendly",
    "shopping",
    "budget friendly",
  ];

  // Fetch itineraries based on filters
  
  const fetchItineraries = async () => {
    setLoading(true);
    let queryParams = [];

    // Build query parameters based on user input
    if (budget) queryParams.push(`budget=${budget}`);
    if (date) queryParams.push(`date=${date}`);
    if (preferences.length > 0) queryParams.push(`preferences=${preferences.join(",")}`);
    if (language) queryParams.push(`language=${language}`);
    if (sortBy) queryParams.push(`sortBy=${sortBy}`);

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    try {
      const response = await axios.get(`http://localhost:3002/itineraries-filter${queryString}`);
      setItineraries(response.data);
    } catch (error) {
      setError("Error fetching itineraries.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  fetchItineraries();
}, [budget, date, preferences, language, sortBy]);

  // Handle preference selection from dropdown
  const handlePreferenceChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setPreferences(selectedOptions);
  };

  // Function to sort itineraries
  const sortItineraries = (itineraries) => {
    let sortedItineraries = [...itineraries]; // Create a copy to avoid mutating the original

    if (sortBy === "price") {
      sortedItineraries.sort((a, b) => a.price - b.price); // Sort by price (low to high)
    } else if (sortBy === "rating") {
      sortedItineraries.sort((a, b) => b.rating - a.rating); // Sort by rating (high to low)
    }
    return sortedItineraries; // Return sorted itineraries
  };

  //const [isBooking, setIsBooking] = useState(false);

  /*const handleItineraryBooking = async (itineraryName) => {
    const user = JSON.parse(localStorage.getItem("user")); // Get the logged-in user details
    const username = user ? user.username : null;
  
    if (!username) {
      alert("You must be logged in to book an itinerary.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3002/itineraries/book-itinerary", {
        Itinerary_Name: itineraryName,
        username, // Include username in the request
      });
      
      alert(response.data.message);
      setItineraries(prevItineraries => 
        prevItineraries.map(itinerary => 
          itinerary.Itinerary_Name === itineraryName ? { ...itinerary, booked: true } : itinerary
        )
      );
    } catch (error) {
      console.error("Error booking itinerary:", error);
      alert("Failed to book itinerary. Please try again.");
    }
  };*/

  const filteredItineraries = itineraries.filter(itinerary => {
    return (
      (itinerary.active === false && itinerary.booked === true) || // Show if active is false and booked is true
      (itinerary.active === true && itinerary.booked === true) || // Show if active is true and booked is true
      (itinerary.active === true && itinerary.booked === false)   // Show if active is true and booked is false
    );
  });
  

  // Styles
  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  };

  const headerStyle = {
    textAlign: "center",
    color: "#343a40",
    marginBottom: "30px",
    fontSize: "2rem",
    fontWeight: "600",
  };

  const filterContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  };

  const filterSectionStyle = {
    flex: "1",
    marginRight: "10px",
  };

  const labelStyle = {
    display: "block",
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "5px",
    color: "#495057",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ced4da",
    fontSize: "16px",
    marginBottom: "15px",
  };

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
  };

  const itineraryListStyle = {
    listStyle: "none",
    padding: 0,
  };

  const itineraryItemStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  };

  const itineraryTitleStyle = {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#007bff",
    marginBottom: "10px",
  };

  const itineraryDetailStyle = {
    fontSize: "1rem",
    color: "#495057",
    marginBottom: "10px",
  };

  const itineraryPriceStyle = {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: "10px",
  };

  if (loading) return <div style={containerStyle}>Loading itineraries...</div>;
  if (error) return <div style={containerStyle}>{error}</div>;

  // Sort itineraries based on selected sort option
  const sortedItineraries = sortItineraries(filteredItineraries);
  const nonFlaggedItineraries = sortedItineraries.filter(itinerary => !itinerary.isFlagged);


  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Itineraries</h2>

      {/* Filter Section */}
      <div style={filterContainerStyle}>
        <div style={filterSectionStyle}>
          <label style={labelStyle}>Budget:</label>
          <input
            type="text"
            style={inputStyle}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter budget"
          />
        </div>
        <div style={filterSectionStyle}>
          <label style={labelStyle}>Date:</label>
          <input
            type="date"
            style={inputStyle}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div style={filterSectionStyle}>
          <label style={labelStyle}>Preferences:</label>
          <select
            multiple
            style={selectStyle}
            onChange={handlePreferenceChange}
          >
            {availablePreferences.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
        </div>
        <div style={filterSectionStyle}>
          <label style={labelStyle}>Language:</label>
          <input
            type="text"
            style={inputStyle}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Enter language"
          />
        </div>
        <div style={filterSectionStyle}>
          <label style={labelStyle}>Sort By:</label>
          <select
            style={selectStyle}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Select Sorting Option</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {/* Display Filtered Itineraries */}
      <ul style={itineraryListStyle}>
        {nonFlaggedItineraries.length > 0 ? (
          nonFlaggedItineraries.map((itinerary) => (
            // Add language filter
            (itinerary.languageOfTour && itinerary.languageOfTour.includes(language)) && (
              <li key={itinerary._id} style={itineraryItemStyle}>
                <h3 style={itineraryTitleStyle}>{itinerary.Itinerary_Name || 'N/A'}</h3>
                <p style={itineraryDetailStyle}>
                  <strong>Tour Guide ID:</strong> {String(itinerary.tourGuideId) || 'N/A'}
                </p>
                <p style={itineraryDetailStyle}>
                  <strong>Timeline:</strong> {itinerary.timeline?.text || 'No timeline provided'}
                </p>
                <p style={itineraryDetailStyle}>
                  <strong>Duration of Activity:</strong> {itinerary.durationOfActivity || 'N/A'} hours
                </p>
                <p style={itineraryDetailStyle}>
                  <strong>Language of Tour:</strong> {typeof itinerary.languageOfTour === 'object' ? itinerary.languageOfTour.name : itinerary.languageOfTour || 'N/A'}
                </p>
                <p style={itineraryDetailStyle}>
                  <strong>Location to be Visited:</strong> {itinerary.locationToBeVisited || 'N/A'}
                </p>
                <p style={itineraryPriceStyle}>
                  <strong>Price:</strong> ${itinerary.price || 'N/A'}
                </p>
                <p style={itineraryDetailStyle}>
                  <strong>Date & Time:</strong> {itinerary.date_time ? new Date(itinerary.date_time).toLocaleString() : 'N/A'}
                </p>
                <p style={itineraryDetailStyle}>
                  <strong>Number of Travelers:</strong> {itinerary.numberOfTravelers || 'N/A'}
                </p>
                <p style={itineraryDetailStyle}>
                  <strong>Rating:</strong> {itinerary.rating !== undefined ? itinerary.rating : 'N/A'}
                </p>
               
              </li>
            )
          ))
        ) : (
          <p>No itineraries found.</p>
        )}
      </ul>
    </div>
  );
};

export default Itineraries2;
