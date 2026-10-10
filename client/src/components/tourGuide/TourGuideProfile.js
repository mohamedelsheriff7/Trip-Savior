import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FaEdit } from "react-icons/fa"; // Edit icon
// import styles from "../styles/Profile.module.css"; 
import defaultProfileImage from "../../images/no-profile-picture-icon.jpeg"
import coverImage from "../../images/bar.jpeg";
import TourGuideNavbar from "./TourGuideNavbar";
const AdvertiserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, email } = location.state || {};

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [isEditing, setIsEditing] = useState(false); // Edit mode state
  const [editableData, setEditableData] = useState({}); // Stores editable data
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [flaggedActivities, setFlaggedActivities] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const { username, email } = user;
        try {
          const response = await fetch(`http://localhost:3002/advertisers?username=${username}&email=${email}`);
          if (!response.ok) throw new Error("Failed to fetch profile data");
          const data = await response.json();
          setProfileData(data[0]); // Store the first user object
          setEditableData(data[0]);
  
          // Fetch the stored image for the logged-in user using their username
          const storedImage = localStorage.getItem(`advertiserProfileImage_${username}`);
          if (storedImage) {
            setProfileImage(storedImage);
          }
        } catch (err) {
          console.error(err);
          setProfileData(null);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []); // Remove username dependency since we get it from localStorage
  
  useEffect(() => {
    const fetchFlaggedActivities = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          const response = await fetch(`http://localhost:3002/activities`);
          const data = await response.json();
          // Filter activities that are flagged and belong to the current advertiser
          const flagged = data.filter(activity => 
            activity.isFlagged && 
            activity.advertiserUsername === user.username
          );
          setFlaggedActivities(flagged);
        }
      } catch (err) {
        console.error("Error fetching flagged activities:", err);
      }
    };
  
    fetchFlaggedActivities();
  }, []);
  


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        // Store the profile image uniquely tied to the advertiser’s username
        const user = JSON.parse(localStorage.getItem("user")); // Get current user
        if (user) {
          const { username } = user;
          localStorage.setItem(`advertiserProfileImage_${username}`, reader.result);
        }
        setShowModal(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleImageDelete = (e) => {
    e.stopPropagation(); // Prevent triggering the image modal
    setProfileImage(defaultProfileImage);
    const user = JSON.parse(localStorage.getItem("user")); // Get current user
    if (user) {
      const { username } = user;
      // Remove the advertiser’s unique profile image from localStorage
      localStorage.removeItem(`advertiserProfileImage_${username}`);
    }
  };
  

  const toggleEditMode = () => setIsEditing((prev) => !prev); // Toggle edit mode

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData({ ...editableData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const { username } = user; // Get username from local storage

      const response = await fetch(`http://localhost:3002/advertisers`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          ...editableData,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to update profile data.');
      }

      // Update the local profile data and exit edit mode
      setProfileData(editableData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleAccountDeletionRequest = async () => {
    navigate("/delete-reqs");
    };


  // Function to handle modal toggle
  const toggleModal = () => setShowModal((prev) => !prev);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <TourGuideNavbar />
      {/* Cover Image Section */}
      <div
        style={{
          backgroundImage: `url(${coverImage})`,
          height: "250px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "80%",
          borderBottom: "2px solid #ddd",
          marginRight: "-280px",
        }}
      />

      <div style={{ display: "flex", width: "100%", maxWidth: "1200px" }}>
        {/* Navigation Menu */}
        <nav
          style={{
            width: "200px",
            padding: "10px",
            borderRight: "1px solid #ddd",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <button style={buttonStyle("#28a745")} onClick={() => navigate("/create-advertisement")}>
            Create Advertisement
          </button>
          <button
            style={buttonStyle("#007bff")}
            onClick={() => navigate("/view-advertisements", { state: { username } })}
          >
            View Advertisements
          </button>
          <button style={buttonStyle("#6c757d")} onClick={() => navigate("/advertiser-create-activity")}>
            Create Activity
          </button>
          <button style={buttonStyle("#6c757d")} onClick={() => navigate("/advertiser-edit-activity")}>
            Edit Activity
          </button>
          <button style={buttonStyle("#6c757d")} onClick={() => navigate("/activities-view")}>
            View My Activities
          </button>
          <button style={buttonStyle("#dc3545")} onClick={() => navigate("/delete-activity")}>
            Delete Activity
          </button>
          <button style={buttonStyle("#dc3545")} onClick={() => navigate("/advertiserchange-password")}>
           Change Password
          </button>
          <button style={buttonStyle("#6c757d")} onClick={handleAccountDeletionRequest}>
          Request Account Deletion
          </button>
        </nav>

        {/* Profile Section */}
        <div style={{ flex: 1, padding: "20px" }}>
          <div style={{ position: "relative", cursor: "pointer", marginTop: "-80px", marginLeft: "40px" }} onClick={toggleModal}>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <img
              src={profileImage}
              alt="Profile"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              onClick={toggleModal} // Open modal on click
            />
          </div>
          

          {loading ? (
            <p style={{ fontSize: "1.2rem", color: "#007bff" }}>Loading profile data...</p>
          ) : profileData ? (
            <div style={{ marginTop: "20px" }}>
              <h2>
                Profile Details:
                <FaEdit style={{ marginLeft: "10px", cursor: "pointer" }} onClick={toggleEditMode} />
              </h2>
              {isEditing ? (
                <div>
                  <input type="text" name="username" value={editableData.username} onChange={handleInputChange} />
                  <input type="email" name="email" value={editableData.email} onChange={handleInputChange} />
                  <input type="text" name="companyName" value={editableData.companyName} onChange={handleInputChange} />
                  <input type="text" name="hotline" value={editableData.hotline} onChange={handleInputChange} />
                  <input type="text" name="website" value={editableData.website} onChange={handleInputChange} />
                  <textarea
                    name="companyProfile"
                    value={editableData.companyProfile}
                    onChange={handleInputChange}
                  />
                  <button onClick={handleSave}>Save</button>
                </div>
              ) : (
                <div>
                  <p><strong>Username:</strong> {profileData.username}</p>
                  <p><strong>Email:</strong> {profileData.email}</p>
                  <p><strong>Company Name:</strong> {profileData.companyName}</p>
                  <p><strong>Hotline:</strong> {profileData.hotline}</p>
                  <p><strong>Website:</strong> <a href={profileData.website}>{profileData.website}</a></p>
                  <p><strong>Company Profile:</strong> {profileData.companyProfile}</p>
                </div>
              )}
            </div>
          ) : (
            <p>No profile data found.</p>
          )}
        </div>
      </div>

  

      {/* Modal for Enlarged Profile Picture */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <IoClose style={closeIconStyle} onClick={toggleModal} />
            <img
              src={profileImage}
              alt="Enlarged Profile"
              style={{ width: "100%", height: "20%", borderRadius: "6px" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <label style={buttonLabelStyle}>
                Change Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </label>
              <button style={deleteButtonStyle} onClick={handleImageDelete}>Delete Image</button>
            </div>
          </div>
        </div>
      )}

      {/* Flagged Activities Notifications */}
<div style={{ 
  position: "fixed",
  right: "20px",
  top: "100px",
  width: "300px",
  maxHeight: "80vh",
  overflowY: "auto",
  zIndex: 999
}}>
  {/* Add this after your modal code and before the final closing div */}
{flaggedActivities.length > 0 && (
  <div style={{
    position: "fixed", // Change to fixed position
    right: "20px",
    top: "100px", // Adjust this value to position it below the header
    width: "300px",
    backgroundColor: "#ffebee",
    border: "1px solid #ef5350",
    borderRadius: "4px",
    padding: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    maxHeight: "calc(100vh - 120px)", // Prevent overflow
    overflowY: "auto",
    zIndex: 999 // Ensure it stays on top
  }}>
    <h3 style={{ color: "#c62828", marginBottom: "10px" }}>
      Flagged Activities
    </h3>
    {flaggedActivities.map((activity) => (
      <div key={activity._id} style={{
        marginBottom: "10px",
        padding: "10px",
        backgroundColor: "#ffffff",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <p style={{ color: "#d32f2f", margin: 0 }}>
          Your activity "{activity.name}" has been flagged as inappropriate by admin.
        </p>
      </div>
    ))}
  </div>
)}
</div>
    </div>
  );
};

const buttonStyle = (backgroundColor) => ({
  padding: "10px",
  border: "none",
  borderRadius: "5px",
  backgroundColor,
  color: "white",
  cursor: "pointer",
});

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  position: "relative",
  maxWidth: "600px",
  width: "80%",
};

const closeIconStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  fontSize: "24px",
  cursor: "pointer",
};

const buttonLabelStyle = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "10px",
  borderRadius: "5px",
  cursor: "pointer",
};

const deleteButtonStyle = {
  backgroundColor: "#dc3545",
  color: "white",
  padding: "10px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default AdvertiserProfile;

