import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../styles/ProductStyle.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css"; // Import default styles for rc-slider
import { useNavigate } from "react-router-dom";
import AdminNavigationbar from "./AdminNavigationBar";
function ProductAdminSellerPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const fileInputRef = useRef(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedDetails, setEditedDetails] = useState("");
  const [editedPrice, setEditedPrice] = useState("");

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
  const handleImageUpload = async (productId, file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.put(
        `http://localhost:3002/uploadProductImage/${productId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const updatedProducts = products.map((product) =>
        product._id === productId
          ? { ...product, Picture: response.data.imagePath }
          : product
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleEdit = (productId) => {
    setEditingProductId(productId);
    const product = products.find((product) => product._id === productId);
    setEditedDetails(product?.Details || "");
    setEditedPrice(product?.Price || "");
  };

  // Handle saving edits
  const handleSave = async (productId) => {
    const data = { Details: editedDetails, Price: editedPrice };
    try {
      await axios.put(
        `http://localhost:3002/editProductDetails/${productId}`,
        data
      );
      const updatedProducts = products.map((product) =>
        product._id === productId
          ? { ...product, Details: editedDetails, Price: editedPrice }
          : product
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setEditingProductId(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleViewDetails = (product) => {
    // Save the product name to localStorage before navigating
    localStorage.setItem("productId", product._id);
    navigate(`/admin-seller-product-details/${product._id}`); // Navigate to ProductDetailsPage with the product ID
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
  const handleArchive = async (productId) => {
    try {
      await axios.put(`http://localhost:3002/archive/${productId}`);
      const updatedProducts = products.filter(
        (product) => product._id !== productId
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error("Error archiving product:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <AdminNavigationbar />
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          onClick={handleSort}
          class="bi bi-sort-down"
          viewBox="0 0 16 16 "
          style={{
           // position: "fixed", // Same position as the search icon
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
          className="filterProductBar"
          onClick={() => setFilterVisible(!filterVisible)} // Toggle filter visibility
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          style={{
          //  position: "fixed",
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
        {filterVisible && (
          <div
            className="filter-slider"
            style={{
           //   position: "absolute",
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

        <svg
          className="filterProductBar"
          onClick={() => navigate("/products")} // Toggle filter visibility
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          style={{
            position: "fixed",
            top: "100px",
            right: "140px",
            fill: "#4ed4b7",
            cursor: "pointer",
            transition: "transform 0.3s ease",
          }}
          viewBox="0 0 16 16"
        >
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
        </svg>

        {
          <div
            className="search-containerProduct"
            style={{ //position: "fixed",
               top: "100px", right: "500px" }}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name"
              style={{
                padding: "5px 15px",
                fontSize: "14px",
                borderRadius: "4px",
              }}
            />
            <svg
              onClick={handleSearch}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#4ed4b7"
              style={{
                cursor: "pointer",
                marginLeft: "10px",

                transition: "fill 0.3s ease",
              }}
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.442 1.1a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
            </svg>
          </div>
        }
        <svg
          onClick={() => navigate("/archived-products")}
          width="24"
          height="24"
          style={{
            position: "fixed", // Position it absolutely within its container
            top: "100px", // Adjust vertical position (distance from top)
            right: "100px", // Adjust horizontal position (distance from right)
            fill: "#4ed4b7", // Set the icon color
            cursor: "pointer", // Make it clickable if necessary
            transition: "transform 0.3s ease", // Add a smooth transition for any transform changes
          }}
          xmlns="http://www.w3.org/2000/svg" // Add the XML namespace
          viewBox="0 0 16 16" // Set the view box for the icon
          className="bi bi-arrow-up-square" // Add class for the icon
        >
          <path
            fillRule="evenodd"
            d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"
          />
        </svg>

        <h1 className="productsh1"> </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px 0px",
            padding: "20px",
            justifyContent: "center",
          }}
        >
          {(filteredProducts.length > 0 ? filteredProducts : products).map(
            (product) => (
              <div className="cardproduct" key={product._id}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(product._id, e.target.files[0])
                  }
                  style={{
                    position: "fixed",
                    width: "30%",
                    height: "30%",
                    top: 0,
                    left: 0,
                    opacity: 0, // Make it invisible but still functional
                    cursor: "pointer", // Make it clickable
                  }}
                />

                {/* Cloud upload icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  top="5px"
                  right="20px"
                  color="#5ddec2"
                  fill="currentColor"
                  className="bi bi-cloud-upload"
                  viewBox="0 0 16 16"
                  style={{
                    cursor: "pointer", // Make the icon clickable
                    display: "block",
                  }}
                >
                  <path
                    fillRule="evenodd"
                    d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383"
                  />
                  <path
                    fillRule="evenodd"
                    d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708z"
                  />
                </svg>
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
                  <span className="text-price">{product.Price} EGP</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => handleArchive(product._id)}
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-archive"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                  </svg>
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
              <div className="product-description">
                <strong>Description:</strong>
                {editingProductId === selectedProduct._id ? (
                  <textarea
                    value={editedDetails}
                    onChange={(e) => setEditedDetails(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginTop: "10px" }}
                  />
                ) : (
                  <span>{selectedProduct.Description}</span>
                )}
                {editingProductId === selectedProduct._id ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-check-circle"
                    viewBox="0 0 16 16"
                    onClick={() => handleSave(selectedProduct._id)} // Trigger save action
                    style={{
                      cursor: "pointer",
                      marginLeft: "10px",
                      color: "green",
                    }}
                  >
                    <path d="M11.3 4.7a1 1 0 0 0-1.4 0L7 7.6 5.1 5.7a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4a1 1 0 0 0 0-1.4z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-pencil-square"
                    viewBox="0 0 16 16"
                    onClick={() => handleEdit(selectedProduct._id)} // Trigger edit action
                    style={{ cursor: "pointer", marginLeft: "10px" }}
                  >
                    <path d="M12.146 1.854a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1 0 .708L9.707 8.5a.5.5 0 0 1-.35.146H6.5a.5.5 0 0 1-.5-.5v-3.5a.5.5 0 0 1 .146-.35l4.146-4.146a.5.5 0 0 1 .708 0l1.5 1.5z" />
                  </svg>
                )}
              </div>
              <div className="product-container">
                <div className="product-details">
                  <p className="left-alignproduct">
                    <strong>Price:</strong> {selectedProduct.Price} EGP
                  </p>
                  <p className="left-alignproduct">
                    <strong>Seller:</strong>{" "}
                    {selectedProduct.sellerUsername || "Unknown Seller"}
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
    </div>
  );
}

export default ProductAdminSellerPage;
