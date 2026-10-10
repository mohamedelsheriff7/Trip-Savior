import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/ProductStyle.css";
import TouristNavbar from "./TouristNavbar";

function ProductTouristRate() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [submitStatuses, setSubmitStatuses] = useState({}); // Change to an object
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : null;

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const pastRes = await axios.get(
        `http://localhost:3002/touristPastOrders/${username}`
      );
      const pastOrders = pastRes.data;

      const productIdsInOrders = pastOrders
        .flatMap((order) => order.order || [])
        .map((item) => item.product?._id?.toString())
        .filter((id) => id);

      const productsResponse = await axios.get(
        "http://localhost:3002/products"
      );
      const allProducts = productsResponse.data;

      const filteredProducts = allProducts.filter((product) =>
        productIdsInOrders.includes(product._id.toString())
      );

      setProducts(filteredProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders or products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRatingChange = (productId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [productId]: rating,
    }));
  };

  const handleReviewChange = (productId, review) => {
    setReviews((prevReviews) => ({
      ...prevReviews,
      [productId]: review,
    }));
  };

  const handleSubmit = async (productId) => {
    const rating = ratings[productId];
    const review = reviews[productId];

    if (!rating || !review) {
      setSubmitStatuses((prevStatus) => ({
        ...prevStatus,
        [productId]: "Error: Please provide both a rating and a review.",
      }));
      return;
    }

    try {
      console.log("Submitting Rating and Review for Product ID:", productId);
      console.log("Rating:", rating);
      console.log("Review:", review);

      // Submitting the rating
      const ratingResponse = await axios.post(
        `http://localhost:3002/tourists/rateProduct/${user._id}`,
        {
          productId,
          rating,
        }
      );
      console.log("Rating submitted:", ratingResponse);

      // Submitting the review
      const reviewResponse = await axios.post(
        `http://localhost:3002/tourists/reviewProduct/${user._id}`,
        {
          productId,
          review,
        }
      );
      console.log("Review submitted:", reviewResponse);

      setSubmitStatuses((prevStatus) => ({
        ...prevStatus,
        [productId]: "Submitted successfully!",
      }));
    } catch (error) {
      console.error("Error submitting rating or review:", error);
      setSubmitStatuses((prevStatus) => ({
        ...prevStatus,
        [productId]: "Error Submitting",
      }));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <TouristNavbar />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          padding: "20px",
        }}
      >
        {products.map((product) => (
          <div
            className="cardproduct"
            key={product._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <div
              className="card-img"
              style={{ height: "200px", overflow: "hidden" }}
            >
              {product.Picture && (
                <img
                  src={`http://localhost:3002/${product.Picture}`}
                  alt={product.Name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
            <div className="card-info w-100" style={{ padding: "16px" }}>
              <p className="text-title" style={{ fontWeight: "bold" }}>
                {product.Name}
              </p>
              <div>
                <strong>Rate:</strong>
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{
                        fontSize: "24px",
                        color:
                          ratings[product._id] >= star ? "#ffd700" : "#ddd",
                        cursor: "pointer",
                      }}
                      onClick={() => handleRatingChange(product._id, star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    marginTop: "10px",
                    resize: "none",
                  }}
                  rows="2"
                  placeholder="Leave a comment"
                  value={reviews[product._id] || ""}
                  onChange={(e) =>
                    handleReviewChange(product._id, e.target.value)
                  }
                />
              </div>
              <div
                className="d-flex flex-column"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <button
                  type="button"
                  style={styles.submitButton}
                  onClick={() => handleSubmit(product._id)}
                >
                  Submit
                </button>
                {submitStatuses[product._id] && (
                  <span
                    style={{
                      color: submitStatuses[product._id].includes("Error")
                        ? "red"
                        : "green",
                      fontSize: "14px",
                      marginLeft: "10px",
                      alignSelf: "center",
                    }}
                  >
                    {submitStatuses[product._id]}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const styles = {
  submitButton: {
    padding: "5px 10px",
    backgroundColor: "#5ddec2",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginBottom: "10px",
    fontSize: "15px",
  },
};

export default ProductTouristRate;
