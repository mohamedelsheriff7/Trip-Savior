import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import departure from "../../images/departures.svg";
import arrival from "../../images/arrivals.svg";
import backgroundImage from "../../images/airplane.jpg";
import TouristNavbar from "./TouristNavbar";
import ShareLinkItinerary from "../ShareLinkItinerary"; // Import the ShareLink component


const TouristBookedItineraries = () => {
    const navigate = useNavigate();
  const [bookedItineraries, setBookedItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookedItineraries = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          setError("No username found in local storage");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3002/itinerary");
        const filteredItineraries = response.data.filter(itinerary =>
          itinerary.bookedBy.includes(user.username)
        );

        console.log("Filtered itineraries:", filteredItineraries);

        setBookedItineraries(filteredItineraries);
      } catch (error) {
        console.error("Error fetching booked itineraries:", error);
        setError("Could not fetch booked itineraries");
      } finally {
        setLoading(false);
      }
    };

    fetchBookedItineraries();
  }, []);

  const handleCancelBooking = async (itineraryId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("User not found. Please log in again.");
        return;
      }
  
      // Find the itinerary to cancel
      const itineraryToCancel = bookedItineraries.find(itinerary => itinerary._id === itineraryId);
  
      if (!itineraryToCancel) {
        alert("Itinerary not found.");
        return;
      }
  
      // Update bookedBy array for the selected itinerary
      const updatedItineraries = bookedItineraries.map((itinerary) => {
        if (itinerary._id === itineraryId) {
          return {
            ...itinerary,
            bookedBy: itinerary.bookedBy.filter((username) => username !== user.username)
          };
        }
        return itinerary;
      });
  
      const updatedItinerary = updatedItineraries.find(itinerary => itinerary._id === itineraryId);
  
      // Send the updated bookedBy array and booked status to the backend
      await axios.put(`http://localhost:3002/itinerary/${itineraryId}`, {
        booked: updatedItinerary.bookedBy.length > 0, // Set to true if there are still users booked
        bookedBy: updatedItinerary.bookedBy
      });
  
      // Remove the itinerary from the user's bookedItineraries array
      await axios.put(`http://localhost:3002/users/${user.username}/cancelItinerary/${itineraryId}`);
  
      // Refund the itinerary price to the user's wallet
      const refundAmount = itineraryToCancel.price; // Assuming the price field exists in the itinerary schema
      await axios.put(`http://localhost:3002/users/${user.username}/wallet`, {
        refundAmount,
      });
  
      // Update the UI to reflect the cancellation
      setBookedItineraries(updatedItineraries.filter(itinerary => itinerary._id !== itineraryId));
      alert(`Booking cancelled successfully. $${refundAmount} has been refunded to your wallet.`);
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };
  
  

  const isCancelable = (dateTime) => {
    const currentTime = new Date();
    const itineraryTime = new Date(dateTime);
    const timeDifference = itineraryTime - currentTime;
    return timeDifference >= 48 * 60 * 60 * 1000; // 48 hours in milliseconds
  };



  return (
    <>
    <TouristNavbar />
    <p className="fs-3 ms-3 my-4 text-start" style={{color: '#5ddec2'}}>Booked Itineraries</p>
    <div className="container my-5">
          <div className="row text-center">
            {bookedItineraries.map((itinerary, index) => (
              <div
                key={itinerary._id || index}
                className="col-lg-4 col-md-6 col-sm-12 mb-4 text-start d-flex"
              >
                <div className="card rounded-3 p-2 mt-lg-0 mt-4 flex-grow-1">
                  {/* Title */}
                  <div className="itinerary-img mb-2 d-flex align-items-end">
                    <div className="itinerary-title d-flex justify-content-between align-items-end w-100">
                      <div className="d-flex flex-column justify-content-start px-2 pb-2">
                        <h4
                          className="mb-1" /* Ensures consistent spacing below the title */
                          style={{
                            color: "white",
                            opacity: "0.9",
                            textAlign: "left", // Ensures alignment is consistent
                          }}
                        >
                          {itinerary.Itinerary_Name}
                        </h4>
                        <a
                          className="text-white ps-0"
                          style={{ opacity: "0.7", fontSize: "14px" }}
                          onMouseEnter={(e) =>
                            (e.target.style.textDecoration = "underline")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.textDecoration = "none")
                          }
                          onClick={() =>
                            navigate(`/itinerary/${itinerary._id}`)
                          }
                        >
                          View Details
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            fill="currentColor"
                            className="bi bi-box-arrow-up-right ms-1 mb-1"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"
                            />
                          </svg>
                        </a>
                      </div>
                      <div className="me-3 mt-2 mb-2">
                        <ShareLinkItinerary
                          type="itinerary"
                          id={itinerary._id}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="fw-bold">
                        {new Date(itinerary.date_time).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>

                      {/* <ul
                        style={{ padding: "0", margin: "0", listStyle: "none" }}
                      >
                        {itinerary.activity.map((act, index) => (
                          <li key={index}>
                            <span
                              className="rounded-pill text-center px-2 mb-1"
                              style={{
                                display: "inline-block",
                                backgroundColor: "#5ddec2",
                                color: "#ffffff",
                                width: "110px",
                              }}
                            >
                              {act.time}
                            </span>{" "}
                            {act.name}
                          </li>
                        ))}
                      </ul> */}
                      <div className="d-flex flex-column justify-content-start align-items-start ms-3">
                        <div className="d-flex align-items-center">
                          <img
                            src={departure}
                            alt="departure"
                            className="me-1"
                            style={{
                              width: "18px",
                              height: "18px",
                              objectFit: "cover",
                            }}
                          />
                          <span className="ms-2">
                            {itinerary.pickupLocation}
                          </span>
                        </div>
                        <div className="d-flex align-items-center mt-2">
                          <img
                            src={arrival}
                            alt="departure"
                            className="me-1"
                            style={{
                              width: "18px",
                              height: "18px",
                              objectFit: "cover",
                            }}
                          />
                          <span className="ms-2">
                            {itinerary.dropoffLocation}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="d-flex justify-content-end align-items-center mt-auto mb-2">
                        {/* Render stars based on the rating */}

                        {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            className={`me-1 ${
                              index < itinerary.rating
                                ? "text-warning"
                                : "text-secondary"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <div
                      className="rounded-3 w-50 p-2"
                      style={{
                        background:
                          "linear-gradient(to bottom, #5ddec2, #a5e0d4, #c5e0da)",
                      }}
                    >
                      <span
                        className="fw-bold bg-white rounded-pill ms-2 px-2"
                        style={{ color: "#5ddec2" }}
                      >
                        Locations
                      </span>
                      <p className="mb-0 ms-2">
                        {itinerary.locationToBeVisited.join(", ")}
                      </p>
                    </div>
                    <div
                      className="d-flex flex-column ps-3"
                      style={{ width: "50%" }}
                    >
                      <div
                        className="rounded-3 p-2 mb-2"
                        style={{
                          background:
                            "linear-gradient(to bottom, #5ddec2, #a5e0d4, #c5e0da)",
                        }}
                      >
                        <span
                          className="fw-bold bg-white rounded-pill ms-2 px-2"
                          style={{ color: "#5ddec2" }}
                        >
                          Preferences
                        </span>
                        <p className="mb-0 ms-2">
                          {itinerary.preferences.join(", ")}
                        </p>
                      </div>
                      <div
                        className="d-flex justify-content-between rounded-3 p-2"
                        style={{
                          background:
                            "linear-gradient(to bottom, #5ddec2, #a5e0d4, #c5e0da)",
                        }}
                      >
                        <span
                          className="fw-bold bg-white rounded-pill ms-2 px-2"
                          style={{ color: "#5ddec2" }}
                        >
                          Language
                        </span>
                        <p className="mb-0">{itinerary.languageOfTour}</p>
                      </div>
                    </div>
                  </div>

                  {/* Book Button */}
                  <div
                    style={{ bottom: "0" }}
                    className="d-flex justify-content-between text-center pt-1 mt-auto"
                  >
                    {/* Book Button */}
                    <div className="d-flex flex-column text-start w-50">
                      
                      {isCancelable(itinerary.date_time) ? (
                  <button
                    className="btn btn-lg btn-more px-4 mt-2 flex-grow-1 me-2 mb-1"
                    onClick={() => handleCancelBooking(itinerary._id)}
                  >
                    Cancel Booking
                  </button>
                ) : (
                  <p className="text-muted">Booking can no longer be canceled within 48 hours of the event.</p>
                )}
                      {/* <ShareLink type="itinerary" id={itinerary._id} /> */}
                    </div>
                    {/* Price */}
                    <div
                      className="d-flex  justify-content-end rounded p-2"
                      style={{ width: "50%" }}
                    >
                      <span className="text-black fs-3 fw-bold">
                        ${itinerary.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </>
  );
};

export default TouristBookedItineraries;
