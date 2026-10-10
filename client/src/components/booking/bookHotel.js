import React, { useState } from "react";
import axios from "axios";
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

const fetchHotelList = async (token, cityCode) => {
  const response = await fetch(
    `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data.data || [];
};

const fetchHotelOffers = async (token, hotelIds, checkInDate, checkOutDate) => {
  const response = await fetch(
    `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIds.join(
      ","
    )}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data;
};

export default function HotelSearch() {
  const [formData, setFormData] = useState({
    cityCode: "",
    checkInDate: "",
    checkOutDate: "",
  });
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingMessages, setBookingMessages] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalType, setModalType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [bookingHotel, setBookingHotel] = useState({ price: 1 });
  const [bookingOffer, setBookingOffer] = useState({ price: 1 });
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : null;
  const [totalPrice, setTotalPrice] = useState(
    bookingOffer.price.total * (1 - discount / 100)
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

  const handleOpenModal = (hotel, offer) => {
    setBookingHotel(hotel);
    setBookingOffer(offer);
    setTotalPrice(offer.price.total * (1 - discount / 100));
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
        bookingOffer.price.total * (1 - response.data.discount / 100)
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
    setBookingHotel({});
    setBookingOffer({});
    setModalShow(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = await fetchToken();
    const fetchedHotels = await fetchHotelList(token, formData.cityCode);
    if (!Array.isArray(fetchedHotels)) {
      setLoading(false);
      return;
    }
    const hotelIds = fetchedHotels.slice(0, 20).map((hotel) => hotel.hotelId);
    const data = await fetchHotelOffers(
      token,
      hotelIds,
      formData.checkInDate,
      formData.checkOutDate
    );

    const warnings = (data.warnings || []).reduce((acc, warning) => {
      if (warning.title.includes("NO ROOMS AVAILABLE")) {
        const unavailableHotels = warning.source.parameter
          .split("=")[1]
          .split(",");
        unavailableHotels.forEach((hotelId) => {
          acc[hotelId] = "No rooms available for this hotel.";
        });
      }
      return acc;
    }, {});

    if (data.data) {
      const hotelsWithOffers = data.data.map((hotel) => ({
        ...hotel.hotel,
        offers: hotel.offers || [],
        warning: warnings[hotel.hotel.hotelId] || null,
      }));
      setHotels(hotelsWithOffers);
    }
    setLoading(false);
  };

  const generateBookingID = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let bookingID = "";
    for (let i = 0; i < 6; i++) {
      bookingID += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return bookingID;
  };

  const handleBook = async (hotel, offer) => {
    if (!bookingMessages[offer.id]) {
      const bookingID = generateBookingID();
      // const totalPrice = `${offer.price.total} ${offer.price.currency}`;
      const hotelDetails = {
        totalPrice: `${totalPrice} ${offer.price.currency}`,
        hotelName: hotel.name,
        location: hotel.cityCode, //e3ml hna
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        bookingId: bookingID,
      };

      try {
        console.log(
          "Username from local storage:",
          localStorage.getItem("username")
        );
        console.log(hotelDetails);
        const response = await axios.put("http://localhost:3002/addHotel", {
          username: localStorage.getItem("username").replace(/^"(.*)"$/, "$1"), // Removes extra quotes
          hotelDetails: hotelDetails,
        });

        if (response.status === 200) {
          const result = response.data;
          setBookingMessages((prevMessages) => ({
            ...prevMessages,
            [offer.id]: `IMPORTANT: Save your booking ID: ${bookingID}`,
          }));
          console.log("Flight booked successfully:", result);
        } else {
          console.error("Error booking hotel");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  const handleBookWithCard = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.username : null;
    if (!username) {
      alert("You Must Be Signed In To Book Transportation");
      return;
    }
    if (!bookingMessages[bookingOffer.id]) {
      const bookingID = generateBookingID();
      // const totalPrice = `${offer.price.total} ${offer.price.currency}`;
      const hotelDetails = {
        totalPrice: totalPrice,
        currency: bookingOffer.price.currency,
        hotelName: bookingHotel.name,
        location: bookingHotel.cityCode, //e3ml hna
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        bookingId: bookingID,
      };
      try {
        const toBePayedFor = hotelDetails;
        const category = "hotel";
        const currency = bookingOffer.price.currency;
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
    }
  };
  const handleBookWithWallet = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.username : null;
    if (!username) {
      alert("You Must Be Signed In To Book Transportation");
      return;
    }
    if (!bookingMessages[bookingOffer.id]) {
      const bookingID = generateBookingID();
      // const totalPrice = `${offer.price.total} ${offer.price.currency}`;
      console.log(bookingOffer.price.total * 2);
      const hotelDetails = {
        totalPrice: totalPrice,
        currency: bookingOffer.price.currency,
        hotelName: bookingHotel.name,
        location: bookingHotel.cityCode, //e3ml hna
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        bookingId: bookingID,
      };

      try {
        console.log(hotelDetails);
        const response = await axios.put(
          "http://localhost:3002/addHotelWithWallet",
          {
            username,
            hotelDetails: hotelDetails,
          }
        );

        if (response.status === 200) {
          const result = response.data;
          setBookingMessages((prevMessages) => ({
            ...prevMessages,
            [bookingHotel.id]: `IMPORTANT: Save your booking ID: ${bookingID}`,
          }));
          console.log("Hotel booked successfully:", result);
          alert("Succesfully Booked Hotel");
        } else {
          console.error("Error booking hotel");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Search Hotels</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div style={styles.inputContainer}>
            <label style={styles.label}>City Code:</label>
            <input
              type="text"
              name="cityCode"
              value={formData.cityCode}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Check-In Date:</label>
            <input
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Check-Out Date:</label>
            <input
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>
        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.button}>
            Search Hotels
          </button>
        </div>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : hotels.length === 0 ? (
        <p>No offers available.</p>
      ) : (
        hotels.map((hotel, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.hotelName}>{hotel.name}</h3>
              <p style={styles.cityCode}>
                City Code: {formData.cityCode.toUpperCase()}
              </p>
            </div>
            <div style={styles.cardBody}>
              {hotel.offers && hotel.offers.length > 0 ? (
                hotel.offers.map((offer) => (
                  <div key={offer.id} style={styles.offerContainer}>
                    <div style={styles.detailsRow}>
                      <span style={styles.detailLabel}>Check-In:</span>
                      <span style={styles.detailValue}>
                        {offer.checkInDate}
                      </span>
                    </div>
                    <div style={styles.detailsRow}>
                      <span style={styles.detailLabel}>Check-Out:</span>
                      <span style={styles.detailValue}>
                        {offer.checkOutDate}
                      </span>
                    </div>
                    <div style={styles.detailsRow}>
                      <span style={styles.detailLabel}>Price:</span>
                      <span style={styles.price}>
                        {offer.price.total} {offer.price.currency}
                      </span>
                    </div>
                    <div style={styles.detailsRow}>
                      <span style={styles.detailLabel}>Description:</span>
                      <span style={styles.detailValue}>
                        {offer.room.description.text}
                      </span>
                    </div>
                    <button
                      style={styles.bookButton}
                      //onClick={() => handleBookWithWallet(hotel, offer)
                      onClick={() => handleOpenModal(hotel, offer)}
                    >
                      Reserve Now
                    </button>
                    {bookingMessages[offer.id] && (
                      <p style={styles.bookingMessage}>
                        {bookingMessages[offer.id]}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p style={styles.noOffersText}>
                  No offers available for this hotel.
                </p>
              )}
            </div>
          </div>
        ))
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
                  {hotels.length > 0 && (
                    <div className="row">
                      <div className="col">{bookingHotel.name}</div>
                      <div className="col text-right">
                        &euro;{bookingHotel.price}
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
  card: {
    display: "flex",
    flexDirection: "row",
    border: "1px solid #ddd",
    borderRadius: "8px",
    margin: "20px auto",
    padding: "15px",
    maxWidth: "800px",
    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    fontFamily: "'Roboto', sans-serif",
  },
  cardImageContainer: {
    flex: "1 1 40%",
    maxWidth: "40%",
    marginRight: "15px",
  },
  cardImage: {
    width: "100%",
    borderRadius: "8px",
    objectFit: "cover",
  },
  cardContent: {
    flex: "2 1 60%",
    padding: "10px",
  },
  hotelName: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#34495e",
    marginBottom: "10px",
  },
  hotelLocation: {
    fontSize: "14px",
    color: "#7f8c8d",
    marginBottom: "15px",
  },
  offerDetails: {
    padding: "10px 0",
    borderBottom: "1px solid #e5e5e5",
    marginBottom: "10px",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  bookButton: {
    display: "inline-block",
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#2ecc71",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  bookButtonHover: {
    backgroundColor: "#27ae60",
  },
  bookingMessage: {
    display: "block",
    marginTop: "10px",
    textAlign: "center",
    color: "#e74c3c",
    fontWeight: "bold",
  },
  warningText: {
    color: "#e74c3c",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  noOffersText: {
    color: "#95a5a6",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: "10px",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#1c5954", // Darker shade of #5ddec2
    fontSize: "28px",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    margin: "20px auto",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    border: "1px solid #e1f4f0",
  },
  cardHeader: {
    backgroundColor: "#ffffff", // Darker shade of #5ddec2

    color: "#ffffff",
    padding: "15px",
    fontSize: "20px",
    borderBottom: "2px solid #45b7a4",
  },
  hotelName: {
    margin: "0",
    fontWeight: "bold",
    fontSize: "22px",
  },
  cityCode: {
    margin: "5px 0 0",
    fontSize: "16px",
    color: "#a3d8d0", // Subtle shade complementing #5ddec2
  },
  cardBody: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  offerContainer: {
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#f9fdfc", // Very light complement to #5ddec2
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  detailsRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#1c5954",
  },
  detailValue: {
    color: "#4e7f7a",
  },
  price: {
    color: "#ff6f61",
    fontWeight: "bold",
    fontSize: "18px",
  },
  bookButton: {
    display: "inline-block",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#5ddec2", // Text matches the palette
    backgroundColor: "#ffffff", // White background
    border: "2px solid #5ddec2", // Border matches the palette
    borderRadius: "6px",
    cursor: "pointer",
    transition: "box-shadow 0.3s, background-color 0.3s",
    margin: "10px auto 0", // Centered button
    textAlign: "center",
  },
  bookButtonHover: {
    boxShadow: "0 4px 8px rgba(93, 222, 194, 0.5)", // Shadow with #5ddec2
    backgroundColor: "#f0fcf8", // Subtle background hover effect
  },
  bookingMessage: {
    marginTop: "10px",
    textAlign: "center",
    color: "#e74c3c",
    fontWeight: "bold",
  },
  noOffersText: {
    color: "#95a5a6",
    fontStyle: "italic",
    textAlign: "center",
  },
};
