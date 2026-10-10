import React, { useState, useEffect } from "react";
import axios from "axios";

const BookedItineraries = () => {
  const [bookedItineraries, setBookedItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookedItineraries = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          setError("No username found in local storage");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3002/itinerary");
        const filteredItineraries = response.data.filter(itinerary =>
          itinerary.bookedBy.includes(user.username)
        );

        setBookedItineraries(filteredItineraries);
      } catch (error) {
        console.error("Error fetching booked itineraries:", error);
        setError("Could not fetch booked itineraries");
      } finally {
        setLoading(false);
      }
    };

    fetchBookedItineraries();
  }, []);

  const handleCancelBooking = async (itineraryId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("User not found. Please log in again.");
        return;
      }
  
      // Find the itinerary to cancel
      const itineraryToCancel = bookedItineraries.find(itinerary => itinerary._id === itineraryId);
  
      if (!itineraryToCancel) {
        alert("Itinerary not found.");
        return;
      }
  
      // Update bookedBy array for the selected itinerary
      const updatedItineraries = bookedItineraries.map((itinerary) => {
        if (itinerary._id === itineraryId) {
          return {
            ...itinerary,
            bookedBy: itinerary.bookedBy.filter((username) => username !== user.username)
          };
        }
        return itinerary;
      });
  
      const updatedItinerary = updatedItineraries.find(itinerary => itinerary._id === itineraryId);
  
      // Send the updated bookedBy array and booked status to the backend
      await axios.put(`http://localhost:3002/itinerary/${itineraryId}`, {
        booked: updatedItinerary.bookedBy.length > 0, // Set to true if there are still users booked
        bookedBy: updatedItinerary.bookedBy
      });
  
      // Remove the itinerary from the user's bookedItineraries array
      await axios.put(`http://localhost:3002/users/${user.username}/cancelItinerary/${itineraryId}`);
  
      // Refund the itinerary price to the user's wallet
      const refundAmount = itineraryToCancel.price; // Assuming the price field exists in the itinerary schema
      await axios.put(`http://localhost:3002/users/${user.username}/wallet`, {
        refundAmount,
      });
  
      // Update the UI to reflect the cancellation
      setBookedItineraries(updatedItineraries.filter(itinerary => itinerary._id !== itineraryId));
      alert(`Booking cancelled successfully. $${refundAmount} has been refunded to your wallet.`);
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };
  
  

  const isCancelable = (dateTime) => {
    const currentTime = new Date();
    const itineraryTime = new Date(dateTime);
    const timeDifference = itineraryTime - currentTime;
    return timeDifference >= 48 * 60 * 60 * 1000; // 48 hours in milliseconds
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (bookedItineraries.length === 0) return <div>No booked itineraries found.</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Booked Itineraries</h2>
      <div className="row">
        {bookedItineraries.map((itinerary) => (
          <div className="col-md-4 mb-4" key={itinerary._id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{itinerary.Itinerary_Name}</h5>
                <p className="card-text">
                  <strong>Tour Guide:</strong> {itinerary.tourGuideName}
                </p>
                <p className="card-text">
                  <strong>Price:</strong> ${itinerary.price}
                </p>
                <p className="card-text">
                  <strong>Duration:</strong> {itinerary.durationOfActivity} hours
                </p>
                <p className="card-text">
                  <strong>Date:</strong> {new Date(itinerary.date_time).toLocaleDateString()}
                </p>
                <p className="card-text">
                  <strong>Location:</strong> {itinerary.locationToBeVisited.join(", ")}
                </p>
                <p className="card-text">
                  <strong>Rating:</strong> {itinerary.rating} / 5
                </p>
                <p className="card-text">{itinerary.details || "No details available."}</p>
                {isCancelable(itinerary.date_time) ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancelBooking(itinerary._id)}
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

export default BookedItineraries;
