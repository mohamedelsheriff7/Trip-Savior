import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomNavbar from "./CustomNavbar"; // Assuming you have a CustomNavbar component
import backButtonImage from "../images/airplane.jpg"; // Assuming you have a backButtonImage
import "./LandingPage/ItinerariesGuest.css"

function ItinerariesGuest2() {
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

  
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

  
    const filteredItineraries = itineraries.filter(itinerary => {
      return (
        (itinerary.active === false && itinerary.booked === true) || // Show if active is false and booked is true
        (itinerary.active === true && itinerary.booked === true) || // Show if active is true and booked is true
        (itinerary.active === true && itinerary.booked === false)   // Show if active is true and booked is false
      );
    });

    return (
        <div>
            <div className="container-fluid w-100">
                <CustomNavbar />
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

                        <div className="d-flex align-items-center">
                            {/* Filter menu */}
                            {showFilters && (
                                <div className="filter-menu ms-3 justify-content-start position-relative">
                                    {availablePreferences.map((preference) => (
                                        <div className="d-flex me-3" key={preference}>
                                            <input
                                                type="checkbox"
                                                value={preference}
                                                checked={preferences.includes(preference)}
                                                onChange={() => handlePreferenceChange(preference)}
                                                className="form-check-input"
                                            />
                                            <label className="ms-2">{preference}</label>
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

                    {filteredItineraries.length > 0 ? (
                        filteredItineraries.map((itinerary, index) => (
                                    <div className="row my-5 w-100"  key={itinerary._id}>
                                        <h1 className="mb-4 w-100 bg-light fs-1">{itinerary.Itinerary_Name}</h1>
                                        <div className="col-8">
                                            <p>Details</p>
                                        </div>
                                        <div className="col-4">
                                        </div>
                                    </div>
                        ))
                    ) : (
                        <p>No itineraries found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ItinerariesGuest2;
