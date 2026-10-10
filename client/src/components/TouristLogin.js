import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css"; // Import custom CSS for styling
import tripSaviourImage from "../images/trip_saviour.jpeg"; // Import the image

const TouristLogin = () => {
  const [username, setUsername] = useState("");
  //const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        // Sending a POST request with username, email, and password
        const response = await axios.post("http://localhost:3002/tourist/login", {
            username,
           // email, // Include email in the request
            password,
        });

        // If the response contains the user data
        if (response.data) {
            // Store user information in localStorage
            localStorage.setItem("user", JSON.stringify(response.data.tourist));
            localStorage.setItem("username", JSON.stringify(response.data.tourist.username));
            // Redirect to Profile page
            navigate("/tourist-profile");
        } else {
            setError("Invalid credentials. Please try again.");
        }
    } catch (err) {
        // Handle errors and set the error message
        setError("Invalid credentials. Please try again.");
    }
};



  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${tripSaviourImage})`, // Add the background image here
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="login-card">
        <h3 className="text-center">Welcome to Trip Saviour</h3>
        <h5 className="text-center">Tourist Login</h5>
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


export default TouristLogin;