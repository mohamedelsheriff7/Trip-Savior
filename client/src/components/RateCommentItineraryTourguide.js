import React, { useState, useEffect } from "react";
import axios from "axios";
import TouristNavbar from "./Profile/TouristNavbar";
import { useNavigate } from "react-router-dom";
import departure from "../images/departures.svg";
import arrival from "../images/arrivals.svg";
import ShareLinkItinerary from "./ShareLinkItinerary"; // Import the ShareLink component

const RateCommentItinerary = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [tourGuides, setTourGuides] = useState([]);
  const [error, setError] = useState(null);

  const [tempRating1, setTempRating1] = useState({});
  const [tempRating2, setTempRating2] = useState({});

  const [submitStatuses, setSubmitStatuses] = useState([]); // Array to hold status for each itinerary

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get("http://localhost:3002/itinerary");
      const tourGuideResponse = await axios.get(
        "http://localhost:3002/tour_guide"
      );
      const now = new Date();

      const filteredItineraries = response.data
        .map((itinerary) => ({
          ...itinerary,
          rating1: 0,
          isRated1: false,
          comment1: "",
          rating2: 0,
          isRated2: false,
          comment2: "",
        }))
        .filter(
          (itinerary) =>
            itinerary.bookedBy.includes(user.username) &&
            new Date(itinerary.date_time) < now
        );

      setItineraries(filteredItineraries);
      setTourGuides(tourGuideResponse.data);
    } catch (err) {
      console.error("Error fetching itineraries:", err);
      setError("Error fetching itineraries. Please try again.");
    }
  };

  const handleRating1 = (index, rating) => {
    setTempRating1((prev) => ({ ...prev, [index]: rating }));
  };

  const handleCommentChange1 = (index, e) => {
    const updatedItineraries = itineraries.map((item, i) =>
      i === index ? { ...item, comment1: e.target.value } : item
    );
    setItineraries(updatedItineraries);
  };

  const handleSubmitComment1 = async (index) => {
    const itinerary = itineraries[index];
    try {
      await axios.put(
        `http://localhost:3002/comment-itinerary/${itinerary._id}`,
        {
          comment: itinerary.comment1,
        }
      );
      const updatedItineraries = itineraries.map((item, i) =>
        i === index ? { ...item, comment1: "" } : item
      );
      setItineraries(updatedItineraries);
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("Could not submit comment. Please try again.");
    }
  };

  const handleRating2 = (index, rating) => {
    setTempRating2((prev) => ({ ...prev, [index]: rating }));
  };

  const handleCommentChange2 = (index, e) => {
    const updatedItineraries = itineraries.map((item, i) =>
      i === index ? { ...item, comment2: e.target.value } : item
    );
    setItineraries(updatedItineraries);
  };

  const handleSubmitComment2 = async (index) => {
    const itinerary = itineraries[index];
    try {
      const tourGuide = tourGuides.find(
        (guide) => guide.username === itinerary.tourGuideName
      );

      await axios.put(
        `http://localhost:3002/comment-tour-guide/${tourGuide._id}`,
        {
          comment: itinerary.comment2,
        }
      );
      const updatedItineraries = itineraries.map((item, i) =>
        i === index ? { ...item, comment2: "" } : item
      );
      setItineraries(updatedItineraries);
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("Could not submit comment. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = async (index) => {
    try {
      console.log(itineraries[index]);
      if (
        !tempRating1[index] ||
        !tempRating2[index] ||
        !itineraries[index].comment1 ||
        !itineraries[index].comment2
      ) {
        setSubmitStatuses((prev) => {
          const updatedStatuses = [...prev];
          updatedStatuses[index] =
            "Error: Please provide both a rating and a review.";
          return updatedStatuses;
        });
        return;
      }
      // Submit rating1
      if (tempRating1[index] !== undefined) {
        await axios.put(
          `http://localhost:3002/rate-itinerary/${itineraries[index]._id}`,
          { rating: tempRating1[index] }
        );
      }

      // Submit rating2
      if (tempRating2[index] !== undefined) {
        const tourGuide = tourGuides.find(
          (guide) => guide.username === itineraries[index].tourGuideName
        );
        if (tourGuide) {
          await axios.put(
            `http://localhost:3002/rate-tour-guide/${tourGuide._id}`,
            { rating: tempRating2[index] }
          );
        }
      }

      // Submit comments
      await handleSubmitComment1(index);
      await handleSubmitComment2(index);

      // Clear temporary ratings
      setTempRating1((prev) => ({ ...prev, [index]: undefined }));
      setTempRating2((prev) => ({ ...prev, [index]: undefined }));

      setSubmitStatuses((prev) => {
        const updatedStatuses = [...prev];
        updatedStatuses[index] = "Submitted successfully!";
        return updatedStatuses;
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("Could not submit feedback. Please try again.");
      setSubmitStatuses((prev) => {
        const updatedStatuses = [...prev];
        updatedStatuses[index] = "Error Submitting";
        return updatedStatuses;
      });
    }
  };

  return (
    <>
      <TouristNavbar />
      <div className="container-fluid">
        {/* Itineraries Section */}
        <div className="container my-5">
          <div className="row text-center">
            {itineraries.map((itinerary, index) => (
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
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <strong>Rate Itinerary:</strong>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() =>
                          !itinerary.isRated1 && handleRating1(index, star)
                        }
                        className="ms-1"
                        style={{
                          fontSize: "24px",
                          color:
                            (tempRating1[index] || itinerary.rating1) >= star
                              ? "#ffc107"
                              : "#ddd",
                          cursor: itinerary.isRated1
                            ? "not-allowed"
                            : "pointer",
                        }}
                      >
                        ★
                      </span>
                    ))}
                    <textarea
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                      }}
                      rows="1"
                      placeholder="Leave a comment"
                      value={itinerary.comment1}
                      onChange={(e) => handleCommentChange1(index, e)}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <strong>Rate Tour Guide {itinerary.tourGuideName}:</strong>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() =>
                          !itinerary.isRated2 && handleRating2(index, star)
                        }
                        className="ms-1"
                        style={{
                          fontSize: "24px",
                          color:
                            (tempRating2[index] || itinerary.rating2) >= star
                              ? "#ffc107"
                              : "#ddd",
                          cursor: itinerary.isRated2
                            ? "not-allowed"
                            : "pointer",
                        }}
                      >
                        ★
                      </span>
                    ))}
                    <textarea
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                      }}
                      rows="1"
                      placeholder="Leave a comment"
                      value={itinerary.comment2}
                      onChange={(e) => handleCommentChange2(index, e)}
                    />
                  </div>
                  <button
                    className="btn btn-primary mt-3 w-100"
                    onClick={() => handleClick(index)}
                  >
                    Submit Feedback
                  </button>

                  {submitStatuses[index] && (
                    <div
                      className={`alert mt-2 ${
                        submitStatuses[index].startsWith("Error")
                          ? "alert-danger"
                          : "alert-success"
                      }`}
                    >
                      {submitStatuses[index]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RateCommentItinerary;
