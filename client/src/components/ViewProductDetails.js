import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ProductDetailsPage() {
  const { productId } = useParams(); // Get productId from the URL parameters
  const [productDetails, setProductDetails] = useState(null);
  const [error, setError] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedDetails, setEditedDetails] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // Get the product name from localStorage
        const productName = localStorage.getItem("productName");

        // If productName is not in localStorage, handle the error
        if (!productName) {
          setError("Product name not found!");
          return;
        }

        // Fetch all products and find the product matching the saved name
        const response = await axios.get("http://localhost:3002/products");
        const product = response.data.find((prod) => prod.Name === productName);

        // If product is found, set it to state
        if (product) {
          setProductDetails(product);
        } else {
          setError("Product not found!");
        }
      } catch (err) {
        setError("Error fetching product details. Please try again later.");
      }
    };

    fetchProductDetails();
  }, [productId]); // Re-run if productId changes

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

  const handleAddToCart = async (productId) => {
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
        `http://localhost:3002/tourists/addToCart/${touristId}`,
        { productId  ,
          quantity : 1
        }
      );
      alert("Product added to Cart successfully!");
    } catch (err) {
      console.error("Error adding product to Cart:", err);
      const errorMessage =
        err.response?.data?.message || "An unexpected error occurred";
      alert(errorMessage);
    }
  };

  // Handle editing the product details
  const handleEdit = (id) => {
    setEditingProductId(id);
    setEditedDetails(productDetails.Description); // Set the initial value to the current description
  };

  // Handle saving the edited details
  const handleSave = (id) => {
    // Save the edited details logic here
    console.log(`Saving edited details for product ${id}`);
    setEditingProductId(null);
  };

  if (error) return <div>{error}</div>;
  if (!productDetails) return <div>Loading...</div>;

  return (
    // <div className="product-details-page">
    //   <svg
    //     onClick={() => window.history.back()}
    //     xmlns="http://www.w3.org/2000/svg"
    //     width="16"
    //     height="16"
    //     fill="currentColor"
    //     className="bi bi-arrow-left-circle back-icon"
    //     viewBox="0 0 16 16"
    //   >
    //     <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
    //     <path d="M11.854 8.146a.5.5 0 0 0 0-.708L9.207 5.5H13a.5.5 0 0 0 0-1H9.207l2.646-2.646a.5.5 0 0 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708z" />
    //   </svg>

    //   <div className="product-content">
    //     <h3>{productDetails.Name}</h3>
    //     <div className="product-description">
    //       <strong>Description:</strong>
    //       {editingProductId === productDetails._id ? (
    //         <textarea
    //           value={editedDetails}
    //           onChange={(e) => setEditedDetails(e.target.value)}
    //           style={{ width: '100%', padding: '8px', marginTop: '10px' }}
    //         />
    //       ) : (
    //         <span>{productDetails.Description}</span>
    //       )}
    //       {editingProductId === productDetails._id ? (
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           width="16"
    //           height="16"
    //           fill="currentColor"
    //           className="bi bi-check-circle"
    //           viewBox="0 0 16 16"
    //           onClick={() => handleSave(productDetails._id)} // Trigger save action
    //           style={{ cursor: 'pointer', marginLeft: '10px', color: 'green' }}
    //         >
    //           <path d="M11.3 4.7a1 1 0 0 0-1.4 0L7 7.6 5.1 5.7a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4a1 1 0 0 0 0-1.4z" />
    //         </svg>
    //       ) : (
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           width="16"
    //           height="16"
    //           fill="currentColor"
    //           className="bi bi-pencil-square"
    //           viewBox="0 0 16 16"
    //           onClick={() => handleEdit(productDetails._id)} // Trigger edit action
    //           style={{ cursor: 'pointer', marginLeft: '10px' }}
    //         >
    //           <path d="M12.146 1.854a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1 0 .708L9.707 8.5a.5.5 0 0 1-.35.146H6.5a.5.5 0 0 1-.5-.5v-3.5a.5.5 0 0 1 .146-.35l4.146-4.146a.5.5 0 0 1 .708 0l1.5 1.5z" />
    //         </svg>
    //       )}
    //     </div>

    //     <div className="product-container">
    //       <div className="product-details">
    //         <p className="left-align"><strong>Price:</strong> {productDetails.Price} EGP</p>
    //         <p className="left-align"><strong>Seller:</strong> {productDetails.sellerUsername || "Unknown Seller"}</p>
    //         <p className="left-align"><strong>Ratings:</strong> {productDetails.Ratings ? `${productDetails.Ratings} / 5` : "No ratings"}</p>
    //         <p className="left-align"><strong>Reviews:</strong></p>
    //         {productDetails.Reviews && productDetails.Reviews.length > 0 ? (
    //           <ul className="reviews-list">
    //             {productDetails.Reviews.map((review, index) => (
    //               <li key={index} className="review-item">
    //                 <p className="left-align">{review}</p>
    //               </li>
    //             ))}
    //           </ul>
    //         ) : (
    //           <p>No reviews</p>
    //         )}
    //         <p className="left-align"><strong>Quantity:</strong> {productDetails.Quantity > 0 ? productDetails.Quantity : "Out of stock"}</p>
    //       </div>

    //       <div className="product-image">
    //         <img src={`http://localhost:3002/${productDetails.Picture}`} alt={productDetails.Name} />
    //       </div>
    //     </div>
    //   </div>

    //   {/* Inline Styles */}
    //   <style jsx>{`
    //     .product-details-page {
    //       display: flex;
    //       flex-direction: column;
    //       align-items: center;
    //       padding: 20px;
    //       margin-top: 100px;
    //     }

    //     .back-icon {
    //       cursor: pointer;
    //       position: absolute;
    //       top: 20px;
    //       left: 20px;
    //     }

    //     .product-content {
    //       max-width: 700px;
    //       width: 100%;
    //       background-color: white;
    //       padding: 20px;
    //       border-radius: 8px;
    //       box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    //     }

    //     .product-description {
    //       margin-top: 20px;
    //       font-size:16px;
    //     }

    //     .product-description textarea {
    //       width: 100%;
    //       padding: 8px;
    //       margin-top: 10px;
    //     }

    //     .product-container {
    //       display: flex;
    //       justify-content: space-between;
    //       margin-top: 20px;
    //     }

    //     .product-details {
    //       width: 60%;

    //     }

    //     .left-align {
    //       text-align: left;
    //       margin-bottom: 10px;
    //       font-size: 16px;
    //     }

    //     .product-image img{
    //       width: 200%;
    //       display: flex;
    //      margin-top:-40px;
    //      margin-left:-70px;
    //       height: auto;
    //       border-radius: 8px;
    //       justify-content: flex-end; /* Align image to the right */
    //     }

    //     .product-image img {

    //     }

    //     .reviews-list {
    //       list-style-type: none;
    //       padding-left: 0;
    //     }

    //     .review-item {
    //       margin-bottom: 5px;
    //     }
    //   `}</style>
    // </div>
    <>
      <div className="container mt-4" style={{ width: "90%" }}>
        <div className="row d-flex flex-row">
          <div className="d-flex align-items-start">
            <img
              src={`http://localhost:3002/${productDetails.Picture}`}
              alt={productDetails.Name}
              style={{
                width: "500px",
                height: '450px',
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              }}
            />
            <div className="d-flex flex-column w-100 h-100 p-5 ">
              <p className="fs-2 mb-0 fw-bold " style={{ color: "#5ddec2" }}>
                {productDetails.Name}
              </p>
              <div className="d-flex justify-self-start align-self-start mt-0 mb-0 fs-1">
                {/* Render stars based on the rating */}
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`me-1 ${
                      index < productDetails.rating
                        ? "text-warning"
                        : "text-secondary"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="fs-5 text-black">
                {productDetails.Description
                  ? productDetails.Description
                  : productDetails.Details}
              </p>
              <p className="fs-5 text-black">
                Sold By: {productDetails.sellerUsername}
              </p>
              <div className="justify-self-end mt-auto">
                <p className="fs-2 fw-bold text-black">
                  ${productDetails.Price}
                </p>
                <div className="d-flex flex-row w-50">
                  <button className="btn btn-lg btn-buy px-4 mt-2 me-2 flex-grow-1  mb-1"
                  style={{maxHeight: '49px'}}
                  onClick={() => handleAddToCart(productDetails._id)}>
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-lg btn-more px-4 mt-2 flex-grow-1  mb-1"
                    onClick={() => handleAddToWishlist(productDetails._id)}
                  >
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
          <hr
            className="mx-auto"
            style={{
              border: "none",
              borderTop: "1px solid #ddd",
              margin: "20px 0",
              width: "100%",
              alignSelf: "center",
              opacity: 0.8,
            }}
          />
          <div className="d-flex flex-column justify-content-start me-3 fs-5">
            <p className="fs-5">Customer Reviews</p>
            <div className="d-flex flex-wrap">
              {productDetails?.Reviews && productDetails.Reviews.length > 0 ? (
                (() => {
                  const minLength = Math.min(
                    productDetails.Reviews.length,
                    productDetails.AllRatings?.length || 0
                  );

                  return productDetails.Reviews.slice(0, minLength).map(
                    (review, reviewIndex) => (
                      <div
                        key={reviewIndex}
                        className="card-prd shadow-sm mb-3 me-3"
                        style={{ width: "300px" }} // Adjust card width here
                      >
                        {/* Stars */}
                        <div className="stars-prd">
                          {[...Array(5)].map((_, index) => (
                            <span
                              key={index}
                              className={`me-1 ${
                                index <
                                (productDetails.AllRatings?.[reviewIndex] || 0)
                                  ? "text-warning"
                                  : "text-secondary"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>

                        {/* Review Details */}
                        <div className="infos-prd">
                          {/* <p className="date-time-prd"></p> */}
                          <p className="description-prd">{review}</p>
                        </div>

                        {/* Author */}
                        {/* <div className="author-prd">—</div> */}
                      </div>
                    )
                  );
                })()
              ) : (
                <p>No reviews available for this product.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailsPage;
