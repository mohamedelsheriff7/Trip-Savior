import React, { useState } from 'react';
import axios from 'axios';

const AdvertiserDeletion = () => {
  console.log("User data from localStorage:", localStorage.getItem("user"));
  const user = JSON.parse(localStorage.getItem("user")); // Retrieve user data from localStorage
  const Username = user?.username || "";

  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility

  const handleDeletionRequest = async () => {
    if (!Username) {
      alert("User is not logged in or username is missing.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3002/request-account-deletion", {
        Username,
        status: "pending", // Default values
        requestDate: new Date(),
      });
      alert(response.data.message);
      setIsModalOpen(false); // Close the modal after successful request
    } catch (error) {
      console.error("Error requesting account deletion:", error);
      alert("Failed to submit account deletion request. Please try again later.");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close the modal if "No" is clicked
  };

  const openModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true); // Open the modal when the link is clicked
  };

  return (
    <div>
      {/* Modal for confirmation */}
      {isModalOpen && (
        <div className="modal" style={modalStyles}>
          <div className="modal-content" style={modalContentStyles}>
            <h3>Are you sure you want to delete your account?</h3>
            <button onClick={handleDeletionRequest} style={buttonStyles}>Yes</button>
            <button onClick={handleCancel} style={buttonStyles}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

const modalStyles = {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: '1000',
};

const modalContentStyles = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
};

const buttonStyles = {
  margin: '10px',
  padding: '10px 20px',
  cursor: 'pointer',
};

export default AdvertiserDeletion;
