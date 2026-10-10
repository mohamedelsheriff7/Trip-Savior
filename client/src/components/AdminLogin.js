import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";
import tripSaviourImage from "../images/trip_saviour.jpeg";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3002/adminlogin", { username: username, Password: password });
      if (response.data) {
        const admin = response.data;
        localStorage.setItem("user", JSON.stringify({ ...admin, password: password ,username:username}));
        localStorage.setItem("adminName", admin.username);
        localStorage.setItem("adminPassword", admin.password);


        navigate("/admin", { state: admin });
        navigate("/admin-nav", { state: admin });
      }
    } catch (err) {
      setError("Error logging in. Please try again.");
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${tripSaviourImage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="login-card">
        <h3 className="text-center">Welcome to Trip Saviour</h3>
        <h5 className="text-center">Admin Login</h5>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">username</label>
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

export default AdminLogin;
