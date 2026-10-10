import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import TouristNavbar from "./Profile/TouristNavbar";
const TouristOrderr = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const location = useLocation(); // Get the location object
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRatings, setSelectedRatings] = useState({}); // State to track selected ratings
  const [submittedRatings, setSubmittedRatings] = useState({}); // State to track submitted ratings
  const [feedbacks, setFeedbacks] = useState({}); // State to track feedback input
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState({}); // State to track submitted feedbacks

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : null;

  useEffect(() => {
    if (!username) {
      setError("No Tourist username provided.");
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [username]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [currentRes, pastRes] = await Promise.all([
        axios.get(`http://localhost:3002/touristCurrentOrders/${username}`),
        axios.get(`http://localhost:3002/touristPastOrders/${username}`),
      ]);
      setCurrentOrders(currentRes.data);
      setPastOrders(pastRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };
// Get the id from location.state
const id = location.state?.id; // Safely access the id, defaulting to undefined if it doesn't exist


  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.put(
        `http://localhost:3002/tourist/cancel-order`,
        { orderId, username }
      );
      if (response.status === 200) {
        const updatedOrders = currentOrders.filter(
          (order) => order._id !== orderId
        );
        setCurrentOrders(updatedOrders);
        alert("Order canceled successfully.");
      } else {
        alert("Failed to cancel the order.");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const renderStars2 = (rating) => {
    return Array(5)
      .fill()
      .map((_, index) => (
        <span
          key={index}
          style={{
            color: index < rating ? "#FFD700" : "#CCCCCC",
            fontSize: "16px",
          }}
        >
          ★
        </span>
      ));
  };

  const OrderCard = ({ order, isCurrent }) => (
    
    <div
      style={{
        backgroundColor: "#fefefe",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        borderLeft: isCurrent ? "4px solid #4ed4b7" : "4px solid #ff6347",
      }}
    >
      <h3 style={{ marginBottom: "10px", fontSize: "18px", color: "#333" }}>
        Order ID: {order._id}
      </h3>
      <p style={{ marginBottom: "15px", fontSize: "14px", color: "#777" }}>
        {isCurrent ? "Status: Active" : "Status: Completed"}
      </p>
      {order.order.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            marginBottom: "10px",
            alignItems: "center",
          }}
        >
          <img
            src={`http://localhost:3002/${item.product.Picture}`}
            alt={item.product.Name}
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "5px",
              marginRight: "15px",
            }}
          />
          <div>
            <h4
              style={{
                margin: "0 0 5px",
                fontSize: "16px",
                color: "#333",
              }}
            >
              {item.product.Name}
            </h4>
            <p style={{ margin: "0", fontSize: "14px", color: "#777" }}>
              Quantity: {item.quantity}
            </p>
            <div>{renderStars2(item.product.Ratings)}</div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setSelectedOrder(order)}
          style={{
            backgroundColor: "#4ed4b7",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "10px 15px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          View Details
        </button>
        {isCurrent && (
          <button
            onClick={() => handleCancelOrder(order._id)}
            style={{
              backgroundColor: "#ff4d4d",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "10px 15px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
    <TouristNavbar /> 
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <>
          {/* Current Orders */}
          <div style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "22px", marginBottom: "15px", color: "#4ed4b7" }}>
              Current Orders
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
              }}
            >
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <OrderCard key={order._id} order={order} isCurrent={true} />
                ))
              ) : (
                <p style={{ color: "#777" }}>No current orders.</p>
              )}
            </div>
          </div>

          {/* Past Orders */}
          <div>
            <h2 style={{ fontSize: "22px", marginBottom: "15px", color: "#ff6347" }}>
              Past Orders
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
              }}
            >
              {pastOrders.length > 0 ? (
                pastOrders.map((order) => (
                  <OrderCard key={order._id} order={order} isCurrent={false} />
                ))
              ) : (
                <p style={{ color: "#777" }}>No past orders.</p>
              )}
            </div>
          </div>
        </>
      )}

           {/* Order Details Modal */}
           {selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "20px",
              width: "90%",
              maxWidth: "600px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            }}
          >
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                fontSize: "20px",
                color: "#333",
                cursor: "pointer",
                float: "right",
              }}
            >
              ✖
            </button>
            <h3 style={{ marginBottom: "20px", fontSize: "20px" }}>
              Order Details
            </h3>
            <p>
              <strong>Order ID:</strong> {selectedOrder._id}
            </p>
            <p>
              <strong>ETA:</strong> {selectedOrder.ETA}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <ul style={{ padding: 0, listStyle: "none", marginTop: "20px" }}>
              {selectedOrder.order.map((item, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "15px",
                    gap: "15px",
                   
                  }}
                >
                  {/* Product Image */}
                  <img
                    src={`http://localhost:3002/${item.product.Picture}`}
                    alt={item.product.Name}
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginRight:"90px"
                    }}
                  />
                  <div>
                    <p>
                      <strong>Product:</strong> {item.product.Name}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {item.quantity}
                    </p>
                    <div>{renderStars2(item.product.Ratings)}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
    </>
  );
};

export default TouristOrderr;
