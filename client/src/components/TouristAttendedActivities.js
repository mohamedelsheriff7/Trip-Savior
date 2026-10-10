import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import TouristNavbar from "./Profile/TouristNavbar";

const TouristAttendedActivities = () => {
  const location = useLocation();
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [submitStatuses, setSubmitStatuses] = useState({});
  const [tempRating, setTempRating] = useState({});
  const [tempFeedback, setTempFeedback] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const id = user._id;

  useEffect(() => {
    const fetchActivities = async () => {
      if (!id) {
        setError("No ID provided");
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3002/tourist/attendedActivities/${id}`
        );

        const filteredActivities = response.data.map((activity) => ({
          ...activity,
          rating: 0,
          isRated: false,
          comment: "",
        }));

        setActivities(filteredActivities);
      } catch (error) {
        setError(
          error.response
            ? error.response.data.message
            : "Could not fetch activities"
        );
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, [id]);

  const handleRatingSelect = (activityId, rating) => {
    setTempRating((prev) => ({ ...prev, [activityId]: rating }));
  };

  const handleFeedbackChange = (activityId, value) => {
    setTempFeedback((prev) => ({ ...prev, [activityId]: value }));
  };

  const handleSubmit = async (activityId) => {
    try {
      // Validate rating and feedback before submitting
      const rating = tempRating[activityId];
      const feedback = tempFeedback[activityId];

      if (rating === undefined || !feedback) {
        setSubmitStatuses((prev) => ({
          ...prev,
          [activityId]: "Error: Please provide both a rating and feedback.",
        }));
        return;
      }

      // Submit Rating
      await axios.post(
        `http://localhost:3002/tourists/rateActivityAttended/${id}`,
        { activityId, rating }
      );

      // Submit Feedback
      await axios.post(`http://localhost:3002/tourists/commentActivity/${id}`, {
        activityId,
        comment: feedback,
      });

      // Update UI after successful submission
      setTempRating((prev) => ({ ...prev, [activityId]: undefined }));
      setTempFeedback((prev) => ({ ...prev, [activityId]: "" }));

      setSubmitStatuses((prev) => ({
        ...prev,
        [activityId]: "Rating and feedback submitted successfully!",
      }));
    } catch (error) {
      console.error("Error submitting rating/feedback:", error);
      setSubmitStatuses((prev) => ({
        ...prev,
        [activityId]: "Error submitting feedback. Please try again.",
      }));
    }
  };

  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <>
      <TouristNavbar />
      <div className="container-fluid">
        {/* Activities Section */}
        <div className="container my-5">
          <div className="row text-center">
            {activities.map((activity, index) => (
              <div
                key={activity._id || index}
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
                          {activity.name}
                        </h4>
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
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <strong>Rate Activity:</strong>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => handleRatingSelect(activity._id, star)}
                        className="ms-1"
                        style={{
                          fontSize: "24px",
                          color:
                            (tempRating[activity._id] || activity.rating) >=
                            star
                              ? "#ffc107"
                              : "#ddd",
                          cursor: activity.isRated ? "not-allowed" : "pointer",
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
                      value={tempFeedback[activity._id] || ""}
                      onChange={(e) =>
                        handleFeedbackChange(activity._id, e.target.value)
                      }
                    />
                  </div>

                  <div
                    className="d-flex flex-column"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flex: 1,
                    }}
                  >
                    <button
                      onClick={() => handleSubmit(activity._id)}
                      type="submit"
                      style={styles.submitButton}
                    >
                      Submit
                    </button>
                  </div>

                  {/* Display Submit Status */}
                  {submitStatuses[activity._id] && (
                    <span
                      style={{
                        color: submitStatuses[activity._id].includes("Error")
                          ? "red"
                          : "green",
                        fontSize: "14px",
                        marginLeft: "10px",
                        alignSelf: "center",
                      }}
                    >
                      {submitStatuses[activity._id]}
                    </span>
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

const styles = {
  submitButton: {
    padding: "5px 10px",
    backgroundColor: "#5ddec2",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginBottom: "10px",
    fontSize: "15px",
  },
};

export default TouristAttendedActivities;
