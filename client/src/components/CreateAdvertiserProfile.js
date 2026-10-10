import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/CreateProfile.css"; // Import the new CSS file for styling

const CreateAdvertiserProfile = () => {
  const [formData, setFormData] = useState({
    username: "",        // Username field
    email: "",           // Email field
    password: "",        // Password field
    companyName: "",     // Advertiser's company name
    website: "",         // Advertiser's website
    hotline: "",         // Advertiser's hotline number
    companyProfile: "",  // Advertiser's company profile description
  });

  const [error, setError] = useState(""); // State for error handling
  const [isSubmitting, setIsSubmitting] = useState(false); // State for form submission status
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  // Function to handle input changes
  const handleChange = (e) => { 
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Update form data on input change
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setError(""); // Reset error state before the request
    setIsSubmitting(true); // Set submitting state to true

    try {
      // Send the request to the backend to create/update the advertiser profile
      const response = await axios.post("http://localhost:3002/advertisers", formData);
      console.log("Advertiser profile created:", response.data);
      navigate("/create-advertiser-success"); // Navigate to the success page on successful creation/update
    } catch (error) {
      console.error("Error creating advertiser profile:", error);
      if (error.response && error.response.data.message) {
        setError(error.response.data.message); // Set backend error message if available
      } else {
        setError("Error creating advertiser profile. Please try again."); // Generic error message
      }
    } finally {
      setIsSubmitting(false); // Reset submitting state after request is completed
    }
  };

  return (
    <div className="create-profile-container">
      <h1 className="create-profile-header">Create Advertiser Profile</h1>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      
      <form onSubmit={handleSubmit} className="create-profile-form">
        {['username', 'email', 'password', 'companyName', 'website', 'hotline', 'companyProfile'].map((field) => (
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
          {isSubmitting ? "Creating..." : "Create Advertiser Profile"}
        </button>
      </form>
    </div>
  );
};

export default CreateAdvertiserProfile;
