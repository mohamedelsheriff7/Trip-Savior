// import React, { useState } from "react";
// import axios from "axios";

// const HistoricalPlacesByUsername = () => {
//   const [username, setUsername] = useState(""); // State to store the entered username
//   const [historicalPlaces, setHistoricalPlaces] = useState([]); // State to store the fetched places
//   const [message, setMessage] = useState(""); // Message to show errors or status

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!username) {
//       setMessage("Please enter a username");
//       return;
//     }

//     try {
//       // Send request to the backend
//       const response = await axios.post(
//         "http://localhost:3002/tourismGovernor/getHistoricalPlacesByGovernorUsername",
//         { governorUsername: username } // Send username in the request body
//       );

//       if (response.status === 200) {
//         setHistoricalPlaces(response.data); // Store the fetched places
//         setMessage("");
//       } else {
//         setMessage("No places found for the given username.");
//       }
//     } catch (error) {
//       setMessage("Error fetching historical places.");
//       console.error("There was an error!", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Find Historical Places by Username</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           placeholder="Enter your username"
//           required
//         />
//         <button type="submit">Search</button>
//       </form>

//       {/* Display message or results */}
//       {message && <p>{message}</p>}

//       {historicalPlaces.length > 0 && (
//         <div>
//           <h2>Historical Places for {username}</h2>
//           <ul>
//             {historicalPlaces.map((place) => (
//               <li key={place._id}>
//                 <h3>{place.name}</h3>
//                 <p>{place.description}</p>
//                 <p>Location: {place.location}</p>
//                 <p>Entry Fee (Foreign): {place.entryFeeForeign}</p>
//                 <p>Entry Fee (Native): {place.entryFeeNative}</p>
//                 <p>Entry Fee (Student): {place.entryFeeStudent}</p>
//                 <p>Category: {place.category}</p>
//                 {place.pictures.length > 0 && (
//                   <div>
//                     <h4>Pictures:</h4>
//                     {place.pictures.map((pic, index) => (
//                       <img
//                         key={index}
//                         src={pic}
//                         alt={`Historical place ${place.name} - pic ${
//                           index + 1
//                         }`}
//                         width="150"
//                       />
//                     ))}
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HistoricalPlacesByUsername;
import React, { useState, useEffect } from "react";
import axios from "axios";

const HistoricalPlacesView = () => {
  // State variables
  const [governorUsername, setGovernorUsername] = useState("");
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [filteredHistoricalPlaces, setFilteredHistoricalPlaces] = useState([]);
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(-1); // Index of the place being edited
  const [updatedData, setUpdatedData] = useState({}); // Data being edited

  // Fetch all historical places on component mount
  useEffect(() => {
    const fetchHistoricalPlaces = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/tourismGovernor/getAllHistoricalPlaces"
        );
        setHistoricalPlaces(response.data);
        console.log("Fetched Historical Places:", response.data);
      } catch (err) {
        console.error("Error fetching historical places:", err);
        setError("Error fetching historical places. Please try again.");
      }
    };

    fetchHistoricalPlaces();
  }, []);

  // Handle input change for governorUsername
  const handleGovernorUsernameChange = (event) => {
    setGovernorUsername(event.target.value);
  };

  // Filter historical places based on governorUsername
  const handleShowHistoricalPlaces = () => {
    console.log("Governor Username Entered:", governorUsername);
    const filtered = historicalPlaces.filter((place) => {
      const governorFromPlace = place.governorUsername;
      return (
        governorFromPlace &&
        governorFromPlace.toLowerCase() === governorUsername.toLowerCase()
      );
    });

    console.log("Filtered Historical Places:", filtered);

    if (filtered.length === 0) {
      setError("No historical places found for this governor.");
      setFilteredHistoricalPlaces([]);
    } else {
      setFilteredHistoricalPlaces(filtered);
      setError("");
    }
  };

  // Handle input changes in the edit form
  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setUpdatedData((prev) => ({
  //     ...prev,
  //     [name]: name === "establishedYear" ? Number(value) : value, // Convert to number if necessary
  //   }));
  // };

  // Handle updating a historical place
  // const handleUpdateHistoricalPlace = async (id) => {
  //   try {
  //     const response = await axios.put(
  //       `http://localhost:3002/historicalPlaces/${id}`,
  //       updatedData
  //     );
  //     setFilteredHistoricalPlaces((prev) =>
  //       prev.map((place, index) =>
  //         index === editIndex ? response.data : place
  //       )
  //     );
  //     setHistoricalPlaces((prev) =>
  //       prev.map((place) => (place._id === id ? response.data : place))
  //     );
  //     setEditIndex(-1); // Exit edit mode
  //     setError("");
  //     console.log("Historical place updated successfully");
  //   } catch (err) {
  //     console.error("Error updating historical place:", err);
  //     setError("Error updating historical place. Please try again.");
  //   }
  // };

  // Handle deleting a historical place
  // const handleDeleteHistoricalPlace = async (id) => {
  //   try {
  //     await axios.delete(`http://localhost:3002/historicalPlaces/${id}`);
  //     setFilteredHistoricalPlaces((prev) =>
  //       prev.filter((place) => place._id !== id)
  //     );
  //     setHistoricalPlaces((prev) => prev.filter((place) => place._id !== id));
  //     console.log("Historical place deleted successfully");
  //   } catch (err) {
  //     console.error("Error deleting historical place:", err);
  //     setError("Error deleting historical place. Please try again.");
  //   }
  // };

  // Handle clicking the edit button
  // const handleEditClick = (index) => {
  //   setEditIndex(index);
  //   setUpdatedData(filteredHistoricalPlaces[index]); // Pre-fill with current data
  // };

  // Handle canceling the edit
  // const handleCancelEdit = () => {
  //   setEditIndex(-1);
  //   setUpdatedData({});
  // };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Historical Places Search</h1>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter Governor Username"
          value={governorUsername}
          onChange={handleGovernorUsernameChange}
          style={styles.input}
        />
        <button onClick={handleShowHistoricalPlaces} style={styles.button}>
          Show Historical Places
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {filteredHistoricalPlaces.length > 0 && (
        <div style={styles.historicalPlacesContainer}>
          <h2 style={styles.subHeader}>Historical Places:</h2>
          {filteredHistoricalPlaces.map((place, index) => (
            <div key={place._id} style={styles.placeBox}>
              <div style={styles.buttonContainer}>
                {/* <button
                  onClick={() => handleEditClick(index)}
                  style={styles.editButton}
                >
                  Edit
                </button> */}
                {/* <button
                  onClick={() => handleDeleteHistoricalPlace(place._id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button> */}
              </div>
              {editIndex === index ? (
                <div>
                  {/* Add other fields as necessary */}

                  {/* <button
                    onClick={() => handleUpdateHistoricalPlace(place._id)}
                    style={styles.button}
                  >
                    Update
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button> */}
                </div>
              ) : (
                <div style={styles.placeDetails}>
                  <p>
                    <strong>Name:</strong> {place.name}
                  </p>
                  <p>
                    <strong>Governor Username:</strong> {place.governorUsername}
                  </p>
                  <p>
                    <strong>Location:</strong> {place.location}
                  </p>
                  <p>
                    <strong>Description:</strong> {place.description}
                  </p>
                  <p>
                    <strong>Established Year:</strong> {place.establishedYear}
                  </p>
                  {/* Display other fields as necessary */}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Inline styles for the component
const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    width: "70%",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  historicalPlacesContainer: {
    marginTop: "20px",
  },
  subHeader: {
    marginBottom: "10px",
  },
  placeBox: {
    border: "1px solid #ccc",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "4px",
    position: "relative",
  },
  buttonContainer: {
    position: "absolute",
    top: "10px",
    right: "10px",
  },
  editButton: {
    background: "#FFA500",
    color: "white",
    border: "none",
    cursor: "pointer",
    padding: "5px 10px",
    borderRadius: "4px",
    marginRight: "5px",
  },
  deleteButton: {
    background: "red",
    color: "white",
    border: "none",
    cursor: "pointer",
    padding: "5px 10px",
    borderRadius: "4px",
  },
  editContainer: {
    marginTop: "20px",
  },
  label: {
    marginTop: "10px",
    fontWeight: "bold",
    display: "block",
  },
  placeDetails: {
    marginTop: "10px",
  },
  cancelButton: {
    padding: "10px 15px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
    marginLeft: "10px",
  },
};

export default HistoricalPlacesView;
