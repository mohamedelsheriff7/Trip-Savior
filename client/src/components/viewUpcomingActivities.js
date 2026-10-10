import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpcomingActivities = () => {
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]); // State to hold categories
    const [category, setCategory] = useState('');
    const [startPrice, setStartPrice] = useState('');
    const [endPrice, setEndPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [rating, setRating] = useState('');

    // Fetch activities and categories when the component loads
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get('http://localhost:3002/getUpcomingActivities');
                setActivities(response.data);
                setError('');
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Failed to load activities. Please try again.');
                setActivities([]);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3002/activities'); // Fetch categories from activities endpoint
                const uniqueCategories = Array.from(new Set(response.data.map(activity => activity.category))); // Get unique categories
                setCategories(uniqueCategories); // Set categories from the response
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };

        fetchActivities(); // Call fetch function on component mount
        fetchCategories(); // Fetch categories
    }, []); // Empty dependency array to ensure it runs only once

    const handleFilter = async (event) => {
        event.preventDefault();
        const filterData = {
            category,
            startPrice,
            endPrice,
            startDate,
            endDate,
            rating,
        };
        console.log("Filter Data:", filterData);

        try {
            const response = await axios.get("http://localhost:3002/filterActivity", {
                params: { startPrice, endPrice, startDate, endDate, category, rating }
            });
            console.log(response.data);
            setActivities(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div>
            <h2>Upcoming Activities</h2>
            <div>
                <form onSubmit={handleFilter} className='container'>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='card mt-3 p-3'>
                                <label>Category:</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="">Select a category</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>

                                <label>Min. Budget:</label>
                                <input type="number" value={startPrice} onChange={(e) => setStartPrice(e.target.value)} />

                                <label>Max Budget:</label>
                                <input type="number" value={endPrice} onChange={(e) => setEndPrice(e.target.value)} />

                                <label>Min. Date:</label>
                                <input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} />

                                <label>Max. Date:</label>
                                <input type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} />

                                <label>Rating:</label>
                                <input type='number' min={0} max={5} step={0.1} value={rating} onChange={(e) => setRating(e.target.value)} />

                                <button type='submit'>Filter</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                            {activities.length > 0 ? (
                <ul>
                    {activities.map((activity) => (
                        <li key={activity._id}>
                            <h4>{activity.name}</h4>
                            <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                            <p>Time: {activity.time}</p>
                            <p>Location: {activity.location}</p>
                            <p>Price: {activity.price}</p>
                            <p>Category: {activity.category}</p>
                            <p>Rating: {activity.rating}</p>
                            {activity.specialDiscounts && <p>Discounts: {activity.specialDiscounts}</p>}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No upcoming activities available.</p>
            )}

            </div>
        </div>
    );
};

export default UpcomingActivities;