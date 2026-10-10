import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/CreateProfile.css"; // Import the new CSS file

const CreateSellerProfile = () => {
  const [formData, setFormData] = useState({
    username: "",     // Username field
    email: "",        // Email field
    password: "",     // Password field
    name: "",         // Seller name
    description: "",  // Seller description
    additionalInfo: "", // Field for additional information
  });

  const [error, setError] = useState(""); // State for error handling
  const [isSubmitting, setIsSubmitting] = useState(false); // State for form submission status
  const [showAddInfoCard, setShowAddInfoCard] = useState(false); // State for toggling Add Info card visibility
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Update form data on input change
  };

  // Handle additional info field change
  const handleAdditionalInfoChange = (e) => {
    setFormData({ ...formData, additionalInfo: e.target.value }); // Update additional info
  };

  // Toggle the Add Info card visibility
  const handleAddInfo = () => {
    setShowAddInfoCard(!showAddInfoCard); // Toggle the Add Info card visibility
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setError(""); // Reset error state before the request
    setIsSubmitting(true); // Set submitting state to true

    try {
      // Send the request to the backend to create the seller profile
      const response = await axios.post("http://localhost:3002/sellers", formData);
      console.log("Profile created:", response.data);
      navigate("/create-seller-success"); // Navigate to the success page on successful creation
    } catch (error) {
      console.error("Error creating profile:", error);
      if (error.response && error.response.data.message) {
        setError(error.response.data.message); // Set backend error message if available
      } else {
        setError("Error creating profile. Please try again."); // Generic error message
      }
    } finally {
      setIsSubmitting(false); // Reset submitting state after request is completed
    }
  };

  return (
    <div className="create-profile-container">
      <h1 className="create-profile-header">Create Seller Profile</h1>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}

      <form onSubmit={handleSubmit} className="create-profile-form">
        {['username', 'email', 'password', 'name', 'description'].map((field) => (
          <div key={field} className="mb-1">
            <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              name={field}
              id={field}
              value={formData[field]} // Bind form data to input fields
              onChange={handleChange} // Handle input changes
              required // Ensure all fields are required
            />
          </div>
        ))}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Profile"}
        </button>
      </form>

      {/* Add Info Card */}
      {showAddInfoCard && (
        <div className="card p-4 ms-3" style={{ width: "500px" }}>
          <h2>Add Additional Info</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="additionalInfo" className="form-label">
                Additional Info
              </label>
              <textarea
                id="additionalInfo"
                className="form-control"
                rows="3"
                placeholder="Enter your additional information here..."
                value={formData.additionalInfo}
                onChange={handleAdditionalInfoChange} // Handle text area change
              ></textarea>
            </div>
            <button type="button" className="btn btn-primary" onClick={handleAddInfo}>
              Save Info
            </button>
          </form>
        </div>
      )}

      <button type="button" className="btn btn-secondary" onClick={handleAddInfo}>
        {showAddInfoCard ? "Cancel" : "Add Info"}
      </button>
    </div>
  );
};

export default CreateSellerProfile;
