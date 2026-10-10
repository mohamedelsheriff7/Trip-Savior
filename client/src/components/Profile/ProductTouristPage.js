import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/ProductStyle.css";
import Slider from "rc-slider";
import { useNavigate } from "react-router-dom";
import "rc-slider/assets/index.css"; // Import default styles for rc-slider
import TouristNavbar from "./TouristNavbar";

function ProductTouristPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null); // Track the selected product
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [sellerName, setSellerName] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State to track the search term
  const [searchVisible, setSearchVisible] = useState(false); // State to track the visibility of the search input field
  const [filterVisible, setFilterVisible] = useState(false); // For showing the slider
  const [startPrice, setStartPrice] = useState(0); // Minimum price
  const [endPrice, setEndPrice] = useState(100000); // Maximum price
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [wishlist, setWishlist] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3002/products");
        if (response.data) {
          // Filter products to exclude archived ones
          const filtered = response.data.filter(
            (product) => !product.isArchived
          );
          setProducts(filtered);
        } else {
          setError("No products found.");
        }
      } catch (err) {
        setError("Error fetching products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  // Fetch seller's name by sellerId when modal is opened
  useEffect(() => {
    const fetchSellerName = async () => {
      if (selectedProduct && selectedProduct.sellerId) {
        try {
          const response = await axios.get(
            `http://localhost:3002/sellers/${selectedProduct.sellerId}`
          );
          setSellerName(response.data.username); // Assuming the response returns the seller's name
        } catch (error) {
          console.error("Error fetching seller name:", error);
        }
      }
    };

    fetchSellerName();
  }, [selectedProduct]);

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="star filled">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="star">
            ★
          </span>
        );
      }
    }
    return stars;
  };

  const handleViewDetails = (product) => {
    // Save the product name to localStorage before navigating
    localStorage.setItem("productName", product.Name);
    navigate(`/tourist-products-details/${product._id}`); // Navigate to ProductDetailsPage with the product ID
  };

  const handleCloseModal = () => {
    setModalVisible(false); // Hide the modal
    setSelectedProduct(null); // Reset selected product
    setSellerName("");
  };
  const handleSearch = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };
  const handleSliderChange = ([min, max]) => {
    setStartPrice(min);
    setEndPrice(max);
  };

  const handleFilterByPrice = () => {
    const filtered = products.filter(
      (product) => product.Price >= startPrice && product.Price <= endPrice
    );
    setFilteredProducts(filtered);
  };

  const handleSort = () => {
    const productsToSort =
      filteredProducts.length > 0 ? filteredProducts : products;

    const sorted = [...productsToSort].sort((a, b) => b.Ratings - a.Ratings);

    // Set the sorted array as the new filteredProducts, regardless of filter status
    setFilteredProducts(sorted);
  };
  const handleAddToWishlist = async (productId) => {
    const userData = localStorage.getItem("user");
    let touristId;
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      touristId = parsedUserData._id;
    } else {
      alert("User not found. Please log in again.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3002/tourists/addProductToWishlist/${touristId}`,
        { productId }
      );
      alert("Product added to wishlist successfully!");
    } catch (err) {
      console.error("Error adding product to wishlist:", err);
      const errorMessage =
        err.response?.data?.message || "An unexpected error occurred";
      alert(errorMessage);
    }
  };

  const toggleHeart = (productId) => {
    // setIsHeartFilled(!isHeartFilled); // Toggle the heart fill state
    handleAddToWishlist(productId); // Add or remove product from wishlist based on heart state
  };
  const handleAddToCart = async (productId, quantity) => {
    const userData = localStorage.getItem("user");
    let touristId;
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      touristId = parsedUserData._id;
    } else {
      alert("User not found. Please log in again.");
      return;
    }

    try {
      await axios.put(`http://localhost:3002/tourists/addToCart/${touristId}`, {
        productId,
        quantity : 1,
      });
      alert("Product added to cart successfully!");
    } catch (err) {
      console.error("Error adding product to cart:", err);
      const errorMessage =
        err.response?.data?.message || "An unexpected error occurred";
      alert(errorMessage);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <TouristNavbar />
      <div>
        <div className="d-flex flex-row justify-content-between mt-3">
          <div></div>
        <div className="input-group rounded mx-3 my-2" style={{ width: "40%" }}>
            <input
              type="search"
              className="form-control rounded d-flex me-2"
              placeholder="Search by name or category or tag"
              aria-label="Search"
              aria-describedby="search-addon"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderColor: "#5ddec2", borderWidth: "2px" }}
            />
            <svg
              className="searchProductBar me-2 align-self-center"
              onClick={handleSearch}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              style={{
                fill: "#4ed4b7", // Set the icon color
                cursor: "pointer", // Make it clickable if necessary
                transition: "transform 0.3s ease", // Add transition for hover effect
              }}
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </div>
          <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          onClick={handleSort}
          class="bi bi-sort-down me-2"
          viewBox="0 0 16 16 "
          style={{
            // Same position as the search icon
            top: "100px", // Adjust vertical position (distance from top)
            right: "60px", // Adjust horizontal position (distance from right)
            fill: "#4ed4b7", // Same color as search icon
            cursor: "pointer", // Make it clickable
            transition: "transform 0.3s ease", // Smooth transition for hover effect
          }}
        >
          <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z" />
        </svg>

        <svg
          className="filterProductBar me-2"
          onClick={() => setFilterVisible(!filterVisible)} // Toggle filter visibility
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          style={{
            top: "100px",
            right: "20px",
            fill: "#4ed4b7",
            cursor: "pointer",
            transition: "transform 0.3s ease",
          }}
          viewBox="0 0 16 16"
        >
          <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />
        </svg>
        </div>
        {filterVisible && (
          <div
            className="filter-slider"
            style={{
              position: "absolute",
              top: "150px", // Adjust this value to move the filter slider further down
              right: "20px",
              backgroundColor: "#ffffff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "10px",
              zIndex: 1000,
              width: "300px",
              height: "auto",
            }}
          >
            <Slider
              range
              min={0}
              max={100000}
              step={100}
              value={[startPrice, endPrice]}
              onChange={([min, max]) => {
                setStartPrice(min);
                setEndPrice(max);
              }}
              trackStyle={[{ backgroundColor: "#5ddec2" }]}
              railStyle={{ backgroundColor: "#e0e0e0" }}
              handleStyle={[
                {
                  backgroundColor: "#5ddec2",
                  border: "none",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  height: 20,
                  width: 20,
                  marginTop: -8,
                },
                {
                  backgroundColor: "#5ddec2",
                  border: "none",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  height: 20,
                  width: 20,
                  marginTop: -8,
                },
              ]}
            />
            <div className="d-flex justify-content-between mt-3 text-sm text-gray-600">
              <span>Min: {startPrice}</span>
              <span>Max: {endPrice}</span>
            </div>
            <button
              className="btn-apply-filter"
              onClick={() => {
                const filtered = products.filter(
                  (product) =>
                    product.Price >= startPrice && product.Price <= endPrice
                );
                setFilteredProducts(filtered);
              }}
              style={{ marginTop: "10px" }}
            >
              Apply Filter
            </button>
          </div>
        )}

          
        
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            padding: "20px",
            justifyContent: "center",
          }}
        >
          {(filteredProducts.length > 0 ? filteredProducts : products).map(
            (product) => (
              <div className="cardproduct" key={product._id}>
                <div className="card-img">
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
                <div className="card-info">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill={isHeartFilled ? "red" : "red"} // Dynamically set the color based on state
                    className={`bi bi-heart ${
                      isHeartFilled ? "heart-filled" : ""
                    }`} // Add 'heart-filled' class if heart is filled
                    viewBox="0 0 16 16"
                    onClick={() => toggleHeart(product._id)} // Toggle heart state on click
                  >
                    {isHeartFilled ? (
                      <path d="M8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                    ) : (
                      <path d="M8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01z" />
                    )}
                  </svg>
                  <p className="text-title">{product.Name}</p>
                  <div className="rating">
                    {product.Ratings
                      ? renderStars(product.Ratings)
                      : "No ratings"}
                  </div>
                  <p className="text-body">
                    {product.Description || "No description available"}
                  </p>
                </div>
                <div className="card-footer">
                  <span className="text-price ms-1">${product.Price}</span>
                  <div className="card-button px-3">
                    <svg
                      className=" "
                      viewBox="0 0 20 20"
                      onClick={() =>
                        handleAddToCart(product._id, product.selectedQuantity)
                      }
                    >
                      <path d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z"></path>
                      <path d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z"></path>
                      <path d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z"></path>
                    </svg>
                  </div>
                </div>
                <div className="view-details">
                  <span onClick={() => handleViewDetails(product)}>
                    View Details
                  </span>
                </div>
              </div>
            )
          )}
        </div>
        {/* Modal */}
        {modalVisible && selectedProduct && (
          <div className="modal-overlayproduct">
            <div className="modal-contentproduct">
              <svg
                onClick={handleCloseModal}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-x-circle close-icon"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
              </svg>

              <h3>{selectedProduct.Name}</h3>
              <p>{selectedProduct.Description || "No description available"}</p>
              <div className="product-container">
                <div className="product-details">
                  <p className="left-alignproduct">
                    <strong>Price:</strong> {selectedProduct.Price} EGP
                  </p>
                  <p className="left-alignproduct">
                    <strong>Seller:</strong> {sellerName || "Unknown Seller"}
                  </p>
                  <p className="left-alignproduct">
                    <strong>Ratings:</strong>{" "}
                    {selectedProduct.Ratings
                      ? `${selectedProduct.Ratings} / 5`
                      : "No ratings"}
                  </p>
                  <p className="left-alignproduct">
                    <strong>Reviews:</strong>
                  </p>
                  {selectedProduct.Reviews &&
                  selectedProduct.Reviews.length > 0 ? (
                    <ul className="reviews-list">
                      {selectedProduct.Reviews.map((review, index) => (
                        <li key={index} className="review-item">
                          <p className="left-alignproduct">{review}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No reviews</p>
                  )}
                  <p className="left-alignproduct">
                    <strong>Quantity:</strong>{" "}
                    {selectedProduct.Quantity > 0
                      ? selectedProduct.Quantity
                      : "Out of stock"}
                  </p>
                </div>

                <div className="product-image">
                  <img
                    src={`http://localhost:3002/${selectedProduct.Picture}`}
                    alt={selectedProduct.Name}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductTouristPage;
