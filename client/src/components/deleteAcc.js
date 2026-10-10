import React, { useState } from 'react';
import axios from 'axios';

const AccountDeletionRequest = () => {
  
  console.log("User data from localStorage:", localStorage.getItem("user"));
  const user = JSON.parse(localStorage.getItem("user")); // Retrieve user data from localStorage
  const Username = user?.username || "";

  const handleDeletionRequest = async (e) => {
    e.preventDefault();
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
          
    } catch (error) {
      console.error("Error requesting account deletion:", error);
      alert("Failed to submit account deletion request. Please try again later.");
    }
  };

  return (
    <button onClick={handleDeletionRequest}>
      Request Account Deletion
    </button>
  );
};

export default AccountDeletionRequest;