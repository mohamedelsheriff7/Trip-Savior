import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import AdvertiserNavbar from "./AdvertiserNavbar"


//const { username, email } = user;

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};
const center = {
  lat: 37.7749, // Default latitude (San Francisco example)
  lng: -122.4194, // Default longitude
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

export default function EditActivity() {
  const { name } = useParams();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAZ_foEGeTZijojjEF1999g6l9GPufNjSM", // Replace with your Google Maps API key
    libraries,
  });

  const [marker, setMarker] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activityDetails, setActivityDetails] = useState({
    name: "",
    date: "",
    time: "",
    price: "",
    category: "",
    tags: [],
    specialDiscounts: "",
    bookingOpen: true,
    rating: "",
  });
  const [categories, setCategories] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activityNameInput, setActivityNameInput] = useState(""); // For activity search
  const [isFormVisible, setIsFormVisible] = useState(false); // To toggle form visibility
  const navigate = useNavigate();

  useEffect(() => {

    const storedActivityName = localStorage.getItem('activityNameToEdit');
  
    // Set the activityNameInput state with the stored name
    if (storedActivityName) {
      setActivityNameInput(storedActivityName);
    }
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3002/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrorMessage("Error fetching categories. Please try again later.");
      }
    };

    const handleSearch = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/wael/activities/${name}`
        );
        const activity = response.data;
        setActivityDetails({
          name: activity.name,
          date: activity.date,
          time: activity.time,
          price: activity.price,
          category: activity.category,
          tags: activity.tags,
          specialDiscounts: activity.specialDiscounts,
          bookingOpen: activity.bookingOpen,
          rating: activity.rating,
        });
        // setMarker({
        //   lat: activity.location.split(", ")[0],
        //   lng: activity.location.split(", ")[1],
        // });
        setIsFormVisible(true); // Show form once the activity is found
        setSuccessMessage(""); // Clear previous messages
      } catch (error) {
        console.error("Error fetching activity:", error);
        setErrorMessage(
          error.response?.data?.message || "Activity not found. Please try again."
        );
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:3002/preferences"); // Assuming 'preferences' endpoint returns tags
        setTagsList(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
        setErrorMessage("Error fetching tags. Please try again later.");
      }
    };

    fetchCategories();
    fetchTags();
    handleSearch();
  }, []);

  const onMapClick = useCallback((event) => {
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (name === "name" || name === "date" || name === "time" || name === "price" || name === "specialDiscounts" ) {
      setActivityDetails({ ...activityDetails, [name]: value });
    }
  
    if (name === "category") {
      setActivityDetails({ ...activityDetails, category: value });
    }
  
    if (name.startsWith("tag_")) {
      const tagValue = value;
      const isChecked = checked;
      let updatedTags = [...activityDetails.tags];
  
      // Clean the tags array before updating
      updatedTags = updatedTags.map(tag => {
        try {
          // Attempt to parse any stringified arrays into real arrays
          return Array.isArray(JSON.parse(tag)) ? JSON.parse(tag) : tag;
        } catch (e) {
          return tag; // If not a stringified array, return the tag as is
        }
      }).flat(); // Flatten the array in case any nested arrays exist
  
      if (isChecked) {
        // Add the tag if not already present
        if (!updatedTags.includes(tagValue)) {
          updatedTags.push(tagValue);
        }
      } else {
        // Remove the tag
        updatedTags = updatedTags.filter(tag => tag !== tagValue);
      }
  
      // Remove duplicates and update the state with clean tags
      updatedTags = [...new Set(updatedTags)];
  
      setActivityDetails({ ...activityDetails, tags: updatedTags });
    }
  
    if (name === "bookingOpen") {
      setActivityDetails({ ...activityDetails, bookingOpen: checked });
    }
  };
  



  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!marker) {
      setErrorMessage("Please select a location on the map.");
      return;
    }
    let activityname = localStorage.getItem('activityNameToEdit');
    setActivityNameInput(activityname) ;

    const {
      name,
      date,
      time,
      price,
      category,
      tags,
      specialDiscounts,
      bookingOpen,
      
    } = activityDetails;

    if (!name || !date || !time || !price || !category) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      // Create FormData to send both text and file data
      const formData = new FormData();
      formData.append('name', name);
      formData.append('date', date);
      formData.append('time', time);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('tags', JSON.stringify(tags));
      formData.append('specialDiscounts', specialDiscounts);
      formData.append('bookingOpen', bookingOpen);
      
      formData.append('location', `${marker.lat}, ${marker.lng}`);
      
      // Append image if selected
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      console.log('..........',activityNameInput)

      const response = await axios.put(
        `http://localhost:3002/wael/activities/${activityNameInput}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Activity updated successfully!");
        setIsFormVisible(false);
        console.log(name);
        localStorage.setItem("activityName", name);

        // Retrieve the activity name from localStorage and update the state
        setActivityNameInput(localStorage.getItem("activityName"));
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Error updating activity. Please try again later."
      );
    }
  };
  if (loadError) return <div>Error loading maps. Please try again.</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      <AdvertiserNavbar></AdvertiserNavbar>
    <div style={styles.container}>
      <h1 className="title text-start mb-4">Edit Activity</h1>
      {successMessage && (
        <p style={{ ...styles.message, ...styles.success }}>{successMessage}</p>
      )}
      {errorMessage && (
        <p style={{ ...styles.message, ...styles.error }}>{errorMessage}</p>
      )}

        <>
        <label>Choose a Location</label>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={8}
            center={center}
            options={options}
            onClick={onMapClick}
          >
            {marker && (
              <Marker position={{ lat: marker.lat, lng: marker.lng }} />
            )}
          </GoogleMap>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Activity Name */}
            <div className="d-flex flex-row justify-content-between"style={styles.formGroup}>
              <div className="d-flex flex-column w-50 p-1">
              <label htmlFor="name" style={styles.label}>
                Activity Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={activityDetails.name}
                onChange={handleInputChange}
                placeholder="Enter activity name"
                style={styles.input}
                required
              />
              </div>
              <div className="d-flex flex-column w-50 p-1">
              <label htmlFor="price" style={styles.label}>
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={activityDetails.price}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
              </div>
            </div>

            {/* Date */}
            <div className="d-flex flex-row justify-content-between"style={styles.formGroup}>
              <div className="d-flex flex-column w-50 p-1">
              <label htmlFor="date" style={styles.label}>
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={activityDetails.date}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
              </div>
                          {/* Time */}
              <div className="d-flex flex-column w-50 p-1">
              <label htmlFor="time" style={styles.label}>
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={activityDetails.time}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
              </div>
            </div>

              

            <div className="d-flex flex-row justify-content-between"style={styles.formGroup}>
            {/* Category */}
              <div className="d-flex flex-column w-50 p-1">
              <label htmlFor="category" style={styles.label}>
                Category
              </label>
              <select
                id="category"
                name="category"
                value={activityDetails.category}
                onChange={handleInputChange}
                style={styles.select}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="d-flex flex-column w-50 p-1">
  <label htmlFor="tags" style={styles.label}>
    Tags
  </label>
  <div id="tags" style={styles.checkboxGroup}>
    {tagsList.map((tag, index) => (
      <div key={index} style={styles.checkboxContainer}>
        <input
          type="checkbox"
          id={`tag_${tag}`}
          name={`tag_${tag}`}
          value={tag}
          checked={activityDetails.tags.includes(tag)}
          onChange={handleInputChange}
          style={styles.checkbox}
        />
        <label htmlFor={`tag_${tag}`} style={styles.checkboxLabel}>
          {tag}
        </label>
      </div>
    ))}
  </div>
