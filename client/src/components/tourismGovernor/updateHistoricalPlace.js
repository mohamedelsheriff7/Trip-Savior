import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import backButtonImage from "../../images/backbutton.png"; // Adjust path if necessary


const UpdateHistoricalPlace = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { username } = user;
  const { name } = useParams();
  const [isUpdating, setIsUpdating] = useState(false);
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
    category: "",
    tags: [],
  });

  const [categories, setCategories] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  const fetchTags = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3002/tourismGovernor/getHistoricalPlacesByName",
        {
          params: {
            name: name, // Use the name from the state
          },
        }
      );

      // Assuming the response contains data relevant to `historicalPlaceDetails`
      if (response.data) {
        setHistoricalPlaceDetails((prevDetails) => ({
          ...prevDetails, // Preserve existing data
          ...response.data, // Spread the response data into the state
        }));
      }
      console.log(historicalPlaceDetails);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHistoricalPlaceDetails((prevDetails) => {
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

  // const handleChange = (e) => {
  //   setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with the following data:");
    console.log(historicalPlaceDetails); // Log the details to check

    setError(""); // Reset any previous errors
    try {
      // Make the PUT request to update the historical place
      const response = await axios.put(
        "http://localhost:3002/tourismGovernor/updateHistoricalPlace",
        {
          name: historicalPlaceDetails.name, // Ensure the 'name' field is included
          description: historicalPlaceDetails.description,
          // Convert string to array
          location: historicalPlaceDetails.location,
          openingHours: historicalPlaceDetails.openingHours,
          entryFeeForeign: historicalPlaceDetails.entryFeeForeign,
          entryFeeNative: historicalPlaceDetails.entryFeeNative,
          entryFeeStudent: historicalPlaceDetails.entryFeeStudent,
          historicalSignificance: historicalPlaceDetails.historicalSignificance, // Add this field if needed
        }
      );

      console.log("API response:", response); // Check the API response
      setIsUpdating(false); // Hide the form or perform any UI changes after successful update
      setSuccessMessage("Historical place updated successfully!"); // You can set a success message here
    } catch (err) {
      console.error("Error updating historical place:", err);
      setError("Error updating historical place"); // Handle errors
    }
  };

  return (
    <div style={styles.container}>
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
          <input
            id="category"
            name="category"
            value={historicalPlaceDetails.category}
            onChange={handleInputChange}
            style={styles.select}
            required
          ></input>
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

        {/* Submit */}
        <div style={styles.formGroup}>
          <button type="submit" className="btn-login" style={styles.button}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

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

export default UpdateHistoricalPlace;
