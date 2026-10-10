import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from 'react-icons/fa';
import backButtonImage from '../images/backbutton.png'; // Adjust path if necessary

const UpdateSellerProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [editableFields, setEditableFields] = useState({
        name: false,
        email: false,
        description: false,
        // Add any additional fields as necessary
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user) {
                const { username, email } = user;
                try {
                    const response = await fetch(`http://localhost:3002/sellers/login?username=${username}&email=${email}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch profile data');
                    }
                    const data = await response.json();
                    setProfileData(data);
                    setFormData(data); // Initialize form data with the fetched profile data
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3002/sellers`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                }),
            });

            // Check if the response is okay
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to update profile data.');
            }

            const updatedSeller = await response.json();
            alert("Profile updated successfully!");
            console.log("Updated Seller:", updatedSeller);
            navigate("/seller-profile"); // Redirect to seller profile page after successful update
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const toggleEdit = (field) => {
        setEditableFields((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            minHeight: '100vh',
            backgroundColor: '#e9ecef',
            fontFamily: 'Arial, sans-serif',
            overflowY: 'auto',
        }}>
            {/* Back Button */}
            <button
                onClick={() => navigate("/seller-profile")}
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
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    padding: '30px',
                    width: '100%',
                    maxWidth: '600px',
                    textAlign: 'left',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    overflowY: 'scroll',
                    maxHeight: '70vh',
                }}>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: '600',
                        color: '#343a40',
                        marginBottom: '20px',
                        textAlign: 'center',
                    }}>Update Profile</h2>
                    <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column' }}>
                        {Object.keys(profileData).map((key) => (
                            <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                <label style={{
                                    fontSize: '1.1rem',
                                    color: '#495057',
                                    width: '45%',
                                    marginRight: '15px',
                                }}>{key.replace(/_/g, ' ').toUpperCase()}:</label>
                                <input
                                    type="text"
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    readOnly={!editableFields[key]}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: '1px solid #ced4da',
                                        transition: 'border-color 0.2s ease',
                                        outline: editableFields[key] ? '2px solid #007bff' : 'none',
                                        marginRight: '15px',
                                        fontSize: '1rem',
                                        fontFamily: 'inherit',
                                    }}
                                />
                                <FaEdit
                                    onClick={() => toggleEdit(key)}
                                    style={{
                                        cursor: 'pointer',
                                        color: editableFields[key] ? '#dc3545' : '#007bff',
                                        fontSize: '1.5rem',
                                        transition: 'color 0.2s ease',
                                    }}
                                />
                            </div>
                        ))}
                        <button type="submit" style={{
                            padding: '12px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s, transform 0.3s',
                            fontSize: '1.1rem',
                            marginTop: '10px',
                        }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}>
                            Update Profile
                        </button>
                    </form>
                </div>
            ) : (
                <p style={{ fontSize: '1.2rem', color: '#dc3545', textAlign: 'center' }}>No profile data found.</p>
            )}
        </div>
    );
};

export default UpdateSellerProfile;
