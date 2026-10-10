import React, { useState, useEffect } from "react";
import axios from "axios";

const BookedActivities = () => {
  const [bookedActivities, setBookedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookedActivities = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          setError("No username found in local storage");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3002/activities");

        // Filter activities for the logged-in user
        const filteredActivities = response.data.filter(activity => 
          activity.bookedBy.includes(user.username)
        );

        setBookedActivities(filteredActivities);
      } catch (error) {
        console.error("Error fetching booked activities:", error);
        setError("Could not fetch booked activities");
      } finally {
        setLoading(false);
      }
    };

    fetchBookedActivities();
  }, []);

  const handleCancelBooking = async (activityId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("User not found. Please log in again.");
        return;
      }
  
      // Find the activity to cancel
      const activityToCancel = bookedActivities.find(activity => activity._id === activityId);
  
      if (!activityToCancel) {
        alert("Activity not found.");
        return;
      }
  
      // Update bookedBy array for the selected activity
      const updatedActivities = bookedActivities.map((activity) => {
        if (activity._id === activityId) {
          return {
            ...activity,
            bookedBy: activity.bookedBy.filter((username) => username !== user.username),
          };
        }
        return activity;
      });
  
      const updatedActivity = updatedActivities.find(activity => activity._id === activityId);
  
      // Update the activity in the backend
      await axios.put(`http://localhost:3002/activities/${activityId}`, {
        bookingOpen: true,
        bookedBy: updatedActivity.bookedBy,
      });
  
      // Remove the activity from the user's bookedActivities array
      await axios.put(`http://localhost:3002/users/${user.username}/cancelActivity/${activityId}`);
  
      // Refund the activity price to the user's wallet
      const refundAmount = activityToCancel.price; // Assuming the price field exists in the activity schema
      await axios.put(`http://localhost:3002/users/${user.username}/wallet`, {
        refundAmount,
      });
  
      // Update the UI to reflect the cancellation
      setBookedActivities(prevActivities =>
        prevActivities.filter(activity => activity._id !== activityId)
      );
      alert(`Booking cancelled successfully. $${refundAmount} has been refunded to your wallet.`);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking.");
    }
  };
  
  

  const isCancelable = (activityDate, activityTime) => {
    const activityDateTime = new Date(`${activityDate.substring(0, 10)}T${activityTime}:00.000Z`);
    const currentTime = new Date();
    const timeDifference = activityDateTime - currentTime;

    const cancelable = timeDifference >= 48 * 60 * 60 * 1000;
    console.log(`Checking if cancelable for date: ${activityDate}, time: ${activityTime}`);
    console.log("Current Time:", currentTime);
    console.log("Activity DateTime:", activityDateTime);
    console.log("Time Difference:", timeDifference, "ms");
    console.log("Is Cancelable:", cancelable);

    return cancelable;
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (bookedActivities.length === 0) return <div>No booked activities found.</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Booked Activities</h2>
      <div className="row">
        {bookedActivities.map((activity) => (
          <div className="col-md-4 mb-4" key={activity._id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{activity.name}</h5>
                <p className="card-text">
                  <strong>Location:</strong> {activity.location}
                </p>
                <p className="card-text">
                  <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
                </p>
                <p className="card-text">
                  <strong>Time:</strong> {activity.time}
                </p>
                <p className="card-text">
                  <strong>Price:</strong> ${activity.price}
                </p>
                <p className="card-text">
                  <strong>Category:</strong> {activity.category}
                </p>
                <p className="card-text">
                  <strong>Rating:</strong> {activity.rating} / 5
                </p>
                <p className="card-text">{activity.specialDiscounts || "No special discounts available."}</p>
                {isCancelable(activity.date, activity.time) ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancelBooking(activity._id)}
                  >
                    Cancel Booking
                  </button>
                ) : (
                  <p className="text-muted">Booking can no longer be canceled within 48 hours of the event.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookedActivities;
