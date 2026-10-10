import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Cart.css";
import { loadStripe } from "@stripe/stripe-js";

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : null;
  const id = user._id;

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
      alert("out of stock");
      console.error("Quantity change error:", err);
    }
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
        { cart, username } // Send cart items and username to the backend
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
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
                      <b>Shopping Cart</b>
                    </h4>
                  </div>
                </div>
              </div>
              {cart.length === 0 ? (
                <div>No items in your cart</div>
              ) : (
                <div className="row border-top border-bottom">
                  {cart.map((item, index) => (
                    <div
                      className="row cart-main align-items-center"
                      key={index}
                    >
                      <div className="col-2">
                        <img
                          className="cart-img"
                          src={`http://localhost:3002/${item.product.Picture}`}
                          alt={item.product.Name}
                        />
                      </div>
                      <div className="col">
                        <div className="row text-muted">
                          {item.product.Name}
                        </div>
                      </div>
                      <div className="col">
                        <a
                          href="#"
                          onClick={() =>
                            handleQuantityChange(
                              item.product._id,
                              item.quantity - 1
                            )
                          }
                        >
                          -
                        </a>
                        <a href="#" className="border">
                          {item.quantity}
                        </a>
                        <a
                          href="#"
                          onClick={() =>
                            handleQuantityChange(
                              item.product._id,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </a>
                      </div>
                      <div className="col">
                        &euro; {item.product.Price}
                        <span
                          className="remove-item"
                          onClick={() => removeFromCart(item.product._id)}
                        >
                          &#10005;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                <p>GIVE CODE</p>
                <input
                  id="promo-code"
                  placeholder="Enter your code"
                  className="text-input"
                  value={promoCode}
                  disabled={cart.length === 0}
                  onChange={(e) => setPromoCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </form>
              {cart.length !== 0 && (
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
                      (total, item) =>
                        total + item.product.Price * item.quantity,
                      0
                    ) *
                      (1 - discount / 100) +
                      5}
                  </div>
                </div>
              )}
              {/* 
  <button
    className="checkout-btn"
    onClick={handleCheckoutWithWallet}
  >
    CHECKOUT WITH WALLET
  </button>
  <button className="checkout-btn" onClick={handleCheckoutWithCard}>
    CHECKOUT WITH CARD
  </button>
*/}
              {cart.length !== 0 && (
                <button
                  style={{ fontSize: "16px" }}
                  className="checkout-btn"
                  onClick={() =>
                    navigate("/checkoutcart", { state: { discount } })
                  }
                >
                  {" "}
                  CHECKOUT{" "}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
