import React, { useState, useEffect } from "react";
import styles from "../../styles/Profile.module.css";

const PreferenceDropdown = () => {
  const [preferences, setPreferences] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch preferences from the API
  const fetchPreferences = async () => {
    try {
      const response = await fetch("http://localhost:3002/preferences");
      const data = await response.json();
      setPreferences(data);
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  // Toggle the dropdown and fetch preferences when opened
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      fetchPreferences();
    }
  };

  // Handle preference selection
  const handleCheckboxChange = (preference) => {
    setSelectedPreferences((prevSelected) =>
      prevSelected.includes(preference)
        ? prevSelected.filter((item) => item !== preference)
        : [...prevSelected, preference]
    );
  };

  // Save selected preferences
  const handleSave = () => {
    console.log("Selected Preferences:", selectedPreferences);
    // Here you could add logic to send selectedPreferences to your backend or store them as needed
    alert(`Preferences saved: ${selectedPreferences.join(", ")}`);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        className={`${styles.btn} ${styles.btnInfo}`}
        onClick={toggleDropdown}
      >
        Choose Preference Tags
      </button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            // top: "100%",
            left: 0,
            // border: "1px solid #ccc",
            backgroundColor: "#fff",
            // padding: "10px",
            // width: "100%",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1,
          }}
        >
          {preferences.map((preference, index) => (
            <label key={index} style={{ display: "block", margin: "5px 0" }}>
              <input
                type="checkbox"
                checked={selectedPreferences.includes(preference)}
                onChange={() => handleCheckboxChange(preference)}
              />
              {preference}
            </label>
          ))}
          <button onClick={handleSave} style={{ marginTop: "10px" }}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default PreferenceDropdown;
