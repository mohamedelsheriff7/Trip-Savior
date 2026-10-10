import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backButtonImage from "../../images/backbutton.png"; // Adjust path if necessary


export default function CreateHistoricalPlace() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { username } = user;

  const [historicalPlaceDetails, setHistoricalPlaceDetails] = useState({
    governorUsername: username,
    name: "",
    description: "",
    location: "",
    historicalSignificance: "",
    entryFeeForeign: 250,
    entryFeeNative: 200,
    entryFeeStudent: 150,
    openingHours: "",
    pictures: "",
    category: "Museum",
    tags: [],
  });

  const [categories, setCategories] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value, type, options } = e.target;

    setHistoricalPlaceDetails((prevDetails) => {
      if (type === "select-multiple") {
        const selectedOptions = Array.from(options)
          .filter((option) => option.selected)
          .map((option) => option.value);
        return { ...prevDetails, [name]: selectedOptions };
      }

      return {
        ...prevDetails,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const {
      name,
      description,
      historicalSignificance,
      openingHours,
      category,
      location,
    } = historicalPlaceDetails;

    if (!location) {
      setErrorMessage("Please enter a location.");
      return;
    }

    if (
      !name ||
      !description ||
      !historicalSignificance ||
      !openingHours ||
      !category
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (!selectedImage) {
      setErrorMessage("Please select an image.");
      return;
    }

    const formData = new FormData();
    // Append all historical place details
    Object.keys(historicalPlaceDetails).forEach((key) => {
      if (key === "tags") {
        // Special handling for tags
        formData.append(key, JSON.stringify(historicalPlaceDetails[key]));
      } else {
        formData.append(key, historicalPlaceDetails[key]);
      }
    });
    // Append the image
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(
        "http://localhost:3002/createHistoricalPlaces",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Historical place created successfully!");
        // Reset form
        setHistoricalPlaceDetails({
          governorUsername: username,
          name: "",
          description: "",
          historicalSignificance: "",
          entryFeeForeign: 250,
          entryFeeNative: 200,
          entryFeeStudent: 150,
          openingHours: "",
          pictures: "",
          category: "Museum",
          tags: [],
          location: "",
        });
        setSelectedImage(null);
      }
    } catch (error) {
      console.error("Error creating historical place:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Error creating historical place. Please try again."
      );
    }
  };

  return (
    <>
     <div>
            <button
              onClick={() => navigate("/get-createdhistoricalplaces")}
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
    <div style={styles.container}>
      <h1 className="title text-start mb-4">Add Historical Place</h1>
      {successMessage && (
        <p style={{ ...styles.message, ...styles.success }}>{successMessage}</p>
      )}
      {errorMessage && (
        <p style={{ ...styles.message, ...styles.error }}>{errorMessage}</p>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* ... (previous form fields remain the same) ... */}
        <div
          className="d-flex flex-row justify-content-between"
          style={styles.formGroup}
        >
          <div className="d-flex flex-column w-50 p-1">
            <label htmlFor="name" style={styles.label}>
              Historical Place Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={historicalPlaceDetails.name}
              onChange={handleInputChange}
              placeholder="Enter Historical Place Name"
              style={styles.input}
              required
            />
          </div>
          <div className="d-flex flex-column w-50 p-1">
            <label htmlFor="price" style={styles.label}>
              Price (Foreign)
            </label>
            <input
              type="number"
              id="entryFeeForeign"
              name="entryFeeForeign"
              value={historicalPlaceDetails.entryFeeForeign}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
        </div>

        {/* Description */}
        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={historicalPlaceDetails.description}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
        </div>

        {/* Historical Significance */}
        <div style={styles.formGroup}>
          <label htmlFor="historicalSignificance" style={styles.label}>
            Historical Significance
          </label>
          <textarea
            id="historicalSignificance"
            name="historicalSignificance"
            value={historicalPlaceDetails.historicalSignificance}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
        </div>

        {/* Opening Hours */}
        <div style={styles.formGroup}>
          <label htmlFor="openingHours" style={styles.label}>
            Opening Hours
          </label>
          <input
            type="text"
            id="openingHours"
            name="openingHours"
            value={historicalPlaceDetails.openingHours}
            onChange={handleInputChange}
            style={styles.input}
            placeholder="e.g., 9:00 AM - 6:00 PM"
            required
          />
        </div>

        {/* Location */}
        <div style={styles.formGroup}>
          <label htmlFor="location" style={styles.label}>
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={historicalPlaceDetails.location}
            onChange={handleInputChange}
            style={styles.input}
            placeholder="e.g., Cairo, Egy"
            required
          />
        </div>

        {/* Category */}
        <div className="d-flex flex-column" style={styles.formGroup}>
          <label htmlFor="category" style={styles.label}>
            Category
          </label>
          <select
            id="category"
            name="category"
            value={historicalPlaceDetails.category}
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
        <div className="d-flex flex-column" style={styles.formGroup}>
          <label htmlFor="tags" style={styles.label}>
            Tags
          </label>
          <select
            multiple
            id="tags"
            name="tags"
            value={historicalPlaceDetails.tags}
            onChange={handleInputChange}
            style={styles.select}
          >
            {tagsList.map((tag, index) => (
              <option key={index} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
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
            Create Historical Place
          </button>
        </div>
      </form>
    </div>
    </>
  );
}

// ... (styles remain the same)

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
  select: {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#5ddec2",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  message: {
    padding: "10px",
    borderRadius: "5px",
  },
  success: {
    backgroundColor: "#4CAF50",
    color: "#fff",
  },
  error: {
    backgroundColor: "#f44336",
    color: "#fff",
  },
};
