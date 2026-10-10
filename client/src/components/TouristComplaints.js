import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import FileComplaintModal from "./FileComplaint";
import TouristNavbar from "./Profile/TouristNavbar";

function TouristComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showReply, setShowReply] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"))?.username;

  useEffect(() => {
    axios
      .get("http://localhost:3002/complaints")
      .then((response) => {
        const userComplaints = response.data.filter(
          (complaint) => complaint.TouristUsername === user
        );
        setComplaints(userComplaints);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching complaints:", error);
        setError("Failed to fetch complaints. Please try again later.");
        setLoading(false);
      });
  }, [user]);

  return (
    <>
      <TouristNavbar />
      <div className="container mt-5">
        <h2 className="mb-4 text-center">My Complaints</h2>

        <div className="mt-4">
          <FileComplaintModal />
        </div>

        {loading && <p className="text-center">Loading complaints...</p>}
        {error && <p className="text-danger text-center">{error}</p>}
        {!loading && complaints.length === 0 && !error && (
          <p className="text-muted text-center">No complaints found.</p>
        )}

        {!loading && complaints.length > 0 && (
          <table
            style={{
              marginTop: "20px",
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead style={{ backgroundColor: "#5ddec2", color: "white" }}>
              <tr>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Title
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint, index) => (
                <tr
                  key={complaint._id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e3f2fd")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? "#f9f9f9" : "#ffffff")
                  }
                >
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      fontSize: "14px",
                      color: "#333",
                    }}
                  >
                    {complaint.Title}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      fontSize: "14px",
                      color: "#333",
                      textAlign: "center",
                    }}
                  >
                    {complaint.Status}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      fontSize: "14px",
                      color: "#333",
                      textAlign: "center",
                    }}
                  >
                    {new Date(complaint.Date).toLocaleDateString("en-GB")}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      fontSize: "14px",
                      color: "#333",
                      textAlign: "center",
                    }}
                  >
                    <a
                      href="#"
                      style={{
                        color: "#5ddec2",
                        textDecoration: "none",
                        padding: "6px 12px",
                        marginRight: "8px",
                        cursor: "pointer",
                        transition: "color 0.3s",
                      }}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default link behavior
                        setSelectedComplaint(complaint);
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.textDecoration = "underline")
                      } // Hover effect
                      onMouseLeave={(e) =>
                        (e.target.style.textDecoration = "none")
                      } // Reset hover effect
                    >
                      View Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedComplaint && (
          <div
            className="d-flex modal fade show d-block"
            role="dialog"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1050,
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
            }}
          >
            <div
              className="modal-dialog"
              style={{ maxWidth: "500px", width: "100%" }}
            >
              <div
                className="modal-content align-self-center"
                style={{ borderRadius: "8px" }}
              >
                <div
                  className="modal-header"
                  style={{
                    borderBottom: "1px solid #ddd",
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h5
                    className="modal-title"
                    style={{ fontSize: "18px", fontWeight: "bold" }}
                  >
                    Complaint Details
                  </h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setSelectedComplaint(null)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: "0",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="#5ddec2" // Preferred color for the X button
                      className="bi bi-x-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                  </button>
                </div>
                <div className="modal-body" style={{ padding: "16px" }}>
                  <p>
                    <strong>Title:</strong> {selectedComplaint.Title}
                  </p>
                  <p>
                    <strong>Body:</strong> {selectedComplaint.Body}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedComplaint.Date).toLocaleDateString(
                      "en-GB"
                    )}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedComplaint.Status}
                  </p>
                  {selectedComplaint.Reply != "" && (
                    <p>
                      <strong>Reply:</strong> {selectedComplaint.Reply}
                    </p>
                  )}
                </div>
                <div
                  className="modal-footer"
                  style={{
                    borderTop: "1px solid #ddd",
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default TouristComplaints;

{
  /* <div className="row g-4">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{complaint.Title}</h5>
                  <p className="card-text">
                    <strong>Status:</strong> {complaint.Status}
                  </p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn-login btn-view rounded-2 py-1 px-3 mt-md-3 mt-2"
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setShowReply(false);
                      }}
                    >
                      View Details
                    </button>
                    {complaint.Reply && complaint.Reply.trim() && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setShowReply(true);
                        }}
                      >
                        View Reply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div> */
}
