import React, { useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';

// Import images
import historicAreasImg from '../images/historic areas.jpeg';
import historicAreas2Img from '../images/historic areas 2.jpeg';
import beachesImg from '../images/beaches.jpeg';
import beaches2Img from '../images/beaches2.jpeg';
import budgetFriendlyImg from '../images/budget friendly.jpeg';
import familyFriendlyImg from '../images/family friendly.jpeg';
import shoppingImg from '../images/shopping.jpeg';
import shopping2Img from '../images/shopping2.jpeg';

// Import slick-carousel CSS
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CreatePreference = () => {
    const [preferenceName, setPreferenceName] = useState('historic areas');
    const [message, setMessage] = useState('');

    const allowedPreferences = [
        "historic areas",
        "beaches",
        "family-friendly",
        "shopping",
        "budget-friendly"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:3001/preference/create', {
                Name: preferenceName,
            });
            setMessage(`Preference '${response.data.Name}' created successfully!`);
            setPreferenceName(allowedPreferences[0]); // Reset to the first preference
        } catch (error) {
            setMessage(`Error: ${error.response?.data.message || 'Something went wrong'}`);
        }
    };

    // Slider settings
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,  // Show 3 slides at a time
        slidesToScroll: 1,
        centerMode: true, // Enable center mode
        centerPadding: '0px', // No padding on the sides of the center slide
        autoplay: true,
        autoplaySpeed: 1000, // 1 second per slide for faster scrolling
        arrows: false, // You can add arrows if desired
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Create Preference Tag</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <select
                    value={preferenceName}
                    onChange={(e) => setPreferenceName(e.target.value)}
                    style={styles.select}
                >
                    {allowedPreferences.map((pref) => (
                        <option key={pref} value={pref}>
                            {pref}
                        </option>
                    ))}
                </select>
                <button type="submit" style={styles.button}>Create Preference</button>
            </form>
            {message && <p style={styles.message}>{message}</p>}

            {/* Carousel for images */}
            <div style={styles.sliderContainer}>
                <Slider {...settings}>
                    <div>
                        <img src={historicAreasImg} alt="Historic Areas" className="slider-image" style={styles.image} />
                    </div>
                    <div>
                        <img src={historicAreas2Img} alt="Historic Areas 2" className="slider-image" style={styles.image} />
                    </div>
                    <div>
                        <img src={beachesImg} alt="Beaches" className="slider-image" style={styles.image} />
                    </div>
                    <div>
                        <img src={beaches2Img} alt="Beaches 2" className="slider-image" style={styles.image} />
                    </div>
                    <div>
                        <img src={budgetFriendlyImg} alt="Budget Friendly" className="slider-image" style={styles.image} />
                    </div>
                    <div>
                        <img src={familyFriendlyImg} alt="Family Friendly" className="slider-image" style={styles.image} />
                    </div>
                    <div>
                        <img src={shoppingImg} alt="Shopping" className="slider-image" style={styles.image} />
                    </div>
                    <div>
                        <img src={shopping2Img} alt="Shopping 2" className="slider-image" style={styles.image} />
                    </div>
                </Slider>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '20px auto',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        backgroundColor: '#f9f9f9',
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    select: {
        padding: '10px',
        marginBottom: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    },
    button: {
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    message: {
        textAlign: 'center',
        marginTop: '10px',
        color: 'green',
    },
    sliderContainer: {
        marginTop: '20px',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    image: {
        width: '85%', // Reduce width to fit with margins
        height: '200px', // Fixed height
        objectFit: 'cover', // Ensures image fits well without distortion
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        margin: '0 40px', // Increased space between images
        transition: 'transform 0.5s ease', // Transition effect for zoom
    },
};

// Add CSS for the animation
const css = `
    .slick-center .slider-image {
        animation: zoomEffect 1s ease-in-out;
        transform: scale(1.1); /* Zoom effect on center slide */
    }

    .slider-image {
        transform: scale(1); /* No zoom for non-centered images */
    }

    @keyframes zoomEffect {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }
`;

// Add the CSS to the page dynamically
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = css;
document.head.appendChild(styleSheet);

export default CreatePreference;
