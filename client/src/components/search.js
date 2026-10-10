import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Search.module.css"; // Adjust your CSS path if needed

const Search = () => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [tag, setTag] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await fetch(`http://localhost:3002/search?name=${encodeURIComponent(name)}&category=${encodeURIComponent(category)}&tag=${encodeURIComponent(tag)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }
            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Styles for the result boxes
    const resultCardStyle = {
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "10px",
        margin: "10px",
        width: "300px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "left",
        overflow: "hidden",
        whiteSpace: "pre-wrap", // Maintain formatting for JSON
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>Search</h2>
            <form onSubmit={handleSearch} className={styles.form}>
                <input
                    type="text"
                    placeholder="Search by Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                />
                <input
                    type="text"
                    placeholder="Search by Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={styles.input}
                />
                <input
                    type="text"
                    placeholder="Search by Tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className={styles.input}
                />
                <button type="submit" className={styles.btn}>Search</button>
            </form>

            {loading && <p>Loading results...</p>}
            {error && <p className={styles.error}>{error}</p>}
            {results && (
                <div className={styles.results}>
                    <h3>Search Results:</h3>
                    <div className={styles.resultsContainer}>
                        {/* Historical Places */}
                        <h4>Historical Places:</h4>
                        {results.historicalPlaces && results.historicalPlaces.length > 0 ? (
                            results.historicalPlaces.map((place) => (
                                <div key={place._id} style={resultCardStyle}>
                                    <h5>{place.name}</h5>
                                    <p><strong>Description:</strong> {place.description}</p>
                                    <p><strong>Location:</strong> {place.location}</p>
                                    <p><strong>Historical Significance:</strong> {place.historicalSignificance}</p>
                                    <p><strong>Entry Fee (Foreign):</strong> ${place.entryFeeForeign}</p>
                                    <p><strong>Entry Fee (Native):</strong> ${place.entryFeeNative}</p>
                                    <p><strong>Entry Fee (Student):</strong> ${place.entryFeeStudent}</p>
                                    <p><strong>Opening Hours:</strong> {place.openingHours}</p>
                                    <p><strong>Website:</strong> <a href={place.website} target="_blank" rel="noopener noreferrer">{place.website}</a></p>
                                    {place.pictures.length > 0 && (
                                        <img src={place.pictures[0]} alt={place.name} style={{ width: "100%", height: "auto" }} />
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No historical places found.</p>
                        )}

                        {/* Activities */}
                        <h4>Activities:</h4>
                        {results.activities && results.activities.length > 0 ? (
                            results.activities.map((activity) => (
                                <div key={activity._id} style={resultCardStyle}>
                                    <h5>{activity.name}</h5>
                                    <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                                    <p><strong>Time:</strong> {activity.time}</p>
                                    <p><strong>Location:</strong> {activity.location}</p>
                                    <p><strong>Price:</strong> ${activity.price}</p>
                                    <p><strong>Category:</strong> {activity.category}</p>
                                    <p><strong>Tags:</strong> {activity.tags ? activity.tags.join(", ") : "N/A"}</p>
                                    <p><strong>Special Discounts:</strong> {activity.specialDiscounts}</p>
                                    <p><strong>Booking Open:</strong> {activity.bookingOpen ? "Yes" : "No"}</p>
                                    <p><strong>Rating:</strong> {activity.rating}</p>
                                </div>
                            ))
                        ) : (
                            <p>No activities found.</p>
                        )}

                        {/* Itineraries */}
                        <h4>Itineraries:</h4>
                        {results.itineraries && Array.isArray(results.itineraries) && results.itineraries.length > 0 ? (
                            results.itineraries.map((itinerary) => (
                                <div key={itinerary._id} style={resultCardStyle}>
                                    <h5>{itinerary.Itinerary_Name}</h5>
                                    <p><strong>Tour Guide Name:</strong> {itinerary.tourGuideName}</p>
                                    <p><strong>Activities:</strong> {itinerary.activities ? itinerary.activities.join(", ") : "N/A"}</p>
                                    <p><strong>Preferences:</strong> {itinerary.preferences ? itinerary.preferences.join(", ") : "N/A"}</p>
                                    <p><strong>Location to Be Visited:</strong> {itinerary.locationToBeVisited}</p> {/* Adjusted this line */}
                                    <p><strong>Timeline:</strong> {itinerary.timeline}</p>
                                    <p><strong>Duration of Activity:</strong> {itinerary.durationOfActivity} hour(s)</p>
                                    <p><strong>Language of Tour:</strong> {itinerary.languageOfTour}</p>
                                    <p><strong>Price:</strong> ${itinerary.price}</p>
                                    <p><strong>Date and Time:</strong> {new Date(itinerary.date_time).toLocaleString()}</p> {/* Adjusted for correct date handling */}
                                    <p><strong>Accessibility:</strong> {itinerary.accessibility}</p>
                                    <p><strong>Pickup Location:</strong> {itinerary.pickupLocation}</p>
                                    <p><strong>Drop-off Location:</strong> {itinerary.dropoffLocation}</p>
                                    <p><strong>Booked:</strong> {itinerary.booked ? "Yes" : "No"}</p>
                                    <p><strong>Rating:</strong> {itinerary.rating}</p>
                                </div>
                            ))
                        ) : (
                            <p>No itineraries found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
