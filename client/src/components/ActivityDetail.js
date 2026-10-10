// src/components/ActivityDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ActivityDetail = () => {
  const { id } = useParams(); // Get the id from the URL
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/activities/${id}`);
        setActivity(response.data);
      } catch (error) {
        setError("Failed to load activity data.");
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>{activity.name}</h2>
      <p><strong>Location:</strong> {activity.location}</p>
      <p><strong>Date:</strong> {new Date(activity.date).toDateString()}</p>
      <p><strong>Time:</strong> {activity.time}</p>
      <p><strong>Price:</strong> ${activity.price}</p>
      <p><strong>Rating:</strong> {activity.rating}/5</p>
      <p><strong>Category:</strong> {activity.category}</p>
      <p><strong>Special Discounts:</strong> {activity.specialDiscounts || "N/A"}</p>
    </div>
  );
};

export default ActivityDetail;
