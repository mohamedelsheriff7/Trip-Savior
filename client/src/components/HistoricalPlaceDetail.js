// src/components/HistoricalPlaceDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const HistoricalPlaceDetail = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/historical-places/${id}`);
        setPlace(response.data);
      } catch (error) {
        setError("Failed to load historical place data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>{place.name}</h2>
      <p><strong>Location:</strong> {place.location}</p>
      <p><strong>Description:</strong> {place.description}</p>
      <p><strong>Entry Fee (Foreign):</strong> ${place.entryFeeForeign}</p>
      <p><strong>Entry Fee (Native):</strong> ${place.entryFeeNative}</p>
      <p><strong>Entry Fee (Student):</strong> ${place.entryFeeStudent}</p>
      <p><strong>Opening Hours:</strong> {place.openingHours}</p>
      <p><strong>Category:</strong> {place.category}</p>
      <p><strong>Date:</strong> {place.date_time ? new Date(place.date_time).toLocaleDateString() : 'N/A'}</p>
    </div>
  );
};

export default HistoricalPlaceDetail;
