import React, { useState } from 'react';
import './StepByStep.css';
import { useNavigate } from 'react-router-dom'; 

const StepByStep = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();


  const vacationSteps = [
    {
      icon: '🗓️',
      title: "Plan Your Dates",
      description: "Choose your travel dates, considering work schedules, peak seasons, and personal preferences.",
      tips: [
        "Check work calendar for availability",
        "Consider destination's weather and peak tourist seasons",
        "Coordinate with travel companions"
      ],
      image: "/api/placeholder/400/300"
    },
    {
      icon: '📍',
      title: "Select Destination",
      description: "Research and decide on a destination that matches your interests, budget, and travel style.",
      tips: [
        "Consider your budget",
        "Read travel blogs and reviews",
        "Check travel advisories"
      ],
      image: "/api/placeholder/400/300"
    },
    {
      icon: '✈️',
      title: "Book Transportation",
      description: "Reserve flights, train tickets, or plan your road trip route.",
      tips: [
        "Compare prices across multiple platforms",
        "Check baggage policies",
        "Consider travel insurance"
      ],
      image: "/api/placeholder/400/300"
    },
    {
      icon: '🧳',
      title: "Accommodation",
      description: "Book hotels, rentals, or plan your lodging strategy.",
      tips: [
        "Read recent reviews",
        "Check location proximity to attractions",
        "Verify cancellation policies"
      ],
      image: "/api/placeholder/400/300"
    },
    {
      icon: '💳',
      title: "Financial Preparation",
      description: "Budget for trip expenses and prepare financial resources.",
      tips: [
        "Notify bank of travel",
        "Get local currency",
        "Prepare emergency funds"
      ],
      image: "/api/placeholder/400/300"
    },
    {
      icon: '🌂',
      title: "Pack Smartly",
      description: "Prepare your luggage with essentials and destination-specific items.",
      tips: [
        "Check weather forecast",
        "Pack versatile clothing",
        "Don't forget chargers and adapters"
      ],
      image: "/api/placeholder/400/300"
    }
  ];

  const handleNextStep = () => {
    if (activeStep === vacationSteps.length - 1) {
      // Navigate to home page when "Finish" is clicked
      window.history.back();
    } 
    setActiveStep((prev) => Math.min(prev + 1, vacationSteps.length - 1));
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="page-container">
      <div className={`vacation-guide ${isFlipped ? 'flipped' : ''}`}>
        <div className="card-inner">
          <div className="card-front">
            <div className="guide-header">
              <h1>Vacation Planning Guide</h1>
            </div>
            
            <div className="progress-container">
              <div 
                className="progress-fill" 
                style={{ width: `${(activeStep / (vacationSteps.length - 1)) * 100}%` }}
              ></div>
              <div className="step-icons">
                {vacationSteps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`step-icon ${index <= activeStep ? 'active' : ''}`}
                  >
                    {step.icon}
                  </div>
                ))}
              </div>
            </div>

            <div className="step-content">
              <h2>{vacationSteps[activeStep].title}</h2>
              <p>{vacationSteps[activeStep].description}</p>
              
              <div className="pro-tips">
                <h3>Pro Tips:</h3>
                <ul>
                  {vacationSteps[activeStep].tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="navigation">
              <button 
                onClick={handlePrevStep} 
                disabled={activeStep === 0}
                className="btn btn-prev"
              >
                Previous
              </button>
              
              <button 
                onClick={handleNextStep} 
                className="btn btn-next"
              >
                {activeStep === vacationSteps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
          
          <div className="card-back">
            <div className="image-container">
              <img 
                src={vacationSteps[activeStep].image} 
                alt={`${vacationSteps[activeStep].title} illustration`} 
              />
            </div>
            <button 
              onClick={handleFlipCard}
              className="btn btn-flip"
            >
              Back to Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepByStep;
