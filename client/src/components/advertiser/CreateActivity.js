import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdvertiserNavbar from "./AdvertiserNavbar";
import backButtonImage from "../../images/backbutton.png";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};
const center = { lat: 37.7749, lng: -122.4194 };
const options = { disableDefaultUI: true, zoomControl: true };

export default function CreateActivity() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAZ_foEGeTZijojjEF1999g6l9GPufNjSM", // Replace with your Google Maps API key
    libraries,
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const { username } = user;

  const [marker, setMarker] = useState(null);
  const [activityDetails, setActivityDetails] = useState({
    advertiserUsername: username,
    name: "",
    date: "",
    time: "",
    price: "",
    category: "",
    tags: [],
    specialDiscounts: "",
    bookingOpen: true,
    rating: "",
    isFlagged: false,
    pictures: [],
  });
  const [categories, setCategories] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [pictureUrl, setPictureUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);


  const handleAddPictureUrl = () => {
    if (pictureUrl) {
      const urls = pictureUrl.split(",").map((url) => url.trim());
      setActivityDetails((prevDetails) => ({
        ...prevDetails,
        pictures: [...prevDetails.pictures, ...urls],
      }));
      setPictureUrl("");
    }
  };

  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          axios.get("http://localhost:3002/categories"),
          axios.get("http://localhost:3002/preferences"),
        ]);
        setCategories(categoriesResponse.data);
        setTagsList(tagsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Error fetching categories or tags. Please try again.");
      }
    };

    fetchCategoriesAndTags();
  }, []);

  const onMapClick = useCallback((event) => {
    setMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setActivityDetails((prevDetails) => {
      if (type === "checkbox" && name.startsWith("tag_")) {
        const updatedTags = checked
          ? [...prevDetails.tags, value]
          : prevDetails.tags.filter((tag) => tag !== value);
        return { ...prevDetails, tags: updatedTags };
      }
      return {
        ...prevDetails,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccessMessage("");
  setErrorMessage("");

  if (!marker) {
    setErrorMessage("Please select a location on the map.");
    return;
  }

  const { advertiserUsername, name, date, time, price, category } =
    activityDetails;

  if (!advertiserUsername || !name || !date || !time || !price || !category) {
    setErrorMessage("Please fill in all required fields.");
    return;
  }

  try {
    // Create FormData to handle file upload along with other data
    const formData = new FormData();

    // Append all activity details to FormData
    formData.append("advertiserUsername", advertiserUsername);
    formData.append("name", name);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("location", `${marker.lat}, ${marker.lng}`);

    // Add optional details if available
    if (activityDetails.tags) formData.append("tags", JSON.stringify(activityDetails.tags));
    if (activityDetails.specialDiscounts) formData.append("specialDiscounts", activityDetails.specialDiscounts);
    formData.append("bookingOpen", activityDetails.bookingOpen);
    if (activityDetails.rating) formData.append("rating", activityDetails.rating);

    // Append pictures if available
    if (activityDetails.pictures && activityDetails.pictures.length > 0) {
      activityDetails.pictures.forEach((picture, index) => {
        formData.append(`pictures[${index}]`, picture);
      });
    }

    // Append the selected image (file upload)
    if (selectedImage) {
      formData.append("image", selectedImage); // Ensure selectedImage is a File object
    }

    // Send the FormData via Axios
    const response = await axios.post("http://localhost:3002/wael/activities", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set the appropriate content type
      },
    });

    if (response.status === 201) {
      setSuccessMessage("Activity created successfully!");
      setActivityDetails({
        advertiserUsername: "",
        name: "",
        date: "",
        time: "",
        price: "",
        category: "",
        tags: [],
        specialDiscounts: "",
        bookingOpen: true,
        rating: "",
        pictures: [],
      });
      setMarker(null);
      setSelectedImage(null); // Reset selected image
    }
  } catch (error) {
    console.error("Error creating activity:", error);
    setErrorMessage(
      error.response?.data?.message || "Error creating activity. Please try again."
    );
  }
};


  if (loadError)
    return (
      <div style={styles.error}>Error loading maps. Please try again.</div>
    );
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      <AdvertiserNavbar></AdvertiserNavbar>
      <div style={styles.container}>
        <h1 className="title text-start mb-4 mt-2">Create Activity</h1>
        {successMessage && (
          <p style={{ ...styles.message, ...styles.success }}>
            {successMessage}
          </p>
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
            <div
              className="d-flex flex-row justify-content-between"
              style={styles.formGroup}
            >
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
            <div
              className="d-flex flex-row justify-content-between"
              style={styles.formGroup}
            >
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

            <div
              className="d-flex flex-row justify-content-between"
              style={styles.formGroup}
            >
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
                <label htmlFor="tag" style={styles.label}>
                  Tags
                </label>
                <select
                  id="tags"
                  name="tags"
                  value={activityDetails.tags}
                  onChange={handleInputChange}
                  style={styles.select}
                  required
                >
                  <option value="">Select Tags</option>
                  {tagsList.map((tag, index) => (
                    <option
                      type="checkbox"
                      key={index}
                      name={`tag_${tag}`} // Checkbox name for the tag
                      value={tag} // Value of the checkbox
                      checked={activityDetails.tags.includes(tag)} // Check if it's selected
                      onChange={handleInputChange}
                      style={styles.checkbox}
                    >
                      {tag} {/* Display tag name */}
                    </option>
                  ))}
                </select>
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
                style={{ borderColor: "#000000" }}
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
                Create Activity
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
