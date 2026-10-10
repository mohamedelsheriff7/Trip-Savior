import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SuccessPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : null;
  const [searchParams] = useSearchParams();
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      // Fetch session details from your backend
      fetch(`http://localhost:3002/retrieve-line-items?session_id=${sessionId}`)
        .then((response) => response.json())
        .then((data) => {
          setSessionDetails(data);
          console.log(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching session details:", error);
          setLoading(false);
        });
    }
  }, [searchParams, username]);

  const handleBooking = async () => {
    if (sessionDetails != null) {
      if (sessionDetails.data.category === "activity") {
        const activityName =
          sessionDetails.data.lineItems[0].price_data.product_data.name;
        await fetch(
          "http://localhost:3002/activities/book-activity-with-card",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: activityName, username }),
          }
        )
          .then((response) => response.json())
          .then((bookingResponse) => {
            console.log("Activity booking response:", bookingResponse);
            alert(bookingResponse.message);
          })
          .catch((error) => {
            console.error("Error booking activity:", error);
            alert(error.message);
          });
      }
      if (sessionDetails.data.category === "itinerary") {
        const itineraryName =
          sessionDetails.data.lineItems[0].price_data.product_data.name;
        await fetch(
          "http://localhost:3002/itineraries/book-itinerary-with-card",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: itineraryName, username }),
          }
        )
          .then((response) => response.json())
          .then((bookingResponse) => {
            console.log("Itinerary booking response:", bookingResponse);
            alert(bookingResponse.message);
          })
          .catch((error) => {
            console.error("Error booking itinerary:", error);
            alert(error.message);
          });
      }
      if (sessionDetails.data.category === "cart") {
        const lineItems = sessionDetails.data.lineItems;
        const totalPrice = sessionDetails.data.totalPrice;
        const address = sessionDetails.data.address;
        await fetch("http://localhost:3002/checkout-cart-with-card", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lineItems, totalPrice, username, address }),
        })
          .then((response) => response.json())
          .then((bookingResponse) => {
            console.log("Cart booking response:", bookingResponse);
            alert(bookingResponse.message);
          })
          .catch((error) => {
            console.error("Error booking cart:", error);
            alert(error.message);
          });
      }
      if (sessionDetails.data.category === "transportation") {
        const transportation = sessionDetails.data.products;
        console.log(transportation);
        try {
          const response = await axios.post(
            "http://localhost:3002/addTransportWithCard",
            {
              username,
              transportationDetails: transportation,
            }
          );
          alert("Success");
        } catch (err) {
          console.error(err);
          alert("Server Error");
        }
      }
      if (sessionDetails.data.category === "flight") {
        console.log("fl success page llflight");
        const flight = sessionDetails.data.products;
        console.log(sessionDetails);
        try {
          const response = await axios.put(
            "http://localhost:3002/addFlightWithCard",
            {
              username,
              flightDetails: flight,
            }
          );
          alert("Success");
        } catch (err) {
          console.error(err);
          alert("Server Error");
        }
      }
      if (sessionDetails.data.category === "hotel") {
        const hotel = sessionDetails.data.products;
        console.log("fl hotel");
        console.log(hotel);
        try {
          const response = await axios.put(
            "http://localhost:3002/addHotelWithCard",
            {
              username,
              hotelDetails: hotel,
            }
          );
          alert("Success");
        } catch (err) {
          console.error(err);
          alert("Server Error");
        }
      }
    }

    // Redirect to /tourist-profile2 after booking
    //alert("booked succesfully");
  };

  useEffect(() => {
    if (sessionDetails) {
      handleBooking();
      navigate("/tourist-profile2");
    }
  }, [sessionDetails]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null; // No UI since the page will redirect
};

export default SuccessPage;
