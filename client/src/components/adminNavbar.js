import React, { useState } from 'react';
import axios from 'axios';

const AdminNavbar = () => {
  const [modalShow, setModalShow] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const buttonColor = '#5ddec2'; // The color of the button in the navbar and modal
  const hoverColor = '#51c7ad'; // The hover color of the button in the navbar

  // Handle form submission for creating a new admin
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage(''); // Reset success message before submitting
    try {
      const response = await axios.post('http://localhost:3002/createAdmin', {
        username: username,
        Password: password
      });
      console.log('Admin created:', response);
      setSuccessMessage('Admin created successfully!');
      // Clear the input fields after a successful request
      setUsername('');
      setPassword('');
    } catch (error) {
      // Display error message if request fails
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div>
      <nav 
        className="navbar navbar-expand-lg navbar-light bg-white"
        style={{
          position: 'fixed',
          top: '0',
          right: '0',
          width: 'auto',
          zIndex: '1000',
        }}
      >
        <button
          className="navbar-toggler me-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ border: 'none', background: 'transparent' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse ms-1 mb-lg-0 mb-4 mt-lg-0 mt-4" id="navbarNav">
          <ul className="navbar-nav fs-5 ms-0 d-flex align-items-center" style={{ display: 'flex', alignItems: 'center' }}>
           
            
          </ul>
        </div>
      </nav>

      {/* Modal */}
      {modalShow && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{
              maxWidth: "30%", // Reduced the width to 30%
              width: "80%",
            }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Admin</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalShow(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* Display error message if it exists */}
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn" 
                      style={{
                        backgroundColor: buttonColor,
                        color: 'white',
                        border: `2px solid ${buttonColor}`,
                        padding: '8px 16px',
                        borderRadius: '5px',
                      }}
                    >
                      Invite
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNavbar;
