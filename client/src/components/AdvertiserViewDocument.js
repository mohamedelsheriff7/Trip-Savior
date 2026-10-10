import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavigationbar from "./AdminNavigationBar";

const AdvertiserDocument = () => {
  const [advertisers, setAdvertisers] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const advertiserResponse = await axios.get('http://localhost:3002/advertisers');
        const pendingAdvertisers = advertiserResponse.data.filter(
          (advertiser) => !advertiser.status || advertiser.status === 'Pending'
        );
        setAdvertisers(pendingAdvertisers);
      } catch (error) {
        console.error('Error fetching advertiser data:', error);
      }
    };
    fetchData();
  }, []);

  const viewDocument = (filePath) => {
    setCurrentDocument(filePath);
  };

  const closeDocument = () => {
    setCurrentDocument(null);
  };

  const acceptApplication = async (username) => {
    try {
      await axios.put(`http://localhost:3002/updateAdvertiserStatus`, {
        username,
        status: 'Accepted',
      });
      alert('Application accepted');
      setAdvertisers((prev) => prev.filter((advertiser) => advertiser.username !== username));
    } catch (error) {
      console.error('Error accepting application:', error);
    }
  };

  const rejectApplication = async (username) => {
    try {
      await axios.put(`http://localhost:3002/updateAdvertiserStatus`, {
        username,
        status: 'Rejected',
      });
      alert('Application rejected');
      setAdvertisers((prev) => prev.filter((advertiser) => advertiser.username !== username));
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  return (
    <div style={{
      margin: "20px auto",
      padding: "20px",
      maxWidth: "1200px",
      backgroundColor: "#ffffff",
    }}>
      <AdminNavigationbar />
      
      <table style={{
        marginTop: "50px",
        width: "112%",
        marginLeft:"-70px",
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
              Username
            </th>
            <th style={{
              border: "1px solid #ddd",
              padding: "12px",
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "bold"
            }}>
              Documents
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
          {advertisers.map((advertiser, index) => (
            <tr key={advertiser._id} style={{
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
                {advertiser.username}
              </td>
              <td style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "center",
                fontSize: "14px",
                color: "#333"
              }}>
                <span
                  onClick={() => viewDocument(advertiser.documents?.idAdvertiserProof)}
                  style={{
                    color: "#3498db",
                    cursor: "pointer",
                    textDecoration: "none",
                    marginRight: "10px",
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                  onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                >
                  ID Proof
                </span>
                <span
                  onClick={() => viewDocument(advertiser.documents?.taxationRegisteryCardAdvertiser)}
                  style={{
                    color: "#3498db",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                  onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                >
                  Taxation Card
                </span>
              </td>
              <td style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "center",
                fontSize: "14px",
                color: "#333"
              }}>
                <span
                  onClick={() => acceptApplication(advertiser.username)}
                  style={{
                    color: "#28a745",
                    cursor: "pointer",
                    textDecoration: "none",
                    marginRight: "10px",
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                  onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                >
                  Accept
                </span>
                <span
                  onClick={() => rejectApplication(advertiser.username)}
                  style={{
                    color: "#e74c3c",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                  onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                >
                  Reject
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {currentDocument && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <span
              className="admin-modal-close"
              onClick={closeDocument}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                cursor: "pointer",
                color: "#e74c3c",
              }}
            >
              &times;
            </span>
            <iframe
              src={`http://localhost:3002/${currentDocument}`}
              className="admin-iframe"
              title="Document View"
              style={{
                width: "100%",
                height: "500px",
                border: "none",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertiserDocument;
