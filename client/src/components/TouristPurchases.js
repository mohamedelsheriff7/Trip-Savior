import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const TouristPurchases = () => {
    const location = useLocation(); // Get the location object
    const [purchasedItems, setPurchasedItems] = useState([]);
    const [error, setError] = useState(null);
    const [selectedRatings, setSelectedRatings] = useState({}); // State to track selected ratings
    const [submittedRatings, setSubmittedRatings] = useState({}); // State to track submitted ratings
    const [feedbacks, setFeedbacks] = useState({}); // State to track feedback input
    const [submittedFeedbacks, setSubmittedFeedbacks] = useState({}); // State to track submitted feedbacks

    // Get the id from location.state
    const id = location.state?.id; // Safely access the id, defaulting to undefined if it doesn't exist

    useEffect(() => {
        const fetchPurchasedItems = async () => {
            if (!id) {
                setError('No ID provided');
                return; // Exit if there is no ID
            }
            try {
                const response = await axios.get(`http://localhost:3002/tourists/purchasedItems/${id}`); // Fetch using the correct endpoint
                setPurchasedItems(response.data); // This should work as your backend returns the purchasedItems array
            } catch (error) {
                setError('Could not fetch purchased items');
                console.error(error);
            }
        };

        fetchPurchasedItems();
    }, [id]);

    const renderStars = (rating, itemId, editable = true) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={i <= rating ? "text-warning" : "text-secondary"}
                    onClick={editable && !submittedRatings[itemId] ? () => handleRatingSelect(itemId, i) : null} // Handle rating selection only if not submitted
                    style={{ cursor: editable && !submittedRatings[itemId] ? 'pointer' : 'default' }}
                >
                    {i <= rating ? '★' : '☆'}
                </span>
            );
        }
        return stars;
    };

    const handleRatingSelect = (itemId, rating) => {
        setSelectedRatings({ ...selectedRatings, [itemId]: rating }); // Update the selected rating for the item
    };

    const handleRatingSubmit = async (itemId) => {
        const rating = selectedRatings[itemId];
        try {
            await axios.post(`http://localhost:3002/tourists/rateProduct/${id}`, {
                productId: itemId,
                rating,
            });
            setSubmittedRatings({ ...submittedRatings, [itemId]: true }); // Mark this rating as submitted
            alert('Rating submitted successfully!');
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const handleFeedbackChange = (itemId, value) => {
        setFeedbacks({ ...feedbacks, [itemId]: value }); // Update the feedback state
    };

    const handleFeedbackSubmit = async (itemId) => {
        const feedback = feedbacks[itemId];
        try {
            await axios.post(`http://localhost:3002/tourists/reviewProduct/${id}`, {
                productId: itemId,
                review: feedback,
            });
            setSubmittedFeedbacks({ ...submittedFeedbacks, [itemId]: true }); // Mark this feedback as submitted
            alert('Feedback submitted successfully!');
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    if (error) return <p>{error}</p>;

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Purchased Items</h2>
            {purchasedItems.length > 0 ? (
                <div className="row">
                    {purchasedItems.map((item) => (
                        <div className="col-md-4 mb-4" key={item.product._id}> {/* Use item.product._id for the key */}
                            <div className="card">
                                <img src={item.product.Picture} className="card-img-top" alt={item.product.Name} /> {/* Access product properties */}
                                <div className="card-body text-center">
                                    <h5 className="card-title">{item.product.Name}</h5>
                                    
                                    <div>
                                        <p className="card-text">Rate this product:</p>
                                        {renderStars(selectedRatings[item.product._id] || 0, item.product._id, true)}
                                    </div>
                                    {!submittedRatings[item.product._id] && selectedRatings[item.product._id] && ( // Only show button if rating has not been submitted
                                        <button
                                            className="btn btn-primary mt-2"
                                            onClick={() => handleRatingSubmit(item.product._id)}
                                        >
                                            Submit Rating
                                        </button>
                                    )}
                                    
                                    <div className="mt-3">
                                        <textarea
                                            rows="3"
                                            className="form-control"
                                            placeholder="Provide feedback..."
                                            value={feedbacks[item.product._id] || ''}
                                            onChange={(e) => handleFeedbackChange(item.product._id, e.target.value)}
                                            disabled={submittedFeedbacks[item.product._id]} // Disable if feedback is submitted
                                        />
                                        {!submittedFeedbacks[item.product._id] && feedbacks[item.product._id] && (
                                            <button
                                                className="btn btn-secondary mt-2"
                                                onClick={() => handleFeedbackSubmit(item.product._id)}
                                            >
                                                Submit Feedback
                                            </button>
                                        )}
                                    </div>
    
                                    {/* Display quantity */}
                                    <p className="card-text mt-2">Quantity purchased: {item.quantity}</p> {/* Display quantity here */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No purchased items found.</p>
            )}
        </div>
    );
    
};

export default TouristPurchases;
