import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/Profile.module.css";
import travel1 from "../images/image_1.jpeg";
import travel2 from "../images/image_2.jpeg";
import travel3 from "../images/image3.jpeg";
import travel4 from "../images/image_4.jpeg";
import PreferenceDropdown from "./tourist-guest/PreferenceDropdown";

const TouristProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [wallet, setWallet] = useState(0); // Assuming wallet state is available
  const [loyaltyPoints, setLoyaltyPoints] = useState(0); // Assuming loyalty points are fetched initially
  const [level, setLevel] = useState(1); // Tourist level
  const { _id, username, email, nationality, mobileNumber, work_status } =
    location.state || {
      _id: "",
      username: "", // Mock data
      email: "", // Mock data
      nationality: "", // Mock data
      mobileNumber: "", // Mock data
      work_status: "", // Mock data
    };

 // Handle account deletion request
 const handleAccountDeletionRequest = async () => {
  navigate("/delete-reqs");
  };
  
  const handleRedeemPoints = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const username = user?.username;

      if (!username) {
        return alert("User not found.");
      }

      const response = await axios.post("http://localhost:3002/tourist/redeem-points", { username });
      
      setMessage(response.data.message);
      setWallet(response.data.newWalletBalance);
      setLoyaltyPoints(response.data.remainingPoints);
      setLevel(response.data.newlevel); // Set new level

    } catch (error) {
      console.error("Error redeeming points:", error);
      setMessage("Failed to redeem points. Please try again.");
      }
    };

  

  const handleRead = () => {
    navigate("/read-tourist-profile", {
      state: { username, email, nationality, mobileNumber, work_status },
    });
  };

  const handleUpdate = () => {
    navigate("/update-tourist-profile", {
      state: { username, email, nationality, mobileNumber, work_status },
    });
  };

  const handleSearch = () => {
    navigate("/search"); // Redirect to the search page
  };

  const handleViewProducts = () => {
    navigate("/product-tourist-page"); // Corrected to match the route in App.js
  };
  const handleViewActivities = () => {
    navigate("/tourist-activitypage");
  };
  const handleViewHistoricalPlaces = () => {
    navigate("/view-historicalPlaces");
  };
  const handleViewItenraries = () => {
    navigate("/view-upcoming-itenraries");
  };
  // New handlers for additional buttons
  const handleViewItinerariess = () => {
    navigate("/itineraries"); // Redirect to itineraries page
  };

  const handleViewHistoricalPlacess = () => {
    navigate("/historical-places"); // Redirect to historical places page
  };

  const handleViewActivitiess = () => {
    navigate("/activities"); // Redirect to activities page
  };
  const handleChangePassword = () => {
    navigate("/tourist-change-password"); // Redirect to the change password page
  };
  const handleComplaints = () => {
    navigate("/tourist-complaints"); // Redirect to the change password page
  };
  const handleViewPurchases = () => {
    // Navigate to the TouristPurchases page, passing the user ID from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const id = user?._id; // Get the user ID

    if (id) {
      navigate("/tourist-purchases", { state: { id } });
    } else {
      alert("User ID not found.");
    }
  };
  const handlefileComplaint = () => {
    navigate("/file-complaint"); // Redirect to the change password page
  };

  const handleViewBookedItineraries = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = user?._id;

    if (id) {
      navigate("/booked-itineraries", { state: { id } });
    } else {
      alert("User ID not found.");
    }
  };

  const handleViewBookedActivities = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = user?._id;
    if (id) {
      navigate("/booked-activities", { state: { id } });
    } else {
      alert("User ID not found.");
    }
  };

  const handleRateCommentItineraries = () => {
    navigate("/rate-comment-itineraries-tourguide");
  };

  
  const handleBookingTransportation = () => {
    navigate("/book-transportation"); // Redirect to the change password page
  };
  const handleBookingFlights = () => {
    navigate("/book-flight"); // Redirect to the change password page
  };
  const handleBookingHotel = () => {
    navigate("/book-hotel"); // Redirect to the change password page
  };

const handleAttendedActivities = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?._id; // Get the user ID

  if (id) {
      navigate("/attended-activites", { state: { id } });
  } else {
      alert("User ID not found.");
  }
}

const handleCart = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?._id; // Get the user ID

  if (id) {
      navigate("/cart", { state: { id } });
  } else {
      alert("User ID not found.");
  }
}

