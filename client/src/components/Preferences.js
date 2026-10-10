import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaSearch } from 'react-icons/fa';
import { FaCheck, FaTimes } from 'react-icons/fa';
import AdminNavigationbar from './AdminNavigationBar'; // Import the navigation bar component

const Preferences = () => {
    const [preferences, setPreferences] = useState([]);
    const [filteredPreferences, setFilteredPreferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [editIndex, setEditIndex] = useState(-1);
    const [updatedPreferenceName, setUpdatedPreferenceName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch preferences from the server
    const fetchPreferences = async () => {
        axios.get('http://localhost:3002/managePreference')
            .then(response => {
                setPreferences(response.data);
                setFilteredPreferences(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching preferences:', error);
                setLoading(false);
                setMessage('Error fetching preferences.');
            });
    };

    // Handle delete preference
    const handleDelete = (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this preference?');
        if (confirmDelete) {
            axios.delete('http://localhost:3002/managePreference', { data: { _id: id } })
                .then(() => {
                    setPreferences(preferences.filter(preference => preference._id !== id));
                    setFilteredPreferences(filteredPreferences.filter(preference => preference._id !== id));
                    setMessage('Preference deleted successfully!');
                })
                .catch(error => {
                    console.error('Error deleting preference:', error);
                    setMessage('Error deleting preference.');
                });
        }
    };

    // Handle update preference
    const handleUpdate = (id) => {
        axios.put('http://localhost:3002/managePreference', { _id: id, Name: updatedPreferenceName })
            .then(() => {
                setPreferences(preferences.map(preference =>
                    preference._id === id ? { ...preference, Name: updatedPreferenceName } : preference
                ));
                setFilteredPreferences(filteredPreferences.map(preference =>
                    preference._id === id ? { ...preference, Name: updatedPreferenceName } : preference
                ));
                setMessage('Preference updated successfully!');
                setEditIndex(-1);
            })
            .catch(error => {
                console.error('Error updating preference:', error);
                setMessage('Error updating preference.');
            });
    };

    // Handle editing preference
    const handleEditClick = (index, currentName) => {
        setEditIndex(index);
        setUpdatedPreferenceName(currentName);
    };

    // Handle creating a new preference
    const handleCreate = () => {
        const newPreference = prompt('Enter new preference name:');
        if (newPreference) {
            axios.post('http://localhost:3002/managePreference', { Name: newPreference })
                .then(response => {
                    setPreferences([...preferences, response.data]);
                    setFilteredPreferences([...filteredPreferences, response.data]);
                    setMessage('Preference created successfully!');
                })
                .catch(error => {
                    console.error('Error creating preference:', error);
                    setMessage('Error creating preference.');
                });
        }
    };

    // Handle search functionality
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setFilteredPreferences(preferences);
        } else {
            const filtered = preferences.filter(preference =>
                preference.Name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPreferences(filtered);
        }
    };

    useEffect(() => {
        fetchPreferences();
    }, []);

    return (
        <>
            <AdminNavigationbar /> {/* Add the navigation bar here */}
            <div style={styles.container}>
                <h2 style={styles.header}>Manage Preferences</h2>
                <div className="d-flex justify-content-center mb-4">
                    <button onClick={handleCreate} className="icon-btn add-complaint-btn">
                        <div className="add-complaint-icon"></div>
                        <div className="btn-txt" style={{ padding: '15px 40px' }}>Create Preference</div>
                    </button>
                </div>

                <div className="rounded mb-4" style={{ display: 'flex', justifyContent: 'center' }}>
                    <input
                        type="search"
                        className="form-control rounded"
                        placeholder="Search preference by its name"
                        aria-label="Search"
                        aria-describedby="search-addon"
                        value={searchTerm}
                        onClick={handleSearch}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            borderColor: '#5ddec2',
                            borderWidth: '1px',
                            width: '50%',
                            margin: '0 auto'
                        }}
                    />
                </div>

                {loading ? (
                    <p style={styles.loading}>Loading preferences...</p>
                ) : (
                    <>
                        {filteredPreferences.length > 0 ? (
                            <ul style={styles.preferenceList}>
                                {filteredPreferences.map((preference, index) => (
                                    <li key={preference._id} style={styles.preferenceItem}>
                                        {editIndex === index ? (
                                            <div style={styles.editContainer}>
                                                <input
                                                    type="text"
                                                    value={updatedPreferenceName}
                                                    onChange={(e) => setUpdatedPreferenceName(e.target.value)}
                                                    style={styles.editInput}
                                                />
                                                <FaCheck
                                                    style={{ ...styles.icon, color: '#28a745' }}
                                                    onClick={() => handleUpdate(preference._id)}
                                                />
                                                <FaTimes
                                                    style={{ ...styles.icon, color: '#e74c3c' }}
                                                    onClick={() => setEditIndex(-1)}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <span style={styles.preferenceText}>{preference.Name}</span>
                                                <div style={styles.actions}>
                                                    <FaEdit
                                                        style={styles.icon}
                                                        onClick={() => handleEditClick(index, preference.Name)}
                                                    />
                                                    <FaTrash
                                                        style={{ ...styles.icon, color: 'red' }}
                                                        onClick={() => handleDelete(preference._id)}
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
                {message && <p style={styles.message}>{message}</p>}
            </div>
        </>
    );
};

const styles = {
    container: {
        width: '75%',
        margin: '90px auto',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        backgroundColor: '#ffffff',
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#2c3e50',
        fontSize: '24px',
        fontWeight: 'bold',
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
        backgroundColor: 'white',
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
        color: '#5ddec2',
        fontSize: '20px',
        transition: 'color 0.3s',
    },
    editContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
    },
    editInput: {
        flex: '1',
        padding: '8px',
        border: '1px solid #2980b9',
        borderRadius: '4px',
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
        color: '#28a745',
        textAlign: 'center',
    },
};

export default Preferences;
