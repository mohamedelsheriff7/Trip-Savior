import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TourGuideNavigationBar from "../TourguideNavBar";
import backButtonImage from "../../images/backbutton.png";

function TGUpdateItinerary() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [itineraryName, setItineraryName] = useState("");
  const [activities, setActivities] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [locations, setLocations] = useState([]);
  const [language, setLanguage] = useState("");
  const [price, setPrice] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [accessibility, setAccessibility] = useState([]);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newActivity, setNewActivity] = useState({ time: "", name: "" });

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchItinerary = async () => {
    try {
      const response = await axios.get("http://localhost:3002/itinerary"); // Fetch all itineraries
      const itineraries = response.data;
  
      // Find the itinerary matching the id from the URL params
      const matchingItinerary = itineraries.find(
        (itinerary) => itinerary._id === id
      );
      console.log(matchingItinerary);
  
      if (matchingItinerary) {
        // Set state variables based on the matching itinerary
        setItineraryName(matchingItinerary.Itinerary_Name || "");
        setActivities(matchingItinerary.activity || []);
        //setPreferences(matchingItinerary.preferences || []);
        //setSelectedPreferences(matchingItinerary.selectedPreferences || []);
        setLocations(matchingItinerary.locationToBeVisited || []);
        setLanguage(matchingItinerary.languageOfTour || "");
        setPrice(matchingItinerary.price || "");
        setDateTime(matchingItinerary.date_time || "");
        setAccessibility(matchingItinerary.accessibility || []);
        setPickupLocation(matchingItinerary.pickupLocation || "");
        setDropoffLocation(matchingItinerary.dropoffLocation || "");
        console.log("name", matchingItinerary.name);
        console.log("activities", matchingItinerary.activities);
        console.log("preferences", matchingItinerary.preferences);
        console.log("selectedPreferences", matchingItinerary.selectedPreferences);
        console.log("locations", matchingItinerary.locations);
        console.log("language", matchingItinerary.language);
        console.log("price", matchingItinerary.price);
        console.log("dateTime", matchingItinerary.dateTime);
        console.log("accessibility", matchingItinerary.accessibility);
        console.log("pickupLocation", matchingItinerary.pickupLocation);
        console.log("dropoffLocation", matchingItinerary.dropoffLocation);
        
      } else {
        console.error("Itinerary not found");
      }
    } catch (error) {
      console.error("Error fetching itineraries: ", error.message);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await axios.get("http://localhost:3002/preferences");
      setPreferences(response.data);
    } catch (error) {
      console.error("Error fetching preferences", error);
    }
  };
  const handleRemoveLocation = (index) => {
    setLocations((prevLocations) =>
      prevLocations.filter((_, i) => i !== index)
    );
  };

  const handleRemoveAccessibility = (index) => {
    setAccessibility((prevAccessibility) =>
      prevAccessibility.filter((_, i) => i !== index)
    );
  };

  const handleRemoveActivity = (index) => {
    setActivities((prevActivities) =>
      prevActivities.filter((_, i) => i !== index)
    );
  };

  useEffect(() => {
    fetchPreferences();
    fetchItinerary();
  }, []);

  const handleAddActivity = () => {
    if (newActivity.time && newActivity.name) {
      setActivities([...activities, newActivity]);
      setNewActivity({ time: "", name: "" });
    }
  };

  const handleAddLocation = (location) => {
    if (location) {
      setLocations([...locations, location]);
    }
  };

  const handleAddAccessibility = (access) => {
    if (access) {
      setAccessibility([...accessibility, access]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itineraryData = {
      Itinerary_Name: itineraryName,
      tourGuideName: user.username,
      activity: activities,
      preferences: selectedPreferences,
      locationToBeVisited: locations,
      languageOfTour: language,
      price: Number(price),
      date_time: dateTime,
      accessibility: accessibility,
      pickupLocation: pickupLocation,
      dropoffLocation: dropoffLocation,
    };

    console.log(itineraryData);
    try {
        const response = await axios.put(`http://localhost:3002/itinerary/${id}`, itineraryData);
        if (response.status === 200) {
            setSuccessMessage("Itinerary updated successfully!"); // Set success message
            // Optionally, you can reset the message after a delay
            setTimeout(() => setSuccessMessage(""), 3000); // Hide message after 3 seconds
          }
    } catch (error) {
      console.error("Error creating itinerary", error);
    }
  };
  const parseDateTime = (dateTime) => {
    if (!dateTime) return ""; // If dateTime is undefined or null
    const date = new Date(dateTime);
    return isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16); // Return formatted or empty
  };

  return (
    <>
      <TourGuideNavigationBar />
      <div>
        <button
          onClick={() => navigate("/tg-itinerary")}
          className=""
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            position: "absolute",
            top: "10%",
            left: "0",
            padding: 0,
          }}
        >
          <img
            src={backButtonImage}
            alt="Back to previous page"
            style={{
              width: "85px",
              height: "85px",
            }}
          />
        </button>
      </div>
      <div style={styles.container} className="my-4">
        <h1 className="title text-start mb-4">Update Itinerary</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="mb-3 d-flex">
            <div className="w-50 me-2">
              <label htmlFor="itineraryName" style={styles.label}>
                Itinerary Name
              </label>
              <input
                type="text"
                id="itineraryName"
                style={styles.input}
                value={itineraryName}
                onChange={(e) => setItineraryName(e.target.value)}
                required
              />
            </div>
            <div className="w-50 ms-2">
              <label htmlFor="dateTime" style={styles.label}>
                Date and Time
              </label>
              <input
                type="datetime-local"
                id="dateTime"
                style={styles.input}
                value={parseDateTime(dateTime)}
                onChange={(e) => setDateTime(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label style={styles.label}>Activities</label>
            <div className="d-flex gap-3 justify-content-start">
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <input
                  type="time"
                  placeholder="Start Time"
                  style={{ ...styles.input, width: "100px" }}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      time: `${e.target.value}-${
                        newActivity.time?.split("-")[1] || ""
                      }`,
                    })
                  }
                />
                <span>-</span>
                <input
                  type="time"
                  placeholder="End Time"
                  style={{ ...styles.input, width: "100px" }}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      time: `${newActivity.time?.split("-")[0] || ""}-${
                        e.target.value
                      }`,
                    })
                  }
                />
              </div>
              <input
                type="text"
                placeholder="Activity Name"
                style={styles.input}
                value={newActivity.name}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, name: e.target.value })
                }
              />
              <button
                type="button"
                className="btn-login w-25"
                style={styles.button}
                onClick={handleAddActivity}
              >
                Add
              </button>
            </div>
            <div className="d-flex flex-wrap mt-2 gap-2">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center btn-login"
                  style={{
                    padding: "5px 10px",
                    borderRadius: "20px",
                  }}
                >
                  <span>
                    {activity.time} "{activity.name}"
                  </span>
                  <div
                    class="close position-relative h-25 me-0"
                    onClick={() => handleRemoveActivity(index)}
                  >
                    <div class="line one"></div>
                    <div class="line two"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label style={styles.label}>Preferences</label>
            <select
              multiple
              style={styles.input}
              value={selectedPreferences}
              onChange={(e) =>
                setSelectedPreferences(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {preferences.map((pref, index) => (
                <option key={index} value={pref}>
                  {pref}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 d-flex">
            {/* Locations Input */}
            <div className="w-50 me-2">
              <label style={styles.label}>Locations to Visit</label>
              <input
                type="text"
                placeholder="Enter location and press Enter"
                style={styles.input}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddLocation(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <div className="d-flex flex-wrap mt-2 gap-2">
                {locations.map((location, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center btn-login"
                    style={{
                      padding: "5px 10px",
                      borderRadius: "20px",
                    }}
                  >
                    <span>{location}</span>
                    <div
                      class="close position-relative h-25 me-0"
                      onClick={() => handleRemoveAccessibility(index)}
                    >
                      <div class="line one"></div>
                      <div class="line two"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accessibility Input */}
            <div className="w-50 ms-2">
              <label htmlFor="accessibility" style={styles.label}>
                Accessibility Options
              </label>
              <input
                type="text"
                placeholder="Enter option and press Enter"
                style={styles.input}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAccessibility(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <div className="d-flex flex-wrap mt-2 gap-2">
                {accessibility.map((access, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center btn-login"
                    style={{
                      padding: "5px 10px",
                      borderRadius: "20px",
                    }}
                  >
                    <span>{access}</span>
                    <div
                      class="close position-relative h-25 me-0"
                      onClick={() => handleRemoveAccessibility(index)}
                    >
                      <div class="line one"></div>
                      <div class="line two"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-3 d-flex">
            <div className="w-50 me-2">
              <label htmlFor="language" style={styles.label}>
                Language
              </label>
              <input
                type="text"
                id="language"
                style={styles.input}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>

            <div className="w-50 ms-2">
              <label htmlFor="price" style={styles.label}>
                Price
              </label>
              <input
                type="number"
                id="price"
                style={styles.input}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3 d-flex">
            <div className="w-50 me-2">
              <label htmlFor="pickupLocation" style={styles.label}>
                Pickup Location
              </label>
              <input
                type="text"
                id="pickupLocation"
                style={styles.input}
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </div>

            <div className="w-50 ms-2">
              <label htmlFor="dropoffLocation" style={styles.label}>
                Dropoff Location
              </label>
              <input
                type="text"
                id="dropoffLocation"
                style={styles.input}
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex gap-3 justify-content-start align-items-center">
          <button type="submit" className="btn-login" style={styles.button}>
            Update
          </button>

          {successMessage && (
    <span style={{ color: successMessage.includes("Error") ? "red" : "green", marginLeft: "10px" }}>
      {successMessage}
    </span>
  )}
          </div>
        </form>
      </div>
    </>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
  },
  form: {
    marginTop: "20px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
  },
  checkboxGroup: {
    display: "flex",
    alignItems: "center",
    marginBottom: "5px",
  },
  checkbox: {
    marginRight: "10px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#5ddec2",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  message: {
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "5px",
  },
  success: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  error: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
  required: {
    color: "red",
  },
};
export default TGUpdateItinerary;