const handleWishlist = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?._id; // Get the user ID

  if (id) {
      navigate("/wishlist", { state: { id } });
  } else {
      alert("User ID not found.");
  }
}

const handleOrders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?._id; // Get the user ID

  if (id) {
      navigate("/orders", { state: { id } });
  } else {
      alert("User ID not found.");
  }
}

  return (
    <div className={styles.container}>
      <div className={styles.imageColumn}>
        <img src={travel1} alt="Travel 1" />
        <img src={travel2} alt="Travel 2" />
        <img src={travel3} alt="Travel 3" />
        <img src={travel4} alt="Travel 4" />
      </div>
      <div className={styles.mainContent}>
        <h3 className={styles.header}>Profile Page</h3>
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.btn} ${styles.btnInfo}`}
            onClick={handleRead}
          >
            Read Profile
          </button>
          <button
            className={`${styles.btn} ${styles.btnWarning}`}
            onClick={handleUpdate}
          >
            Update Profile
          </button>
          <button
            className={`${styles.btn} ${styles.btnSearch}`}
            onClick={handleSearch}
          >
            Search for Museums/Activities
          </button>
          <button
            className={`${styles.btn} ${styles.btnProducts}`}
            onClick={handleViewProducts}
          >
            View Products
          </button>
          <button
            className={`${styles.btn} ${styles.btnProducts}`}
            onClick={handleViewActivities}
          >
            View Activities
          </button>
          <button
            className={`${styles.btn} ${styles.btnProducts}`}
            onClick={handleViewItenraries}
          >
            View Itenraries
          </button>
          <button
            className={`${styles.btn} ${styles.btnProducts}`}
            onClick={handleViewHistoricalPlaces}
          >
            View HistoricalPlaces
          </button>{" "}
          {/* New button added here */}
          <button
            className={`${styles.btn} ${styles.btnInfo}`}
            onClick={handleViewItinerariess}
          >
            show Itineraries
          </button>
          <button
            className={`${styles.btn} ${styles.btnProducts}`}
            onClick={handleViewBookedItineraries}
          >
            View Booked Itineraries
          </button>
          <button
            className={`${styles.btn} ${styles.btnWarning}`}
            onClick={handleViewHistoricalPlacess}
          >
            Show Historical Places
          </button>
          <button
            className={`${styles.btn} ${styles.btnSearch}`}
            onClick={handleViewActivitiess}
          >
            Show Activities
          </button>
          <button
            className={`${styles.btn} ${styles.btnProducts}`}
            onClick={handleViewBookedActivities}
          >
            View Booked Activities
          </button>
          <button
            className={`${styles.btn} ${styles.btnWarning}`}
            onClick={handleChangePassword}
          >
            Change Password
          </button>
          <button
            className={`${styles.btn} ${styles.btnWarning}`}
            onClick={handlefileComplaint}
          >
            File Complaint
          </button>
          <button
            className={`${styles.btn} ${styles.btnWarning}`}
            onClick={handleComplaints}
          >
            My Complaints
          </button>
          <button
            className={`${styles.btn} ${styles.btnWarning}`}
            onClick={handleViewPurchases}
          >
            My Purchases
          </button>
          <button
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={handleAccountDeletionRequest}
          >
            Request Account Deletion
          </button>
          <button
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={handleRateCommentItineraries}
          >
            Rate & Comment on Itineraries & Tour Guides
          </button>
          <button
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={handleRedeemPoints}
          >
            Redeem Points
          </button>
          <button
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={handleBookingTransportation}
          >
            Book Transportation
          </button>
          <button
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={handleBookingFlights}
          >
            Book Flight
          </button>
          <button
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={handleBookingHotel}
          >
            Book Hotel
          </button>
          <PreferenceDropdown></PreferenceDropdown>
        </div>
        
          <button className={`${styles.btn} ${styles.btnWarning}`} onClick={handleAttendedActivities}>
            Attended Activities
          </button>

          <button className={`${styles.btn} ${styles.btnWarning}`} onClick={handleCart}>
            Cart
          </button>

          <button className={`${styles.btn} ${styles.btnWarning}`} onClick={handleWishlist}>
            WishList
          </button>

          <button
        onClick={() => navigate("/my-promo-codes")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        View My Promo Codes
      </button>

          <button className={`${styles.btn} ${styles.btnWarning}`} onClick={handleOrders}>
            Orders
          </button>


        {/* Display success or failure message */}
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default TouristProfile;
