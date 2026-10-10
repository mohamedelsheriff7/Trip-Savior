import React, { useState } from "react";

// The TagsFilter component takes in an onFilter callback prop
const TagsFilter = ({ onFilter }) => {
  const [tags, setTags] = useState(""); // State to store user input for tags

  // Handle form submission to apply the tags filter
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    onFilter(tags); // Call the parent component's onFilter function, passing the entered tags
  };

  return (
    <form onSubmit={handleFilterSubmit}>
      <div>
        <label>Tags (comma separated):</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., museum,monument"
        />
      </div>
      <button type="submit">Apply Filters</button>
    </form>
  );
};

export default TagsFilter;
