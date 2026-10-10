import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewSavedItineraries = () => {
  const [itineraries, setItineraries] = useState([]); // State for saved itineraries
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch saved itineraries
  const fetchSavedItineraries = async () => {
    const user = JSON.parse(localStorage.getItem("user")); // Get the logged-in user's info
    const touristId = user ? user._id : null;

    if (!touristId) {
      setError("You must be logged in to view your saved itineraries.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3002/api/bookmark/tourist/${touristId}?type=itinerary`
      );
      if (response.data && response.data.bookmarks) {
        setItineraries(response.data.bookmarks); // Save the bookmarks to state
      } else {
        setError("No saved itineraries found.");
      }
    } catch (error) {
      console.error("Error fetching saved itineraries:", error);
      setError("Failed to fetch saved itineraries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedItineraries(); // Fetch saved itineraries when the component loads
  }, []);

  if (loading) return <div>Loading saved itineraries...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2>Your Saved Itineraries</h2>
      {itineraries.length === 0 ? (
        <p>No itineraries have been saved yet.</p>
      ) : (
        <ul>
          {itineraries.map((bookmark, index) => {
            const itinerary = bookmark.event || {}; // Safely access the event details
            return (
              <li
                key={index}
                style={{
                  marginBottom: "20px",
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h3 style={{ color: "#007bff" }}>
                  {itinerary.Itinerary_Name || "Unnamed Itinerary"}
                </h3>
                <p><strong>Tour Guide Name:</strong> {itinerary.tourGuideName || "N/A"}</p>
                <p><strong>Activities:</strong> {itinerary.activities?.join(", ") || "N/A"}</p>
                <p>
                  <strong>Preferences:</strong>{" "}
                  {itinerary.preferences?.length ? itinerary.preferences.join(", ") : "N/A"}
                </p>
                <p>
                  <strong>Locations to Visit:</strong>{" "}
                  {itinerary.locationToBeVisited?.join(", ") || "N/A"}
                </p>
                <p><strong>Timeline:</strong> {itinerary.timeline || "N/A"}</p>
                <p><strong>Duration of Activity:</strong> {itinerary.durationOfActivity || "N/A"} hours</p>
                <p><strong>Language:</strong> {itinerary.languageOfTour || "N/A"}</p>
                <p><strong>Accessibility:</strong> {itinerary.accessibility || "N/A"}</p>
                <p><strong>Pickup Location:</strong> {itinerary.pickupLocation || "N/A"}</p>
                <p><strong>Dropoff Location:</strong> {itinerary.dropoffLocation || "N/A"}</p>
                <p><strong>Price:</strong> {itinerary.price ? `${itinerary.price} USD` : "N/A"}</p>
                <p>
                  <strong>Date & Time:</strong>{" "}
                  {itinerary.date_time
                    ? new Date(itinerary.date_time).toLocaleDateString()
                    : "N/A"}
                </p>
                <p><strong>Rating:</strong> {itinerary.rating || "N/A"}/5</p>
                <p>
                  <strong>Comments:</strong>{" "}
                  {itinerary.comments?.length ? itinerary.comments.join(", ") : "N/A"}
                </p>
                <p><strong>Is Active:</strong> {itinerary.active ? "Yes" : "No"}</p>
                <p><strong>Is Flagged:</strong> {itinerary.isFlagged ? "Yes" : "No"}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ViewSavedItineraries;
