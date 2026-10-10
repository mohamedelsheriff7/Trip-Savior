import TouristNavbar from "./TouristNavbar";
import React, { useState, useEffect } from "react";
import axios from "axios";

function TouristBookedTransport(){
  const [transportations, setTransportations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user")); // Get the logged-in user's info
  const username = user ? user.username : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/tourist/profile/${username}`);
        setTransportations(response.data.bookedTransportations || []); // Retrieve bookedTransportations
        setLoading(false);
      } catch (err) {
        setError("Unable to fetch transportation details");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return(
    <> 
    <TouristNavbar />
    <p className="fs-3 ms-3 my-4 text-center" style={{color: '#5ddec2'}}>Booked Transport</p>
    {
        transportations.map((option) => (
          <div key={option.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.ticketTitle}>{option.type}</h3>
              <p style={styles.cityCode}>City: {option.city}</p>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.detailsRow}>
                <span style={styles.detailLabel}>Company:</span>
                <span style={styles.detailValue}>{option.name}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailLabel}>Price:</span>
                <span style={styles.price}>${option.price} USD</span>
              </div>
              <div style={styles.bookButtonContainer}>
              </div>
            </div>
          </div>
        ))
      }

    </>
  );

}

const styles = {
    container: {
      width: "80%",
      margin: "50px auto",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#ffffff",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#2c3e50",
      fontSize: "26px",
      fontWeight: "bold",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      marginBottom: "20px",
    },
    inputContainer: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "15px",
    },
    label: {
      fontWeight: "bold",
      marginBottom: "8px",
      color: "#2c3e50",
    },
    input: {
      padding: "12px",
      borderRadius: "5px",
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
      padding: "12px 24px",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#ffffff",
      backgroundColor: "#5ddec2",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    card: {
      display: "flex",
      flexDirection: "column",
      border: "1px solid #ddd",
      borderRadius: "8px",
      margin: "20px auto",
      padding: "20px",
      maxWidth: "700px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
      fontFamily: "'Roboto', sans-serif",
    },
    cardHeader: {
      borderBottom: "1px solid #ddd",
      marginBottom: "15px",
      paddingBottom: "10px",
    },
    ticketTitle: {
      fontSize: "22px",
      fontWeight: "bold",
      color: "#2c3e50",
      margin: 0,
    },
    cityCode: {
      fontSize: "14px",
      color: "#7f8c8d",
    },
    cardBody: {
      display: "flex",
      flexDirection: "column",
    },
    detailsRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "12px",
    },
    detailLabel: {
      fontWeight: "bold",
      color: "#2c3e50",
    },
    detailValue: {
      color: "#34495e",
    },
    price: {
      color: "#e74c3c",
      fontWeight: "bold",
      fontSize: "18px",
    },
    bookButtonContainer: {
      textAlign: "center",
      marginTop: "20px",
    },
    bookButton: {
      padding: "12px 24px",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#ffffff",
      backgroundColor: "#5ddec2",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    bookingMessage: {
      marginTop: "10px",
      color: "#e74c3c",
      fontWeight: "bold",
      textAlign: "center",
    },
    noOffersText: {
      color: "#95a5a6",
      fontStyle: "italic",
      textAlign: "center",
    },
  };

export default TouristBookedTransport;