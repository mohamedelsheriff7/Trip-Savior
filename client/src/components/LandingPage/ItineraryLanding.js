import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
//import "./Tourist.css";
import departure from "../../images/departures.svg";
import arrival from "../../images/arrivals.svg";
import backgroundImage from "../../images/airplane.jpg";
import CustomNavbar from "../CustomNavbar";

function ItineraryLanding(){
    const navigate = useNavigate();
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPriceChecked, setIsPriceChecked] = useState(false);
    const [isRatingChecked, setIsRatingChecked] = useState(false);
    const [showSort, setShowSort] = useState(false);

    const fetchItineraries = async () => {
        try {
          setLoading(true); // Show loading state
          const response = await axios.get("http://localhost:3002/itinerary");
          setItineraries(response.data); // Update state with fetched data
          setLoading(false); // Hide loading state
        } catch (err) {
          setError("Failed to load itineraries. Please try again.");
          setLoading(false);
          console.error("Error fetching itineraries:", err);
        }
      };

      useEffect(() => {
        fetchItineraries();
      }, []);

      return(
        <>
        <div className="d-flex flex-column">
        <div className="container mt-5">
            <p className="fs-3 ms-3 text-center" style={{color: '#5ddec2'}}>Our Itineraries</p>
          <div className="row text-center">
          {itineraries.slice(0, 3).map((itinerary, index) => (
              <div
                key={itinerary._id || index}
                className="col-lg-4 col-md-6 col-sm-12 mb-4 text-start d-flex"
              >
                <div className="card rounded-3 p-2 mt-lg-0 mt-4 flex-grow-1">
                  {/* Title */}
                  <div
                  className="activity-img mb-2 d-flex align-items-end"
                   style={{
                  backgroundImage: itinerary.pictures[0]
                  ? `url(http://localhost:3002/${itinerary.pictures[0].replace(/\\/g, "/")})`
                    : "none", // Fallback if there's no image path
                   }}
                  >
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
                          onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                          onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                          onClick={() => navigate(`/itinerary-guest/${itinerary._id}`)}
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
                      {/* <ShareLink type="itinerary" id={itinerary._id} /> */}
                    </div>
                    {/* Price */}
                    <div
                      className="d-flex  justify-content-end rounded p-2"
                      style={{ width: "50%" }}
                    >
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="d-flex w-100 justify-content-center align-items-center">
        <button className="btn btn-lg btn-more w-25 mt-2" 
                onClick={() => window.location.href = '/guest-itinerary'}>View More</button>
                </div>
        </div>
        </div>
        </>
      );
    

}
export default ItineraryLanding;