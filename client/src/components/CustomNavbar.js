import React from "react";
import logo from "../images/logos.jpg";
  import { useNavigate } from 'react-router-dom';


function CustomNavbar({ handleSignup, handleLogin }) {
        const navigate = useNavigate();

return (
    <nav className="container-fluid shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <a className="navbar-brand fs-3" href="/" style={{ color: '#9095A1', height: '100%' }}>
  <img 
    alt="Logo" 
    src={logo}
    style={{
        clipPath: 'inset(10% 10% 10% 10%)',
        padding: '0',
        margin: '0',
      width: '60px', // Maintain aspect ratio
      objectFit: 'contain', // Ensure it fills the navbar height
      overflow: 'hidden',
    }} 
  />
</a>
            <button className="navbar-toggler me-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse ms-1 mb-lg-0 mb-4 mt-lg-0 mt-4" id="navbarNav">
                    <ul className="navbar-nav ms-0" style={{fontSize: '18px'}}>
                            <li className="nav-item">
                                    <a className="nav-link navbar-link me-lg-4 ms-lg-0 ms-3" onClick={() => navigate("/")} >Home</a>
                            </li>
                            <li className="nav-item">
                            <a className="nav-link navbar-link me-lg-4 ms-lg-0 ms-3" onClick={() => navigate("/guest-itinerary")} >Itineraries</a>
                            </li>
                            <li className="nav-item">
                                    <a className="nav-link navbar-link me-lg-4 ms-lg-0 ms-3"  onClick={() => navigate("/view-upcoming-activities")} >Activities</a>
                            </li>
                            <li className="nav-item">
                                    <a className="nav-link navbar-link me-lg-3 ms-lg-0 ms-3"  onClick={() => navigate("/viewhistorical-guest")} >Historical Places</a>
                            </li>
                            <li className="nav-item">
                                    <a className="nav-link navbar-link me-lg-3 ms-lg-0 ms-3"  onClick={() => navigate("/step-by-step")} >Help</a>
                            </li>
                    </ul>
                    <div className="d-flex ms-auto">
                            <button className="btn-navbar btn-more rounded-2 me-3 px-4 py-2 mt-2 mt-lg-0" onClick={handleLogin}>Login</button>
                            <button className="btn-navbar btn-login rounded-2 me-3 px-4 py-2 mt-2 mt-lg-0" onClick={handleSignup}>Sign Up</button>
                    </div>
            </div>
    </nav>
);
}
export default CustomNavbar;