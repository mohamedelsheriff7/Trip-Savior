import React, { useEffect, useState } from "react";
import axios from "axios";
import TagsFilter from "./filter"; // Import the TagsFilter component

const HistoricalPlacesPage = () => {
  const [places, setPlaces] = useState([]); // State to store historical places
  const [error, setError] = useState(""); // State to handle error messages
  const [loading, setLoading] = useState(true); // State to handle loading

  // Fetch all historical places with optional tag filters
  const fetchHistoricalPlaces = async (tags = "") => {
    setLoading(true);
    setError(""); // Clear any previous error message
    try {
      const response = await axios.get(
        "http://localhost:3002/filterHistoricalPlaces",
        { params: { tags } } // Pass tags as query parameter
      );
      setPlaces(response.data); // Save the fetched data
      setLoading(false); // Disable the loading state
    } catch (err) {
      setError("Error fetching historical places");
      setLoading(false); // Disable the loading state even if there's an error
    }
  };

  // Callback to handle the tag filter from the TagsFilter component
  const handleTagFilter = (tags) => {
    fetchHistoricalPlaces(tags); // Fetch places filtered by tags
  };

  // Fetch all places when the component mounts (without filters)
  useEffect(() => {
    fetchHistoricalPlaces();
  }, []);

  if (loading) {
    return <p>Loading historical places...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h1>All Historical Places</h1>

      {/* Render the TagsFilter component and pass handleTagFilter as the onFilter callback */}
      <TagsFilter onFilter={handleTagFilter} />

      {places.length > 0 ? (
        <ul>
          {places.map((place) => (
            <li key={place._id}>
              <h3>{place.name}</h3>
              <p>{place.description}</p>
              <p>Location: {place.location}</p>
              <p>Entry Fee (Foreign): {place.entryFeeForeign}</p>
              <p>Entry Fee (Native): {place.entryFeeNative}</p>
              <p>Opening Hours: {place.openingHours}</p>
              <p>Date: {new Date(place.date_time).toLocaleDateString()}</p>
              <div>
                <h4>Pictures:</h4>
                {place.pictures && place.pictures.length > 0 ? (
                  place.pictures.map((pic, index) => (
                    <img
                      key={index}
                      src={pic}
                      alt={`place-pic-${index}`}
                      style={{ width: "100px", height: "auto" }}
                    />
                  ))
                ) : (
                  <p>No pictures available</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No historical places found.</p>
      )}
    </div>
  );
};

export default HistoricalPlacesPage;
