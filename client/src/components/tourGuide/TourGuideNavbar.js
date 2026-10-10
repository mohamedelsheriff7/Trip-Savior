import React from "react";
import { useNavigate } from "react-router-dom";

function TourGuideNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="container-fluid navbar navbar-expand-lg navbar-light bg-white mb-5">
      <a
        className="navbar-brand ms- fs-3"
        href="/"
        style={{ color: "#9095A1" }}
      >
        <img alt="Logo" className="logo" />
      </a>
      <button
        className="navbar-toggler me-3"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className="collapse navbar-collapse ms-1 mb-lg-0 mb-4 mt-lg-0 mt-4"
        id="navbarNav"
      >
        <ul className="navbar-nav fs-5 ms-0">
          <li className="nav-item">
            <a className="nav-link navbar-link me-lg-4 ms-lg-0 ms-3" style={{color: '#9095A1'}}>Home</a>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle me-lg-4"
              style={{color: '#9095A1'}}
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Book
            </a>
            <ul
              className="dropdown-menu"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <li>
                <a style={{cursor: "pointer"}} className="dropdown-item"  onClick={() => navigate("/tourist-itinerary")}>
                  Itinerary
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Activity
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Flight
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Hotel
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Transportation
                </a>
              </li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle me-lg-4"
              style={{color: '#9095A1'}}
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Products
            </a>
            <ul
              className="dropdown-menu"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <li>
                <a className="dropdown-item" onClick={() => navigate("/tourist-itinerary")}>
                  Products
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Purchases
                </a>
              </li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle me-lg-4"
              style={{color: '#9095A1'}}
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              My Bookings
            </a>
            <ul
              className="dropdown-menu"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <li>
                <a className="dropdown-item" >
                  Itineraries
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Activities
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Flights
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Hotels
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Transportation
                </a>
              </li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              style={{color: '#9095A1'}}
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Complaints
            </a>
            <ul
              className="dropdown-menu"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <li>
                <a className="dropdown-item" >
                  File a Complaint
                </a>
              </li>
              <li>
                <a className="dropdown-item" >
                  My Complaints
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <div className="d-flex ms-auto">
          <li className="nav-item wishlist">
            <a
              className="nav-link navbar-link me-lg-2 ms-lg-0 ms-3"
              onClick={() => navigate("/wishlist")}
              style={{ cursor: "pointer" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-bag-heart"
                viewBox="0 0 16 16"
                style={{ color: "#5ddec2" }}
              >
                <path
                  fill-rule="evenodd"
                  d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0M14 14V5H2v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1M8 7.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"
                />
              </svg>
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link navbar-link me-lg-4 ms-lg-0 ms-3"
              onClick={() => navigate("/cart")}
              style={{ cursor: "pointer" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-cart3"
                viewBox="0 0 16 16"
                style={{ color: "#5ddec2" }}
              >
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
              </svg>
            </a>
          </li>
          <li className="nav-item dropdown">
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="rounded-circle dropdown-toggle me-lg-3"
              style={{ cursor: "pointer" }}
              id="profileDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
            <ul
              className="dropdown-menu dropdown-menu-end me-2"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <li>
                <a className="dropdown-item" href="#" onClick={() => navigate("/tourist-profile2")}>
                  View Profile
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#" onClick={() => navigate("/wishlist")}>
                  Change Password
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#" style={{ color: "red" }} >
                  Delete account
                </a>
              </li>
            </ul>
          </li>
        </div>
      </div>
    </nav>
  );
}
export default TourGuideNavbar;
