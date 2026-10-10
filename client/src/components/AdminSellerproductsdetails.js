import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import backButtonImage from "../images/backbutton.png";
import { useNavigate } from "react-router-dom";

function ProductDetailsPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productId = localStorage.getItem("productId");

        if (!productId) {
          setError("Product not found!");
          return;
        }

        const response = await axios.get("http://localhost:3002/products");
        const product = response.data.find((prod) => prod._id === productId);

        if (product) {
          setProductDetails(product);
          setEditedDetails({ ...product });
        } else {
          setError("Product not found!");
        }
      } catch (err) {
        setError("Error fetching product details. Please try again later.");
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleEditToggle = () => {
    if (editMode) {
      handleSaveProduct();
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProduct = async () => {
    const confirmSave = window.confirm("Are you sure you want to save the changes?");
    if (!confirmSave) return;

    try {
      const response = await axios.put(
        `http://localhost:3002/editProductDetails/${productDetails._id}`,
        editedDetails
      );
      setProductDetails(editedDetails);
      localStorage.setItem("productName", editedDetails.Name);
      setEditMode(false);
      setError("");
      alert("Product details have been successfully updated!");
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Error saving product. Please try again.");
    }
  };

  const handleUpdateImage = async () => {
    if (!selectedImage) {
      alert("Please select an image before updating.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.put(
        `http://localhost:3002/uploadProductImage/${productDetails._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);
      setProductDetails((prev) => ({
        ...prev,
        Picture: response.data.imagePath,
      }));
      setSelectedImage(null);
    } catch (err) {
      console.error("Error uploading image:", err);
      const errorMessage = err.response?.data?.message || "An unexpected error occurred";
      alert(errorMessage);
    }
  };

  if (error) return <div>{error}</div>;
  if (!productDetails) return <div>Loading...</div>;

  return (
    <div className="container mt-4" style={{ width: "90%" }}>
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
      <div className="row d-flex flex-row">
        <div className="d-flex align-items-start">
          <img
            src={`http://localhost:3002/${productDetails.Picture}`}
            alt={productDetails.Name}
            style={{ width: "500px", height: '450px', boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
          />
          <div className="d-flex flex-column w-100 h-100 p-5">
            {editMode ? (
              <input
                type="text"
                name="Name"
                placeholder="Product Name"
                onChange={handleInputChange}
                className="form-control mb-2 fs-2"
                style={{ color: "#5ddec2" }}
              />
            ) : (
              <p className="fs-2 mb-0 fw-bold" style={{ color: "#5ddec2" }}>
                {productDetails.Name}
              </p>
            )}
            {/* Rating Logic */}
            <div className="d-flex justify-self-start align-self-start mt-0 mb-0 fs-1">
              {!editMode &&
                [...Array(5)].map((_, index) => (
                  <span key={index} className={`me-1 ${index < productDetails.rating ? "text-warning" : "text-secondary"}`}>
                    ★
                  </span>
                ))}
            </div>

            {editMode ? (
              <textarea
                name="Description"
                placeholder="Description"
                onChange={handleInputChange}
                className="form-control mb-2 fs-5"
                rows="3"
              />
            ) : (
              <p className="fs-5 text-black">
                {productDetails.Description || productDetails.Details}
              </p>
            )}

            <div className="justify-self-end mt-auto">
              {editMode ? (
                <input
                  type="number"
                  name="Price"
                  placeholder="Price"
                  onChange={handleInputChange}
                  className="form-control mb-2 fs-2 fw-bold"
                />
              ) : (
                <p className="fs-2 fw-bold text-black">
                  ${productDetails.Price}
                </p>
              )}

              {editMode ? (
                <input
                  type="number"
                  name="Quantity"
                  onChange={handleInputChange}
                  className="form-control mb-2 fs-5"
                  placeholder="Remaining Quantity"
                />
              ) : (
                <>
                  <p className="fs-5 text-black">Remaining: {productDetails.Quantity}</p>
                  <p className="fs-5 text-black">Sold: {productDetails.Sold}</p>
                </>
              )}

              <div className="d-flex flex-row w-50">
                <button
                  className="btn btn-lg btn-buy px-4 mt-2 me-2 flex-grow-1 mb-1"
                  onClick={handleEditToggle}
                  style={{ maxHeight: '49px' }}
                >
                  {editMode ? "Save Product" : "Edit Product"}
                </button>
                <button
                  className="btn btn-lg btn-more px-4 mt-2 flex-grow-1 mb-1"
                  onClick={editMode ? () => {
                    setEditMode(false);
                    setEditedDetails(productDetails);
                  } : handleUpdateImage}
                >
                  {editMode ? "Cancel" : "Update Image"}
                </button>
              </div>

              {/* Image Selection */}
              <div>
                <input
                  type="file"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                  accept="image/*"
                  className="form-control mb-2"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="mx-auto" style={{ border: "none", borderTop: "1px solid #ddd", margin: "20px 0", width: "100%" }} />
        
        <div className="d-flex flex-column justify-content-start me-3 fs-5">
          <p className="fs-5">Customer Reviews</p>
          <div className="d-flex flex-wrap">
            {productDetails?.Reviews && productDetails.Reviews.length > 0 ? (
              productDetails.Reviews.map((review, reviewIndex) => (
                <div key={reviewIndex} className="card-prd shadow-sm mb-3 me-3" style={{ width: "300px" }}>
                  <div className="stars-prd">
                    {[...Array(5)].map((_, index) => (
                      <span key={index} className={`me-1 ${index < (productDetails.AllRatings?.[reviewIndex] || 0) ? "text-warning" : "text-secondary"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="infos-prd">
                    <p className="description-prd">{review}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No reviews available for this product.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
