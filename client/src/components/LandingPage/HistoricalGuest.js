import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import "../../styles/HistoricalGuest.css";
import { useNavigate } from "react-router-dom";


function HistoricalGuest() {
    const [historicalPlaces, setHistoricalPlaces] = useState([]);
    const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTag, setSearchTag] = useState(""); // State for the search input
  const [tags, setTags] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3002/historical-places")
      .then((response) => {
        setHistoricalPlaces(response.data);
        setLoading(false);

        const allTags = new Set();
        response.data.forEach((place) => {
          place.tags.forEach((tag) => allTags.add(tag));
        });
        setTags(Array.from(allTags));
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching historical places.");
        setLoading(false);
      });
  }, []);

 
    return (
      
        <div id="historical-section" className="d-flex flex-column">
          <p className="fs-3 ms-4 text-center" style={{color: '#5ddec2'}}>Visit Today</p>
            <div className="container">
          <div className="row text-center">
            {historicalPlaces.slice(0, 3).map((place, index) => (
              <div
                key={place._id || index}
                className="col-lg-4 col-md-6 col-sm-12 mb-4 text-start d-flex"
              >
                <div className="card rounded-3 p-2 mt-lg-0 mt-4 flex-grow-1">
                  {/* Title */}
                  <div
                  className="activity-img mb-2 d-flex align-items-end"
                   style={{
                  backgroundImage: place.pictures[0]
                  ? `url(http://localhost:3002/${place.pictures[0].replace(/\\/g, "/")})`
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
                          {place.name}
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
                            navigate(`/hp-guest-details/${place._id}`)
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
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="fw-bold mb-0">{place.location}</p>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="#5ddec2"
                        class="bi bi-buildings"
                        viewBox="0 0 16 16"
                      >
                        <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022M6 8.694 1 10.36V15h5zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5z" />
                        <path d="M2 11h1v1H2zm2 0h1v1H4zm-2 2h1v1H2zm2 0h1v1H4zm4-4h1v1H8zm2 0h1v1h-1zm-2 2h1v1H8zm2 0h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zM8 7h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zM8 5h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm0-2h1v1h-1z" />
                      </svg>
                      <span className="ms-2" style={{ fontSize: "15px" }}>
                        {place.category}
                      </span>
                    </div>
                    <div>
                      <div className="d-flex justify-content-end align-items-center mt-auto mb-2">
                        {/* Render stars based on the rating */}
                        <p className="fw-bold align-self-end">
                          {place.openingHours}
                        </p>
                        {/* {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            className={`me-1 ${
                              index < activity.rating
                                ? "text-warning"
                                : "text-secondary"
                            }`}
                          >
                            ★
                          </span>
                        ))} */}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    {/* <div
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
                    </div> */}
                    <div className="d-flex flex-row " style={{ width: "100%" }}>
                      <div className="w-100 ">
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
                            Entry Fee
                          </span>
                          <ul className="mb-0 ">
                            <li>Foreign: ${place.entryFeeForeign}</li>
                            <li>Native: ${place.entryFeeNative}</li>
                            <li>Student: ${place.entryFeeStudent}</li>
                          </ul>
                        </div>
                        {/* <div
                        className="rounded-3 p-2"
                        style={{
                          background:
                            "linear-gradient(to bottom, #5ddec2, #a5e0d4, #c5e0da)",
                        }}
                      >
                        <span
                          className="fw-bold bg-white rounded-pill ms-2 px-2"
                          style={{ color: "#5ddec2" }}
                        >
                          Discounts
                        </span>
                        <p className="mb-0">{activity.specialDiscounts}</p>
                      </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
                <button className="btn btn-lg btn-more w-25 mx-auto mt-2 px-4 mb-3" 
                onClick={() => window.location.href = '/viewhistorical-guest'}>View More</button>
            
            </div>
    );
}
export default HistoricalGuest;