import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/CreateProfile.css"; // Import the new CSS file

const CreateProfile = () => {
  const [formData, setFormData] = useState({
    username: "", 
    email: "",    
    password: "", 
    age: "",
    mobileNumber: "",
    years_of_experience: "",
    previous_work: "",
    work_status: "Rejected", // Default value
  });

  const [error, setError] = useState(""); // State for error handling
  const [isSubmitting, setIsSubmitting] = useState(false); // State for form submission status
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state before the request
    setIsSubmitting(true); // Set submitting state to true

    try {
      const response = await axios.post("http://localhost:3002/tour_guide", formData);
      console.log("Profile created:", response.data);
      navigate("/profile-creation-success"); 
    } catch (error) {
      console.error("Error creating profile:", error);
      setError("Error creating profile. Please try again."); // Set error message
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div 
      className="create-profile-container" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa', // Light background color for professionalism
        fontFamily: 'Arial, sans-serif', // Consistent font style
      }}
    >
      <h1 
        className="create-profile-header" 
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#007bff', // Primary color
          marginBottom: '10px', // Further reduced margin for header
        }}
      >
        Create Tour Guide Profile
      </h1>
      {error && (
        <p 
          className="error-message" 
          style={{
            color: '#dc3545', // Bootstrap error color
            marginBottom: '10px', // Further reduced margin for error message
            fontWeight: 'bold',
          }}
        >
          {error}
        </p>
      )}
      
      {/* Scrollable Container */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        maxHeight: '500px', // Set a maximum height for the scrollable area
        overflowY: 'auto', // Enable vertical scrolling
        padding: '10px',
        border: '1px solid #007bff', // Optional border for clarity
        borderRadius: '4px', // Match the input field style
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', // Added subtle shadow for depth
      }}>
        <form onSubmit={handleSubmit} className="create-profile-form" style={{ width: '100%' }}>
          {['username', 'email', 'password', 'age', 'mobileNumber', 'years_of_experience', 'previous_work'].map((field) => (
            <div className="mb-1" key={field} style={{ marginBottom: '5px' }}> {/* Reduced margin */}
              <label htmlFor={field} style={{ fontWeight: '600', color: '#333', marginBottom: '2px' }}>{field.replace(/_/g, ' ').toUpperCase()}</label>
              <input
                type={field === 'password' ? 'password' : field === 'age' || field === 'years_of_experience' ? 'number' : 'text'}
                name={field}
                id={field}
                className="create-profile-input"
                style={{
                  width: '100%',
                  padding: '6px', // Further reduced padding
                  border: '1px solid #007bff', // Border color
                  borderRadius: '4px', // Slightly reduced border radius
                  fontSize: '0.9rem', // Smaller font size for inputs
                  transition: 'border-color 0.3s',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', // Added subtle shadow for depth
                }}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <button 
            type="submit" 
            className="create-profile-btn create-profile-btn-success" 
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '8px', // Further reduced padding for the button
              backgroundColor: '#007bff',
              border: 'none',
              borderRadius: '4px', // Slightly reduced border radius
              fontSize: '1rem',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s, transform 0.2s',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', // Added shadow for depth
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'} // Scale effect on hover
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} // Reset scale on leave
          >
            {isSubmitting ? "Creating..." : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
