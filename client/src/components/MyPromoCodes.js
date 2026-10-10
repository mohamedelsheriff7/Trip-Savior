import React, { useEffect, useState } from "react";
import axios from "axios";

const MyPromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPromoCodes = async () => {
      const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user's info
      const touristId = user ? user._id : null;

      if (!touristId) {
        setError("You must be logged in to view your promo codes.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3002/api/promo-codes/${touristId}`);
        setPromoCodes(response.data.promoCodes);
      } catch (error) {
        console.error("Error fetching promo codes:", error);
        setError("Failed to fetch promo codes.");
      } finally {
        setLoading(false);
      }
    };

    fetchPromoCodes();
  }, []);

  if (loading) return <div>Loading your promo codes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>My Promo Codes</h2>
      {promoCodes.length === 0 ? (
        <p>No promo codes available.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {promoCodes.map((promo) => (
            <li
              key={promo._id}
              style={{
                backgroundColor: "#f8f9fa",
                padding: "20px",
                marginBottom: "10px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <p>
                <strong>Code:</strong> {promo.code}
              </p>
              <p>
                <strong>Discount:</strong> {promo.discount}%
              </p>
              <p>
                <strong>Expiry Date:</strong>{" "}
                {new Date(promo.expiryDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Usage Limit:</strong> {promo.usageLimit}
              </p>
              <p>
                <strong>Times Used:</strong> {promo.timesUsed}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPromoCodes;
