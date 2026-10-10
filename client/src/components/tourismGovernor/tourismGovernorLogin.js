import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Login.css"; // Import custom CSS for styling
import tripSaviourImage from "../../images/trip_saviour.jpeg"; // Import the image

const TourismGovernorLogin = () => {
  const [Username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sending a POST request with Username, email, and Password
      const response = await axios.post(
        "http://localhost:3002/tourism-governor/login",
        {
          Username: Username,
          email: email, // Include email in the request
          Password: Password,
        }
      );
      console.log(response);

      // If the response contains the user data
      if (response.data) {
        const tourismGovernor = response.data.tourismGovernor;

        // Check if the returned seller matches the provided credentials
        console.log(tourismGovernor.Username);
        console.log(Username);
        console.log(tourismGovernor.Password);
        console.log(Password);
        console.log(tourismGovernor.Username === Username);
        console.log(tourismGovernor.Password === Password);
        if (
          tourismGovernor.Username === Username &&
          tourismGovernor.Password === Password
        ) {
          // Store the user's details including the Username and Password in localStorage
          localStorage.setItem("user", JSON.stringify(tourismGovernor));
          localStorage.setItem("tourismGovernorName", tourismGovernor.Username); // Store Username for later comparison
          localStorage.setItem(
            "tourismGovernorPassword",
            tourismGovernor.Password
          );

          // Redirect to Seller Profile page with seller's data
          navigate("/view-historicalPlaces", { state: tourismGovernor }); //mhtageen n3ml tourism governor profile? Ahmed
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
        <h5 className="text-center">Tourism Governor Login</h5>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group Password-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-Password"
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                aria-label={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? "👁️" : "🙈"}
              </span>
            </div>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <p className="text-center mt-3">
          {/* <ahmed /> */}
          <a href="/forgot-password" className="link">
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default TourismGovernorLogin;
