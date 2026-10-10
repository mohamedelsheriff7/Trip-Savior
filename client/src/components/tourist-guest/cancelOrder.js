import React, { useEffect, useState } from "react";
import axios from "axios";

const handleCancel = async (order) => {
  try {
    const orderId = order._id;

    // Call the cancel-order API
    const response = await axios.put(
      "http://localhost:3002/tourist/cancel-order",
      { orderId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Handle success response
    if (response.status === 200) {
      alert("Order cancelled and refunded successfully.");

      // Update the UI (e.g., remove the cancelled order from the displayed list)
      // Assuming `orders` is a state variable holding the list of orders
      setOrders((prevOrders) =>
        prevOrders.filter((item) => item._id !== orderId)
      );

      // Optionally update wallet balance if provided in the response
      if (response.data.walletBalance !== undefined) {
        setWalletBalance(response.data.walletBalance); // Assuming `setWalletBalance` updates wallet balance in the UI
      }
    }
  } catch (err) {
    // Handle errors
    if (err.response) {
      // Server responded with a status outside of the 2xx range
      alert(err.response.data.message || "Failed to cancel the order.");
    } else if (err.request) {
      // Request was made but no response received
      alert("No response from the server. Please try again.");
    } else {
      // Other errors (e.g., issues setting up the request)
      alert("An unexpected error occurred. Please try again.");
    }
  }
};
