import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Tourist.css";
import TouristNavbar from "./TouristNavbar.js";
import defaultProfileImage from "../../images/no-profile-picture-icon.jpeg";

import { FaEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";

import { FaFacebook, FaInstagram } from "react-icons/fa";
import { BsPersonSquare } from "react-icons/bs"; // Add this import
import { Link } from "react-router-dom";
function ViewProfile() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [products, setProducts] = useState([]);

  const [editMode2, setEditMode2] = useState(false);
  const [showTable, setShowTable] = useState(false);

  //   const location = useLocation();
  const [message, setMessage] = useState("");
  const [wallet, setWallet] = useState(0); // Assuming wallet state is available
  const [loyaltyPoints, setLoyaltyPoints] = useState(0); // Assuming loyalty points are fetched initially
  const [level, setLevel] = useState(1); // Tourist level
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [formData, setFormData] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCreateProfileForm, setShowCreateProfileForm] = useState(false);
  const [error, setError] = useState(""); // For error handling
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false); // Modal state
  const [tags, setTags] = useState([]); // Stores all tags from API
  const [filteredTags, setFilteredTags] = useState([]); // Stores filtered tags based on search
  const [selectedTags, setSelectedTags] = useState([]); // Stores selected tags
  const [searchQuery, setSearchQuery] = useState(""); // Search input value

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState([]);

 
  
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get("http://localhost:3002/itinerary-preferences");
        if (response.status === 200) {
          setTags(response.data);
        } else {
          console.error("Failed to fetch preferences list");
        }
      } catch (error) {
        console.error("Error fetching preferences list:", error);
      }
    };

    fetchPreferences();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelect = async (preference) => {
    if (!selectedPreferences.includes(preference)) {
      try {
        // Add the selected preference to the database
        const response = await axios.post("http://localhost:3002/tourist/preferences", {
          username: localStorage.getItem("user"), // Assuming you store the logged-in user's username in localStorage
          preference,
          action: "add", // Specify the action
        });
  
        if (response.status === 200) {
          setSelectedPreferences([...selectedPreferences, preference]);
        } else {
          console.error("Failed to add preference to the database");
        }
      } catch (error) {
        console.error("Error adding preference:", error);
      }
    }
  };
  const [editedData, setEditedData] = useState({
    name: '',
    mobileNumber: '',
    username: '',
    email: ''
  });

  useEffect(() => {
    const fetchData = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            const { username } = user; // Get username from local storage
            try {
                const response = await fetch(`http://localhost:3002/tourist/profile/${username}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }

                const data = await response.json();
                setProfileData(data);
                setEditedData({
                    ...data,
                    mobileNumber: data.mobileNumber || "",
                    email: data.email || "",
                    name: data.username || "" ,// Default to empty string if no description,
                    nationality : data.nationality ,
                    work_status : data.work_status 
                  });
            } catch (err) {
                console.error(err);
                setProfileData(null);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    fetchData();
    }, []);
  
  const handleEditToggle = () => {
    setEditMode(!editMode);
  };
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically update the field based on the name
    }));
  };
  const levelBadge = () => {
    if (profileData?.level === 1) {
      return "★";  // 1 star for level 1
    } else if (profileData?.level === 2) {
      return "★★"; // 2 stars for level 2
    } else if (profileData?.level === 3) {
      return "★★★"; // 3 stars for level 3
    } else {
      console.log("No level badge found");
      return null; // If no level exists, return null
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
    setProfileImage(defaultProfileImage);
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const { username } = user;
      localStorage.removeItem(`sellerProfileImage_${username}`);
    }
  };


 


  const handleAddInfo = () => {
    setEditMode2(true); // Make sure edit mode for profile is off
    setShowCreateProfileForm(true); // Open the profile creation form
  };
  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const { username } = user;
      const response = await fetch(`http://localhost:3002/tourists/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedData), // Send updated name and description
      });

      if (!response.ok) throw new Error("Failed to save profile data");

      setProfileData(editedData); // Update the profile data on success
      setEditMode2(false); // Turn off edit mode after saving
    } catch (err) {
      setError("Error saving profile. Please try again.");
      console.error(err);
    }
  };

  const handleCreateProfileSave = async (newProfileData) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const { username } = user;
      const response = await fetch(`http://localhost:3002/tourists/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProfileData),
      });
      if (!response.ok) throw new Error("Failed to save profile data");
      setProfileData(newProfileData);
      setEditMode2(false); // Hide the form after saving
    } catch (err) {
      console.error(err);
      setError("Error saving profile info.");
    }
  };

  const handleRemove = async (preference) => {
    try {
      // Remove the selected preference from the database
      const response = await axios.post("http://localhost:3002/tourist/preferences", {
        username: localStorage.getItem("user"), // Assuming you store the logged-in user's username in localStorage
        preference,
        action: "remove", // Specify the action
      });
  
      if (response.status === 200) {
        setSelectedPreferences(
          selectedPreferences.filter((item) => item !== preference)
        );
      } else {
        console.error("Failed to remove preference from the database");
      }
    } catch (error) {
      console.error("Error removing preference:", error);
    }
  };

  const filteredPreferences = tags.filter((preference) =>
    preference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const { username } = user;
      try {
        const response = await fetch(
          `http://localhost:3002/tourist/profile/${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setProfileData(data);
        setFormData(data); // Initialize form data with fetched data
      } catch (err) {
        console.error(err);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

 

  const handleEditMode = () => {
    setEditMode(true); // Enable edit mode
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const { username } = user;
    try {
      const response = await fetch(
        `http://localhost:3002/tourists/${username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // Send the updated formData
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.message || "Failed to update profile data."
        );
      }

      const result = await response.json();
      console.log(result);
      alert(result.message);
      setEditMode(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    levelBadge();
    fetchData();
  }, []);

  const handleRedeemPoints = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const username = user?.username;

      if (!username) {
        return alert("User not found.");
      }

      const response = await axios.post(
        "http://localhost:3002/tourist/redeem-points",
        { username }
      );

      setMessage(response.data.message);
      setIsSuccess(true);
      setWallet(response.data.newWalletBalance);
      setLoyaltyPoints(response.data.remainingPoints);
      setLevel(response.data.newlevel); // Set new level

      fetchData();
    } catch (error) {
      console.error("Error redeeming points:", error);
      setMessage("Failed to redeem points. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profileData) {
    return <div>No profile data available</div>;
  }

  return (
    <div>
      <TouristNavbar></TouristNavbar>
      {!showTable && (
        <div className="container d-flex justify-content-center" style={{marginTop:"-35px"}}>

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
                      name="wallet"
                      value={editedData.wallet || ""} // Default to empty string if no description
                     
                      placeholder="wallet"
                    />
                  ) : (
                    <>Wallet : {profileData?.wallet}</> // Display updated name
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
                      name="loyalityPoints"
                      value={editedData.loyaltyPoints || ""} // Default to empty string if no description
                      
                      placeholder="loyalityPoints"
                    />
                  ) : (
                    <>Loyality Points : {profileData?.loyaltyPoints}</> // Display updated description
                  )}
                </span>
                
              </div>

              {/* Footer with social media icons */}
              <div className="social-media-icons">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <FaFacebook size={24} style={{ marginRight: "10px" ,marginTop:"20px"}} />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagram size={24}  style={{marginTop:"20px"}}  />
                </a>
              </div>
            </div>

          </div>


          {/* Create Profile Form */}
          {editMode2 ? (
            <div className="card p-4 ms-3" style={{ width: "400px" }}>
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
                
                {/* Description Field */}
                <div className="mb-3">
                      
                  <label htmlFor="mobileNumber" className="form-label custom-label" style={{ color: "#5ddec2" }}>Phone</label>
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
                <div className="mb-3">
  <label htmlFor="date_of_birth" className="form-label custom-label" style={{ color: "#5ddec2" }}>Date Of Birth</label>
  <input
    type="date"
    className="form-control custom-input"
    id="date_of_birth"
    name="date_of_birth"
    value={editedData.date_of_birth || ""}
    onChange={handleInputChange}
    required
    readOnly={!editMode2} // Set readOnly based on editMode2
  />
</div>


                <div className="mb-3">
                  <label htmlFor="nationality" className="form-label custom-label" style={{ color: "#5ddec2" }}>Nationality</label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    id="nationality"
                    name="nationality"
                    value={editedData.nationality || ""}
                    onChange={handleInputChange}
                    required
                    readOnly={!editMode2}  // Set readOnly based on editMode2
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="work_status" className="form-label custom-label" style={{ color: "#5ddec2" }}>Work Status</label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    id="work_status"
                    name="work_status"
                    value={editedData.work_status || ""}
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
            <div className="card p-4 ms-3" style={{ width: "400px" }}>
              <h2 className="mb-4">Profile</h2>



              {/* Email Field (Read-Only) */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label custom-label " style={{ color: "#5ddec2" }}>Email</label>
                <p>
                  {editedData.email || ""}
                </p>

              </div>
              {/* Name Field (Read-Only) */}
              

              {/* Description Field (Read-Only) */}
              <div className="mb-3">
                <label htmlFor="phone" className="form-label custom-label" style={{ color: "#5ddec2" }}>Phone</label>
                <p >
                    {editedData.mobileNumber || ""}
                </p>
              </div>
              <div className="mb-3">
  <label htmlFor="date_of_birth" className="form-label custom-label" style={{ color: "#5ddec2" }}>Date Of Birth</label>
  <p>
    {editedData.date_of_birth 
      ? new Date(editedData.date_of_birth).toLocaleDateString('en-GB')  // Format the date in DD/MM/YYYY
      : ""}
  </p>
</div>


              <div className="mb-3">
                <label htmlFor="nationality" className="form-label custom-label" style={{ color: "#5ddec2" }}>Nationality</label>
                <p >
                    {editedData.nationality || ""}
                </p>
              </div>

              <div className="mb-3">
                <label htmlFor="work_status" className="form-label custom-label" style={{ color: "#5ddec2" }}>Work Status</label>
                <p >
                    {editedData.work_status || ""}
                </p>
              </div>
              { (
 <div 
 style={{
   position: 'absolute',
   top: '15px',
   right: '15px',
   fontSize: '28px', // Adjust the size of the stars
   color: '#FFB300', // Darker yellow color
 }}
>
 {profileData?.level === 1 && "★"}  {/* One star for level 1 */}
 {profileData?.level === 2 && "★★"} {/* Two stars for level 2 */}
 {profileData?.level === 3 && "★★★"} {/* Three stars for level 3 */}
</div>


)}
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
export default ViewProfile;