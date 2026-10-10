// Itineraries.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpcomingItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [error, setError] = useState('');

  // Fetch itineraries automatically when the component loads
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get('http://localhost:3002/getUpcomingItenraries');
        setItineraries(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load itineraries. Please try again.');
        setItineraries([]);
      }
    };

    fetchItineraries(); // Call fetch function on component mount
  }, []); // Empty dependency array to ensure it runs only once

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {itineraries.length > 0 ? (
        <ul>
          {itineraries.map((itinerary) => (
            <li key={itinerary._id}>
              <h4>Tour Guide: {itinerary.tourGuideId?.name}</h4>
              <p>Location to Visit: {itinerary.locationToBeVisited}</p>
              <p>Duration: {itinerary.durationOfActivity} hours</p>
              <p>Language: {itinerary.languageOfTour}</p>
              <p>Price: ${itinerary.price}</p>
              <p>Timeline: {itinerary.timeline}</p>
              <p>Date: {new Date(itinerary.date_time).toLocaleDateString()}</p>
              <p>Pickup Location: {itinerary.pickupLocation}</p>
              <p>Dropoff Location: {itinerary.dropoffLocation}</p>
              <p>Accessibility: {itinerary.accesibility}</p>
              <p>Booked: {itinerary.booked ? 'Yes' : 'No'}</p>
              {itinerary.activities?.length > 0 && (
                <div>
  <h4>Activities:</h4>
  <ul>
    {itinerary.activities.map((activityName, index) => (  // Use activityName since it's a string
      <li key={index}>  
        <p>Name: {activityName}</p>
       
      </li>
    ))}
  </ul>
</div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming itineraries available.</p>
      )}
    </div>
  );
};

export default UpcomingItineraries;