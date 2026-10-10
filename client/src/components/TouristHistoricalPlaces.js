import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/HistoricalGuest.css";
import CustomNavbar from "./CustomNavbar";
import backButtonImage from '../images/backbutton.png'; // Adjust path if necessary
import ShareLink from "./ShareLink"; // Import the ShareLink component

const TouristHistoricalPlaces = () => {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:3002/historical-places');
    
      // Extract `type` and `historicalPeriod` as separate entries
      const types = response.data.map((place) => place.tag?.type).filter(Boolean); // Ensures no undefined/null values
      const historicalPeriods = response.data.map((place) => place.tag?.historicalPeriod).filter(Boolean);
  
      // Combine and deduplicate entries
      const uniqueTags = Array.from(new Set([...types, ...historicalPeriods]));
  
      setTags(uniqueTags);
      console.log("Tags:", uniqueTags);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  const fetchTagsAndPlaces = async () => {
    try {
      const response = await axios.get("http://localhost:3002/historical-places");

      // Extract tags
      const types = response.data.map((place) => place.tag?.type).filter(Boolean);
      const historicalPeriods = response.data.map((place) => place.tag?.historicalPeriod).filter(Boolean);
      const uniqueTags = Array.from(new Set([...types, ...historicalPeriods]));

      setTags(uniqueTags);
      setHistoricalPlaces(response.data);
      setFilteredPlaces(response.data); // Initially display all data
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error fetching historical places.");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTagsAndPlaces();
  }, []);

  const handleCheckboxChange = (tag) => {
    const updatedSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag) // Remove tag if unchecked
      : [...selectedTags, tag]; // Add tag if checked

    setSelectedTags(updatedSelectedTags);

    // Filter places based on selected tags
    if (updatedSelectedTags.length > 0) {
      const filtered = historicalPlaces.filter((place) =>
        updatedSelectedTags.some(
          (tag) =>
            place.tag?.type === tag || place.tag?.historicalPeriod === tag
        )
      );
      setFilteredPlaces(filtered);
      console.log("Filtered Places:", filtered);
    } else {
      setFilteredPlaces(historicalPlaces); // Show all if no filters selected
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3002/historical-places")
      .then((response) => {
        setHistoricalPlaces(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching historical places.");
        setLoading(false);
      });
  }, []);

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
          `http://localhost:3002/search?name=${encodeURIComponent(query)}&category=${encodeURIComponent(query)}&tag=${encodeURIComponent(query)}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
  
        const data = await response.json();
  
        // Assuming `data` contains filtered places matching the search query
        // Historical places, activities, and itineraries are all returned now
        setFilteredPlaces(data.historicalPlaces);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 3000); // Delay of 300ms (adjust as needed)
  
    setSearchTimeout(timeout);
  };
  


  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="container-fluid w-100">
     {false && <CustomNavbar />}


    <div className="container pt-4">


<div className="d-flex justify-content-between">
  <div>
        <button 
          onClick={() => window.history.back()} 
          className=""
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            position: 'absolute',
         
            padding: 0,
          }}
        >
          <img 
            src={backButtonImage} 
            alt="Back to previous page" 
            style={{
              width: '85px',
              height: '85px',
            }}
            onClick={() => window.location.href = '/'}
          />
        </button>
        
        </div>
        <div className="d-flex align-items-center w-50">
  <div className="input-group rounded">
    <input
      type="search"
      className="form-control rounded"
      placeholder="Search by name or category or tag"
      aria-label="Search"
      aria-describedby="search-addon"
      value={searchTerm}
      onChange={handleSearchChange}
      style={{ borderColor: '#5ddec2', borderWidth: '2px' }} // Inline style to set border color
      
    />
   

   <div class="d-flex align-items-center">
  
  
</div>
  </div>
</div>


        <div className="d-flex align-items-center">
  {/* Filter menu */}
  {showFilters && (
    <div className="filter-menu ms-3 justify-content-start position-relative">
      {tags.map((tag) => (
        <div className="d-flex me-3" key={tag}>
          <input
            type="checkbox"
            value={tag}
            checked={selectedTags.includes(tag)}
            onChange={() => handleCheckboxChange(tag)}
            className="form-check-input"
          />
          <label className="ms-2">{tag}</label>
        </div>
      ))}
    </div>
  )}

  {/* Button */}
  <button
    title="filter"
    className="filter ms-0"
    onClick={() => setShowFilters(!showFilters)}
    style={{ position: 'relative', zIndex: 2}}
  >
    <svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19,2H5A3,3,0,0,0,2,5V6.17a3,3,0,0,0,.25,1.2l0,.06a2.81,2.81,0,0,0,.59.86L9,14.41V21a1,1,0,0,0,.47.85A1,1,0,0,0,10,22a1,1,0,0,0,.45-.11l4-2A1,1,0,0,0,15,19V14.41l6.12-6.12a2.81,2.81,0,0,0,.59-.86l0-.06A3,3,0,0,0,22,6.17V5A3,3,0,0,0,19,2ZM13.29,13.29A1,1,0,0,0,13,14v4.38l-2,1V14a1,1,0,0,0-.29-.71L5.41,8H18.59ZM20,6H4V5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1Z"/></svg>
  </button>
</div>

      </div>

      {filteredPlaces.length > 0 ? (
        filteredPlaces.map((place, index) => (
          <div className="row my-5" key={place._id}>
            {/* Alternate the order based on the index */}
            {index % 2 === 0 ? (
              <div className="card d-flex flex-row">
                {/* Text First, Image Second */}
                <div className="col-md-6 col-12 order-md-1 order-2 p-4">
                  <div className="ms-md-5 ps-lg-5 text-md-start text-center">
                    <h1 className="mb-4">{place.name}{" "} <ShareLink type="historicalPlace" id={place._id} ></ShareLink>
  </h1>
                    <hr
                      className="d-md-block d-none"
                      style={{ width: "40%", color: "rgb(5, 5, 112)" }}
                    />
                    
                    <div className="d-flex">
                      <p className="fw-bold me-1">Location:</p>
                      <p>{place.location}</p>
                    </div>
                    <div className="d-flex">
                      <p className="fw-bold me-1">Significance:</p>
                      <p>{place.historicalSignificance}</p>
                    </div>
                    <div className="d-flex">
                      <p className="fw-bold me-1">Established:</p>
                      <p>
                        {place.established
                          ? new Date(place.established).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div className="d-flex">
                      <p className="fw-bold me-1">Entry Fees (Foreign):</p>
                      <p>${place.entryFeeForeign}</p>
                    </div>
                    <div className="d-flex">
                      <p className="fw-bold me-1">Entry Fees (Native):</p>
                      <p>${place.entryFeeNative}</p>
                    </div>
                    <div className="d-flex">
                      <p className="fw-bold me-1">Entry Fees (Student):</p>
                      <p>${place.entryFeeStudent}</p>
                    </div>
                    <div className="d-flex">
                      <p className="fw-bold me-1">Opening Hours:</p>
                      <p>{place.openingHours}</p>
                    </div>
                    <div className="d-flex">
                      <p className="fw-bold me-1">Category:</p>
                      <p>{place.category}</p>
                    </div>
                    <div className="d-flex">
                      <p className="fw-bold me-1">Website:</p>
                      <p>{place.website || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 order-md-2 order-1 text-center align-content-center mb-md-0 mb-4">
                  {place.pictures?.length > 0 ? (
                    <img
                    className="img-square"
                      src={place.pictures[0]} // Display the first picture as the main image
                      alt={place.name}
                      style={{ maxWidth: "100%", borderRadius: "8px" }}
                    />
                  ) : (
                    <img
                      src="/placeholder-image.jpg" // Provide a fallback image
                      alt="No image available"
                      style={{ maxWidth: "100%", borderRadius: "8px" }}
                    />
                  )}
                </div>
                <hr/>
              </div>
            ) : (
              <div className="card d-flex flex-row p-4">
                {/* Image First, Text Second */}
                <div className="col-md-6 col-12 order-md-1 order-1 text-center align-content-center mb-md-0 mb-4">
                  {place.pictures?.length > 0 ? (
                    <img
                    className="img-square"
                      src={place.pictures[0]} // Display the first picture as the main image
                      alt={place.name}
                      style={{ maxWidth: "100%", borderRadius: "8px" }}
                    />
                  ) : (
                    <img
                      src="/placeholder-image.jpg" // Provide a fallback image
                      alt="No image available"
                      style={{ maxWidth: "100%", borderRadius: "8px" }}
                    />
                  )}
                </div>
                <div className="col-md-6 col-12 order-md-2 order-2">
                  <div className="ms-md-5 ps-lg-5 text-md-start text-center">
                    <h1 className="mb-4">{place.name}{" "}<ShareLink type="historicalPlace" id={place._id} ></ShareLink>
</h1>
                    <hr
                      className="d-md-block d-none"
                      style={{ width: "40%", color: "rgb(5, 5, 112)" }}
                    />
                    <div className="d-flex">
                      <p className="fw-bold me-1">Location:</p>
                      <p>{place.location}</p>
                    </div>
                    <div className="d-flex">
                      <p className="fw-bold me-1">Significance:</p>
                      <p>{place.historicalSignificance}</p>
                    </div>
                    <div className="d-flex">
                      <p className="fw-bold me-1">Established:</p>
                      <p>
                        {place.established
                          ? new Date(place.established).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div className="d-flex">
                      <p className="fw-bold me-1">Entry Fees (Foreign):</p>
                      <p>${place.entryFeeForeign}</p>
                    </div>
                    <div className="d-flex">
                      <p className="fw-bold me-1">Entry Fees (Native):</p>
                      <p>${place.entryFeeNative}</p>
                    </div>
                    <div className="d-flex">
                      <p className="fw-bold me-1">Entry Fees (Student):</p>
                      <p>${place.entryFeeStudent}</p>
                    </div>
                    <div className="d-flex">
                      <p className="fw-bold me-1">Opening Hours:</p>
                      <p>{place.openingHours}</p>
                    </div>
                    <div className="d-flex">
                      <p className="fw-bold me-1">Category:</p>
                      <p>{place.category}</p>
                    </div>
                    <div className="d-flex">
                      <p className="fw-bold me-1">Website:</p>
                      <p>{place.website || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No historical places available.</p>
      )}
    </div>
    </div>
  );
};

export default TouristHistoricalPlaces;
