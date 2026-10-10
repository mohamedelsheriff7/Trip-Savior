import React, { useState } from "react";
import axios from "axios";
import AdminNavigationbar from "./AdminNavigationBar";
const CreatePromoCode = () => {
  const [promoCode, setPromoCode] = useState({
    code: "",
    discount: "",
    expiryDate: "",
    usageLimit: 1,
  });

  const [message, setMessage] = useState(""); // Success message state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromoCode({ ...promoCode, [name]: value });
  };

  const handleCreatePromoCode = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3002/api/promo-code",
        promoCode
      );

      if (response.status === 201) {
        setMessage("Promo code created successfully!"); // Set success message
        setPromoCode({
          code: "",
          discount: "",
          expiryDate: "",
          usageLimit: 1,
        });

        // Clear the message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        alert(err.response.data.message);
      } else {
        alert("An error occurred while creating the promo code.");
      }
    }
  };

  const inputStyle = {
    borderColor: "#5ddec2",
    borderWidth: "2px",
    borderRadius: "8px",
    padding: "10px",
    width: "100%",
    marginBottom: "20px",
  };

  const buttonStyle = {
    backgroundColor: "#5ddec2",
    borderColor: "#5ddec2",
    padding: "12px 30px",
    fontSize: "16px",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    width: "50%",
    textAlign: "center",
  };

  const messageStyle = {
    color: "#4caf50", // Green color
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  return (
    <>
      <AdminNavigationbar />
      <div className="container" style={{ marginTop: "40px" }}>
        <div className="row">
          <div className="col-lg-8 offset-lg-2 col-md-10 offset-md-1">
            <div className="card shadow-sm mt-5 p-4">
              <h2 className="text-center mb-4">Create Promo Code</h2>
              <form onSubmit={handleCreatePromoCode}>
                <div className="form-row">
                  <div className="form-group col-md-12">
                    <label htmlFor="code">Promo Code</label>
                    <input
                      type="text"
                      className="form-control"
                      id="code"
                      name="code"
                      placeholder="Enter promo code"
                      value={promoCode.code}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div className="form-group col-md-12">
                    <label htmlFor="discount">Discount (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="discount"
                      name="discount"
                      placeholder="Enter discount percentage"
                      value={promoCode.discount}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div className="form-group col-md-12">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="expiryDate"
                      name="expiryDate"
                      value={promoCode.expiryDate}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div className="form-group col-md-12">
                    <label htmlFor="usageLimit">Usage Limit</label>
                    <input
                      type="number"
                      className="form-control"
                      id="usageLimit"
                      name="usageLimit"
                      placeholder="Enter usage limit"
                      value={promoCode.usageLimit}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                </div>
                {/* Display success message */}
                {message && <div style={messageStyle}>{message}</div>}
                <div className="form-group text-center">
                  <button type="submit" style={buttonStyle}>
                    Create Promo Code
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePromoCode;
