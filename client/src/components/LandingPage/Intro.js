// src/components/LandingPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../images/airplane.jpg"; // Ensure this path is correct
import "./LandingPage.css";
import 'animate.css';

import CustomNavbar from "../CustomNavbar";
import Registration from '../Registration'; // Import the Registration component
import LoginModal from './loginModal';
import ForgotPassword from "./forgotPassword";

const Intro = () => {
  const navigate = useNavigate();

  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSignup = () => {
    setShowSignup(true);
    setShowForgotPassword(false);
  };

  const handleLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
    setShowForgotPassword(false);
  };

  const closeLogin = () => {setShowLogin(false);}

  const openForgotPassword = () => {
    setShowForgotPassword(true);
    setShowLogin(false);
  };

  const closeForgotPassword = () => {setShowForgotPassword(false);}


  const handleActivities = () => {
    navigate("/view-upcoming-activities");
  };

  const handleItineraries = () => {
    navigate("/view-upcoming-itenraries");
  };

  const handleHistoricalPlaces = () => {
    navigate("/view-historicalPlaces");
  };
  const closeSignup = () => {setShowSignup(false);}

  return (
    <div>
      {/* Pass handleSignup and handleLogin to CustomNavbar */}
      <CustomNavbar handleSignup={handleSignup} handleLogin={handleLogin} />
      <div
        id="intro-section"
        className="container-fluid img-bg-plane d-flex justify-content-center align-items-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {!showSignup && !showLogin && !showForgotPassword &&(
          <div className="row mt-3 filter-div text-center py-5 animate__animated animate__fadeInUpBig">
           
            <h1 className="text-white fw-bold fs-1 mb-1 " style={{marginLeft:"40px"}}>
          Plan Your Trip With Trip Saviour
        </h1>
        <p className="text-gray fs-6 mb-2" style={{marginLeft:"40px"}}>
          Discover new destinations and adventures, all in one place.
        </p>
        <p className="text-gray fs-6 mb-2"style={{marginLeft:"40px"}}>
          Seamless planning, booking, and unforgettable experiences await.
        </p>
            
          </div>
        )}
        {/* Login Modal */}
        {showLogin && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="close" onClick={closeLogin}>
                <div className="line one"></div>
                <div className="line two"></div>
              </div>
              <LoginModal
                closeLogin={closeLogin}
                setShowForgotPassword={openForgotPassword}
              />
            </div>
          </div>
        )}

{showForgotPassword && (
         <div className="model-overlay">
         <div className="model content">
              <div className="close" onClick={closeForgotPassword}>
                <div className="line one"></div>
                <div className="line two"></div>
              </div>
              <ForgotPassword />
            </div>
          </div>
        )}

        {showSignup && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div class="close" onClick={closeSignup}>
                <div class="line one"></div>
                <div class="line two"></div>
              </div>
              <Registration closeSignup={closeSignup} />{" "}
              {/* Embed Registration form */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const styles = {
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    height: "100vh",
    overflow: "hidden",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    //zIndex: -1, // Places video behind the content
  },
  navbar: {
    position: "absolute",
    top: "20px",
    left: "20px",
    zIndex: 1, // Ensures navbar is above the video
    display: "flex",
    gap: "15px",
  },
  buttonContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
    marginRight: "540px",
    position: "relative",
    zIndex: 1, // Ensures buttons are above the video
  },
  button: {
    padding: "15px 30px",
    fontSize: "1em",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#808080",
    color: "#fff",
    transition: "background-color 0.3s, transform 0.3s",
  },
  buttonHover: {
    transform: "scale(1.1)",
    backgroundColor: "#6c757d",
  },
};

const AnimatedButton = ({ onClick, children }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        ...styles.button,
        ...(isHovered ? styles.buttonHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

export default Intro;
