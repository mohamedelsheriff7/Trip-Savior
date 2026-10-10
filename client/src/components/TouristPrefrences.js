import React, { useState } from 'react';
//import './SelectPreferences.css';
import TouristNavBar from './Profile/TouristNavbar';
import axios from 'axios'; // Import axios

const SelectPreferences = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [username, setUsername] = useState(''); // Assuming you have a way to get the username
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility

  // Predefined list of preferences
  const preferences = [
    'Adventure', 'Relaxation', 'Sightseeing', 'Food', 
    'Nature', 'Culture', 'Hiking', 'Beach', 
    'Historical Sites', 'Photography', 'Culinary'
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelect = (preference) => {
    if (!selectedPreferences.includes(preference)) {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };

  const handleRemove = (preference) => {
    setSelectedPreferences(selectedPreferences.filter(item => item !== preference));
  };

  const handleSubmit = async () => {
    const username = localStorage.getItem("username");
    console.log(username);
    try {
      // Send the preferences as an array instead of individual preference actions
      const preferenceData = {
        username ,  // User's name
        preferences: selectedPreferences,  // Array of selected preferences
        action: 'add'  // Assuming 'add' action, change if needed
      };
      console.log(preferenceData);
  
      // Make the POST request to add the selected preferences to the database
      const response = await axios.post("http://localhost:3002/tourist/updatePreferences", preferenceData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log("Preferences updated successfully");
        // You can also update the UI here, such as showing a success message
      } else {
        console.error("Error updating preferences");
      }
    } catch (err) {
      console.error("Error submitting preferences:", err);
      if (err.response) {
        console.error("Response error: ", err.response.data);  // Log response error
      }
      alert("Error: " + (err.response ? err.response.data.message : err.message)); 
    }
  };

  const filteredPreferences = preferences
    .filter(preference => 
      preference.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedPreferences.includes(preference)
    );

  return (
    <>
      <TouristNavBar />
      
      {/* Trigger button to open modal */}
      <button onClick={() => setModalVisible(true)} className="btn btn-primary">Change Preferences</button>

      {/* Modal structure */}
      {modalVisible && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
              }}
            >
              <div className="form-group" style={{ position: 'relative' }}>
                <label htmlFor="currentPassword">Search Preferences</label>
                <input
                  type="text"
                  placeholder="Search preferences..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{
                    padding: '10px 40px 10px 10px', // Add right padding for the icon
                    borderRadius: '5px',
                    border: '1px dashed #ccc',
                  }}
                />
              </div>

              <div className="selected-preferences">
                <h3 className="section-title">Your Selected Preferences</h3>
                {selectedPreferences.length === 0 ? (
                  <p className="no-preferences">No preferences selected yet</p>
                ) : (
                  <div className="preferences-list">
                    {selectedPreferences.map((preference) => (
                      <div key={preference} className="preference-chip">
                        <span>{preference}</span>
                        <button 
                          onClick={() => handleRemove(preference)}
                          className="remove-preference"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="preferences-list mt-2">
                {filteredPreferences.map((preference) => (
                  <button
                    key={preference}
                    onClick={() => handleSelect(preference)}
                    className="preference-button"
                  >
                    {preference}
                    <span className="add-icon">+</span>
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              {selectedPreferences.length > 0 && (
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    backgroundColor: '#5ddec2',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    marginLeft: 'auto', // This moves the button to the right
                  }}
                >
                  Submit Preferences
                </button>
              )}
            </form>
            <button onClick={() => setModalVisible(false)} className="btn btn-secondary">Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default SelectPreferences;
