import React, { useState, useEffect } from "react";
import axios from "axios";
import TouristNavbar from "./TouristNavbar";
import ShareLinkItinerary from "../ShareLinkItinerary"; // Import the ShareLink component
import departure from "../../images/departures.svg";
import arrival from "../../images/arrivals.svg";
import { useNavigate } from "react-router-dom";

const BookmarkItinerary = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]); // State for saved itineraries
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleNotifyRequest = async (itineraryId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.username : null;

    if (!username) {
      alert("You must be logged in to request notifications.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:3002/itineraries/${itineraryId}/notify`,
        {
          username,
          email: user.email, // Assuming user's email is stored in localStorage
        }
      );
      alert("You will be notified when this itinerary starts taking bookings.");
    } catch (error) {
      console.error("Error requesting notification:", error);
      alert("Failed to request notification. Please try again.");
    }
  };

  const handleRemoveBookmark = async (itinerary) => {
    const user = JSON.parse(localStorage.getItem("user")); // Ensure a user is logged in
    const touristId = user ? user._id : null;

    if (!touristId) {
      alert("You must be logged in to remove a bookmark.");
      return;
    }

    try {
      await axios.post("http://localhost:3002/api/bookmark/remove", {
        touristId: touristId,
        eventId: itinerary._id,
        type: "itinerary",
      });
      alert("Itinerary removed from bookmarks successfully!");
    } catch (error) {
      if (
        error.response &&
        error.response.status === 404 &&
        error.response.data.message === "Bookmark not found"
      ) {
        alert("This itinerary is not bookmarked.");
      } else {
        console.error("Error removing bookmark:", error);
        alert("Failed to remove bookmark. Please try again.");
      }
    }
  };
  // Fetch saved itineraries
  const fetchSavedItineraries = async () => {
    const user = JSON.parse(localStorage.getItem("user")); // Get the logged-in user's info
    const touristId = user ? user._id : null;
    console.log("touristId", touristId);

    if (!touristId) {
      setError("You must be logged in to view your saved itineraries.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3002/api/bookmark/tourist/${touristId}?type=itinerary`
      );
      if (response.data && response.data.bookmarks) {
        setItineraries(response.data.bookmarks); // Save the bookmarks to state
      } else {
        setError("No saved itineraries found.");
      }
      console.log("response a7a", response.data.bookmarks);
    } catch (error) {
      console.error("Error fetching saved itineraries:", error);
      setError("Failed to fetch saved itineraries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedItineraries(); // Fetch saved itineraries when the component loads
  }, []);

  if (loading) return <div>Loading saved itineraries...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <TouristNavbar />
      <div className="container my-5">
        <div className="row text-center">
          {itineraries.map((bookmark, index) => {
            const itinerary = bookmark.event || {}; // Safely access the event details
            return (
              <div
                key={itinerary._id || index}
                className="col-lg-4 col-md-6 col-sm-12 mb-4 text-start d-flex"
              >
                <div className="card rounded-3 p-2 mt-lg-0 mt-4 flex-grow-1">
                  {/* Title */}
                  <div className="itinerary-img mb-2 d-flex align-items-end">
                    <div className="itinerary-title d-flex justify-content-between align-items-end w-100">
                      <div className="d-flex flex-column justify-content-start px-2 pb-2">
                        <div className="d-flex flex-row align-items-center">
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="white"
                            class="bi bi-bell mb-1 ms-2"
                            viewBox="0 0 16 16"
                            onClick={() => handleNotifyRequest(itinerary._id)}
                            style={{cursor: "pointer"}}
                          >
                            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                          </svg>
                        </div>
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
                        {/* {itinerary.locationToBeVisited.join(",")} */}
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
                          {/* {itinerary.preferences.join(", ")} */}
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
                      <span className="text-black fs-3 fw-bold">
                        ${itinerary.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BookmarkItinerary;
