import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewSavedActivities = () => {
  const [savedActivities, setSavedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch bookmarked activities
  const fetchSavedActivities = async () => {
    const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user info
    const touristId = user ? user._id : null;
    console.log("touristId", touristId);

    if (!touristId) {
      setError("You must be logged in to view your saved activities.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3002/api/bookmark/tourist/${touristId}?type=activities`
      );
      if (response.data && response.data.bookmarks) {
        setSavedActivities(response.data.bookmarks); // Save bookmarks to state
      } else {
        setError("No saved activities found.");
      }
    } catch (error) {
      console.error("Error fetching saved activities:", error);
      setError("Failed to fetch saved activities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedActivities(); // Fetch saved activities when the component loads
  }, []);

  if (loading) return <div>Loading saved activities...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "'Segoe UI', sans-serif" }}>
      <h2>Your Saved Activities</h2>
      {savedActivities.length === 0 ? (
        <p>No activities have been saved yet.</p>
      ) : (
        <ul>
          {savedActivities.map((bookmark) => (
            <li key={bookmark._id}>
              <h3>{bookmark.event.name || "Unnamed Activity"}</h3>
              <p>Location: {bookmark.event.location}</p>
              <p>Date: {new Date(bookmark.event.date).toDateString()}</p>
              <p>Time: {bookmark.event.time}</p>
              <p>Price: {bookmark.event.price} USD</p>
              <p>Category: {bookmark.event.category}</p>
              <p>Rating: {bookmark.event.rating}/5</p>
              <p>Special Discounts: {bookmark.event.specialDiscounts || "N/A"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewSavedActivities;

