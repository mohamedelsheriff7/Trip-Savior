import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminNavigationbar from './AdminNavigationBar';
function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [reply, setReply] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc
  const [filterStatus, setFilterStatus] = useState("All"); // All, Pending, Resolved

  useEffect(() => {
    axios.get('http://localhost:3002/complaints').then(response => {
      setComplaints(response.data);
      setFilteredComplaints(response.data);
    });
  }, []);

  useEffect(() => {
    let updatedComplaints = [...complaints];
    
    // Sort by Date
    updatedComplaints.sort((a, b) => {
      const dateA = new Date(a.Date);
      const dateB = new Date(b.Date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    // Filter by Status
    if (filterStatus !== "All") {
      updatedComplaints = updatedComplaints.filter(complaint => complaint.Status === filterStatus);
    }

    setFilteredComplaints(updatedComplaints);
  }, [sortOrder, filterStatus, complaints]);

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Resolved" : "Pending";
    await axios.put(`http://localhost:3002/complaints/${id}/status`, { status: newStatus });
    setComplaints(complaints.map(c => c._id === id ? { ...c, Status: newStatus } : c));
  };

  const handleReply = async (id) => {
    await axios.post(`http://localhost:3002/complaints/${id}/reply`, { message: reply });
    setReply(""); 
    alert("Reply sent!");
  };

  return (
    <div>
      <AdminNavigationbar />
    <div className="container mt-5">
         
        <h2 className="mb-4" style={{margin: '90px auto',}}>Complaints</h2>

      {/* Sort and Filter Controls */}
      <div className="d-flex mb-3">
        <div className="me-3">
          <label>Sort by Date:</label>
          <select 
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Oldest First</option>
            <option value="desc">Newest First</option>
          </select>
        </div>
        <div>
          <label>Filter by Status:</label>
          <select 
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <table style={{
  marginTop: "20px",
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
}}>
  <thead style={{ backgroundColor: "#5ddec2", color: "white" }}>
    <tr>
      <th style={{
        border: "1px solid #ddd",
        padding: "12px",
        textAlign: "center",
        fontSize: "16px",
        fontWeight: "bold"
      }}>
        Tourist Username
      </th>
      <th style={{
        border: "1px solid #ddd",
        padding: "12px",
        textAlign: "center",
        fontSize: "16px",
        fontWeight: "bold"
      }}>
        Title
      </th>
      <th style={{
        border: "1px solid #ddd",
        padding: "12px",
        textAlign: "center",
        fontSize: "16px",
        fontWeight: "bold"
      }}>
        Status
      </th>
      <th style={{
        border: "1px solid #ddd",
        padding: "12px",
        textAlign: "center",
        fontSize: "16px",
        fontWeight: "bold"
      }}>
        Date
      </th>
      <th style={{
        border: "1px solid #ddd",
        padding: "12px",
        textAlign: "center",
        fontSize: "16px",
        fontWeight: "bold"
      }}>
        Actions
      </th>
    </tr>
  </thead>
  <tbody>
    {filteredComplaints.map((complaint, index) => (
      <tr key={complaint._id} style={{
        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
        transition: "background-color 0.3s"
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e3f2fd"}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#ffffff"}>
        <td style={{
          border: "1px solid #ddd",
          padding: "12px",
          fontSize: "14px",
          color: "#333"
        }}>
          {complaint.TouristUsername || "N/A"}
        </td>
        <td style={{
          border: "1px solid #ddd",
          padding: "12px",
          fontSize: "14px",
          color: "#333"
        }}>
          {complaint.Title}
        </td>
        <td style={{
          border: "1px solid #ddd",
          padding: "12px",
          fontSize: "14px",
          color: "#333",
          textAlign: "center"
        }}>
          {complaint.Status}
        </td>
        <td style={{
          border: "1px solid #ddd",
          padding: "12px",
          fontSize: "14px",
          color: "#333",
          textAlign: "center"
        }}>
          {new Date(complaint.Date).toLocaleDateString('en-GB')}
        </td>
        <td style={{
          border: "1px solid #ddd",
          padding: "12px",
          fontSize: "14px",
          color: "#333",
          textAlign: "center"
        }}>
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
  onMouseEnter={(e) => e.target.style.color = "#3498db"} // Hover effect
  onMouseLeave={(e) => e.target.style.color = "#5ddec2"} // Reset hover effect
>
  View Details
</a>
<a
  href="#"
  style={{
    color: complaint.Status === "Pending" ? "#e74c3c" : "#28a745",
    textDecoration: "none",
    padding: "6px 12px",
    cursor: "pointer",
    transition: "color 0.3s",
  }}
  onClick={(e) => {
    e.preventDefault(); // Prevent default link behavior
    handleStatusToggle(complaint._id, complaint.Status);
  }}
  onMouseEnter={(e) => e.target.style.textDecoration = "underline"} // Hover underline
  onMouseLeave={(e) => e.target.style.textDecoration = "none"} // Reset underline
>
  {complaint.Status === "Pending" ? "Resolve" : "Set Pending"}
</a>

        </td>
      </tr>
    ))}
  </tbody>
</table>


      {/* Complaint Details Modal */}
{/* Complaint Details Modal */}
{selectedComplaint && (
  <div
    className="modal fade show d-block"
    role="dialog"
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1050,
      marginTop:'70px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    }}
  >
    <div className="modal-dialog" style={{ maxWidth: '500px', width: '100%' }}>
      <div className="modal-content" style={{ borderRadius: '8px' }}>
        <div
          className="modal-header"
          style={{
            borderBottom: '1px solid #ddd',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h5 className="modal-title" style={{ fontSize: '18px', fontWeight: 'bold' }}>
            Complaint Details
          </h5>
          <button
            type="button"
            className="close"
            onClick={() => setSelectedComplaint(null)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
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
        <div className="modal-body" style={{ padding: '16px' }}>
          <p><strong>Title:</strong> {selectedComplaint.Title}</p>
          <p><strong>Body:</strong> {selectedComplaint.Body}</p>
          <p><strong>Date:</strong> {new Date(selectedComplaint.Date).toLocaleDateString('en-GB')}</p>
          <h5 style={{ marginTop: '20px', marginBottom: '10px', fontWeight: 'bold' }}>Reply to Complaint</h5>
          <textarea
            className="form-control"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply here"
            style={{
              borderColor: '#5ddec2',
              borderRadius: '4px',
              padding: '10px',
              width: '100%',
              fontSize: '14px',
              minHeight: '100px',
            }}
          />
        </div>
        <div
          className="modal-footer"
          style={{
            borderTop: '1px solid #ddd',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            className="send-button"
            style={{
              backgroundColor: '#5ddec2',
              border: 'none',
              color: 'white',
              fontSize: '14px',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => handleReply(selectedComplaint._id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="white"
              style={{ marginRight: '8px' }}
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path
                d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
              ></path>
            </svg>
            Reply
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
    </div>
  );
}

export default AdminComplaints;
