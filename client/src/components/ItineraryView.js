import React, { useState, useEffect } from "react";
import axios from "axios";


const ItineraryView = () => {
    const [tourGuideName, setTourGuideName] = useState("");
    const [itineraries, setItineraries] = useState([]);
    const [filteredItineraries, setFilteredItineraries] = useState([]);
    const [error, setError] = useState("");
    const [editIndex, setEditIndex] = useState(-1); // Index of the itinerary being edited
    const [updatedData, setUpdatedData] = useState({}); // State for updated itinerary data

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const response = await axios.get("http://localhost:3002/itinerary");
                setItineraries(response.data);
                console.log("Fetched Itineraries:", response.data);
            } catch (err) {
                console.error("Error fetching itineraries:", err);
                setError("Error fetching itineraries. Please try again.");
            }
        };

        fetchItineraries();
    }, []);

    const handleTourGuideNameChange = (event) => {
        setTourGuideName(event.target.value);
    };

    const handleShowItineraries = () => {
        console.log("Tour Guide Name Entered:", tourGuideName);
        const filtered = itineraries.filter(itinerary => {
            const tourGuideNameFromItinerary = itinerary.tourGuideName;
            return tourGuideNameFromItinerary &&
                tourGuideNameFromItinerary.toLowerCase() === tourGuideName.toLowerCase();
        });

        console.log("Filtered Itineraries:", filtered);

        if (filtered.length === 0) {
            setError("No itineraries found for this tour guide.");
            setFilteredItineraries([]);
        } else {
            setFilteredItineraries(filtered);
            setError("");
        }
    };

    const handleDeleteItinerary = async (id) => {
        // Find the itinerary by ID
        const itineraryToDelete = filteredItineraries.find(itinerary => itinerary._id === id);

        if (itineraryToDelete && itineraryToDelete.booked) {
            alert("This itinerary can't be deleted because it is booked.");
            return; // Exit the function if booked
        }

        try {
            await axios.delete(`http://localhost:3002/itinerary/${id}`);
            // Update the itineraries state to reflect the deletion
            setFilteredItineraries(prev => prev.filter(itinerary => itinerary._id !== id));
            setItineraries(prev => prev.filter(itinerary => itinerary._id !== id));
            console.log("Itinerary deleted successfully");
        } catch (err) {
            console.error("Error deleting itinerary:", err);
            setError("Error deleting itinerary. Please try again.");
        }
    };

    const handleEditClick = (index) => {
        setEditIndex(index);
        setUpdatedData(filteredItineraries[index]); // Pre-fill with current data
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'preferences' || name === 'activities') {
            setUpdatedData(prev => ({ ...prev, [name]: value.split(',').map(item => item.trim()) })); // Convert to array
        } else {
            setUpdatedData(prev => ({ ...prev, [name]: value }));
        }
    };
    const [success, setSuccess] = useState(""); // State for success message
    //const [error, setError] = useState(""); // State for error message
    
    const handleActivate = async (id) => {
        const itineraryToActivate = filteredItineraries.find(itinerary => itinerary._id === id);
    
        if (itineraryToActivate && itineraryToActivate.booked) {
            setError("This itinerary can't be activated because it is booked.");
            setSuccess("");
            return;
        }
    
        try {
            const response = await axios.put(`http://localhost:3002/itinerary/${id}/activate`);
            if (response.status === 200) {
                setFilteredItineraries(prev =>
                    prev.map(itinerary => (itinerary._id === id ? { ...itinerary, active: true } : itinerary))
                );
                setSuccess("Itinerary activated successfully!");
                setError("");
            } else {
                setError("Failed to activate itinerary.");
            }
        } catch (err) {
            console.error("Error activating itinerary:", err);
            setError("Error activating itinerary. Please try again.");
            setSuccess("");
        }
    };
    
    const handleDeactivate = async (id) => {
        try {
            const response = await axios.put(`http://localhost:3002/itinerary/${id}/deactivate`);
            if (response.status === 200) {
                setFilteredItineraries(prev => 
                    prev.map(itinerary => (itinerary._id === id ? { ...itinerary, active: false } : itinerary))
                );
                setSuccess("Itinerary deactivated successfully!");
                setError("");
            } else {
                setError("Failed to deactivate itinerary.");
            }
        } catch (err) {
            console.error("Error deactivating itinerary:", err);
            setError("Error deactivating itinerary. Please try again.");
            setSuccess("");
        }
    };
    
    
    const handleUpdateItinerary = async (id) => {
        try {
            // Fetch the activities from the database (assuming you have an endpoint for this)
            const activitiesResponse = await axios.get("http://localhost:3002/activities");
            const activities = activitiesResponse.data;

            // Check if the updated activity name exists in the activities
            const matchedActivity = activities.find(activity => activity.name === updatedData.activities[0]);

            if (!matchedActivity) {
                setError("No matches found.");
                return;
            }

            // Check if the matched activity is booked
            if (matchedActivity.booked) {
                setError("This activity is not available.");
                return;
            }

            // Update the itinerary data with matched activity details
            const updatedItinerary = {
                ...updatedData,
                locationToBeVisited: matchedActivity.location, // Assuming your activity object has these fields
                preferences: matchedActivity.tags, // Assuming your activity has tags
            };

            const response = await axios.put(`http://localhost:3002/itinerary/${id}`, updatedItinerary);
            setFilteredItineraries(prev => 
                prev.map((itinerary, index) => (index === editIndex ? response.data : itinerary))
            );
            setEditIndex(-1); // Close the edit mode
            setError("");
        } catch (err) {
            console.error("Error updating itinerary:", err);
            setError("Error updating itinerary. Please try again.");
        }
    };

    return (
        <div style={styles.container}>
             
            <h1 style={styles.header}>Itinerary Search</h1>
            <div style={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="Enter Tour Guide Name"
                    value={tourGuideName}
                    onChange={handleTourGuideNameChange}
                    style={styles.input}
                />
                <button onClick={handleShowItineraries} style={styles.button}>Show Itineraries</button>
            </div>

            {error && <p style={styles.error}>{error}</p>}
            {success && <div className="success-message">{success}</div>}
            
            {filteredItineraries.length > 0 && (
                <div style={styles.itineraryContainer}>
                    <h2 style={styles.subHeader}>Itineraries:</h2>
                    {filteredItineraries.map((itinerary, index) => (
                        <div key={itinerary._id} style={styles.itineraryBox}>
                            <div style={styles.buttonContainer}>
                                
                            </div>
                            {editIndex === index ? (
                                <div style={styles.editContainer}>
                                    {/* Editable Fields with Labels */}
                                    <label style={styles.label}>Itinerary Name:</label>
                                    <input
                                        type="text"
                                        name="Itinerary_Name"
                                        value={updatedData.Itinerary_Name || ""}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    />
                                    
                                    <label style={styles.label}>Tour Guide Name:</label>
                                    <input
                                        type="text"
                                        name="tourGuideName"
                                        value={updatedData.tourGuideName || ""}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    />
                                    <label style={styles.label}>Location to be Visited:</label>
                                    <input
                                        type="text"
                                        name="locationToBeVisited"
                                        value={updatedData.locationToBeVisited || ""}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    />
                                    <label style={styles.label}>Timeline:</label>
                                    <input
                                        type="text"
                                        name="timeline"
                                        value={updatedData.timeline || ""}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    />
                                    <label style={styles.label}>Duration of Activity:</label>
                                    <input
                                        type="number"
                                        name="durationOfActivity"
                                        value={updatedData.durationOfActivity || ""}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    />
                                    <label style={styles.label}>Language of Tour:</label>
                                    <input
                                        type="text"
                                        name="languageOfTour"
                                        value={updatedData.languageOfTour || ""}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    />
                                    <label style={styles.label}>Price:</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={updatedData.price || ""}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    />
                                    <label style={styles.label}>Accessibility:</label>
                                    <input
                                        type="text"
                                        name="accessibility"
                                        value={updatedData.accessibility || ""}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    />
                                    <label style={styles.label}>Pickup Location:</label>
                                    <input
                                        type="text"
                                        name="pickupLocation"
                                        value={updatedData.pickupLocation || ""}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    />
                                    <label style={styles.label}>Dropoff Location:</label>
                                    <input
                                        type="text"
                                        name="dropoffLocation"
                                        value={updatedData.dropoffLocation || ""}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    />
                                    {/* Booked Dropdown */}
                                    <label style={styles.label}>Booked:</label>
                                    <select
                                        name="booked"
                                        value={updatedData.booked ? "Yes" : "No"}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    >
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                    <label style={styles.label}>Rating:</label>
                                    <input
                                        type="number"
                                        name="rating"
                                        value={updatedData.rating || ""}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    />
                                    <label style={styles.label}>Activities :</label>
                                    <input
                                        type="text"
                                        name="activities"
                                        value={updatedData.activities ? updatedData.activities.join(', ') : ""}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    />
                                    <label style={styles.label}>Preferences :</label>
                                    <input
                                        type="text"
                                        name="preferences"
                                        value={updatedData.preferences ? updatedData.preferences.join(', ') : ""}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    />
                                    <button onClick={() => handleUpdateItinerary(itinerary._id)} style={styles.button}>Update</button>
                                    <button onClick={() => setEditIndex(-1)} style={styles.cancelButton}>Cancel</button>
                                </div>
                            ) : (
                                <div style={styles.itineraryDetails}>
                                    <div style={styles.buttonContainer}>
    <button 
        onClick={() => handleActivate(itinerary._id)} 
        style={{ ...styles.button, backgroundColor: 'green', color: 'white', marginLeft: '10px' }}>
        Activate
    </button>
    <button 
        onClick={() => handleDeactivate(itinerary._id)} 
        style={{ ...styles.button, backgroundColor: 'red', color: 'white', marginLeft: '10px' }}>
        Deactivate
    </button>
</div>

                                    <p><strong>Itinerary Name:</strong> {itinerary.Itinerary_Name}</p>
                                    <p><strong>Tour Guide Name:</strong> {itinerary.tourGuideName}</p>
                                    <p><strong>Location to be Visited:</strong> {itinerary.locationToBeVisited}</p>
                                    <p><strong>Timeline:</strong> {itinerary.timeline}</p>
                                    <p><strong>Duration of Activity:</strong> {itinerary.durationOfActivity}</p>
                                    <p><strong>Language of Tour:</strong> {itinerary.languageOfTour}</p>
                                    <p><strong>Price:</strong> {itinerary.price}</p>
                                    <p><strong>Accessibility:</strong> {itinerary.accessibility}</p>
                                    <p><strong>Pickup Location:</strong> {itinerary.pickupLocation}</p>
                                    <p><strong>Dropoff Location:</strong> {itinerary.dropoffLocation}</p>
                                    <p><strong>Booked:</strong> {itinerary.booked ? "Yes" : "No"}</p>
                                    <p><strong>Rating:</strong> {itinerary.rating}</p>
                                    <p><strong>Activities:</strong> {itinerary.activities.join(', ')}</p>
                                    <p><strong>Preferences:</strong> {itinerary.preferences.join(', ')}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Styles (Maintain existing styles)
const styles = {
    container: {
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    inputContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    input: {
        padding: '10px',
        width: '70%',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    button: {
        padding: '10px 15px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
    itineraryContainer: {
        marginTop: '20px',
    },
    itineraryBox: {
        border: '1px solid #ccc',
        padding: '15px',
        marginBottom: '10px',
        borderRadius: '4px',
        position: 'relative',
    },
    buttonContainer: {
        position: 'absolute',
        top: '10px',
        right: '10px',
    },
    deleteButton: {
        background: 'red',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        padding: '5px',
        borderRadius: '4px',
        marginRight: '5px',
    },
    editButton: {
        background: '#FFA500',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        padding: '5px',
        borderRadius: '4px',
    },
    editContainer: {
        marginTop: '20px',
    },
    label: {
        marginTop: '10px',
        fontWeight: 'bold',
    },
    itineraryDetails: {
        marginTop: '10px',
    },
    cancelButton: {
        padding: '10px 15px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    subHeader: {
        marginBottom: '10px',
    },
};

export default ItineraryView;
