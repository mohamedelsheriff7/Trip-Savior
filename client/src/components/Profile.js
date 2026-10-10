import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; // Import close icon from react-icons
import { AiOutlineDelete } from "react-icons/ai"; // Import delete icon from react-icons
import defaultProfileImage from "../images/no-profile-picture-icon.jpeg"; // Import the default profile image
import coverImage from "../images/bar.jpeg"; // Import cover image

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [showImageModal, setShowImageModal] = useState(false); // State for image modal
  const [menuVisible, setMenuVisible] = useState(false); // Add this line
  const [flaggedItineraries, setFlaggedItineraries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user")); // Get the logged-in user info
      if (user) {
        const { username, email } = user;
        try {
          const response = await fetch(
            `http://localhost:3002/tour_guide?username=${username}&email=${email}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch profile data");
          }
          const data = await response.json();
          setProfileData(data[0]);
          setEditedData(data[0]);
        } catch (err) {
          console.error(err);
          setProfileData(null);
        }
      }
  
      // Load profile image specific to the user
      const storedImage = localStorage.getItem(`profileImage_${user.username}`);
      setProfileImage(storedImage || defaultProfileImage); // Load image or fallback to default
      setLoading(false);
    };
    fetchData();
  }, []);

// Add this useEffect to fetch flagged itineraries
useEffect(() => {
  const fetchFlaggedItineraries = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const response = await fetch(
          `http://localhost:3002/itinerary?tourGuideName=${user.username}`
        );
        const data = await response.json();
        // Filter for both flagged status AND matching tourGuideName
        const flagged = data.filter(itinerary => 
          itinerary.isFlagged && 
          itinerary.tourGuideName === user.username
        );
        setFlaggedItineraries(flagged);
      }
    } catch (err) {
      console.error("Error fetching flagged itineraries:", err);
    }
  };

  fetchFlaggedItineraries();
}, []);
  

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };
  const toggleMenu = () => {
    setMenuVisible((prev) => !prev); // Toggle the visibility
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3002/tour_guide`, {
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
        setProfileImage(reader.result); // Set the profile image in component state
        localStorage.setItem(`profileImage_${profileData.username}`, reader.result); // Save it to localStorage for the specific user
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleImageDelete = () => {
    setProfileImage(defaultProfileImage); // Reset to default profile image
    localStorage.removeItem(`profileImage_${profileData.username}`); // Remove the user's specific image from localStorage
  };

  const handleAccountDeletionRequest = async () => {
    navigate("/delete-reqs");
    };

  const openImageModal = () => {
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const goToRevenueReport = () => {
  
    navigate("/revf-report"); // Navigate to the revenue report page

};

const goToTotalTouristsReport = () => {

  navigate("/total-tourist-booked-itinerary"); // Navigate to the revenue report page

};

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Cover Image Section */}
      <div
  style={{
    backgroundImage: `url(${coverImage})`,
    height: "250px", // Adjust height to showcase more of the image
    backgroundSize: "cover", // Ensures the image covers the entire area
    backgroundPosition: "right", // Center the image
    backgroundRepeat: "no-repeat", // Prevent the image from repeating
    width: "78%", // Full width of the parent container
    overflow: "hidden", // Hides any overflow
    margin: "0", // Remove auto margin to allow full width
    marginLeft:"250px",
  }}
></div>





      <div style={{ display: "flex", width: "100%", maxWidth: "1200px" }}>
     {/* Navigation Menu */}
<nav style={{ width: "200px", padding: "10px", borderRight: "1px solid #ddd" }}>
  <div
    onClick={toggleMenu} // Add this to toggle the menu
    style={{
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      padding: "2px",
      background: "transparent", // No background color
      color: "#007bff", 
      borderRadius: "1px",
      marginTop: "-250px",
      marginLeft:"-50px"
    }}
  >
    <span style={{ fontSize: "42px" }}>≡</span> {/* Equal sign-like icon */}
  </div>
  {menuVisible && ( // Conditional rendering of menu items
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      <li style={{ margin: "10px 0" }}>
        <span
          style={{
            display: "block",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/create-profile")}
        >
          Create Profile
        </span>
      </li>
      <li style={{ margin: "10px 0" }}>
        <span
          style={{
            display: "block",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/create-itinerary")}
        >
          Create Itinerary
        </span>
      </li>
      <li style={{ margin: "10px 0" }}>
        <span
          style={{
            display: "block",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/read-itinerary")}
        >
          Read Itinerary
        </span>
      </li>
      <li style={{ margin: "10px 0" }}>
        <span
          style={{
            display: "block",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/view-itinerary")}
        >
          View My Itineraries
        </span>
      </li>
      <li style={{ margin: "10px 0" }}>
        <span
          style={{
            display: "block",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/change-password")}
        >
          Change Password
        </span>
      </li>
      <li style={{ margin: "10px 0" }}>
        <span
          style={{
            display: "block",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={handleAccountDeletionRequest}
        >
          Request Account Deletion
        </span>
        
      </li>
      <li style={{ margin: "10px 0" }}>
        <span
          style={{
            display: "block",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={goToRevenueReport}
        >
          View sales Report
        </span>
      </li>
      <li style={{ margin: "10px 0" }}>
        <span
          style={{
            display: "block",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={goToTotalTouristsReport}
        >
          View Total Tourists used my itinerary 
        </span>
      </li>
    </ul>
  )}
</nav>



        <div style={{ flex: 1, padding: "20px" }}>
          <div style={{ position: "relative", cursor: "pointer" ,marginTop:"-50px"}} onClick={openImageModal}>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }} // Hide the file input
            />
            <div style={{ position: "relative" }}>
              <img
                src={profileImage}
                alt="Profile"
                style={{
                  width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover"
                }}
              />
              {profileImage !== defaultProfileImage && ( // Show delete icon only if user has uploaded an image
                <AiOutlineDelete
                  size={24}
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "-25px", // Adjusted to move the icon left
                    cursor: "pointer",
                    color: "#dc3545",
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the modal
                    handleImageDelete();
                  }}
                />
              )}
            </div>
          </div>

          {loading ? (
            <p style={{ fontSize: "1.2rem", color: "#007bff" }}>
              Loading profile data...
            </p>
          ) : profileData ? (
            <div style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h2>Profile Details:</h2>
                <FaEdit
                  size={24}
                  style={{ cursor: "pointer", marginLeft: "10px" }}
                  onClick={handleEditToggle}
                />
              </div>
              {editMode ? (
                <>
                  <input
                    name="username"
                    value={editedData.username}
                    onChange={handleInputChange}
                  />
                  <input
                    name="email"
                    value={editedData.email}
                    onChange={handleInputChange}
                  />
                  <input
                    name="mobileNumber"
                    value={editedData.mobileNumber}
                    onChange={handleInputChange}
                  />
                  <input
                    name="age"
                    value={editedData.age}
                    onChange={handleInputChange}
                  />
                  <input
                    name="years_of_experience"
                    value={editedData.years_of_experience}
                    onChange={handleInputChange}
                  />
                  <input
                    name="previous_work"
                    value={editedData.previous_work}
                    onChange={handleInputChange}
                  />
                  <input
                    name="work_status"
                    value={editedData.work_status}
                    onChange={handleInputChange}
                  />
                  <button onClick={handleSave}>Save</button>
                </>
              ) : (
                <>
                  <p>
                    <strong>Username:</strong> {profileData.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {profileData.email}
                  </p>
                  <p>
                    <strong>Mobile Number:</strong> {profileData.mobileNumber}
                  </p>
                  <p>
                    <strong>Age:</strong> {profileData.age}
                  </p>
                  <p>
                    <strong>Years of Experience:</strong> {profileData.years_of_experience}
                  </p>
                  <p>
                    <strong>Previous Work:</strong> {profileData.previous_work}
                  </p>
                  <p>
                    <strong>Work Status:</strong> {profileData.work_status}
                  </p>
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
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              position: "relative",
            }}
          >
            <IoClose
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                fontSize: "24px",
              }}
              onClick={closeImageModal}
            />
            <img
              src={profileImage}
              alt="Profile enlarged"
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "400px",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "15px",
              }}
            >
              <label
                htmlFor="imageUpload"
                style={{
                  background: "#007bff",
                  color: "white",
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background 0.3s ease",
                }}
              >
                Change
              </label>
              <button
                style={{
                  background: "#dc3545",
                  color: "white",
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background 0.3s ease",
                }}
                onClick={closeImageModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {flaggedItineraries.length > 0 && (
  <div style={{
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#ffebee",
    border: "1px solid #ef5350",
    borderRadius: "4px"
  }}>
    <h3 style={{ color: "#c62828", marginBottom: "10px" }}>Flagged Itineraries</h3>
    {flaggedItineraries.map((itinerary) => (
      <div key={itinerary._id} style={{
        marginBottom: "10px",
        padding: "10px",
        backgroundColor: "#ffffff",
        borderRadius: "4px"
      }}>
        <p style={{ color: "#d32f2f" }}>
          Your itinerary "{itinerary.Itinerary_Name}" has been flagged as inappropriate.
        </p>
      </div>
    ))}
  </div>
)}
    </div>
  );
};

export default Profile;


