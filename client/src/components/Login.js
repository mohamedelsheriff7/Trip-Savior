import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css"; // Import custom CSS for styling
import tripSaviourImage from "../images/trip_saviour.jpeg"; // Import the image

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:3002/tour_guide", {
        params: { username, password },
      });
  
      if (response.data && response.data.length > 0) {
        const tourGuide = response.data[0];
  
        // Check if the status is "Accepted"
        if (tourGuide.status === "Accepted") {
          // Store the user's details including the username in localStorage
          localStorage.setItem("user", JSON.stringify(tourGuide));
          localStorage.setItem("tourGuideName", tourGuide.username); // Store username for later comparison
          localStorage.setItem("tourGuidePassword", password); // Store the password
          navigate("/terms-and-conditions");
          // Redirect to Profile page
         // navigate("/profile");
        } else if (tourGuide.status === "Pending" || !tourGuide.status) {
          setError("Your account has not been accepted yet.");
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Error logging in. Please try again.");
    }
  };
  

  return (
    <div
      className="login-container"
      style={{
       // backgroundImage: `url(${tripSaviourImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="login-card">
        <h3 className="text-center">Welcome to Trip Saviour</h3>
        <h5 className="text-center">Tour Guide Login</h5>
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

export default Login;