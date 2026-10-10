import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

export default function CardPayment({ toBePayedFor, category, currency }) {
  //category di string bt2ol dh activity wla itenerarie wla el cart 3mtn
  // get products that are in the cart
  // aw lw activity aw itenerarie
  const makePayment = async () => {
    //ht call di 3l payment button
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
  return <button onClick={makePayment}>book with card</button>;
}
