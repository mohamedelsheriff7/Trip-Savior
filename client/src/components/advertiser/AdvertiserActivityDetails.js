// src/components/ActivityDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ShareLinkItinerary from "../ShareLinkItinerary";
import backButtonImage from "../../images/backbutton.png"; // Adjust path if necessary
import { useNavigate } from "react-router-dom";
import AdvertiserNavbar from "./AdvertiserNavbar";

const AdvertiserActivityDetails = () => {
  const navigate = useNavigate(); // Initialize navigate
  const { id } = useParams(); // Get the id from the URL
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/activities/${id}`
        );
        setActivity(response.data);
      } catch (error) {
        setError("Failed to load activity data.");
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <AdvertiserNavbar />
      <div>
        <button
          onClick={() => navigate("/activities-view")}
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
          className="activity-details-img mb-2 d-flex align-items-end"
          style={{
            backgroundImage: `url(${activity.pictures[0]})`,
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
                {activity.name}
              </h1>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-start my-3">
          <div>
            <p className="fw-bold fs-4">
              {new Date(activity.date).toLocaleDateString("en-US", {
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
                    index < activity.rating ? "text-warning" : "text-secondary"
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
            <div className="d-flex flex-column justify-content-start ms-3 fs-5">
              <div className="d-flex flex-row ">
                <div>
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
                    <span className="ms-2 align-self-end">
                      {activity.location}
                    </span>
                  </div>
                  <div className="d-flex align-items-center mt-2 ms-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
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
                <span className="text-black fs-3 fw-bold align-self-center">
                  ${activity.price}
                </span>
              </div>
              <div
                style={{ bottom: "0" }}
                className="d-flex justify-content-start text-center pt-1 mt-4"
              >
                {/* Book Button */}
                <button
                  onClick={() =>
                    navigate(`/advertiser-edit-activity/${activity.name}`)
                  }
                  className="btn btn-lg btn-more px-4 mt-2 flex-grow-1 mb-1"
                >
                  Edit
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
                className="rounded-3 p-2 mb-2 flex-grow-1"
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
                  {activity.tags.map((tag, index) => (
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
                  Category
                </span>
                <p className="mb-0 fs-5 text-black">{activity.category}</p>
              </div>
              <div
                className="rounded-3 p-2 mt-2 flex-grow-1"
                style={{
                  background:
                    "linear-gradient(to bottom, #5ddec2, #a5e0d4, #c5e0da)",
                  maxHeight: "195px",
                }}
              >
                <span
                  className="fw-bold bg-white rounded-pill ms-2 px-2"
                  style={{ color: "#5ddec2" }}
                >
                  Discounts
                </span>
                <ul
                  className="mb-0 ms-2"
                  style={{ listStyleType: "disc !important" }}
                >
                  {activity.specialDiscounts}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvertiserActivityDetails;
