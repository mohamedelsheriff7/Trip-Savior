import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Cart.css";
import { loadStripe } from "@stripe/stripe-js";

const CheckOutCart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : null;
  const id = user._id;
  const [chosenAddress, setChosenAddress] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const discount = location.state?.discount || 0;
  const [databaseAddresses, setDatabaseAddresses] = useState([]);

  const fetchAddresses = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const username = user ? user.username : null;
      setLoading(true);
      const response = await axios.put(
        "http://localhost:3002/tourist/get-delivery-addresses",
        { username }
      );
      if (response.status === 200) {
        setDatabaseAddresses(response.data.deliveryAddresses);
      }
      setError("");
    } catch (err) {
      console.error("Cart fetch error:", err);
      setError("Failed to load cart. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!username) {
      setError("No Tourist username provided.");
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3002/tourists/cart/${id}`
        );
        setCart(response.data.cart);
        setError("");
      } catch (err) {
        console.error("Cart fetch error:", err);
        setError("Failed to load cart. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
    fetchAddresses();
  }, [id]);

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      if (newQuantity < 0) {
        setError("Quantity cannot be negative.");
        return;
      }

      const response = await axios.put(
        `http://localhost:3002/tourists/changeAmountInCart/${id}`,
        {
          productId,
          quantity: newQuantity,
        }
      );

      setCart(response.data.cart); // Update cart with new quantities
      setError("");
    } catch (err) {
      console.error("Quantity change error:", err);
      setError("Failed to update quantity.");
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCheckoutWithWallet = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.username : null;

    if (!username) {
      alert("You must be logged in to checkout. Please log in first.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3002/checkout-cart-with-wallet",
        { cart, username, discount, address: chosenAddress } // Send cart items and username to the backend
      );

      if (response.status === 200) {
        alert("Checkout successful! Thank you for your purchase.");
        setCart([]); // Clear the cart after successful checkout
      }
    } catch (err) {
      console.error("Checkout error:", err);

      alert(
        "Not enough funds in wallet. Please add more funds or use another payment method."
      );
    }
  };

  const handleCheckoutWithCard = async () => {
    //ht call di 3l payment button
    const toBePayedFor = cart;
    const category = "cart";
    const currency = "USD";
    const stripe = await loadStripe(
      "pk_test_51QP32KJw0GnOmOhiEcjFRPOQuAaeMvLFua47d32A2oZRpH6RjplhiKrp98clFipprosXFawCqzGEGAYK2OpulYI400jvrMVbHU"
    );
    const body = {
      //need to get as input to the CardPayment component
      category: category,
      products: toBePayedFor,
      currency: currency,
      discount: discount,
      address: chosenAddress,
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
  };

  const removeFromCart = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this item from your cart?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:3002/tourists/removeFromCart/${id}`,
        {
          data: { productId },
        }
      );
      setCart(response.data.cart); // Update cart after removal
    } catch (err) {
      setError("Failed to remove product from cart.");
    }
  };

  // const handleAddAddress = () => {
  //   const newAddress = { id: addresses.length + 1, value: "" };
  //   setAddresses([...addresses, newAddress]);
  // };
  const handleAddAddress = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const username = user ? user.username : null;
      setLoading(true);
      console.log(address);
      console.log(username);
      console.log(chosenAddress);
      const response = await axios.put(
        "http://localhost:3002/tourist/add-delivery-address",
        { username, address }
      );
      if (response.status === 200) {
        await fetchAddresses();
      }
      setError("");
    } catch (err) {
      console.error("Address fetch error:", err);
      setError("Failed to load cart. Please try again later.");
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "wallet") {
      handleCheckoutWithWallet();
    } else if (paymentMethod === "cash") {
      alert("Order added successfully! Cash on delivery selected.");
    } else if (paymentMethod === "card") {
      handleCheckoutWithCard();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const inputStyle = {
    borderColor: "#5ddec2",
    borderWidth: "2px",
    borderRadius: "8px",
    padding: "10px",
    width: "100%",
    marginBottom: "20px",
  };

  return (
    <>
      <div className="cart-page">
        <div className="cart-card">
          <div className="row">
            <div className="col-md-8 cart-container">
              <div className="cart-title">
                <div className="row">
                  <div className="col">
                    <h4>
                      <b>Checkout My Order</b>
                    </h4>
                  </div>
                </div>
              </div>
              {/* Shopping Cart items */}

              <div className="delivery-address-section">
                <h5 style={{ marginTop: "-20px", marginLeft: "-390px" }}>
                  Delivery Addresses:
                </h5>

                <div className="address-input-container">
                  <label className="form-label" style={{ color: "#5ddec2" }}>
                    Address
                  </label>
                  <input
                    type="text"
                    onChange={(e) => handleAddressChange(e)}
                    placeholder={`Enter Your Address`}
                    className="form-control custom-input"
                    style={inputStyle}
                  />

                  <button
                    className="btn btn-secondary mt-2"
                    style={{ marginLeft: "200px" }}
                    onClick={handleAddAddress}
                  >
                    Add Another Address
                  </button>
                </div>

                {/* Payment Options */}
                <h5 style={{ marginTop: "20px", marginLeft: "-450px" }}>
                  Pay With:
                </h5>
                <div
                  className="payment-method-section"
                  style={{ marginTop: "20px" }}
                >
                  <div className="container">
                    <div className="payment-method-options">
                      <div className="payment-option-container">
                        <div className="payment-method-box">
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
                          />
                        </div>
                      </div>
                      <div className="payment-option-container">
                        <div className="payment-method-box">
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
                          />
                        </div>
                      </div>
                      <div className="payment-option-container">
                        <div className="payment-method-box">
                          <label
                            htmlFor="cash"
                            className="payment-method-label"
                          >
                            Cash On Delivery
                          </label>
                          <input
                            type="radio"
                            name="payment-method"
                            value="cash"
                            checked={paymentMethod === "cash"}
                            onChange={handlePaymentMethodChange}
                            className="payment-radio-button"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 summary-container">
              <div>
                <h5>
                  <b>Summary</b>
                </h5>
              </div>
              <hr className="cart-summary-divider" />
              <div className="row">
                <div className="col" style={{ paddingLeft: "0" }}>
                  ITEMS {cart.length}
                </div>
                <div className="col text-right">
                  &euro;{" "}
                  {cart.reduce(
                    (total, item) => total + item.product.Price * item.quantity,
                    0
                  )}
                </div>
              </div>
              <form className="cart-form">
                <p>SHIPPING</p>
                <select className="select-input">
                  <option className="text-muted">
                    Standard-Delivery- &euro;5.00
                  </option>
                </select>
              </form>
              <div
                className="row"
                style={{
                  borderTop: "1px solid rgba(0,0,0,.1)",
                  padding: "2vh 0",
                }}
              >
                <div className="col">TOTAL PRICE</div>
                <div className="col text-right">
                  &euro;
                  {cart.reduce(
                    (total, item) => total + item.product.Price * item.quantity,
                    0
                  ) *
                    (1 - discount / 100) +
                    5}
                </div>
              </div>
              {/* Map through databaseAddresses below the total price */}
              <h6>Delivery Addresses:</h6>
              <div className="row gap-3">
                {databaseAddresses.map((address, index) => (
                  <div className="payment-method-box">
                    <label
                      htmlFor="wallet"
                      className="payment-method-label mx-10"
                    >
                      {address}
                    </label>
                    <input
                      key={index}
                      type="radio"
                      name="delivery-address"
                      value={address}
                      checked={chosenAddress === `${address}`}
                      onChange={() => setChosenAddress(address)}
                      className="payment-radio-button"
                    />
                  </div>
                ))}
              </div>

              {/* <div className="row  p-2" style={{ marginTop: "10px" }}>
                <div className="col">
                  <ul style={{ marginLeft: "-35px", paddingLeft: "20px" }}>
                    {databaseAddresses.map((address, index) => (
                      <li
                        key={index}
                        className="card"
                        style={{ marginBottom: "5px", paddingLeft: "5px" }}
                      >
                        {address}
                      </li>
                    ))}
                  </ul>
                </div>
              </div> */}

              <button
                style={{ fontSize: "16px", marginTop: "190px" }}
                className="checkout-btn"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckOutCart;
