import React, { useState } from "react";
import axios from "axios";
import "./flight.css";
import { loadStripe } from "@stripe/stripe-js";
const fetchToken = async () => {
  const response = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: "pHZkVzPZQJhnGM6dewgF6mSVVGirb2VW", // Replace with your actual client_id
        client_secret: "Yv3u6DAkHKsa3cFv", // Replace with your actual client_secret
      }),
    }
  );
  const data = await response.json();
  return data.access_token;
};

const fetchFlights = async (
  token,
  origin,
  destination,
  departureDate,
  returnDate,
  adults,
  maxResults = 5
) => {
  const response = await fetch(
    `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&returnDate=${returnDate}&adults=${adults}&max=${maxResults}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data.data || [];
};

export default function FlightSearch() {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    adults: 1,
  });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingMessages, setBookingMessages] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalType, setModalType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [bookingFlight, setBookingFlight] = useState({ price: 1 });
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : null;
  const [totalPrice, setTotalPrice] = useState(
    bookingFlight.price * (1 - discount / 100)
  );
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "card") {
      handleBookWithCard();
    } else {
      handleBookWithWallet();
    }
  };

  const handleOpenModal = (flight) => {
    setBookingFlight(flight);
    setTotalPrice(flight.price.grandTotal * (1 - discount / 100));
    setModalShow(true);
  };
  const handlePromoCode = async (promoCode) => {
    try {
      const response = await axios.post(
        "http://localhost:3002/validatePromoCode",
        {
          promoCode,
          username,
        }
      );
      console.log(response);
      if (response.status !== 200) {
        alert("invalid Promo Code");
        return;
      }
      setDiscount(response.data.discount);
      setTotalPrice(
        bookingFlight.price.grandTotal * (1 - response.data.discount / 100)
      );
      alert("PromoCode Discount Added!");
    } catch (error) {
      console.error("Error adding promoCode:", error.message);
      alert("Invalid Promo Code");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default form submission
      handlePromoCode(promoCode);
    }
  };
  const closeModal = () => {
    setBookingFlight({});
    setModalShow(false);
  };
  const handleChange = (e) => {
    setFlights([]);
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = await fetchToken();
    const fetchedFlights = await fetchFlights(
      token,
      formData.origin,
      formData.destination,
      formData.departureDate,
      formData.returnDate,
      formData.adults
    );
    setFlights(fetchedFlights);
    setLoading(false);
  };

  const generateBookingID = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let bookingID = "";
    for (let i = 0; i < 7; i++) {
      bookingID += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return bookingID;
  };

  const handleBook = async (flight) => {
    if (!bookingMessages[flight.id]) {
      const bookingID = generateBookingID();
      const flightDetails = {
        totalPrice: flight.price.grandTotal,
        origin: formData.origin,
        destination: formData.destination,
        departureDate: formData.departureDate,
        returnDate: formData.returnDate,
        bookingId: bookingID,
      };

      try {
        console.log(
          "Username from local storage:",
          localStorage.getItem("username")
        );
        console.log(flightDetails);
        const response = await axios.put("http://localhost:3002/addFlight", {
          username: localStorage.getItem("username").replace(/^"(.*)"$/, "$1"), // Removes extra quotes
          flightDetails: flightDetails,
        });

        if (response.status === 200) {
          const result = response.data;
          setBookingMessages((prevMessages) => ({
            ...prevMessages,
            [flight.id]: `IMPORTANT: Save your booking ID: ${bookingID}`,
          }));
          console.log("Flight booked successfully:", result);
        } else {
          console.error("Error booking flight");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  const handleBookWithCard = async () => {
    //ht call di 3l payment button
    const flight = bookingFlight;
    console.log(flight);
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.username : null;
    if (!username) {
      alert("You Must Be Signed In To Book Transportation");
      return;
    }

    const bookingID = generateBookingID();
    const flightDetails = {
      totalPrice: flight.price.grandTotal,
      currency: flight.price.currency,
      origin: formData.origin,
      destination: formData.destination,
      departureDate: formData.departureDate,
      returnDate: formData.returnDate,
      bookingId: bookingID,
    };
    try {
      const toBePayedFor = flightDetails;
      const category = "flight";
      const currency = flight.price.currency;
      const stripe = await loadStripe(
        "pk_test_51QP32KJw0GnOmOhiEcjFRPOQuAaeMvLFua47d32A2oZRpH6RjplhiKrp98clFipprosXFawCqzGEGAYK2OpulYI400jvrMVbHU"
      );
      const body = {
        //need to get as input to the CardPayment component
        category: category,
        products: toBePayedFor,
        currency: currency,
      };
      const headers = {
        "content-Type": "application/json",
      };
      const response = await fetch(
        "http://localhost:3002/create-checkout-session",
        {
          method: "post",
          headers: headers,
          body: JSON.stringify(body),
        }
      );
      const session = await response.json();
      const result = stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleBookWithWallet = async () => {
    const flight = bookingFlight;
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.username : null;
    if (!username) {
      alert("You Must Be Signed In To Book Transportation");
      return;
    }
    const bookingID = generateBookingID();
    const flightDetails = {
      totalPrice: flight.price.grandTotal,
      origin: formData.origin,
      destination: formData.destination,
      departureDate: formData.departureDate,
      returnDate: formData.returnDate,
      bookingId: bookingID,
    };

    try {
      console.log(flightDetails);
      const response = await axios.put(
        "http://localhost:3002/addFlightWithWallet",
        {
          username,
          flightDetails: flightDetails,
        }
      );

      if (response.status === 200) {
        const result = response.data;
        setBookingMessages((prevMessages) => ({
          ...prevMessages,
          [flight.id]: `IMPORTANT: Save your booking ID: ${bookingID}`,
        }));
        console.log("Flight booked successfully:", result);
        alert("Succesfully Booked Flight");
      } else {
        console.error("Error booking flight");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Search Flights</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Origin:</label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Destination:</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>
        <div style={styles.row}>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Departure Date:</label>
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Return Date:</label>
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Adults:</label>
            <input
              type="number"
              name="adults"
              value={formData.adults}
              onChange={handleChange}
              min="1"
              required
              style={styles.input}
            />
          </div>
        </div>
        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.button}>
            Search Flights
          </button>
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {flights.length > 0 ? (
            flights.map((flight, index) => (
              <div className="ticket-container" key={index}>
                <div className="ticket">
                  <ul className="left">
                    {Array(14)
                      .fill(null)
                      .map((_, i) => (
                        <li key={i}></li>
                      ))}
                  </ul>
                  <ul className="right">
                    {Array(14)
                      .fill(null)
                      .map((_, i) => (
                        <li key={i}></li>
                      ))}
                  </ul>
                  <div className="ticket-header">
                    <h3 className="airline">{flight.source}</h3>
                    <p className="boarding">Boarding Pass</p>
                  </div>
                  <div className="content">
                    <div className="main-details">
                      <span className="departure">
                        {flight.itineraries[0]?.segments[0]?.departure.iataCode}
                      </span>
                      <span className="plane">✈️</span>
                      <span className="arrival">
                        {
                          flight.itineraries[0]?.segments.slice(-1)[0]?.arrival
                            .iataCode
                        }
                      </span>
                    </div>
                    <div className="sub-content">
                      <span className="name">
                        Price
                        <br />
                        <span>
                          {flight.price.grandTotal} {flight.price.currency}
                        </span>
                      </span>
                      <span className="flight">
                        Offer ID
                        <br />
                        <span>{flight.id}</span>
                      </span>
                      <span className="gate">
                        Travelers
                        <br />
                        <span>{flight.travelerPricings.length}</span>
                      </span>
                      <span className="boardingtime">
                        Departure
                        <br />
                        <span>
                          {new Date(
                            flight.itineraries[0]?.segments[0]?.departure.at
                          ).toLocaleString()}
                        </span>
                      </span>
                      <span className="seat">
                        Arrival
                        <br />
                        <span>
                          {new Date(
                            flight.itineraries[0]?.segments.slice(
                              -1
                            )[0]?.arrival.at
                          ).toLocaleString()}
                        </span>
                      </span>
                      <div>
                        <button
                          onClick={() => handleOpenModal(flight)}
                          className="book-button"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="barcode"></div>
                </div>

                {bookingMessages[flight.id] && (
                  <p className="booking-message">
                    {bookingMessages[flight.id]}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p>No flights available</p>
          )}
        </div>
      )}
      {modalShow && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{
              maxWidth: "800px",
              width: "90%",
              margin: "0 auto",
            }}
          >
            <div
              className="modal-content"
              style={{
                maxHeight: "90vh",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="modal-header">
                <h5 className="modal-title">Checkout My Order</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => closeModal()}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* Payment Options */}
                <div
                  className="payment-method-section"
                  style={{ marginTop: "20px", width: "100%" }}
                >
                  <div
                    className="container"
                    style={{ width: "100%", padding: "0" }}
                  >
                    <div
                      className="payment-method-options"
                      style={{ width: "100%" }}
                    >
                      <div
                        className="payment-option-container"
                        style={{ width: "100%" }}
                      >
                        <div
                          className="payment-method-box"
                          style={{ width: "100%" }}
                        >
                          <label
                            htmlFor="wallet"
                            className="payment-method-label"
                          >
                            Wallet
                          </label>
                          <input
                            type="radio"
                            name="payment-method"
                            value="wallet"
                            checked={paymentMethod === "wallet"}
                            onChange={handlePaymentMethodChange}
                            className="payment-radio-button"
                            style={{ marginLeft: "auto" }}
                          />
                        </div>
                      </div>
                      <div
                        className="payment-option-container"
                        style={{ width: "100%" }}
                      >
                        <div
                          className="payment-method-box"
                          style={{ width: "100%" }}
                        >
                          <label
                            htmlFor="card"
                            className="payment-method-label"
                          >
                            Credit Card
                          </label>
                          <input
                            type="radio"
                            name="payment-method"
                            value="card"
                            checked={paymentMethod === "card"}
                            onChange={handlePaymentMethodChange}
                            className="payment-radio-button"
                            style={{ marginLeft: "auto" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="summary-container">
                  <div>
                    <h5>Summary</h5>
                  </div>
                  <hr />
                  {/* Display only the first  (or your selected item) */}
                  {flights.length > 0 && (
                    <div className="row">
                      <div className="col">{bookingFlight.name}</div>
                      <div className="col text-right">
                        &euro;{bookingFlight.price.grandTotal}
                      </div>
                    </div>
                  )}

                  {/* Promo Code Field (Leftmost) */}
                  <div style={{ marginTop: "10px" }}>
                    <h5>Promo Code</h5>
                    <input
                      type="text"
                      placeholder="Enter your promo code"
                      className="form-control"
                      style={{ width: "100%", marginBottom: "10px" }}
                      onChange={(e) => setPromoCode(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>

                  <div className="row">
                    <div className="col">TOTAL PRICE</div>
                    <div className="col text-right">
                      &euro;
                      {totalPrice}
                    </div>
                  </div>

                  {/* Full Width Button */}
                  <button
                    className="btn btn-lg btn-buy px-4 mt-2 me-2 flex-grow-1 mb-1 w-100"
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    backgroundColor: "#ffffff",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#2c3e50",
    fontSize: "24px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
  },
  inputContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#2c3e50",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #bdc3c7",
    fontSize: "16px",
    outline: "none",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "border-color 0.3s",
  },
  buttonContainer: {
    textAlign: "center",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#5ddec2",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};