</div>

            </div>

            {/* Special Discounts */}
            <div style={styles.formGroup}>
              <label htmlFor="specialDiscounts" style={styles.label}>
                Special Discounts:
              </label>
              <input
                type="text"
                id="specialDiscounts"
                name="specialDiscounts"
                value={activityDetails.specialDiscounts}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter special discounts (optional)"
              />
            </div>

            {/* Booking Open */}
            <div className="d-flex" style={styles.formGroup}>
              <label
                className="text-nowrap me-2"
                htmlFor="bookingOpen"
                style={styles.label}
              >
                Booking Open:
              </label>
              <input
                type="checkbox"
                id="bookingOpen"
                className="form-check-input"
                name="bookingOpen"
                checked={activityDetails.bookingOpen}
                onChange={handleInputChange}
                style={{borderColor:"#000000"}}
              />
            </div>

            <div style={styles.formGroup}>
          <label htmlFor="images" style={styles.label}>
            Upload Image
          </label>
          <input
            type="file"
            onChange={(e) => setSelectedImage(e.target.files[0])}
            accept="image/*"
            className="form-control mb-2"
          />
        </div>

            {/* Submit */}
            <div style={styles.formGroup}>
              <button type="submit" className="btn-login" style={styles.button}>
                Update Activity
              </button>
            </div>
          </form>
        </>
    </div>
    </div>
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
