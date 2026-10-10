
import React, { useEffect, useState } from "react";
import axios from "axios";
import departure from "../images/departures.svg";
import arrival from "../images/arrivals.svg";
import { useNavigate } from "react-router-dom";
import AdminNavigationbar from './AdminNavigationBar';
const ActivitiesandItineraries = () => {
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingItineraries, setLoadingItineraries] = useState(true);
  const [flaggingId, setFlaggingId] = useState(null);
  const navigate = useNavigate();
  // Function to fetch activities
  const fetchActivities = async () => {
    setLoadingActivities(true);
    try {
      const response = await axios.get("http://localhost:3002/activities-sort");
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoadingActivities(false);
    }
  };

  // Function to fetch itineraries
  const fetchItineraries = async () => {
    setLoadingItineraries(true);
    try {
      const response = await axios.get("http://localhost:3002/itineraries-filter");
      setItineraries(response.data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    } finally {
      setLoadingItineraries(false);
    }
  };

  // Function to toggle the flag status
 // Update the toggleFlag function
const toggleFlag = async (id, type, isFlagged) => {
  try {
    setFlaggingId(id);

    // Find the complete item data
    const item = type === "activities" 
      ? activities.find(a => a._id === id)
      : itineraries.find(i => i._id === id);

    console.log("Flagging item:", item); // Debug log

    const url = type === "activities" 
      ? `http://localhost:3002/activities/${id}` 
      : `http://localhost:3002/itinerary/${id}`;

    // Structure the request data
    const requestData = type === "activities" 
      ? {
          ...item,
          isFlagged: !isFlagged,
          advertiserUsername: item.advertiserUsername, // Make sure this exists
          name: item.name
        }
      : {
          ...item,
          isFlagged: !isFlagged,
          tourGuideName: item.tourGuideName,
          Itinerary_Name: item.Itinerary_Name
        };

    console.log("Sending request:", requestData); // Debug log

    const response = await axios.put(url, requestData);
    console.log("Response:", response.data); // Debug log

    // Update local state
    if (type === "activities") {
      setActivities(prevActivities =>
        prevActivities.map(activity =>
          activity._id === id ? { ...activity, isFlagged: !activity.isFlagged } : activity
        )
      );
    } else {
      setItineraries(prevItineraries =>
        prevItineraries.map(itinerary =>
          itinerary._id === id ? { ...itinerary, isFlagged: !itinerary.isFlagged } : itinerary
        )
      );
    }
  } catch (error) {
    console.error("Error flagging the item:", error.response?.data || error.message);
  } finally {
    setFlaggingId(null);
  }
};

  // Fetch activities and itineraries on component mount
  useEffect(() => {
    fetchActivities();
    fetchItineraries();
  }, []);
return(
  <div>
      <AdminNavigationbar />
  <div className="container my-5">
  <div className="row text-center">
  <h2
    className="text-center"
    style={{
      color: "#007b83",
      fontSize: "30px",
      fontWeight: "bold",
      marginTop: "40px", // Reduced margin for less space below
    }}
  >
    Itineraries
  </h2>
    {itineraries.map((itinerary) => (
      <div key={itinerary._id} className="col-lg-4 col-md-6 col-sm-12 mb-4 text-start d-flex">
        <div className="card rounded-3 p-2 mt-lg-0 mt-4 flex-grow-1">
          {/* Title Section */}
          <div className="itinerary-img mb-2 d-flex align-items-end">
            <div className="itinerary-title d-flex justify-content-between align-items-end w-100">
              <div className="d-flex flex-column justify-content-start px-2 pb-2">
                <h4
                  className="mb-1"
                  style={{
                    color: "white",
                    opacity: "0.9",
                    textAlign: "left",
                  }}
                >
                  {itinerary.Itinerary_Name}
                </h4>
                <a
                  className="text-white ps-0"
                  style={{ opacity: "0.7", fontSize: "14px" }}
                  onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                  onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                  onClick={() => navigate(`/itinerary-flagged/${itinerary._id}`)}
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
                      fillRule="evenodd"
                      d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"
                    />
                    <path
                      fillRule="evenodd"
                      d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Date and Location Section */}
          <div className="d-flex justify-content-between">
            <div>
              <p className="fw-bold">
                {new Date(itinerary.date_time).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div className="d-flex flex-column justify-content-start align-items-start ms-3">
                <div className="d-flex align-items-center">
                  <img
                    src={departure}
                    alt="departure"
                    className="me-1"
                    style={{ width: "18px", height: "18px", objectFit: "cover" }}
                  />
                  <span className="ms-2">{itinerary.pickupLocation}</span>
                </div>
                <div className="d-flex align-items-center mt-2">
                  <img
                    src={arrival}
                    alt="arrival"
                    className="me-1"
                    style={{ width: "18px", height: "18px", objectFit: "cover" }}
                  />
                  <span className="ms-2">{itinerary.dropoffLocation}</span>
                </div>
              </div>
            </div>

            {/* Rating Section */}
            <div>
              <div className="d-flex justify-content-end align-items-center mt-auto mb-2">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`me-1 ${index < itinerary.rating ? "text-warning" : "text-secondary"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Location and Preferences */}
          <div className="d-flex justify-content-between mt-3">
            <div className="rounded-3 w-50 p-2" style={{ background: "linear-gradient(to bottom, #5ddec2, #a5e0d4, #c5e0da)" }}>
              <span className="fw-bold bg-white rounded-pill ms-2 px-2" style={{ color: "#5ddec2" }}>Locations</span>
              <p className="mb-0 ms-2">{itinerary.locationToBeVisited.join(", ")}</p>
            </div>
            <div className="d-flex flex-column ps-3" style={{ width: "50%" }}>
              <div className="rounded-3 p-2 mb-2" style={{ background: "linear-gradient(to bottom, #5ddec2, #a5e0d4, #c5e0da)" }}>
                <span className="fw-bold bg-white rounded-pill ms-2 px-2" style={{ color: "#5ddec2" }}>Preferences</span>
                <p className="mb-0 ms-2">{itinerary.preferences.join(", ")}</p>
              </div>
              <div className="d-flex justify-content-between rounded-3 p-2" style={{ background: "linear-gradient(to bottom, #5ddec2, #a5e0d4, #c5e0da)" }}>
                <span className="fw-bold bg-white rounded-pill ms-2 px-2" style={{ color: "#5ddec2" }}>Language</span>
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
                    <button
  className="btn btn-lg btn-more px-4 mt-2 flex-grow-1 me-2 mb-1"
  onClick={() => toggleFlag(itinerary._id, "itineraries", itinerary.isFlagged)}
>
  {itinerary.isFlagged ? "Unflag" : "Flag"}
</button>



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
          <h2
    className="text-center"
    style={{
      color: "#007b83",
      fontSize: "30px",
      fontWeight: "bold",
      marginBottom: "-30px", // Reduced margin for less space below
    }}
  >
   Activities
  </h2>
  <div className="container my-5">
          <div className="row text-center">
            {activities.map((activity, index) => (
              <div
                key={activity._id || index}
                className="col-lg-4 col-md-6 col-sm-12 mb-4 text-start d-flex"
              >
                <div className="card rounded-3 p-2 mt-lg-0 mt-4 flex-grow-1">
                  {/* Title */}
                  <div
                    className="activity-img mb-2 d-flex align-items-end"
                    style={{
                      backgroundImage: `url(${activity.pictures[0]})`
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
                          {activity.name}
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
                          onClick={() => navigate(`/activity-flagged/${activity._id}`)}
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
                        {new Date(activity.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
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
                    </div>
                    <div>
                      <div className="d-flex justify-content-end align-items-center mt-auto mb-2">
                        {/* Render stars based on the rating */}

                        {[...Array(5)].map((_, index) => (
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
                        ))}
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
                    <div
                      className="d-flex flex-row ps-3"
                      style={{ width: "100%" }}
                    >
                      <div className="d-flex flex-column justify-content-start align-items-start w-50 ">
                        <div className="d-flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="35"
                            height="35"
                            fill="#5ddec2"
                            className="bi bi-geo-alt"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                          </svg>
                          <span className="ms-2">{activity.location}</span>
                        </div>
                        <div className="d-flex align-items-center mt-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="#5ddec2"
                            class="bi bi-clock"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
                          </svg>
                          <span className="ms-2">{activity.time}</span>
                        </div>
                      </div>
                      <div className="w-100 ps-5 ">
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
                            Tags
                          </span>
                          <p className="mb-0 ms-3">
                            {activity.tags.join(", ")}
                          </p>
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

                  {/* Book Button */}
                  <div
                    style={{ bottom: "0" }}
                    className="d-flex justify-content-between text-center pt-1 mt-auto"
                  >
                    {/* Book Button */}
                    <div className="d-flex flex-column text-start w-50">
                    <button
  className="btn btn-lg btn-more px-4 mt-2 flex-grow-1 me-2 mb-1"
  onClick={() => toggleFlag(activity._id, "activities", activity.isFlagged)}
>
  {activity.isFlagged ? "Unflag" : "Flag"}
</button>



                      {/* <ShareLink type="itinerary" id={itinerary._id} /> */}
                    </div>
                    {/* Price */}
                    <div
                      className="d-flex  justify-content-end rounded p-2"
                      style={{ width: "50%" }}
                    >
                      <span className="text-black fs-3 fw-bold">
                        ${activity.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
         ))}
          </div>
          </div>
      </div>
      </div>
)
};
export default ActivitiesandItineraries;
