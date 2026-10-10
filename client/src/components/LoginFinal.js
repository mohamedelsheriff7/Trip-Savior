import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css"; // Import custom CSS for styling
import tripSaviourImage from "../images/trip_saviour.jpeg"; // Import the image

const LoginFinal = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
    const user = await axios.get("http://localhost:3002/search-username", {
        params: { username },
    });

    let response;
    let nav;

    if (user.data.role === "Tourguide"){
      response = await axios.get("http://localhost:3002/tour_guide", {
        params: { username, password },
      });

      localStorage.setItem("selectedRole", user.data.role);
      nav = "/terms-and-conditions";
    }
    else if (user.data.role === "Seller"){
        response = await axios.get("http://localhost:3002/sellers/login", {
          params: { username, password },
        });
  
        localStorage.setItem("selectedRole", user.data.role);
        nav = "/terms-and-conditions";
    }
    else if (user.data.role === "Advertiser"){
        response = await axios.get("http://localhost:3002/advertisers", {
            params: { username, password },
        });
    
        localStorage.setItem("selectedRole", user.data.role);
        nav = "/terms-and-conditions";
    }
    else if (user.data.role === "Tourist"){
        response = await axios.post("http://localhost:3002/tourist/login", {
            username, password
        });
    
        localStorage.setItem("selectedRole", user.data.role);
        nav = "/tourist-profile";
    }
    else if (user.data.role === "Admin"){
        response = await axios.get("http://localhost:3002/adminlogin", {
            params: { username, password },
        });
    
        localStorage.setItem("selectedRole", user.data.role);
        nav = "/admin-nav";
    }
    else if (user.data.role === "TourismGovernor"){
        response = await axios.get("http://localhost:3002/tourism-governor/login", {
            params: { username, password },
        });
    
        localStorage.setItem("selectedRole", user.data.role);
        nav = "/view-historicalPlaces";
    }


  
    if (response.data) {
        const account = response.data;
        
        if ((user.data.role === "seller") || (user.data.role === "advertiser") || (user.data.role === "tourGuide")){
            // Check if the status is "Accepted"
            if (account.status === "Accepted") {
            // Store the user's details including the username in localStorage
            localStorage.setItem("user", JSON.stringify(account));
            localStorage.setItem("tourGuideName", account.username); // Store username for later comparison
            localStorage.setItem("tourGuidePassword", password); // Store the password
            navigate(nav);
            // Redirect to Profile page
            // navigate("/profile");
            } else if (account.status === "Pending" || !account.status) {
            setError("Your account has not been accepted yet.");
            } else {
            setError("Invalid credentials. Please try again.");
            }
        }
        else{
            // Store the user's details including the username in localStorage
            localStorage.setItem("user", JSON.stringify(account));
            localStorage.setItem("tourGuideName", account.username); // Store username for later comparison
            localStorage.setItem("tourGuidePassword", password); // Store the password
            navigate(nav);
        }
      }
    else {
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
        backgroundImage: `url(${tripSaviourImage})`,
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

export default LoginFinal;