import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backButtonImage from '../images/backbutton.png'; // Adjust path if necessary
import Level1Badge from '../images/Level1.jpeg';
import Level2Badge from '../images/Level2.jpeg';
import Level3Badge from '../images/Level3.jpeg';


const ReadTouristProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user) {
                const { username } = user; // Get username from local storage
                try {
                    const response = await fetch(`http://localhost:3002/tourist/profile/${username}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch profile data');
                    }

                    const data = await response.json();
                    setProfileData(data);
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

    // Determine the badge image based on the level
    const getBadgeImage = () => {
        switch (profileData?.level) {
            case 1:
                return Level1Badge;
            case 2:
                return Level2Badge;
            case 3:
                return Level3Badge;
            default:
                return null;
        }
    };

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
            {/* Back Button */}
            <button 
                onClick={() => navigate("/tourist-profile")}
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
                    src={backButtonImage} 
                    alt="Back to profile" 
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
                    position: 'relative',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    padding: '20px',
                    width: '100%',
                    maxWidth: '400px',
                    textAlign: 'left',
                }}>
                    {/* Badge Image inside the box, positioned in the top-right corner */}
                    {getBadgeImage() && (
                        <img 
                            src={getBadgeImage()} 
                            alt={`Level ${profileData.level} Badge`} 
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                border: '2px solid #ddd',
                            }} 
                        />
                    )}
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
                        <strong>Mobile Number:</strong> {profileData.mobileNumber}
                    </p>
                    <p style={{ fontSize: '1rem', color: '#555', margin: '5px 0' }}>
                        <strong>Nationality:</strong> {profileData.nationality}
                    </p>
                    <p style={{ fontSize: '1rem', color: '#555', margin: '5px 0' }}>
                        <strong>Date of Birth:</strong> {new Date(profileData.date_of_birth).toLocaleDateString('en-GB')}
                    </p>
                    <p style={{ fontSize: '1rem', color: '#555', margin: '5px 0' }}>
                        <strong>Work Status:</strong> {profileData.work_status}
                    </p>
                    <p style={{ fontSize: '1rem', color: '#555', margin: '5px 0' }}>
                        <strong>Wallet:</strong> {profileData.wallet}
                    </p>
                    <p style={{ fontSize: '1rem', color: '#555', margin: '5px 0' }}>
                        <strong>Level:</strong> {profileData.level}
                    </p>
                    <p style={{ fontSize: '1rem', color: '#555', margin: '5px 0' }}>
                        <strong>Loyalty Points:</strong> {profileData.loyaltyPoints}
                    </p>
                </div>
            ) : (
                <p style={{ fontSize: '1.2rem', color: '#dc3545' }}>No profile data found.</p>
            )}
        </div>
    );
};

export default ReadTouristProfile;
