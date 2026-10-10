// src/components/ItineraryDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TouristNavbar from "./TouristNavbar";
import ShareLinkItinerary from "../ShareLinkItinerary"; // Import the ShareLink component
import { useNavigate } from "react-router-dom";
import departure from "../../images/departures.svg";
import arrival from "../../images/arrivals.svg";
import backButtonImage from "../../images/backbutton.png"; // Adjust path if necessary


const ItineraryDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/itineraries/${id}`
        );
        setItinerary(response.data);
      } catch (error) {
        setError("Failed to load itinerary data.");
      } finally {
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <TouristNavbar />
      <div>
            <button
              onClick={() => navigate("/tourist-itinerary")}
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
      <div className="container-fluid p-0 w-75 mx-auto">
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
              <h1
                className="mb-1 fs-1" /* Ensures consistent spacing below the title */
                style={{
                  color: "white",
                  opacity: "0.9",
                  textAlign: "left", // Ensures alignment is consistent
                }}
              >
                {itinerary.Itinerary_Name}
              </h1>
            </div>
            <div className="me-3 mt-2 mb-2">
              <ShareLinkItinerary type="itinerary" id={itinerary._id} />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-start my-3">
          <div>
            <p className="fw-bold fs-4">
              {new Date(itinerary.date_time).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div>
            <div className="d-flex justify-content-end align-items-center mt-auto mb-2 fs-4">
              {/* Render stars based on the rating */}

              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`me-1 ${
                    index < itinerary.rating ? "text-warning" : "text-secondary"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <div className="w-50 align-content-end">
            <ul
              className="fs-5"
              style={{ padding: "0", margin: "0", listStyle: "none" }}
            >
              {itinerary.activity.map((act, index) => (
                <li key={index} className="ms-3">
                  <span
                    className="rounded-pill text-center px-2 mb-1 me-1"
                    style={{
                      display: "inline-block",
                      backgroundColor: "#5ddec2",
                      color: "#ffffff",
                      width: "140px",
                    }}
                  >
                    {act.time}
                  </span>{" "}
                  {act.name}
                </li>
              ))}
            </ul>
            <div className="d-flex flex-column justify-content-start ms-3 fs-5 mt-5">
              <div className="d-flex flex-row justify-content-between">
                <div>
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
                    <span className="ms-2">{itinerary.pickupLocation}</span>
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
                    <span className="ms-2">{itinerary.dropoffLocation}</span>
                  </div>
                </div>
                <span className="text-black fs-3 fw-bold align-self-end">
                  ${itinerary.price}
                </span>
              </div>
              <div
                style={{ bottom: "0" }}
                className="d-flex flex-column w-100 align-self-end text-center pt-1 mt-4"
              >
                {/* Book Button */}
                <button className="btn btn-lg btn-more px-4 mt-2 flex-grow-1  mb-1">
                  Book
                </button>
                {/* <ShareLink type="itinerary" id={itinerary._id} /> */}
                {/* Price */}
              </div>
            </div>
          </div>
          <div className="d-flex flex-row w-100 justify-content-end">
            <div
              className="d-flex flex-column ps-3 fs-5 me-2"
              style={{ width: "40%" }}
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
                  Locations
                </span>
                <ul
                  className="mb-0 ms-2"
                  style={{ listStyleType: "disc !important" }}
                >
                  {itinerary.locationToBeVisited.map((location, index) => (
                    <li
                      key={index}
                      className="mb-1"
                      style={{ listStyleType: "disc" }}
                    >
                      {location}
                    </li>
                  ))}
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
                  Preferences
                </span>
                <ul
                  className="mb-0 ms-2"
                  style={{ listStyleType: "disc !important" }}
                >
                  {itinerary.preferences.map((preference, index) => (
                    <li
                      key={index}
                      className="mb-1"
                      style={{ listStyleType: "disc" }}
                    >
                      {preference}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div
              className="d-flex flex-column ps-3 fs-5 me-3"
              style={{ width: "40%" }}
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
                  Language
                </span>
                <p className="mb-0">{itinerary.languageOfTour}</p>
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
                  Accessibility
                </span>
                <ul
                  className="mb-0 ms-2"
                  style={{ listStyleType: "disc !important" }}
                >
                  {itinerary.accessibility.map((accessibility, index) => (
                    <li
                      key={index}
                      className="mb-1"
                      style={{ listStyleType: "disc" }}
                    >
                      {accessibility}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItineraryDetails;
