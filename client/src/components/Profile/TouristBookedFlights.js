import TouristNavbar from "./TouristNavbar";
import React, { useState, useEffect } from "react";
import axios from "axios";

function TouristBookedFlights() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const user = JSON.parse(localStorage.getItem("user")); // Get the logged-in user's info
    const username = user ? user.username : null;

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:3002/tourist/profile/${username}`);
            setFlights(response.data.bookedFlights || []); // Retrieve bookedFlights
            setLoading(false);
          } catch (err) {
            setError("Unable to fetch flight details");
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);

  return (
    <>
    <TouristNavbar />
    <p className="fs-3 ms-3 my-4 text-center" style={{color: '#5ddec2'}}>Booked Flights</p>
    <div>
          {
            flights.map((flight, index) => (
              <div className="ticket-container" key={index}>
                <div className="ticket">
                  <ul className="left">
                    {Array(14)
                      .fill(null)
                      .map((_, i) => (
                        <li key={i}></li>
                      ))}
                  </ul>
                  <ul className="right">
                    {Array(14)
                      .fill(null)
                      .map((_, i) => (
                        <li key={i}></li>
                      ))}
                  </ul>
                  <div className="ticket-header">
                    <h3 className="airline">{flight.source}</h3>
                    <p className="boarding">Boarding Pass</p>
                  </div>
                  <div className="content">
                    <div className="main-details">
                      <span className="departure">
                        {flight.origin}
                      </span>
                      <span className="plane">✈️</span>
                      <span className="arrival">
                        {
                          flight.destination
                        }
                      </span>
                    </div>
                    <div className="sub-content">
                      <span className="name">
                        Price
                        <br />
                        <span>
                          {flight.totalPrice}
                        </span>
                      </span>
                      <span className="flight">
                        Offer ID
                        <br />
                        <span>{flight.bookingId}</span>
                      </span>
                      
                      <span className="boardingtime">
                        Departure
                        <br />
                        <span>
                          {new Date(
                            flight.departureDate
                          ).toLocaleString()}
                        </span>
                      </span>
                      <span className="seat">
                        Arrival
                        <br />
                        <span>
                          {new Date(
                            flight.returnDate
                          ).toLocaleString()}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="barcode"></div>
                </div>

                {/* {bookingMessages[flight.id] && (
                  <p className="booking-message">
                    {bookingMessages[flight.id]}
                  </p>
                )} */}
              </div>
            ))
          }
        </div>
        </>
  );
}   
export default TouristBookedFlights;