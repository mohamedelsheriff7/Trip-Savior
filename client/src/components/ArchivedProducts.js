import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backButtonImage from "../images/backbutton.png";


const ArchivedProducts = () => {
  const navigate = useNavigate();

  const [archivedProducts, setArchivedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArchivedProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3002/archived-products");
        setArchivedProducts(response.data);
      } catch (err) {
        setError("Error fetching archived products.");
      } finally {
        setLoading(false);
      }
    };
    fetchArchivedProducts();
  }, []);

  const handleUnarchive = async (productId) => {
    try {
      await axios.put(`http://localhost:3002/unarchive/${productId}`);
      setArchivedProducts(archivedProducts.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error unarchiving product:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <button
              onClick={() => navigate("/adminsellerproduct2")}
              className=""
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                position: "absolute",
                top: "10%",
                left: "0",
                padding: 0,
              }}
            >
              <img
                src={backButtonImage}
                alt="Back to previous page"
                style={{
                  width: "85px",
                  height: "85px",
                }}
              />
            </button>
      <h2>Archived Products</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {archivedProducts.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "20px",
              width: "250px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              backgroundColor: "#fff",
            }}
          >
            {/* Check if the product has a picture, and display it */}
            {product.Picture && (
              <img
                src={`http://localhost:3002/${product.Picture}`} // Assuming the Picture field contains the file path or URL
                alt={product.Name}
                style={{
                  width: "100%", // Make sure the image takes the full width of its container
                  height: "auto", // Maintain aspect ratio
                  borderRadius: "8px", // Optional: to add rounded corners to the image
                  objectFit: "cover", // Ensures that the image covers the area properly without stretching
                  marginBottom: "10px", // Add some space below the image
                }}
              />
            )}
            <h3 style={{ fontSize: "18px", color: "#333" }}>{product.Name}</h3>
            <p style={{ fontSize: "16px", color: "#4CAF50" }}>{product.Price} EGP</p>
            <button
              onClick={() => handleUnarchive(product._id)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4ed4b7",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Unarchive
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchivedProducts;
