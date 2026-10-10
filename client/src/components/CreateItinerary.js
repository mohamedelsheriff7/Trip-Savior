import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/CreateItinerary.module.css"; // Import your CSS module for styling
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash } from 'react-icons/fa'; // Import trash icon
import { useNavigate } from "react-router-dom";
const CreateItinerary = () => {
  const navigate = useNavigate();
  const [itineraryData, setItineraryData] = useState({
    Itinerary_Name: "",
    tourGuideName: "",
    locationToBeVisited: [],
    timeline: "",
    durationOfActivity: 1,
    languageOfTour: "",
    price: 1,
    date_time: "",
    accessibility: "",
    pickupLocation: "",
    dropoffLocation: "",
    booked: false,
    rating: 0,
    isFlagged: false,
    preferences: [], // This will be filled based on selected activities
    activities: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState({ available: [], unavailable: [] });
  const [tourGuides, setTourGuides] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchErrorMessage, setSearchErrorMessage] = useState(""); 

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("http://localhost:3002/activities");
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setErrorMessage("Error fetching activities. Please try again.");
      }
    };

    const fetchTourGuides = async () => {
      try {
        const response = await axios.get("http://localhost:3002/tourguides");
        setTourGuides(response.data);
      } catch (error) {
        console.error("Error fetching tour guides:", error);
      }
    };

    fetchActivities();
    fetchTourGuides();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItineraryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  
    // Ensure activities have been fetched before trying to filter
    if (activities && activities.length > 0) {
      const filtered = activities.filter((activity) =>
        (activity.name || '').toLowerCase().includes(value.toLowerCase()) // Check if name is defined
      );
  
      // Separate available and unavailable activities
      const availableActivities = filtered.filter(activity => activity.bookingOpen);
      const unavailableActivities = filtered.filter(activity => !activity.bookingOpen);
  
      // Update filtered activities
      setFilteredActivities({ available: availableActivities, unavailable: unavailableActivities });
  
      // Set search error messages based on available and unavailable activities
      if (filtered.length === 0) {
        setSearchErrorMessage("No matches found."); // No activities found in the database
      } else if (availableActivities.length === 0 && unavailableActivities.length > 0) {
        setSearchErrorMessage("These activities are not available now."); // All found activities are unavailable
      } else {
        setSearchErrorMessage(""); // Clear the error message if activities are found
      }
    } else {
      // Handle the case where activities haven't been fetched yet
      setFilteredActivities({ available: [], unavailable: [] });
      setSearchErrorMessage("No activities available for searching."); // Optional message if no activities
    }
  };
  

  const handleActivitySelect = (activity) => {
    if (!itineraryData.activities.includes(activity.name)) {
      setItineraryData((prevData) => {
        const updatedActivities = [...prevData.activities, activity.name];
        const updatedLocations = [...prevData.locationToBeVisited, activity.location];

        // Update preferences based on the tags from the selected activity
        const newPreferences = [...new Set([...prevData.preferences, ...activity.tags])];

        return {
          ...prevData,
          activities: updatedActivities,
          locationToBeVisited: updatedLocations,
          preferences: newPreferences, // Update preferences
        };
      });
    }
    setSearchTerm("");
    setFilteredActivities({ available: [], unavailable: [] });
  };

  const handleActivityRemove = (activityToRemove) => {
    setItineraryData((prevData) => {
      const updatedActivities = prevData.activities.filter(activity => activity !== activityToRemove);
      const updatedLocations = prevData.locationToBeVisited.filter((location, index) => {
        const activityIndex = prevData.activities.indexOf(activityToRemove);
        return index !== activityIndex;
      });

      // Update preferences to keep only those related to the remaining activities
      const updatedPreferences = prevData.preferences.filter(pref => {
        return updatedActivities.some(activityName => 
          activities.find(activity => activity.name === activityName)?.tags.includes(pref)
        );
      });

      return {
        ...prevData,
        activities: updatedActivities,
        locationToBeVisited: updatedLocations,
        preferences: updatedPreferences, // Update preferences
      };
    });
  };

  const handleStarClick = (index) => {
    setItineraryData((prevData) => ({
      ...prevData,
      rating: index + 1,
    }));
  };

  const handleBookingChange = (e) => {
    setItineraryData((prev) => ({
      ...prev,
      booked: e.target.value === "true",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3002/itinerary", itineraryData);
      console.log("Itinerary created:", response.data);
      setSuccessMessage("Itinerary created successfully!");
      setErrorMessage("");

      // Reset itinerary data after successful submission
      setItineraryData({
        Itinerary_Name: "",
        tourGuideName: "",
        locationToBeVisited: [],
        timeline: "",
        durationOfActivity: 1,
        languageOfTour: "",
        price: 1,
        date_time: "",
        accessibility: "",
        pickupLocation: "",
        dropoffLocation: "",
        booked: false,
        rating: 0,
        preferences: [],
        activities: [],
      });

      // Step 3: Redirect to Profile page
      setTimeout(() => {
        navigate('/profile'); // Redirect to the Profile page
      }, 1000); // Optional: delay before redirecting

    } catch (error) {
      console.error("There was an error creating the itinerary!", error);
      setErrorMessage("There was an error creating the itinerary. Please try again.");
      setSuccessMessage("");
    }
  };

  const accessibilityOptions = [
    { value: "", label: "Select Accessibility" },
    { value: "Wheelchair Accessible", label: "Wheelchair Accessible" },
    { value: "Visually Impaired Friendly", label: "Visually Impaired Friendly" },
    { value: "Hearing Impaired Friendly", label: "Hearing Impaired Friendly" },
    { value: "Family Friendly", label: "Family Friendly" },
    { value: "Pet Friendly", label: "Pet Friendly" },
  ];

  const languages = [
    { value: "", label: "Select Language" },
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Arabic", label: "Arabic" },
    { value: "Italian", label: "Italian" },
    { value: "Turkish", label: "Turkish" },
    { value: "Japanese", label: "Japanese" },
    { value: "Chinese", label: "Chinese" }
  ];

  return (
    <div className={styles.formContainer}>
      <h3>Create Itinerary</h3>
  
      {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
  
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search activities..."
          className={styles.searchInput}
        />
        {searchErrorMessage && <p className={styles.errorMessage}>{searchErrorMessage}</p>} {/* Display search error message */}
        {filteredActivities.available.length > 0 && (
          <ul className={styles.activityList}>
            {filteredActivities.available.map((activity) => (
              <li key={activity._id}>
                {activity.name}
                <button
                  type="button"
                  onClick={() => handleActivitySelect(activity)}
                  className={styles.addButton}
                  aria-label={`Add ${activity.name} to itinerary`}
                >
                  +
                </button>
              </li>
            ))}
          </ul>
        )}
        {filteredActivities.unavailable.length > 0 && (
          <div>
            
            <ul className={styles.unavailableList}>
              
            </ul>
          </div>
        )}
    
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="Itinerary_Name">Itinerary Name:</label>
          <input
            type="text"
            id="Itinerary_Name"
            name="Itinerary_Name"
            value={itineraryData.Itinerary_Name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="tourGuideName">Tour Guide:</label>
          <input
            type="text"
            id="tourGuideName"
            name="tourGuideName"
            value={itineraryData.tourGuideName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.activityContainer}>
          <h4>Selected Activities</h4>
          {itineraryData.activities.length > 0 ? (
            itineraryData.activities.map((activity) => (
              <div key={activity} className={styles.selectedActivity}>
                {activity}
                <button
                  type="button"
                  onClick={() => handleActivityRemove(activity)}
                  className={styles.removeButton}
                  aria-label={`Remove ${activity} from itinerary`}
                >
                  <FaTrash />
                </button>
              </div>
            ))
          ) : (
            <p>No activities selected.</p>
          )}
        </div>

      {/* Locations to be visited input */}
      <div>
        <label htmlFor="locationToBeVisited">Locations to be Visited:</label>
        <input
          type="text"
          id="locationToBeVisited"
          name="locationToBeVisited"
          value={itineraryData.locationToBeVisited.join(", ")}
          readOnly
        />
      </div>

      {/* Preferences input */}
      <div>
        <label htmlFor="preferences">Preferences:</label>
        <input
          type="text"
          id="preferences"
          name="preferences"
          value={itineraryData.preferences.join(", ")}
          readOnly
        />
      </div>

     
        <div>
          <label htmlFor="timeline">Timeline:</label>
          <input
            type="text"
            id="timeline"
            name="timeline"
            value={itineraryData.timeline}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="durationOfActivity">Duration of Activity (in hours):</label>
          <input
            type="number"
            id="durationOfActivity"
            name="durationOfActivity"
            value={itineraryData.durationOfActivity}
            onChange={handleChange}
            required
            min={1}
          />
        </div>

        <div>
          <label htmlFor="languageOfTour">Language of Tour:</label>
          <select
            id="languageOfTour"
            name="languageOfTour"
            value={itineraryData.languageOfTour}
            onChange={handleChange}
            required
          >
            {languages.map((language) => (
              <option key={language.value} value={language.value}>{language.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={itineraryData.price}
            onChange={handleChange}
            required
            min={1}
          />
        </div>

        <div>
          <label htmlFor="date_time">Date & Time:</label>
          <input
            type="datetime-local"
            id="date_time"
            name="date_time"
            value={itineraryData.date_time}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="accessibility">Accessibility:</label>
          <select
            id="accessibility"
            name="accessibility"
            value={itineraryData.accessibility}
            onChange={handleChange}
          >
            {accessibilityOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pickupLocation">Pickup Location:</label>
          <input
            type="text"
            id="pickupLocation"
            name="pickupLocation"
            value={itineraryData.pickupLocation}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="dropoffLocation">Dropoff Location:</label>
          <input
            type="text"
            id="dropoffLocation"
            name="dropoffLocation"
            value={itineraryData.dropoffLocation}
            onChange={handleChange}
            required
          />
        </div>

        

        <button type="submit" className={styles.submitButton}>Create Itinerary</button>
      </form>
    </div>
  );
};

export default CreateItinerary;
