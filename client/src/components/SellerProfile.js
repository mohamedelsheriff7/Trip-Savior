
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";

import defaultProfileImage from "../images/no-profile-picture-icon.jpeg";
import coverImage from "../images/bar.jpeg";
import styles from "../styles/Profile.module.css";

const SellerProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, email } = location.state || {};

  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [showEnlargedImage, setShowEnlargedImage] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const { username, email } = user;
        try {
          const response = await fetch(`http://localhost:3002/sellers/login?username=${username}&email=${email}`);
          if (!response.ok) throw new Error("Failed to fetch profile data");
          const data = await response.json();
          setProfileData(data);
          setEditedData(data);
        } catch (err) {
          console.error(err);
          setProfileData(null);
        }
        
        // Load the distinct profile image for the logged-in seller
        const storedImage = localStorage.getItem(`sellerProfileImage_${username}`);
        setProfileImage(storedImage || defaultProfileImage);
      }
      setLoading(false);
    };
    fetchData();
  }, []);


  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3002/sellers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedData),
      });
      if (!response.ok) throw new Error("Failed to save profile data");
      setProfileData(editedData);
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          const { username } = user;
          localStorage.setItem(`sellerProfileImage_${username}`, reader.result);
        }
        setShowImageModal(false);
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleImageDelete = (e) => {
    e.stopPropagation();
    setProfileImage(defaultProfileImage);
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const { username } = user;
      localStorage.removeItem(`sellerProfileImage_${username}`);
    }
  };
  // Handle account deletion request
  const handleAccountDeletionRequest = async () => {
    navigate("/delete-reqs");
    };

  const openImageModal = () => {
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const toggleEnlargedImage = () => {
    setShowEnlargedImage((prev) => !prev);
  };
  const goToRevenueReport = () => {
  
    navigate("/products-sales-report"); // Navigate to the revenue report page

};

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Cover Image Section */}
      <div
        style={{
          backgroundImage: `url(${coverImage})`,
          height: "250px",
          backgroundSize: "cover",
          backgroundPosition: "right",
          width: "78%",
          marginLeft: "250px",
        }}
      ></div>

      <div style={{ display: "flex", width: "100%", maxWidth: "1200px" }}>
        {/* Navigation Menu */}
        <nav style={{ width: "200px", padding: "10px", borderRight: "1px solid #ddd", display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            style={{ width: "100%", padding: "10px", border: "none", borderRadius: "5px", color: "white", background: "#28a745", cursor: "pointer" }}
            onClick={() => navigate("/create-seller-profile")}
          >
            Create Profile
          </button>
          <button
            style={{ width: "100%", padding: "10px", border: "none", borderRadius: "5px", color: "white", background: "#007bff", cursor: "pointer" }}
            onClick={() => navigate("/edit-products")}
          >
            View Products
          </button>
          <button onClick={() => navigate("/products")} style={{ padding: "10px", border: "none", borderRadius: "5px", background: "#6c757d", color: "white" }}>Add Product</button>
          <button
            style={{ width: "100%", padding: "10px", border: "none", borderRadius: "5px", color: "white", background: "#dc3545", cursor: "pointer" }}
            onClick={() => navigate("/sellerchange-password")}
          >
            Change Password
          </button>
          <button
            style={{ width: "100%", padding: "10px", border: "none", borderRadius: "5px", color: "white", background: "#007bff", cursor: "pointer" }}
            onClick={handleAccountDeletionRequest}
          >
            Request Account Deletion
          </button>
          <button
            style={{ width: "100%", padding: "10px", border: "none", borderRadius: "5px", color: "white", background: "#007bff", cursor: "pointer" }}
            onClick={goToRevenueReport}
          >
            View Sales Report
          </button>
        </nav>

        <div style={{ flex: 1, padding: "20px" }}>
          <div style={{ position: "relative", cursor: "pointer", marginTop: "-50px" }} onClick={toggleEnlargedImage}>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <div style={{ position: "relative" }}>
              <img
                src={profileImage}
                alt="Profile"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  transform: showEnlargedImage ? 'scale(1.05)' : 'scale(1)', // Adjust the scale here for smaller enlargement
                  transition: 'transform 0.2s ease'
                }}
                onClick={openImageModal} // Open modal on click
              />
              {profileImage !== defaultProfileImage && (
                <AiOutlineDelete
                  size={24}
                  style={{ position: "absolute", top: "15px", right: "-25px", cursor: "pointer", color: "#dc3545" }}
                  onClick={handleImageDelete}
                />
              )}
            </div>
          </div>

          {loading ? (
            <p style={{ fontSize: "1.2rem", color: "#007bff" }}>Loading profile data...</p>
          ) : profileData ? (
            <div style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h2>Profile Details:</h2>
                <FaEdit size={24} style={{ cursor: "pointer", marginLeft: "10px" }} onClick={handleEditToggle} />
              </div>
              {editMode ? (
                <>
                  <input name="username" value={editedData.username} onChange={handleInputChange} placeholder="Username" />
                  <input name="email" value={editedData.email} onChange={handleInputChange} placeholder="Email" />
                  <input name="name" value={editedData.name} onChange={handleInputChange} placeholder="Name" />
                  <input name="description" value={editedData.description} onChange={handleInputChange} placeholder="Description" />
                  <button onClick={handleSave}>Save</button>
                </>
              ) : (
                <>
                  <p><strong>Username:</strong> {profileData.username}</p>
                  <p><strong>Email:</strong> {profileData.email}</p>
                  <p><strong>Name:</strong> {profileData.name}</p>
                  <p><strong>Description:</strong> {profileData.description}</p>
                </>
              )}
            </div>
          ) : (
            <p style={{ color: "#dc3545" }}>Profile data not found.</p>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            position: "relative",
          }}>
            <IoClose style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              cursor: "pointer",
            }} size={24} onClick={closeImageModal} />
            <h2>Profile Picture</h2>
            <img src={profileImage} alt="Profile" style={{ width: "80%", maxWidth: "300px", height: "auto", borderRadius: "8px" }} />
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button onClick={() => document.getElementById("imageUpload").click()} style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px" }}>
                Change Profile Picture
              </button>
              <button onClick={handleImageDelete} style={{ padding: "10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px" }}>
                Remove Profile Picture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProfile;



