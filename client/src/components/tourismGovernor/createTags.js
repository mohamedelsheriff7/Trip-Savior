// import React, { useState } from "react";
// import axios from "axios";

// const CreateTag = () => {
//   const [placeName, setPlaceName] = useState(""); // State to store the historical place name
//   const [tag, setTag] = useState(""); // State to store the new tag
//   const [message, setMessage] = useState(""); // State to store success/error message

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.put(
//         "http://localhost:3002/tourismGovernor/createTags",
//         {
//           name: placeName,
//           tag: tag,
//         }
//       );

//       if (response.status === 200) {
//         setMessage("Tag added successfully!");
//       } else {
//         setMessage("Failed to add tag.");
//       }
//     } catch (error) {
//       setMessage("Error occurred while adding tag.");
//       console.error("There was an error!", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Add Tag to Historical Place</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Historical Place Name:</label>
//           <input
//             type="text"
//             value={placeName}
//             onChange={(e) => setPlaceName(e.target.value)}
//             placeholder="Enter place name"
//             required
//           />
//         </div>
//         <div>
//           <label>Tag:</label>
//           <input
//             type="text"
//             value={tag}
//             onChange={(e) => setTag(e.target.value)}
//             placeholder="Enter tag"
//             required
//           />
//         </div>
//         <button type="submit">Add Tag</button>
//       </form>

//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default CreateTag;
import React, { useState } from "react";
import axios from "axios";

const CreateTags = ({ placeId, onTagCreateSuccess }) => {
  const [tags, setTags] = useState(""); // State to store the new tag input
  const [message, setMessage] = useState(""); // State to store success/error message

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert the comma-separated string into an array and trim any extra spaces
    const tagsArray = tags.split(",").map((tag) => tag.trim());

    try {
      const response = await axios.put(
        `http://localhost:3002/tourismGovernor/createTagsForHistoricalPlaces`,
        {
          _id: placeId, // Assuming you match the place by ID
          tags: tagsArray, // Send the processed array of tags
        }
      );

      if (response.status === 200) {
        setMessage("Tags added successfully!");
        onTagCreateSuccess(response.data); // Callback to update parent state
      } else {
        setMessage("Failed to add tags.");
      }
    } catch (error) {
      setMessage("Error occurred while adding tags.");
      console.error("There was an error!", error);
    }
  };

  return (
    <div>
      <h4>Add Tags</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Enter tags: tag1,tag2,tag3"
          required
        />
        <button type="submit">Add Tags</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateTags;
