import TouristNavbar from "./TouristNavbar";
import React, { useState, useEffect } from "react";
import axios from "axios";

function TouristBookedHotels() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const user = JSON.parse(localStorage.getItem("user")); // Get the logged-in user's info
    const username = user ? user.username : null;

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:3002/tourist/profile/${username}`);
            setHotels(response.data.bookedHotels || []); // Retrieve bookedHotels
            setLoading(false);
          } catch (err) {
            setError("Unable to fetch hotel details");
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);

  return (
    <>
    <TouristNavbar />
    <p className="fs-3 ms-3 my-4 text-center" style={{color: '#5ddec2'}}>Booked Hotels</p>
    <div className="container px-5">
     {hotels.map((hotel, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.hotelName}>{hotel.hotelName}</h3>
              <p style={styles.cityCode}>
                City Code: {hotel.location}
              </p>
            </div>
            <div style={styles.cardBody}>
                  <div key={hotel.id} style={styles.offerContainer}>
                    <div style={styles.detailsRow}>
                      <span style={styles.detailLabel}>Check-In:</span>
                      <span style={styles.detailValue}>
                        {hotel.checkInDate}
                      </span>
                    </div>
                    <div style={styles.detailsRow}>
                      <span style={styles.detailLabel}>Check-Out:</span>
                      <span style={styles.detailValue}>
                        {hotel.checkOutDate}
                      </span>
                    </div>
                    <div style={styles.detailsRow}>
                      <span style={styles.detailLabel}>Price:</span>
                      <span style={styles.price}>
                     {hotel.totalPrice}
                      </span>
                    </div>
                    {/* <div style={styles.detailsRow}>
                      <span style={styles.detailLabel}>Description:</span>
                      <span style={styles.detailValue}>
                        {offer.room.description.text}
                      </span>
                    </div> */}
                    
                  </div>
                
            </div>
          </div>
        ))
        }
    </div>
    </>
  );
}
export default TouristBookedHotels;

const styles = {
    container: {
      width: "100%",
      margin: "50px auto",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      backgroundColor: "#ffffff",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#2c3e50",
      fontSize: "24px",
      fontWeight: "bold",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      gap: "20px",
    },
    inputContainer: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    label: {
      fontWeight: "bold",
      marginBottom: "8px",
      color: "#2c3e50",
    },
    input: {
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #bdc3c7",
      fontSize: "16px",
      outline: "none",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      transition: "border-color 0.3s",
    },
    buttonContainer: {
      textAlign: "center",
    },
    button: {
      padding: "10px 20px",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#ffffff",
      backgroundColor: "#5ddec2",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    card: {
      display: "flex",
      flexDirection: "row",
      border: "1px solid #ddd",
      borderRadius: "8px",
      margin: "20px auto",
      padding: "15px",
      maxWidth: "800px",
      boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
      backgroundColor: "#fff",
      fontFamily: "'Roboto', sans-serif",
    },
    cardImageContainer: {
      flex: "1 1 40%",
      maxWidth: "40%",
      marginRight: "15px",
    },
    cardImage: {
      width: "100%",
      borderRadius: "8px",
      objectFit: "cover",
    },
    cardContent: {
      flex: "2 1 60%",
      padding: "10px",
    },
    hotelName: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#34495e",
      marginBottom: "10px",
    },
    hotelLocation: {
      fontSize: "14px",
      color: "#7f8c8d",
      marginBottom: "15px",
    },
    offerDetails: {
      padding: "10px 0",
      borderBottom: "1px solid #e5e5e5",
      marginBottom: "10px",
      fontSize: "14px",
      lineHeight: "1.5",
    },
    bookButton: {
      display: "inline-block",
      marginTop: "10px",
      padding: "10px 20px",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#fff",
      backgroundColor: "#2ecc71",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    bookButtonHover: {
      backgroundColor: "#27ae60",
    },
    bookingMessage: {
      display: "block",
      marginTop: "10px",
      textAlign: "center",
      color: "#e74c3c",
      fontWeight: "bold",
    },
    warningText: {
      color: "#e74c3c",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    noOffersText: {
      color: "#95a5a6",
      fontStyle: "italic",
      textAlign: "center",
      marginTop: "10px",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#1c5954", // Darker shade of #5ddec2
      fontSize: "28px",
      fontWeight: "bold",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      margin: "20px auto",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      border: "1px solid #e1f4f0",
    },
    cardHeader: {
      backgroundColor: "#ffffff", // Darker shade of #5ddec2
  
      color: "#ffffff",
      padding: "15px",
      fontSize: "20px",
      borderBottom: "2px solid #45b7a4",
    },
    hotelName: {
      margin: "0",
      fontWeight: "bold",
      fontSize: "22px",
    },
    cityCode: {
      margin: "5px 0 0",
      fontSize: "16px",
      color: "#a3d8d0", // Subtle shade complementing #5ddec2
    },
    cardBody: {
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    offerContainer: {
      padding: "15px",
      borderRadius: "8px",
      backgroundColor: "#f9fdfc", // Very light complement to #5ddec2
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    detailsRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
    },
    detailLabel: {
      fontWeight: "bold",
      color: "#1c5954",
    },
    detailValue: {
      color: "#4e7f7a",
    },
    price: {
      color: "#ff6f61",
      fontWeight: "bold",
      fontSize: "18px",
    },
    bookButton: {
      display: "inline-block",
      padding: "10px 20px",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#5ddec2", // Text matches the palette
      backgroundColor: "#ffffff", // White background
      border: "2px solid #5ddec2", // Border matches the palette
      borderRadius: "6px",
      cursor: "pointer",
      transition: "box-shadow 0.3s, background-color 0.3s",
      margin: "10px auto 0", // Centered button
      textAlign: "center",
    },
    bookButtonHover: {
      boxShadow: "0 4px 8px rgba(93, 222, 194, 0.5)", // Shadow with #5ddec2
      backgroundColor: "#f0fcf8", // Subtle background hover effect
    },
    bookingMessage: {
      marginTop: "10px",
      textAlign: "center",
      color: "#e74c3c",
      fontWeight: "bold",
    },
    noOffersText: {
      color: "#95a5a6",
      fontStyle: "italic",
      textAlign: "center",
    },
  };
  