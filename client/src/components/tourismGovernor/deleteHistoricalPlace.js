// Delete.js
import React from "react";
import axios from "axios";

const DeleteHistoricalPlace = ({ placeId, placeName, onDeleteSuccess }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(
        "http://localhost:3002/tourismGovernor/deleteHistoricalPlace",
        {
          data: { name: placeName }, // sending name in request body to match backend
        }
      );
      onDeleteSuccess(placeId); // Call the callback after successful delete
    } catch (err) {
      console.error("Error deleting historical place", err);
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
};

export default DeleteHistoricalPlace;
