import React from "react";
import { useNavigate } from "react-router-dom";
import backButtonImage from '../images/backbutton.png'; // Adjust path if necessary

const ProfileCreationSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ textAlign: 'center', padding: '20px', position: 'relative' }}>
      <h3>Profile Created Successfully!</h3>
      <p>Your tour guide profile has been created.</p>
      
      {/* Back Button */}
      <button 
        onClick={() => navigate("/profile")} // Redirects to the profile page
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px', // Padding for larger clickable area
        }}
      >
        <img 
          src={backButtonImage} // Using the imported image
          alt="Back to profile" // Provide meaningful text for accessibility
          style={{
            width: '85px',  // Size of the back button image
            height: '85px',
          }}
        />
      </button>
    </div>
  );
};

export default ProfileCreationSuccess;
