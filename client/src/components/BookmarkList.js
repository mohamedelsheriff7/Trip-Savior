import React, { useEffect, useState } from "react";
import { getBookmarks } from "../services/bookmarkService";

const BookmarkList = ({ touristId }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await getBookmarks(touristId);
        setBookmarks(response.data.bookmarks);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [touristId]);

  if (loading) return <p>Loading bookmarks...</p>;

  return (
    <div>
      <h3>Your Bookmarks</h3>
      <ul>
        {bookmarks.map((bookmark) => (
          <li key={bookmark._id}>
            <p>{bookmark.eventId.name || bookmark.eventId.Itinerary_Name}</p>
            <p>Type: {bookmark.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookmarkList;
