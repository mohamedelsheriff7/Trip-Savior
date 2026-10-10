// src/components/ItineraryDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TouristNavbar from "./TouristNavbar";
import ShareLinkItinerary from "../ShareLinkItinerary"; // Import the ShareLink component
import { useNavigate } from "react-router-dom";
import backButtonImage from "../../images/backbutton.png"; // Adjust path if necessary


const ViewHPGuestDetails = () => {
    const navigate = useNavigate(); // Initialize navigate

    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchPlace = async () => {
        try {
          const response = await axios.get(`http://localhost:3002/historical-places/${id}`);
          setPlace(response.data);
        } catch (error) {
          setError("Failed to load historical place data.");
        } finally {
          setLoading(false);
        }
      };
      fetchPlace();
    }, [id]);
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
  

  return (
    <>
    <div>
            <button
              onClick={() => navigate("/tourist-hp")}
              className=""
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                position: "absolute",
                top: "10%",
                left: "0",
                padding: 0,
              }}
            >
              <img
                src={backButtonImage}
                alt="Back to previous page"
                style={{
                  width: "85px",
                  height: "85px",
                }}
              />
            </button>
          </div>
      <TouristNavbar />
      <div className="container-fluid p-0 w-75 mx-auto">
        <div
          className="activity-details-img mb-2 d-flex align-items-end"
          style={{
            backgroundImage: `url(${place.pictures[0]})`,
          }}
        >
          <div className="itinerary-title d-flex justify-content-between align-items-end w-100">
            <div className="d-flex flex-column justify-content-start px-2 pb-2">
              <h1
                className="mb-1 fs-1" /* Ensures consistent spacing below the title */
                style={{
                  color: "white",
                  opacity: "0.9",
                  textAlign: "left", // Ensures alignment is consistent
                }}
              >
                {place.name}
              </h1>
            </div>
            <div className="me-3 mt-2 mb-2">
              <ShareLinkItinerary type="itinerary" id={place._id} />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-start my-3">
          <div>
            <p className="fw-bold fs-4 mb-0">
              {place.location}
            </p>
            <div className="d-flex align-items-center mt-0 fs-5">
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
                          <span className="ms-2">{place.category}</span> 
                        </div>
          </div>

          <div>
            <div className="d-flex justify-content-end align-items-center mt-auto mb-2 fs-4">
              {/* Render stars based on the rating */}

              {place.openingHours}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between">
         
          <div className="d-flex flex-row w-100 justify-content-between w-100">
            <div
              className="d-flex flex-column ps-3 fs-5 me-2"
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
                  Description
                </span>
                <ul
                  className="mb-0 ms-2"
                  style={{ listStyleType: "disc !important" }}
                >
                  {place.historicalSignificance}
                </ul>
              </div>
              <div
                className="rounded-3 p-2 flex-grow-1"
                style={{
                  background:
                    "linear-gradient(to bottom, #5ddec2, #a5e0d4, #c5e0da)",
                }}
              >
                <span
                  className="fw-bold bg-white rounded-pill ms-2 px-2"
                  style={{ color: "#5ddec2" }}
                >
                  Tags
                </span>
                <ul
                  className="mb-0 ms-2"
                  style={{ listStyleType: "disc !important" }}
                >
                  {place.tags.map((tag, index) => (
                    <li
                      key={index}
                      className="mb-1"
                      style={{ listStyleType: "disc" }}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div
              className="d-flex flex-column ps-3 fs-5 me-3"
              style={{ width: "50%" }}
            >
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
                  Established (Year)
                </span>
                <p className="mb-0 fs-5">{new Date(place.established).getFullYear()}</p>
              </div>
              <div
                className="rounded-3 p-2 mt-2 flex-grow-1"
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewHPGuestDetails;
