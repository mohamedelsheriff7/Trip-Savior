import React, { useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

export default function BookTransportation() {
  const [formData, setFormData] = useState({ city: "" });
  const [loading, setLoading] = useState(false);
  const [transportationOptions, setTransportationOptions] = useState([]);
  const [bookingMessages, setBookingMessages] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalType, setModalType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [bookingTransportation, setBookingTransportation] = useState({
    price: 0,
  });
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : null;
  const [totalPrice, setTotalPrice] = useState(
    bookingTransportation.price * (1 - discount / 100)
  );
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "card") {
      handleBookingWithCard();
    } else {
      handleBookingWithWallet();
    }
  };

  const handleOpenModal = (transportation) => {
    setBookingTransportation(transportation);
    setTotalPrice(transportation.price * (1 - discount / 100));
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
        bookingTransportation.price * (1 - response.data.discount / 100)
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
    setBookingTransportation({ price: 1 });
    setModalShow(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleBook = (transportId) => {
    if (!bookingMessages[transportId]) {
      const bookingID = generateBookingID();
      setBookingMessages((prevMessages) => ({
        ...prevMessages,
        [transportId]: `IMPORTANT: Save your booking ID: ${bookingID}`,
      }));
    }
  };
  const handleBookingWithCard = async () => {
    //ht call di 3l payment button
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.username : null;
    if (!username) {
      alert("You Must Be Signed In To Book Transportation");
      return;
    }
    const transportation = bookingTransportation;
    if (!bookingMessages[transportation.id]) {
      const bookingID = generateBookingID();
      const transportationDetails = {
        name: transportation.company,
        city: transportation.city,
        price: transportation.price,
        bookingId: bookingID,
      };
      try {
        const toBePayedFor = transportationDetails;
        const category = "transportation";
        const currency = "USD";
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
  const handleBookingWithWallet = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.username : null;
    if (!username) {
      alert("You Must Be Signed In To Book Transportation");
      return;
    }
    const transportation = bookingTransportation;
    if (!bookingMessages[transportation.id]) {
      const bookingID = generateBookingID();
      const transportationDetails = {
        name: transportation.company,
        city: transportation.city,
        price: transportation.price,
        bookingId: bookingID,
      };
      try {
        const response = await axios.put(
          "http://localhost:3002/addTransportWithWallet",
          {
            username,
            transportationDetails,
          }
        );
        if (response.status === 200) {
          alert("Succesfully Booked Transport");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const dummyData = [
        { id: 1, type: "Car", company: "City Rides", price: 100 },
        { id: 2, type: "Bus", company: "Shuttle Express", price: 120 },
        { id: 3, type: "Shuttle", company: "Quick Transport", price: 90 },
        { id: 4, type: "Car", company: "Urban Drive", price: 133 },
        { id: 5, type: "Bus", company: "Local Travel", price: 60 },
        { id: 6, type: "Shuttle", company: "Airport Connect", price: 75 },
      ];

      const updatedOptions = dummyData.map((option) => ({
        ...option,
        city: formData.city,
      }));

      setTransportationOptions(updatedOptions);
      setLoading(false);
    }, 2000);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Book Your Transportation</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.button}>
            Search Transportation
          </button>
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : transportationOptions.length === 0 ? (
        <p>No options available.</p>
      ) : (
        transportationOptions.map((option) => (
          <div key={option.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.ticketTitle}>{option.type}</h3>
              <p style={styles.cityCode}>City: {formData.city}</p>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.detailsRow}>
                <span style={styles.detailLabel}>Company:</span>
                <span style={styles.detailValue}>{option.company}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailLabel}>Price:</span>
                <span style={styles.price}>${option.price} USD</span>
              </div>
              <div style={styles.bookButtonContainer}>
                <button
                  style={styles.bookButton}
                  onClick={() => handleOpenModal(option)}
                >
                  Book Now
                </button>
                {bookingMessages[option.id] && (
                  <p style={styles.bookingMessage}>
                    {bookingMessages[option.id]}
                  </p>
                )}
              </div>
            </div>
            (
            {modalShow && (
              <div
                className="modal fade show d-flex align-items-center justify-content-center"
                tabIndex="-1"
                style={{
                  display: "block",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
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
                        <div className="row">
                          <div className="col">
                            {bookingTransportation.name}
                          </div>
                          <div className="col text-right">
                            &euro;{bookingTransportation.price}
                          </div>
                        </div>
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
            )
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "80%",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#2c3e50",
    fontSize: "26px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "20px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#2c3e50",
  },
  input: {
    padding: "12px",
    borderRadius: "5px",
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
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#5ddec2",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ddd",
    borderRadius: "8px",
    margin: "20px auto",
    padding: "20px",
    maxWidth: "700px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    fontFamily: "'Roboto', sans-serif",
  },
  cardHeader: {
    borderBottom: "1px solid #ddd",
    marginBottom: "15px",
    paddingBottom: "10px",
  },
  ticketTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#2c3e50",
    margin: 0,
  },
  cityCode: {
    fontSize: "14px",
    color: "#7f8c8d",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
  },
  detailsRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#2c3e50",
  },
  detailValue: {
    color: "#34495e",
  },
  price: {
    color: "#e74c3c",
    fontWeight: "bold",
    fontSize: "18px",
  },
  bookButtonContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
  bookButton: {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#5ddec2",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  bookingMessage: {
    marginTop: "10px",
    color: "#e74c3c",
    fontWeight: "bold",
    textAlign: "center",
  },
  noOffersText: {
    color: "#95a5a6",
    fontStyle: "italic",
    textAlign: "center",
  },
  containerM: {
    width: "100%",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    backgroundColor: "#ffffff",
  },
  headerM: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#2c3e50",
    fontSize: "24px",
    fontWeight: "bold",
  },
  formM: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  rowM: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
  },
  inputContainerM: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  labelM: {
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#2c3e50",
  },
  inputM: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #bdc3c7",
    fontSize: "16px",
    outline: "none",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "border-color 0.3s",
  },
  buttonContainerM: {
    textAlign: "center",
  },
  buttonM: {
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
