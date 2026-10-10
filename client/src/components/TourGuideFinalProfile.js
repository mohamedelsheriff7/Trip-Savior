import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import defaultProfileImage from "../images/no-profile-picture-icon.jpeg";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { BsPersonSquare } from "react-icons/bs"; // Add this import
import { Link } from "react-router-dom";
import TourGuideNavigationBar from "./TourguideNavBar";

import axios from "axios";

const TourGuideFinalProfile = () => {


  const [menuVisible, setMenuVisible] = useState(false); // Add this line
  const [flaggedItineraries, setFlaggedItineraries] = useState([]);
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editMode2, setEditMode2] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const [showImageModal, setShowImageModal] = useState(false);
  const [showCreateProfileForm, setShowCreateProfileForm] = useState(false);
  const [error, setError] = useState(""); // For error handling
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false); // Modal state
  const [editedData, setEditedData] = useState({
    name: '',
    description: '',
    username: '',
    email: ''
  });

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
          setProfileData(data[0]); // Set the fetched data for displaying
          setEditedData(data[0]);  // Set the fetched data for editing
        } catch (err) {
          console.error(err);
          setProfileData(null);
        }
      }

      const storedImage = localStorage.getItem(`profileImage_${user.username}`);
      setProfileImage(storedImage || defaultProfileImage); // Set profile image
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
    setEditMode2((prev) => !prev); // Toggles editMode2
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
      setProfileData(editedData); // Update the displayed profile data
      setEditMode2(false); // Exit edit mode
    } catch (err) {
      console.error(err);
      setError("Failed to save profile. Please try again."); // Display an error if saving fails
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

  return (
    <div>

      <TourGuideNavigationBar />


      {showTable && (
        <table
          style={{
            marginTop: "20px",
            margin: "20px auto",
            width: "90%",
            borderCollapse: "collapse",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead style={{ backgroundColor: "#5ddec2", color: "white" }}>
            <tr>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Product Name
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Quantity
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Sales
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product._id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e3f2fd")
                }
                onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  index % 2 === 0 ? "#f9f9f9" : "#ffffff")
                }
              >
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    fontSize: "14px",
                    color: "#333",
                  }}
                >
                  {product.Name}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    fontSize: "14px",
                    color: "#333",
                    textAlign: "center",
                  }}
                >
                  {product.Quantity}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    fontSize: "14px",
                    color: "#333",
                    textAlign: "center",
                  }}
                >
                  {product.Sold}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!showTable && (
        <div className="container mt-4 mb-4 p-3 d-flex justify-content-center" >

          <div className="card p-5">
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
                <button className="btn1 btn-dark" onClick={handleEditToggle}>
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
                      name="name"
                      value={editedData.work_status || ""} // Default to empty string if no description
                      onChange={handleInputChange}
                      placeholder="Name"
                    />
                  ) : (
                    <> {" "}{" "}</> // Display updated name
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
                      name="description"
                      value={editedData.age || ""} // Default to empty string if no description
                      onChange={handleInputChange}
                      placeholder="Description"
                    />
                  ) : (
                    <></>

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
            <div className="card p-4 ms-3" style={{ width: "450px" }}>
              <h2>Create Profile</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form>

                {/* Email Field */}
                <div className="mb-0.5">
                  <label htmlFor="email" className="form-label custom-label" style={{ color: "#5ddec2" }}>Email</label>
                  <input
                    type="email"
                    className="form-control custom-input"
                    id="email"
                    name="email"
                    value={editedData.email || ""}
                    onChange={handleInputChange}
                    required

                  />
                </div>
                {/* Name Field */}
                <div className="mb-0.5">
                  <label htmlFor="age" className="form-label custom-label" style={{ color: "#5ddec2" }}>Age</label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    id="age"
                    name="age"
                    value={editedData.age || ""}
                    onChange={handleInputChange}
                    required
                    readOnly={!editMode2}  // Set readOnly based on editMode2
                  />
                </div>

                {/* Description Field */}
                <div className="mb-0.5">
                  <label htmlFor="mobileNumber" className="form-label custom-label" style={{ color: "#5ddec2" }}>Mobile Number</label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={editedData.mobileNumber || ""}
                    onChange={handleInputChange}
                    required
                    readOnly={!editMode2}  // Set readOnly based on editMode2
                  />
                </div>
                {/* Description Field */}
                <div className="mb-0.5">
                  <label htmlFor="years_of_experience" className="form-label custom-label" style={{ color: "#5ddec2" }}>Years Of Experience</label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    id="years_of_experience"
                    name="years_of_experience"
                    value={editedData.years_of_experience || ""}
                    onChange={handleInputChange}
                    required
                    readOnly={!editMode2}  // Set readOnly based on editMode2
                  />
                </div>


                {/* Description Field */}
                <div className="mb-0.5">
                  <label htmlFor="previous_work" className="form-label custom-label" style={{ color: "#5ddec2" }}>Previous Work</label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    id="previous_work"
                    name="previous_work"
                    value={editedData.previous_work || ""}
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
                    onClick={handleSave}
                    disabled={!editMode2}
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card p-4 ms-3" style={{ width: "450px" }}>
              <h2 className="mb-4">Profile</h2>



              {/* Email Field (Read-Only) */}
              <div className="mb-0.5">
                <label htmlFor="email" className="form-label custom-label " style={{ color: "#5ddec2" }}>Email</label>
                <p>
                  {editedData.email || ""}
                </p>

              </div>
              {/* Name Field (Read-Only) */}
              <div className="mb-0.5">
                <label htmlFor="name" className="form-label custom-label" style={{ color: "#5ddec2" }}>Age</label>
                <p>
                  {editedData.age || ""}
                </p>
              </div>

              {/* Description Field (Read-Only) */}
              <div className="mb-0.5">
                <label htmlFor="description" className="form-label custom-label" style={{ color: "#5ddec2" }}>Mobile Number</label>
                <p >{editedData.mobileNumber || ""}

                </p>
              </div>
              <div className="mb-0.5">
                <label htmlFor="description" className="form-label custom-label" style={{ color: "#5ddec2" }}>Years Of Experience</label>
                <p >{editedData.years_of_experience || ""}

                </p>
              </div>
              <div className="mb-0.5">
                <label htmlFor="description" className="form-label custom-label" style={{ color: "#5ddec2" }}>Previous Work</label>
                <p >{editedData.previous_work || ""}

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

  
  body {
      background-color: #f2f2f2
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

export default TourGuideFinalProfile;
