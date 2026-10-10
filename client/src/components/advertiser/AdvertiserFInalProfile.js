import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import defaultProfileImage from "../../images/no-profile-picture-icon.jpeg";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { BsPersonSquare } from "react-icons/bs"; // Add this import
import { Link } from "react-router-dom";
import AdvertiserNavbar from "./AdvertiserNavbar";

const AdvertiserFinalProfile = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({
    username: '',
    hotline: '',
    website: '',
    email: '' ,
    companyName : ''
  });
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCreateProfileForm, setShowCreateProfileForm] = useState(false);
  const [error, setError] = useState(""); // For error handling
  const [editMode2, setEditMode2] = useState(false);
  const [showTable, setShowTable] = useState(false);
  

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const { username, email } = user;
        try {
          const response = await fetch(`http://localhost:3002/advertisers?username=${username}&email=${email}`);
          if (!response.ok) throw new Error("Failed to fetch profile data");
          const data = await response.json();
          setProfileData(data[0]);

          // Ensure description field is always present
          setEditedData({...data[0]});

          const storedImage = localStorage.getItem(`sellerProfileImage_${username}`);
          setProfileImage(storedImage || defaultProfileImage);
        } catch (err) {
          console.error(err);
          setProfileData(null);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleEditToggle = async () => {
    if (editMode) {
      await handleSave(); // Save data before toggling off edit mode
    }
    setEditMode(!editMode); // Toggle the edit mode
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value, // Only update the field that matches the name
    }));
  };
  

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value, // Correctly update the specific field based on the name
    }));
  };

  

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
        setShowImageModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setProfileImage(defaultProfileImage);
    const user = JSON.parse(localStorage.getItem("user")); // Get current user
    if (user) {
      const { username } = user;
      // Remove the advertiser’s unique profile image from localStorage
      localStorage.removeItem(`advertiserProfileImage_${username}`);
    }
  };

  const handleAddInfo = () => {
    setEditMode2(true); // Make sure edit mode for profile is off
    setShowCreateProfileForm(true); // Open the profile creation form
  };


  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3002/advertisers/${profileData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedData),
      });

  
      if (!response.ok) throw new Error("Failed to save profile data");

      
      // Update local state and profile data
      setProfileData(editedData);

      localStorage.setItem("user", JSON.stringify(editedData));
      setEditMode(false);
      setError(""); // Clear any existing errors
    } catch (err) {
      setError("Error saving profile. Please try again.");
      console.error(err);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically update the field based on the name
    }));
  };
  
  const handleCreateProfileSave = async (newProfileData) => {
    try {
      const response = await fetch(`http://localhost:3002/advertisers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProfileData),
      });
      if (!response.ok) throw new Error("Failed to save profile data");
      setProfileData(newProfileData);
      setShowCreateProfileForm(false); // Hide the form after saving
    } catch (err) {
      console.error(err);
      setError("Error saving profile info.");
    }
  };

  return (
    <div>
<AdvertiserNavbar />
      {!showTable && (
        <div className="container mt-4 mb-4 p-3 d-flex justify-content-center">

          <div className="card p-4">
            <div className="image d-flex flex-column justify-content-center align-items-center">
              <button className="btn btn-secondary">
                <img
                  src={profileImage}
                  alt="Profile"
                  height="100"
                  width="100"
                  onClick={() => setShowImageModal(true)}
                  style={{ borderRadius: "50%" }} // Make image circular
                />

              </button>
              {/* Upload Icon next to profile image */}
              <div className="upload-icon" style={{ position: 'relative', marginTop: '-25px', marginLeft: '100px' }}>
                <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                  <BsPersonSquare size={18} color="#5ddec2" /> {/* Updated icon */}
                </label>
                <input
                  type="file"
                  id="file-upload"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleImageUpload}
                />

              </div>



              <span className="idd">{profileData?.username}</span>
              <div className="d-flex flex-row justify-content-center align-items-center gap-2">
                <span className="idd1">{profileData?.email}</span>
              </div>

              <div className="d-flex mt-1 ">
                {/* Removed the Edit Profile button */}
                <button className="btn1 btn-dark" onClick={handleAddInfo}>
                  Edit Profile
                </button>
              </div>
              <div className="text mt-3">
                <span>
                  {editMode ? (
                    <textarea
                      style={{
                        width: "100%",
                        padding: "10px",
                        margin: "10px 0",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        alignItems: "left",
                      }}
                      name="hotline"
                      value={editedData.hotline || ""} // Default to empty string if no description
                     
                      placeholder="hotline"
                    />
                  ) : (
                    <>Hotline : {profileData?.hotline}</> // Display updated name
                  )}
                </span>
              </div>

              <div className="text mt-3">
                <span>
                  {editMode ? (
                    <textarea
                      style={{
                        width: "100%",
                        padding: "10px",
                        margin: "10px 0",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        alignItems: "left",
                      }}
                      name="companyProfile"
                      value={editedData.companyProfile || ""} // Default to empty string if no description
                      
                      placeholder="companyProfile"
                    />
                  ) : (
                    <>Company Profile : {profileData?.companyProfile}</> // Display updated description
                  )}
                </span>
                
              </div>

              {/* Footer with social media icons */}
              <div className="social-media-icons">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <FaFacebook size={24} style={{ marginRight: "10px" }} />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagram size={24} />
                </a>
              </div>
            </div>

          </div>


          {/* Create Profile Form */}
          {editMode2 ? (
            <div className="card p-4 ms-3" style={{ width: "500px" }}>
              <h2>Create Profile</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form>

                {/* Email Field */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label custom-label" style={{ color: "#5ddec2" }}>Email</label>
                  <input
                    type="email"
                    className="form-control custom-input"
                    id="email"
                    name="email"
                    value={editedData.email || ""}
                    onChange={handleInputChange}
                    required
                    readOnly={!editMode2}  // Set readOnly based on editMode2
                  />
                </div>
                {/* Name Field */}
                <div className="mb-2">
                  <label htmlFor="name" className="form-label custom-label" style={{ color: "#5ddec2" }}>Company name</label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    id="companyName"
                    name="companyName"
                    value={editedData.companyName || ""}
                    onChange={handleInputChange}
                    required
                    readOnly={!editMode2}  // Set readOnly based on editMode2
                  />
                </div>

                {/* Description Field */}
                <div className="mb-3">
                      
                  <label htmlFor="mobileNumber" className="form-label custom-label" style={{ color: "#5ddec2" }}>Website</label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    id="website"
                    name="website"
                    value={editedData.website || ""}
                    onChange={handleInputChange}
                    required
                    readOnly={!editMode2}  // Set readOnly based on editMode2
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="nationality" className="form-label custom-label" style={{ color: "#5ddec2" }}>Hotline</label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    id="hotline"
                    name="hotline"
                    value={editedData.hotline || ""}
                    onChange={handleInputChange}
                    required
                    readOnly={!editMode2}  // Set readOnly based on editMode2
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="companyProfile" className="form-label custom-label" style={{ color: "#5ddec2" }}>Company Profile</label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    id="companyProfile"
                    name="companyProfile"
                    value={editedData.companyProfile || ""}
                    onChange={handleInputChange}
                    required
                    readOnly={!editMode2}  // Set readOnly based on editMode2
                  />
                </div>



                {/* Save Profile Button */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="btn1"
                    onClick={() => handleCreateProfileSave(editedData)}
                    disabled={!editMode2}
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card p-4 ms-3" style={{ width: "500px" }}>
              <h2 className="mb-4">Profile</h2>



              {/* Email Field (Read-Only) */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label custom-label " style={{ color: "#5ddec2" }}>Email</label>
                <p>
                  {editedData.email || ""}
                </p>

              </div>
              {/* Name Field (Read-Only) */}
              <div className="mb-2">
                <label htmlFor="companyName" className="form-label custom-label" style={{ color: "#5ddec2" }}>Company Name </label>
                <p>
                  {editedData.companyName || ""}
                </p>
              </div>

              {/* Description Field (Read-Only) */}
              <div className="mb-3">
                <label htmlFor="website" className="form-label custom-label" style={{ color: "#5ddec2" }}>website</label>
                <p >
                    {editedData.website || ""}
                </p>
              </div>

              <div className="mb-3">
                <label htmlFor="hotline" className="form-label custom-label" style={{ color: "#5ddec2" }}>hotline</label>
                <p >
                    {editedData.hotline || ""}
                </p>
              </div>

              <div className="mb-3">
                <label htmlFor="companyProfile" className="form-label custom-label" style={{ color: "#5ddec2" }}>Company Profile</label>
                <p >
                    {editedData.companyProfile|| ""}
                </p>
              </div>
             
            </div>
          )}





          <style>
            {`
          * * {
    margin: 0;
    padding: 0
}
     /* Resize Navbar Font */
          .navbar-nav .nav-link {
            font-size: 14px; /* Change this to adjust font size */
          }

          .navbar-brand {
            font-size: 20px; /* Change this to adjust the brand font size */
          }

body {
    background-color: #ffffff
}
    .social-media-icons {
  display: flex;  /* Align icons in a row */
  justify-content: center;  /* Center the icons horizontally */
  gap: 2px;  /* Add some spacing between the icons */
  margin-top: -2px;  /* Push the icons to the bottom */
  padding-top: 20px;  /* Add some spacing from the top if necessary */
}


.card {
    width: 350px;
    background-color: #fcfcfc;
    border: none;
    cursor: pointer;
    transition: all 0.5s;
    margin-top: 70px;
}

.image img {
    transition: all 0.5s
}

.card:hover .image img {
    transform: scale(1.5)
}

.btn {
    height: 140px;
    width: 140px;
    border-radius: 50%
}

.name {
    font-size: 22px;
    font-weight: bold
}

.idd {
    font-size: 16px;
    font-weight: 600;
    margin-top:10px;
}

.idd1 {
    font-size: 12px
}

.number {
    font-size: 22px;
    font-weight: bold
}

.follow {
    font-size: 12px;
    font-weight: 500;
    color: #444444
}

.btn1 {
    height: 40px;
    width: 200px;
    border: none;
    background-color: #5ddec2;
    color: #000;
    font-size: 15px;
    margin-top:5px;
}

.text span {
    font-size: 13px;
    color: #545454;
    font-weight: 500
}

.icons i {
    font-size: 19px
}

hr .new1 {
    border: 1px solid
}

.join {
    font-size: 14px;
    color: #a0a0a0;
    font-weight: bold
}

.date {
    background-color: #ccc
}
            .custom-input {
  color: black; /* Text color */
  border: 2px solid #5ddec2; /* Border color */
  border-radius: 5px; /* Optional: for rounded corners */
  padding: 10px; /* Optional: for padding inside the input */
}

.custom-input:focus {
  border-color: #5ddec2; /* Border color stays the same on focus */
  outline: none; /* Remove the default focus outline */
}

          .btn1:hover {
            
    background-color: #5ddec2;
    color: white;
    box-shadow: #5ddec2 0px 0px 10px;
          }
        `}
          </style>
        </div>
      )}
    </div>
  );
};

export default AdvertiserFinalProfile;
