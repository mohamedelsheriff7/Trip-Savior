import React, { useState, useEffect } from "react";
import axios from "axios";
import CurrencySelector from "./CurrencySelector"; // Import CurrencySelector component
import ShareLink from "./ShareLink"; // Import the ShareLink component


import { useNavigate } from "react-router-dom"; // Import useNavigate


const Itineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState('USD'); // Currency state
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Add this line

  
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
      const itinerariesData = response.data;

      // Convert prices based on the selected currency
      const exchangeRateResponse = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
      const exchangeRate = exchangeRateResponse.data.rates[currency] || 1;

      const updatedItineraries = itinerariesData.map((itinerary) => ({
        ...itinerary,
        price: (itinerary.price * exchangeRate).toFixed(2), // Convert price to selected currency
      }));

      setItineraries(updatedItineraries);
    } catch (error) {
      setError("Error fetching itineraries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, [budget, date, preferences, language, sortBy, currency]); // Added currency to dependencies

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

  const [isBooking, setIsBooking] = useState(false);

  const handleItineraryBooking = async (itineraryName) => {
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
  };
  
  
  const handleNotifyRequest = async (itineraryId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.username : null;
  
    if (!username) {
      alert("You must be logged in to request notifications.");
      return;
    }
  
    try {
      await axios.post(`http://localhost:3002/itineraries/${itineraryId}/notify`, {
        username,
        email: user.email, // Assuming user's email is stored in localStorage
      });
      alert("You will be notified when this itinerary starts taking bookings.");
    } catch (error) {
      console.error("Error requesting notification:", error);
      alert("Failed to request notification. Please try again.");
    }
  };
  
  
  
  
  
  
  

  if (loading) return <div>Loading itineraries...</div>;
  if (error) return <div>{error}</div>;

  const filteredItineraries = itineraries.filter(itinerary => {
    return (
      (itinerary.active === false && itinerary.booked === true) || // Show if active is false and booked is true
      (itinerary.active === true && itinerary.booked === true) || // Show if active is true and booked is true
      (itinerary.active === true && itinerary.booked === false)   // Show if active is true and booked is false
    );
  });


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
      if (error.response && error.response.status === 400 && error.response.data.message === "Event already bookmarked") {
        alert("This itinerary is already bookmarked.");
      } else {
        console.error("Error bookmarking itinerary:", error);
        alert("Failed to bookmark itinerary. Please try again.");
      }
    }
  };
  
  

  
  

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
      
      <button
  onClick={() => navigate("/viewsaveditineraries")} // Redirect to the Saved Itineraries page
  style={{
    marginBottom: "20px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  }}
>
  View Saved Itineraries
</button>


      {/* Currency Selector */}
      <CurrencySelector selectedCurrency={currency} onCurrencyChange={setCurrency} />

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
            style={selectStyle}
            multiple
            value={preferences}
            onChange={handlePreferenceChange}
          >
            {availablePreferences.map((preference) => (
              <option key={preference} value={preference}>
                {preference}
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
          <label style={labelStyle}>Sort by:</label>
          <select
            style={selectStyle}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Select sorting option</option>
           
            
            
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {/* Display Filtered Itineraries */}
      <ul style={itineraryListStyle}>
        {nonFlaggedItineraries.map((itinerary) => {
          const user = JSON.parse(localStorage.getItem("user"));
          const username = user ? user.username : null;
          const isBookedByUser = itinerary.bookedBy.includes(username);

          return (
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
                  <strong>Price:</strong> {itinerary.price || 'N/A'}  {currency}
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

                {/* Add the ShareLink component here for each itinerary */}
              <ShareLink type="itinerary" id={itinerary._id} />
              


                {/* Bookmark Button */}
                 <button
                   onClick={() => handleBookmark(itinerary)}
                   style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#ffc107",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                   cursor: "pointer",
                   }}
                 >
                   Bookmark
                 </button>

                <button
                onClick={() => handleItineraryBooking(itinerary.Itinerary_Name)}
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  fontSize: "16px",
                  backgroundColor: isBookedByUser ? "#6c757d" : "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: isBookedByUser ? "not-allowed" : "pointer",
                }}
                disabled={isBookedByUser} // Disable if already booked
              >
                {isBookedByUser ? "Booked" : "Book Now"}
              </button>

              {!itinerary.booked && (
              <button onClick={() => handleNotifyRequest(itinerary._id)}>
                Notify Me
              </button>
            )}

              
              </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Itineraries;
