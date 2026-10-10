import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminViewDocuments = () => {
  const [tourGuides, setTourGuides] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [advertisers, setAdvertisers] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);

  useEffect(() => {
    // Fetch the list of tour guides, sellers, and advertisers from the server
    const fetchData = async () => {
      try {
        const tourGuideResponse = await axios.get('http://localhost:3002/tour_guide');
        const sellerResponse = await axios.get('http://localhost:3002/sellers');
        const advertiserResponse = await axios.get('http://localhost:3002/advertisers');

        // Filter only those with pending status
        const pendingTourGuides = tourGuideResponse.data.filter(
          (guide) => !guide.status || guide.status === 'Pending'
        );
        const pendingSellers = sellerResponse.data.filter(
          (seller) => !seller.status || seller.status === 'Pending'
        );
        const pendingAdvertisers = advertiserResponse.data.filter(
          (advertiser) => !advertiser.status || advertiser.status === 'Pending'
        );

        setTourGuides(pendingTourGuides);
        setSellers(pendingSellers);
        setAdvertisers(pendingAdvertisers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Function to view a document
  const viewDocument = (filePath) => {
    setCurrentDocument(filePath);
  };

  // Function to close document view
  const closeDocument = () => {
    setCurrentDocument(null);
  };

  // Function to accept an application
  const acceptApplication = async (username, type) => {
    try {
      const endpoint = type === 'Tour Guide'
        ? 'updateTourGuideStatus'
        : type === 'Seller'
        ? 'updateSellerStatus'
        : 'updateAdvertiserStatus';

      await axios.put(`http://localhost:3002/${endpoint}`, {
        username,
        status: 'Accepted',
      });

      alert('Application accepted');
      if (type === 'Tour Guide') {
        setTourGuides((prev) => prev.filter((guide) => guide.username !== username));
      } else if (type === 'Seller') {
        setSellers((prev) => prev.filter((seller) => seller.username !== username));
      } else if (type === 'Advertiser') {
        setAdvertisers((prev) => prev.filter((advertiser) => advertiser.username !== username));
      }
    } catch (error) {
      console.error('Error accepting application:', error);
    }
  };

  // Function to reject an application
  const rejectApplication = async (username, type) => {
    try {
      const endpoint = type === 'Tour Guide'
        ? 'updateTourGuideStatus'
        : type === 'Seller'
        ? 'updateSellerStatus'
        : 'updateAdvertiserStatus';

      await axios.put(`http://localhost:3002/${endpoint}`, {
        username,
        status: 'Rejected',
      });

      alert('Application rejected');
      if (type === 'Tour Guide') {
        setTourGuides((prev) => prev.filter((guide) => guide.username !== username));
      } else if (type === 'Seller') {
        setSellers((prev) => prev.filter((seller) => seller.username !== username));
      } else if (type === 'Advertiser') {
        setAdvertisers((prev) => prev.filter((advertiser) => advertiser.username !== username));
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  // Inline styles for modal
  const modalStyle = {
    position: 'fixed',
    zIndex: 1000,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  };

  const modalContentStyle = {
    backgroundColor: '#fff',
    margin: '10% auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '70%',
    maxHeight: '80%',
    overflowY: 'auto',
  };

  const closeButtonStyle = {
    color: '#aaa',
    float: 'right',
    fontSize: '28px',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  // Function to render application table for each type
  const renderTable = (data, type) => (
    <div>
      <h2>{type} Applications</h2>
      <table className="table table-bordered table-hover mt-3">
        <thead>
          <tr>
            <th>Username</th>
            <th>Documents</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.username}</td>
              <td>
                {type === 'Tour Guide' && (
                  <>
                    <button
                      className="btn btn-info btn-sm mx-1"
                      onClick={() => viewDocument(item.documents?.idProof)}
                      disabled={!item.documents || !item.documents.idProof}
                    >
                      View ID Proof
                    </button>
                    <button
                      className="btn btn-info btn-sm mx-1"
                      onClick={() => viewDocument(item.documents?.certificates)}
                      disabled={!item.documents || !item.documents.certificates}
                    >
                      View Certificate
                    </button>
                  </>
                )}
                {type === 'Seller' && (
                  <>
                    <button
                      className="btn btn-info btn-sm mx-1"
                      onClick={() => viewDocument(item.documents?.idSellerProof)}
                      disabled={!item.documents || !item.documents.idSellerProof}
                    >
                      View ID Seller Proof
                    </button>
                    <button
                      className="btn btn-info btn-sm mx-1"
                      onClick={() => viewDocument(item.documents?.taxationRegisteryCard)}
                      disabled={!item.documents || !item.documents.taxationRegisteryCard}
                    >
                      View Taxation Registry Card
                    </button>
                  </>
                )}
                {type === 'Advertiser' && (
                  <>
                    <button
                      className="btn btn-info btn-sm mx-1"
                      onClick={() => viewDocument(item.documents?.idAdvertiserProof)}
                      disabled={!item.documents || !item.documents.idAdvertiserProof}
                    >
                      View ID Advertiser Proof
                    </button>
                    <button
                      className="btn btn-info btn-sm mx-1"
                      onClick={() => viewDocument(item.documents?.taxationRegisteryCardAdvertiser)}
                      disabled={!item.documents || !item.documents.taxationRegisteryCardAdvertiser}
                    >
                      View Taxation Registry Card Advertiser
                    </button>
                  </>
                )}
              </td>
              <td>
                <button
                  className="btn btn-success btn-sm mx-1"
                  onClick={() => acceptApplication(item.username, type)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-danger btn-sm mx-1"
                  onClick={() => rejectApplication(item.username, type)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mt-5">
      {renderTable(tourGuides, 'Tour Guide')}
      {renderTable(sellers, 'Seller')}
      {renderTable(advertisers, 'Advertiser')}

      {/* Modal for viewing documents */}
      {currentDocument && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <span
              style={closeButtonStyle}
              onClick={closeDocument}
            >
              &times;
            </span>
            <iframe
              src={`http://localhost:3002/${currentDocument}`}
              style={{ width: '100%', height: '500px', border: 'none' }}
              title="Document View"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminViewDocuments;