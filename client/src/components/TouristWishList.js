import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import TouristNavbar from "./Profile/TouristNavbar";

const Wishlist = () => {
  const location = useLocation();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null); // Track the selected product
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [sellerName, setSellerName] = useState(""); 
  const id = location.state?.id || JSON.parse(localStorage.getItem("user"))?._id;
  useEffect(() => {
    if (!id) {
      setError("No Tourist ID provided.");
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3002/tourists/wishlist/${id}`);
        setWishlist(response.data.wishlist);
        setError("");
      } catch (err) {
        console.error("Wishlist fetch error:", err);
        setError("Failed to load wishlist. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [id]);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setModalVisible(true); // Show the modal
  };

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else {
        stars.push(<span key={i} className="star">★</span>);
      }
    }
    return stars;
  };

  const handleCloseModal = () => {
    setModalVisible(false); // Hide the modal
    setSelectedProduct(null); // Reset selected product
    setSellerName(""); 
  };

  const removeFromWishlist = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this item from your wishlist?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3002/tourists/removeFromWishlist/${id}`, {
        data: { productId },
      });
      setWishlist((prevWishlist) => prevWishlist.filter((item) => item._id !== productId)); // Update wishlist after removal
    } catch (err) {
      setError("Failed to remove product from wishlist.");
    }
  };

  const moveToCartFromWishlist = async (productId) => {
    const confirmMove = window.confirm("Are you sure you want to move this item to your cart?");
    if (!confirmMove) return;

    try {
      await axios.put(`http://localhost:3002/tourists/addToCartFromWishlist/${id}`, {
        productId,
        quantity: 1, // Default quantity, you can modify this if needed
      });
      setWishlist((prevWishlist) => prevWishlist.filter((item) => item._id !== productId)); // Update wishlist after moving
      alert("Product successfully moved to cart!");
    } catch (err) {
      console.error("Error moving product to cart:", err);
      setError("Failed to move product to cart.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
    <TouristNavbar /> 
    <div>
      <h1 className="text-center fs-2 mt-4" style={{color: '#5ddec2'}}>My Wishlist</h1>
      <div 
        style={{
          display: "grid", 
          gridTemplateColumns: "repeat(4, 1fr)", 
          gap: "20px", 
          padding: "20px", 
          justifyContent: "center"
        }}
      >
        {wishlist.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          
          wishlist.map((product) => (
            
            <div className="cardproduct" key={product._id}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash"
                viewBox="0 0 16 16"
                style={{
                  position: "absolute", 
                  top: "4px", 
                  right: "4px", 
                  cursor: "pointer",
                  fill:"red"
                }}
                onClick={() => removeFromWishlist(product._id)} // Remove product on click
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
              <div className="card-img">
                {product.Picture && (
                  <img
                    src={`http://localhost:3002/${product.Picture}`}
                    alt={product.Name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </div>
              <div className="card-info">
                <p className="text-title">{product.Name}</p>
                <div className="rating">
                  {product.Ratings ? renderStars(product.Ratings) : "No ratings"}
                </div>
                <p className="text-body">{product.Description || "No description available"}</p>
              </div>
              <div className="card-footer">
                <span className="text-price">{product.Price} EGP</span>
                <div className="card-button px-3">
                  <svg className=" " viewBox="0 0 20 20" onClick={() => moveToCartFromWishlist(product._id, product.selectedQuantity)}>
                    <path d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z"></path>
                    <path d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z"></path>
                    <path d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z"></path>
                  </svg>
                </div>

                
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Modal */}
      {modalVisible && selectedProduct && (
        <div className="modal-overlayproduct">
          <div className="modal-contentproduct">
            <svg 
              onClick={handleCloseModal} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className="w-6 h-6 close-modal" 
              style={{ position: "absolute", top: "10px", right: "10px", cursor: "pointer" }}
            >
              <path fillRule="evenodd" d="M6.293 4.293a1 1 0 011.414 0L10 6.586l2.293-2.293a1 1 0 111.414 1.414L11.414 8l2.293 2.293a1 1 0 01-1.414 1.414L10 9.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 8 6.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <h2>Product Details</h2>
            <p><strong>Name:</strong> {selectedProduct.Name}</p>
            <p><strong>Description:</strong> {selectedProduct.Description}</p>
            <p><strong>Price:</strong> {selectedProduct.Price}</p>
            <p><strong>Ratings:</strong> {renderStars(selectedProduct.Ratings)}</p>
            <p><strong>Seller:</strong> {selectedProduct.SellerName}</p>
            <div className="modal-footer">
              <button onClick={() => moveToCartFromWishlist(selectedProduct._id)}>Move to Cart</button>
              <button onClick={() => removeFromWishlist(selectedProduct._id)}>Remove from Wishlist</button>
            </div>
          </div>
        </div>
      )}
    </div>
    
    </>
  );
};

export default Wishlist;
