// src/historicalPlaces.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import ShareLink from "./ShareLink"; // Import the ShareLink component


const HistoricalPlacess = () => {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTag, setSearchTag] = useState(""); // State for the search input
  const [tags, setTags] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3002/historical-places")
      .then((response) => {
        setHistoricalPlaces(response.data);
        setLoading(false);

        const allTags = new Set();
        response.data.forEach((place) => {
          place.tags.forEach((tag) => allTags.add(tag));
        });
        setTags(Array.from(allTags));
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching historical places.");
        setLoading(false);
      });
  }, []);

  const filteredPlaces = historicalPlaces.filter((place) => {
    return searchTag
      ? place.tags.some((tag) => tag.toLowerCase().includes(searchTag.toLowerCase()))
      : true; // If there's no search term, consider it a match
  });

  const containerStyle = {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "800px",
    margin: "20px auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const headingStyle = {
    textAlign: "center",
    color: "#343a40",
    marginBottom: "20px",
  };

  const searchBarStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  };

  const inputStyle = {
    padding: "10px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    width: "100%",
    maxWidth: "400px",
    fontSize: "16px",
  };

  const listStyle = {
    listStyleType: "none",
    padding: 0,
  };

  const itemStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "4px",
    padding: "15px",
    margin: "10px 0",
    boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)",
  };

  if (loading) return <div style={containerStyle}>Loading historical places...</div>;
  if (error) return <div style={containerStyle}>{error}</div>;

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Historical Places</h1>

      {/* Search Bar for Tag Name */}
      <div style={searchBarStyle}>
        <h3>Search by Tag:</h3>
        <input
          type="text"
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          placeholder="Enter tag name"
          style={inputStyle}
        />
      </div>

      <ul style={listStyle}>
        {filteredPlaces.map((place) => (
          <li key={place._id} style={itemStyle}>
            <h2>{place.name}</h2>
            <p><strong>Location:</strong> {place.location}</p>
            <p><strong>Description:</strong> {place.description}</p>
            <p><strong>Entry Fee (Foreign):</strong> ${place.entryFeeForeign}</p>
            <p><strong>Entry Fee (Native):</strong> ${place.entryFeeNative}</p>
            <p><strong>Entry Fee (Student):</strong> ${place.entryFeeStudent}</p>
            <p><strong>Opening Hours:</strong> {place.openingHours}</p>
            <p><strong>Category:</strong> {place.category}</p>
            <p><strong>Pictures:</strong> {place.pictures.join(", ")}</p>
            <p><strong>Date:</strong> {place.date_time ? new Date(place.date_time).toLocaleDateString() : 'N/A'}</p>
             {/* Add ShareLink component here for each historical place */}
             <ShareLink type="historicalPlace" id={place._id} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoricalPlacess;
