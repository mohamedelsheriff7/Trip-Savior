import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ActivitiesList() {
  const [activities, setActivities] = useState([]);
  const [searchName, setSearchName] = useState(""); // State for the search input
  const [searchResult, setSearchResult] = useState(null); // Store result of searched activity
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all activities initially
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/wael/activities"
        ); // Replace with your actual backend URL
        setActivities(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching activities.");
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  // Handle search input change
  const handleInputChange = (e) => {
    setSearchName(e.target.value);
  };

  // Handle search by name
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearchResult(null); // Reset search result

    if (searchName.trim() === "") {
      setError("Please enter a name to search.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3002/wael/activities/${searchName}`
      );
      setSearchResult(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("Activity not found.");
      } else {
        setError("Error fetching activity.");
      }
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Activities List</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Search activity by name"
          value={searchName}
          onChange={handleInputChange}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>
          Search
        </button>
      </form>

      {/* Display loading or error */}
      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* Display search result if an activity is found */}
      {searchResult && (
        <div style={styles.card}>
          <h2>{searchResult.name}</h2>
          <p>
            <strong>Advertiser:</strong> {searchResult.advertiserUsername}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(searchResult.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Time:</strong> {searchResult.time}
          </p>
          <p>
            <strong>Location:</strong>{" "}
            {searchResult.location || "Not specified"}
          </p>
          <p>
            <strong>Price:</strong> ${searchResult.price}
          </p>
          <p>
            <strong>Category:</strong> {searchResult.category}
          </p>
          <p>
            <strong>Tags:</strong> {searchResult.tags.join(", ") || "None"}
          </p>
          {searchResult.specialDiscounts && (
            <p>
              <strong>Special Discounts:</strong>{" "}
              {searchResult.specialDiscounts}
            </p>
          )}
          <p>
            <strong>Rating:</strong> {searchResult.rating}/5
          </p>
          <p>
            <strong>Booking Open:</strong>{" "}
            {searchResult.bookingOpen ? "Yes" : "No"}
          </p>
        </div>
      )}

      {/* Display all activities if no search result */}
      {!searchResult && activities.length > 0 && (
        <div style={styles.gridContainer}>
          {activities.map((activity) => (
            <div key={activity._id} style={styles.card}>
              <h2>{activity.name}</h2>
              <p>
                <strong>Advertiser:</strong> {activity.advertiserUsername}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(activity.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {activity.time}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {activity.location || "Not specified"}
              </p>
              <p>
                <strong>Price:</strong> ${activity.price}
              </p>
              <p>
                <strong>Category:</strong> {activity.category}
              </p>
              <p>
                <strong>Tags:</strong> {activity.tags.join(", ") || "None"}
              </p>
              {activity.specialDiscounts && (
                <p>
                  <strong>Special Discounts:</strong>{" "}
                  {activity.specialDiscounts}
                </p>
              )}
              <p>
                <strong>Rating:</strong> {activity.rating}/5
              </p>
              <p>
                <strong>Booking Open:</strong>{" "}
                {activity.bookingOpen ? "Yes" : "No"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  searchForm: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
  },
  searchInput: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "250px",
    marginRight: "10px",
  },
  searchButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
  },
};
