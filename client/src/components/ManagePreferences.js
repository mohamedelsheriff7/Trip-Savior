import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';

const ManagePreferences = () => {
    const [preferences, setPreferences] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPreferences, setFilteredPreferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editIndex, setEditIndex] = useState(-1);
    const [updatedData, setUpdatedData] = useState('');
    const [message, setMessage] = useState('');

    // List of available preference options
    const preferenceOptions = [
        "historic areas",
        "beaches",
        "family-friendly",
        "shopping",
        "budget-friendly"
    ];

    // Fetch preferences from the server
    const fetchPreferences = async () => {
        try {
            const response = await axios.get('http://localhost:3002/preferences');
            setPreferences(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching preferences:', error);
            setLoading(false);
            setMessage('Error fetching preferences.');
        }
    };

    // Delete a preference by Name
    const deletePreference = async (name) => {
        try {
            await axios.delete('http://localhost:3002/preferences', {
                data: { Name: name } // Pass preference name in the request body
            });
            fetchPreferences(); // Refresh preferences after deletion
            setMessage('Preference deleted successfully!'); // Set success message
        } catch (error) {
            console.error('Error deleting preference:', error);
            setMessage('Error deleting preference.');
        }
    };

    // Handle editing a preference
    const handleEditClick = (index) => {
        setEditIndex(index);
        setUpdatedData(filteredPreferences[index].Name); // Pre-fill with current preference data
    };

    const handleUpdatePreference = async (name) => {
        try {
            await axios.put('http://localhost:3002/preferences', { Name: name, newName: updatedData }); // Pass both names in the request body
            setFilteredPreferences(prev => prev.map((preference, index) => (index === editIndex ? { ...preference, Name: updatedData } : preference)));
            setMessage('Preference updated successfully!'); // Set success message
            setEditIndex(-1);
        } catch (error) {
            console.error('Error updating preference:', error);
            setMessage('Error updating preference.');
        }
    };

    // Update filtered preferences based on search term
    useEffect(() => {
        const results = preferences.filter(pref =>
            pref.Name && pref.Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPreferences(results);
    }, [searchTerm, preferences]);

    useEffect(() => {
        fetchPreferences(); // Fetch preferences on component mount
    }, []);

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Manage Preferences</h2>
            <input
                type="text"
                placeholder="Search preferences by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
            />
            {searchTerm && !loading && (
                <>
                    {filteredPreferences.length > 0 ? (
                        <ul style={styles.preferenceList}>
                            {filteredPreferences.map((preference, index) => (
                                <li key={preference._id} style={styles.preferenceItem}>
                                    {editIndex === index ? (
                                        <div style={styles.editContainer}>
                                            <select
                                                value={updatedData}
                                                onChange={(e) => setUpdatedData(e.target.value)}
                                                style={styles.editSelect}
                                            >
                                                <option value="">Select a preference</option>
                                                {preferenceOptions.map((option, i) => (
                                                    <option key={i} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            <button onClick={() => handleUpdatePreference(preference.Name)} style={styles.updateButton}>Update</button>
                                            <button onClick={() => setEditIndex(-1)} style={styles.cancelButton}>Cancel</button>
                                        </div>
                                    ) : (
                                        <>
                                            <span style={styles.preferenceText}>{preference.Name}</span>
                                            <div style={styles.actions}>
                                                <FaEdit
                                                    style={styles.icon}
                                                    onClick={() => handleEditClick(index)}
                                                />
                                                <FaTrash
                                                    style={styles.icon}
                                                    onClick={() => deletePreference(preference.Name)} // Use Name for deletion
                                                />
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={styles.noPreferences}>No preferences found</p>
                    )}
                </>
            )}
            {loading && <p style={styles.loading}>Loading preferences...</p>}
            {message && <p style={styles.message}>{message}</p>} {/* Display message */}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '20px auto',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        backgroundColor: '#ffffff', // Change to white for a cleaner look
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#2c3e50', // Darker shade for better visibility
        fontSize: '24px',
        fontWeight: 'bold',
    },
    searchInput: {
        width: '100%',
        padding: '12px',
        marginBottom: '20px',
        border: '1px solid #2980b9', // Blue border for better visibility
        borderRadius: '4px',
        fontSize: '16px',
        outline: 'none',
        transition: 'border 0.3s',
    },
    searchInputFocus: {
        borderColor: '#3498db',
    },
    preferenceList: {
        listStyle: 'none',
        padding: '0',
    },
    preferenceItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #bdc3c7',
        transition: 'background 0.3s',
        backgroundColor: '#ecf0f1', // Light gray for item background
    },
    preferenceText: {
        color: '#2c3e50',
        fontWeight: '500',
    },
    actions: {
        display: 'flex',
        gap: '10px',
    },
    icon: {
        cursor: 'pointer',
        color: '#007bff',
        fontSize: '20px',
        transition: 'color 0.3s',
    },
    iconHover: {
        color: '#0056b3',
    },
    editContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    editSelect: {
        flex: 1,
        padding: '8px',
        border: '1px solid #2980b9',
        borderRadius: '4px',
    },
    updateButton: {
        padding: '8px 12px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background 0.3s',
    },
    updateButtonHover: {
        backgroundColor: '#218838',
    },
    cancelButton: {
        padding: '8px 12px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background 0.3s',
    },
    cancelButtonHover: {
        backgroundColor: '#c82333',
    },
    loading: {
        textAlign: 'center',
        color: '#7f8c8d',
    },
    noPreferences: {
        textAlign: 'center',
        color: '#e74c3c',
    },
    message: {
        marginTop: '20px',
        color: '#28a745', // Change to #dc3545 for error messages
        textAlign: 'center',
    },
};

export default ManagePreferences;
