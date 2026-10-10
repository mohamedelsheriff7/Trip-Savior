// import React, { useState } from "react";
// import axios from "axios";
// import UpdateHistoricalPlace from "../tourismGovernor/updateHistoricalPlace"; // Assuming Delete component is also used
// import DeleteHistoricalPlace from "../tourismGovernor/deleteHistoricalPlace"; // Import the Update component
// import CreateTag from "./createTag";

// const HistoricalPlacesSearch = () => {
//   const [searchName, setSearchName] = useState("");
//   const [places, setPlaces] = useState([]);
//   const [error, setError] = useState("");

//   // Handle search for historical places
//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setError(""); // clear previous error
//     try {
//       const response = await axios.get(
//         "http://localhost:3002/tourismGovernor/getHistoricalPlacesByName",
//         {
//           params: { name: searchName },
//         }
//       );
//       setPlaces(response.data); // save the result
//     } catch (err) {
//       setError("Error fetching historical places");
//     }
//   };

//   // Callback to handle the updated place
//   const handleUpdateSuccess = (updatedPlace) => {
//     setPlaces(
//       places.map((place) =>
//         place._id === updatedPlace._id ? updatedPlace : place
//       )
//     ); // Update the place in state
//   };

//   return (
//     <div>
//       <h1>Search Historical Places</h1>
//       <form onSubmit={handleSearch}>
//         <input
//           type="text"
//           value={searchName}
//           onChange={(e) => setSearchName(e.target.value)}
//           placeholder="Enter place name"
//         />
//         <button type="submit">Search</button>
//       </form>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <div>
//         <h2>Results:</h2>
//         {places.length > 0 ? (
//           <ul>
//             {places.map((place) => (
//               <li key={place._id}>
//                 <h3>{place.name}</h3>
//                 <p>{place.description}</p>
//                 {/* Use Delete component */}
//                 <DeleteHistoricalPlace
//                   placeId={place._id}
//                   placeName={place.name}
//                   onDeleteSuccess={() =>
//                     setPlaces(places.filter((p) => p._id !== place._id))
//                   }
//                 />
//                 {/* Use Update component */}
//                 <UpdateHistoricalPlace
//                   place={place}
//                   onUpdateSuccess={handleUpdateSuccess}
//                 />
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No places found</p>
//         )}
//       </div>
//       {/* <CreateTag /> */}
//     </div>
//   );
// };

// export default HistoricalPlacesSearch;
import React, { useState } from "react";
import axios from "axios";
import UpdateHistoricalPlace from "./updateHistoricalPlace";
import DeleteHistoricalPlace from "./deleteHistoricalPlace";
import CreateTags from "./createTags";
import CreateHistoricalPlace from "./createHistoricalPlace";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
const HistoricalPlacesSearch = () => {
  const [searchName, setSearchName] = useState("");
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate
  // Handle search for historical places
  const handleSearch = async (e) => {
    e.preventDefault();
    setError(""); // clear previous error
    try {
      const response = await axios.get(
        "http://localhost:3002/tourismGovernor/getHistoricalPlacesByName",
        {
          params: { name: searchName },
        }
      );
      setPlaces(response.data); // save the result
    } catch (err) {
      setError("Error fetching historical places");
    }
  };

  // Callback to handle the updated place
  const handleUpdateSuccess = (updatedPlace) => {
    setPlaces(
      places.map((place) =>
        place._id === updatedPlace._id ? updatedPlace : place
      )
    ); // Update the place in state
  };

  // Callback to handle tag creation success
  const handleTagCreateSuccess = (updatedPlace) => {
    setPlaces(
      places.map((place) =>
        place._id === updatedPlace._id ? updatedPlace : place
      )
    );
  };
   // Redirect to Change Password page
   const handleChangePassword = () => {
    navigate("/tourismGovernor/changePassword"); // Adjust the route as necessary
  };


  return (
    <div>
       <button onClick={handleChangePassword} style={{ marginTop: "20px" }}>
        Change Password
      </button>
      <CreateHistoricalPlace />
     
      <h1>Search Historical Places</h1>
      
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Enter place name"
        />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      

      <div>
        <h2>Results:</h2>
        {places.length > 0 ? (
          <ul>
            {places.map((place) => (
              <li key={place._id}>
                <h3>{place.name}</h3>
                <p>{place.description}</p>

                {/* Use Delete component */}
                <DeleteHistoricalPlace
                  placeId={place._id}
                  placeName={place.name}
                  onDeleteSuccess={() =>
                    setPlaces(places.filter((p) => p._id !== place._id))
                  }
                />

                {/* Use Update component */}
                <UpdateHistoricalPlace
                  place={place}
                  onUpdateSuccess={handleUpdateSuccess}
                />

                {/* Create Tag component */}
                <CreateTags
                  placeId={place._id}
                  onTagCreateSuccess={handleTagCreateSuccess}
                />

                {/* Display current tags */}
                {place.tags && place.tags.length > 0 ? (
                  <div>
                    <h4>Tags:</h4>
                    <ul>
                      {place.tags.map((tag, index) => (
                        <li key={index}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No tags available</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No places found</p>
        )}
      </div>
    </div>
  );
};

export default HistoricalPlacesSearch;
