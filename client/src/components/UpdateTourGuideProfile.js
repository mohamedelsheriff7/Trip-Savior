import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from 'react-icons/fa';

const UpdateTourGuideProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [editableFields, setEditableFields] = useState({
        age: false,
        mobileNumber: false,
        years_of_experience: false,
        previous_work: false,
        work_status: false,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user) {
                const { username, email } = user;
                try {
                    const response = await fetch(`http://localhost:3002/tour_guide?username=${username}&email=${email}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch profile data');
                    }
                    const data = await response.json();
                    setProfileData(data[0]);
                    setFormData(data[0]);
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
            const user = JSON.parse(localStorage.getItem("user"));
            const { username, email, password } = user;

            const response = await fetch(`http://localhost:3002/tour_guide`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    age: formData.age,
                    mobileNumber: formData.mobileNumber,
                    years_of_experience: formData.years_of_experience,
                    previous_work: formData.previous_work,
                    work_status: formData.work_status,
                }),
            });

            if (!response.ok) {
                const errorResponse = await response.json(); 
                throw new Error(errorResponse.message || 'Failed to update profile data.');
            }

            alert("Profile updated successfully!");
            navigate("/profile");
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
            overflowY: 'auto', // Enables vertical scroll if content overflows
        }}>
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
                    overflowY: 'scroll', // Enables scrolling within the card
                    maxHeight: '70vh', // Set maximum height to enable scrolling
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
                                    width: '45%', // Label width
                                    marginRight: '15px', // Space between label and input
                                }}>{key.replace(/_/g, ' ').toUpperCase()}:</label>
                                <input
                                    type="text"
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    readOnly={!editableFields[key]}
                                    style={{
                                        flex: 1, // Allow input to fill the remaining space
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: '1px solid #ced4da',
                                        transition: 'border-color 0.2s ease',
                                        outline: editableFields[key] ? '2px solid #007bff' : 'none', // Change outline on edit
                                        marginRight: '15px', // Space between input and icon
                                        fontSize: '1rem',
                                        fontFamily: 'inherit',
                                    }}
                                />
                                <FaEdit
                                    onClick={() => toggleEdit(key)}
                                    style={{
                                        cursor: 'pointer',
                                        color: editableFields[key] ? '#dc3545' : '#007bff', // Change icon color based on editing state
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

export default UpdateTourGuideProfile;
