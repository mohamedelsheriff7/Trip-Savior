import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import CurrencySelector from "./CurrencySelector"; // Ensure to import the CurrencySelector component
import ShareLink from "./ShareLink"; // Import the ShareLink component



const ActivityF = () => {
  const [activities, setActivities] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookedActivities, setBookedActivities] = useState([]); // Track booked activities
  const [message, setMessage] = useState(""); // Loading state
  const navigate = useNavigate(); // Initialize navigate
  const [currency, setCurrency] = useState('USD'); // Default to USD
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("http://localhost:3002/activities");
        if (response.data) {
          const filtered = response.data.filter((activity) => activity.isArchived !== true).map((activity) => ({
            ...activity,
            convertedPrice: activity.price, 
          }));
          setActivities(filtered);
          setFilteredActivities(filtered);
        } else {
          setError("No activities found.");
        }
      } catch (err) {
        setError("Error fetching activities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const handleCurrencyChange = async (selectedCurrency) => {
    setCurrency(selectedCurrency);

    try {
      const exchangeRateResponse = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
      const exchangeRate = exchangeRateResponse.data.rates[selectedCurrency] || 1;

      const updatedActivities = activities.map((activity) => ({
        ...activity,
        convertedPrice: (activity.price * exchangeRate).toFixed(2), 
      }));

      setFilteredActivities(updatedActivities);
    } catch (err) {
      console.error("Failed to fetch exchange rate", err);
    }
  };


  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSortBy(selectedSort);

    let sortedActivities = [...filteredActivities];
    if (selectedSort === "price") {
      sortedActivities.sort((a, b) => a.convertedPrice - b.convertedPrice);  // Sort by price
    } else if (selectedSort === "rating") {
      sortedActivities.sort((a, b) => b.rating - a.rating);  // Sort by rating
    }
    setFilteredActivities(sortedActivities);
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
      const response = await axios.post("http://localhost:3002/activities/book-activity", {
        name: activityName,
        username,
      });

      alert(response.data.message);
      setActivities(prevActivities => 
        prevActivities.map(activity => 
          activity.name === activityName 
            ? { ...activity, bookedBy: [...(activity.bookedBy || []), username] }
            : activity
        )
      );
    } catch (error) {
      console.error("Error booking activity:", error.message);
      alert("Failed to book activity. Please try again.");
    }
  };

  const handleNotifyRequest = async (activityId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.username : null;

    if (!username) {
      alert("You must be logged in to request notifications.");
      return;
    }

    try {
      await axios.post(`http://localhost:3002/activities/${activityId}/notify`, {
        username,
        email: user.email, // Assuming user's email is stored in localStorage
      });
      alert("You will be notified when this activity starts taking bookings.");
    } catch (error) {
      console.error("Error requesting notification:", error);
      alert("Failed to request notification. Please try again.");
    }
  };


  const handleActivityBookmark = async (activity) => {
    const user = JSON.parse(localStorage.getItem("user")); // Ensure a user is logged in
    const touristId = user ? user._id : null;
  
    if (!touristId) {
      alert("You must be logged in to bookmark an activity.");
      return;
    }
  
    try {
      // Direct API call for activity bookmarking
      await axios.post("http://localhost:3002/api/bookmark/add", {
        touristId: touristId,
        eventId: activity._id,
        type: "activities",
      });
      alert("Activity bookmarked successfully!");
    }  catch (error) {
      // Check if the error is because it's already bookmarked
      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message === "Event already bookmarked") {
          alert("This activity is already bookmarked.");
        } else {
          alert(error.response.data.message); // Handle other server messages
        }
      } else {
        console.error("Error bookmarking activity:", error);
        alert("Failed to bookmark activity. Please try again.");
      }
    }
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
    width: "250px", // Set a fixed width for consistency
  };

  const activitiesListStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  };

  const activityCardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s",
    textAlign: "center",
  };

  const activityCardHoverStyle = {
    ...activityCardStyle,
    transform: "scale(1.05)",
  };

  const titleStyle = {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#007bff",
    marginBottom: "15px",
  };

  const detailStyle = {
    fontSize: "1rem",
    color: "#495057",
    margin: "10px 0",
  };

  const priceStyle = {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#28a745",
    marginTop: "10px",
  };

  if (loading) return <div style={containerStyle}>Loading activities...</div>;
  if (!loading && activities.length === 0) return <div style={containerStyle}>No activities available at the moment.</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Activities</h2>

      <button
        onClick={() => navigate("/viewsavedactivities")}
        style={{
        marginBottom: "20px",
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
       }}
     >
        View Saved Activities
     </button>


      {/* Currency Selector */}
      <CurrencySelector onCurrencyChange={handleCurrencyChange} />

      {/* Dropdown for sorting */}
      <div style={sortContainerStyle}>
        <label>
          <select
            style={selectStyle}
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="">Sort activities by</option>
            <option value="price">Price (Low to High)</option>
            <option value="rating">Rating (High to Low)</option>
          </select>
        </label>
      </div>

      <div style={activitiesListStyle}>
        {filteredActivities.filter(activity => !activity.isFlagged).map((activity) => {
          const user = JSON.parse(localStorage.getItem("user"));
          const username = user ? user.username : null;
          const isBookedByUser = activity.bookedBy?.includes(username);

          return (
            <div
              key={activity._id}
              style={activityCardStyle}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <h3 style={titleStyle}>{activity.name}</h3>
              <p style={detailStyle}>
                <strong>Location:</strong> {activity.location}
              </p>
              <p style={detailStyle}>
                <strong>Date:</strong> {new Date(activity.date).toDateString()}
              </p>
              <p style={detailStyle}>
                <strong>Time:</strong> {activity.time}
              </p>
              <p style={priceStyle}>
            <strong>Price:</strong>{" "}
            {activity.convertedPrice
              ? `${activity.convertedPrice} ${currency}`
              : `${activity.price} USD (Conversion Failed)`}
            </p>
              <p style={detailStyle}>
                <strong>Rating:</strong> {activity.rating}/5
              </p>
              <p style={detailStyle}>
                <strong>Category:</strong> {activity.category}
              </p>
              <p style={detailStyle}>
                <strong>Special Discounts:</strong> {activity.specialDiscounts || "N/A"}
              </p>

              <ShareLink type="activity" id={activity._id} />


               {/* Bookmark Button */}
                <button
                   onClick={() => handleActivityBookmark(activity)}
                    style={{
                    marginTop: "10px",
                    marginRight: "10px",
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
                onClick={() => handleBooking(activity.name)}
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
                disabled={isBookedByUser}
              >
                {isBookedByUser ? "Booked" : "Book Now"}
              </button>
              <button
                  onClick={() => handleNotifyRequest(activity._id)}
                  style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Notify Me
                </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityF;