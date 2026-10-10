import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DocumentViewer = ({ username }) => {
    const [documents, setDocuments] = useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get(`http://localhost:3002/getUserDocuments?username=${username}`);
                setDocuments(response.data.documents);
            } catch (error) {
                console.error("Error fetching documents:", error);
            }
        };
        fetchDocuments();
    }, [username]);

    if (!documents) return <p>Loading documents...</p>;

    return (
        <div>
            <h2>{username}'s Documents</h2>
            {documents.idProof && (
                <a href={`http://localhost:3002/${documents.idProof}`} target="_blank" rel="noopener noreferrer">
                    View ID Proof
                </a>
            )}
            {documents.certificates && (
                <a href={`http://localhost:3002/${documents.certificates}`} target="_blank" rel="noopener noreferrer">
                    View Certificates
                </a>
            )}
            {documents.idSellerProof && (
                <a href={`http://localhost:3002/${documents.idSellerProof}`} target="_blank" rel="noopener noreferrer">
                    View Seller ID Proof
                </a>
            )}
            {documents.taxationRegisteryCard && (
                <a href={`http://localhost:3002/${documents.taxationRegisteryCard}`} target="_blank" rel="noopener noreferrer">
                    View Taxation Registry Card
                </a>
            )}
            {/* Add similar links for advertiser documents if applicable */}
        </div>
    );
};

export default DocumentViewer;
