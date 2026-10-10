import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css"; // Import custom CSS for styling
import tripSaviourImage from "../images/trip_saviour.jpeg"; // Import the image

const SellerLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:3002/sellers/login", {
        params: { username, password },
      });

      if (response.data) {
        const seller = response.data;

        // Check if the returned seller matches the provided credentials and has an "Accepted" status
        if (
          seller.username === username &&
          seller.password === password &&
          seller.status === "Accepted"
        ) {
          // Store the user's details including the username and password in localStorage
          localStorage.setItem("user", JSON.stringify(seller));
          localStorage.setItem("sellerName", seller.username); // Store username for later comparison
          localStorage.setItem("sellerGuidePassword", seller.password);

          navigate('/terms-and-conditions');
          // Redirect to Seller Profile page with seller's data
         // navigate("/seller-profile", { state: seller });
        } else if (seller.status === "Pending" || !seller.status) {
          setError("Your account has not been accepted yet.");
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${tripSaviourImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="login-card">
        <h3 className="text-center">Welcome to Trip Saviour</h3>
        <h5 className="text-center">Seller Login</h5>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group password-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "🙈"}
              </span>
            </div>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="text-center mt-3">
          <a href="/forgot-password" className="link">Forgot Password?</a>
        </p>
      </div>
    </div>
  );
};

export default SellerLogin;
