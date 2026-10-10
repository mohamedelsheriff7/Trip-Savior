import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backButtonImage from '../images/backbutton.png'; // Adjust path if necessary

const ReadAdvertiserProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user) {
                const { username, email } = user;
                try {
                    const response = await fetch(`http://localhost:3002/advertisers?username=${username}&email=${email}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch profile data');
                    }
                    const data = await response.json();
                    setProfileData(data[0]);
                } catch (err) {
                    console.error(err);
                    setProfileData(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div 
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                minHeight: '100vh',
                backgroundColor: '#f0f4f8',
                fontFamily: 'Arial, sans-serif',
            }}
        >
            {/* Back Button with Airplane Image */}
            <button 
                onClick={() => navigate("/advertiser-profile")}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    padding: 0,
                }}
            >
                <img 
                    src={backButtonImage} // Using the imported image
                    alt="Back to profile" // Provide meaningful text for accessibility
                    style={{
                        width: '85px',
                        height: '85px',
                    }}
                />
            </button>

            {loading ? (
                <p style={{ fontSize: '1.2rem', color: '#007bff' }}>Loading profile data...</p>
            ) : profileData ? (
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    padding: '20px',
                    width: '100%',
                    maxWidth: '400px',
                    textAlign: 'left',
                }}>
                    <h2 style={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: '15px',
                    }}>Profile Details:</h2>
                    <p style={{ fontSize: '1rem', color: '#555', margin: '5px 0' }}>
                        <strong>Username:</strong> {profileData.username}
                    </p>
                    <p style={{ fontSize: '1rem', color: '#555', margin: '5px 0' }}>
                        <strong>Email:</strong> {profileData.email}
                    </p>
                    <p style={{ fontSize: '1rem', color: '#555', margin: '5px 0' }}>
                        <strong>Company Name:</strong> {profileData.companyName}
                    </p>
                    <p style={{ fontSize: '1rem', color: '#555', margin: '5px 0' }}>
                        <strong>Hotline:</strong> {profileData.hotline} {/* Displaying hotline */}
                    </p>
                    <p style={{ fontSize: '1rem', color: '#555', margin: '5px 0' }}>
                        <strong>Website:</strong> <a href={profileData.website} target="_blank" rel="noopener noreferrer">{profileData.website}</a>
                    </p>
                    <p style={{ fontSize: '1rem', color: '#555', margin: '5px 0' }}>
                        <strong>Company Profile:</strong> {profileData.companyProfile}
                    </p>
                </div>
            ) : (
                <p style={{ fontSize: '1.2rem', color: '#dc3545' }}>No profile data found.</p>
            )}
        </div>
    );
};

export default ReadAdvertiserProfile;
